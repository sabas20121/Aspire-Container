import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { User } from './User';
import NotificationComponent from '../components/Notifications/NotificationComponent';

export function NotificationHandler() {
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);

  useEffect(() => {
    const userData = User.getUser();

    const expTimeinMS = userData.getExpiryTs() * 1000;
    const timeoutDuration = expTimeinMS - Date.now() - 10000;

    const timeoutId = setTimeout(() => {
      setShowTimeoutAlert(true);
    }, timeoutDuration);

    return () => clearTimeout(timeoutId);

  }, []);

  return (
    <Box>
      {showTimeoutAlert && <NotificationComponent />}
    </Box>
  );
}
