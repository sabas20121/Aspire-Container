import React, { useState, useEffect, useRef } from 'react';
import { SessionManager } from '../../services/SessionManager';
import { CookieManager } from '../../services/CookieManager';
import { Dialog, DialogContent, Box } from '@mui/material';
import Notifications from './NotificationComponent.json';
import './NotificationComponent.css';
import { NotificationHandler } from '../../services/NotificationHandler';

const NotificationComponent = () => {
  const [countdown, setCountdown] = useState(localStorage.getItem('SessionCountDown'));
  const [dialogOpen, setDialogOpen] = useState(true);
  const [resetNotifier, setResetNotifier] = useState(false);

  const intervalIdRef = useRef(null);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, []);

  function handleSessionTimeout() {
    const handleSignOut = () => {
      SessionManager.signout();
    };

    const handleSessionExtend = () => {
      setDialogOpen(false);
      clearInterval(intervalIdRef.current);
      getJwtToken();
    };

    if (countdown === 0) {
      handleSignOut();
    }

    const message =
      Notifications.find((notification) => notification.id === 'timeout')?.message ||
      'Default Message';

    async function getJwtToken() {
      const clientId = localStorage.getItem('cognitoClientId');
      const refreshToken = localStorage.getItem('refreshToken');
      const cognitoDomainUrl = localStorage.getItem('cognitoDomainUrl');

      try {
        if (clientId && refreshToken && cognitoDomainUrl) {
          const payload = {
            grant_type: 'refresh_token',
            client_id: clientId,
            refresh_token: refreshToken,
          };

          const tokenEndpoint = `${cognitoDomainUrl}/oauth2/token`;
          const response = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.keys(payload)
              .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]))
              .join('&'),
          });

          if (!response.ok) {
            console.error('!response.ok::', response);
          }

          const tokenData = await response.json();
          const idToken = tokenData?.id_token;
          if (idToken) {
            handleAuthenticationSuccess(idToken);
          }
        }
      } catch (err) {
        console.error('Error: ', err);
        throw err;
      }
    }

    const handleAuthenticationSuccess = (idToken) => {
      CookieManager.setCookie('OptimizerID', idToken);
      SessionManager.init();
      setResetNotifier(true);
    };

    return (
      <Dialog
        open={dialogOpen}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            marginTop: '20px',
            marginRight: '30px',
            marginLeft: '60px',
            height: '200px',
            overflow: 'hidden',
          },
        }}
      >
        <DialogContent style={{ height: '200px', overflow: 'hidden' }}>
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <div className="timeout-alert">
              <p>{`${message} in ${countdown} seconds.`}</p>
              <div>
                <button onClick={handleSignOut}>Logout</button>
                <button onClick={handleSessionExtend}>Extend</button>
              </div>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {handleSessionTimeout()}
      {resetNotifier && <NotificationHandler />}
    </>
  );
};

export default NotificationComponent;
