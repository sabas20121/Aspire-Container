import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box
} from '@mui/material';
import QuickSightAPI from '../../services/QuickSightAPI';
import { ScreenStates, renderLoadingMessage, renderErrorMessage } from '../../components/ScreenStates/screenState';

export default function AskMePopUp({ open, onClose }) {
  const [url, setUrl] = useState('');
  const [screenState, setScreenState] = useState(ScreenStates.LOADING);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await QuickSightAPI.generateAskMeURL(); 
        if (response.status === 200 && response.payload.url) {
          setUrl(response.payload.url);
          setScreenState(ScreenStates.CONTENT_AVAILABLE);
        } else if (response.status === 200 && response.payload.empty) {
          setScreenState(ScreenStates.EMPTY);
        } else {
          setScreenState(ScreenStates.ERROR);
        }
      } catch (error) {
        console.error('Error:', error);
        setScreenState(ScreenStates.ERROR);
      }
    };

    if (open) {
      fetchData();
    } else {
      setUrl('');
      setScreenState(ScreenStates.LOADING);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xd"
      fullWidth
      PaperProps={{
        style: {
          marginTop: '20px',
          marginRight: '30px',
          marginLeft: '60px',
          height: '500px',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent style={{ height: '500px', overflow: 'hidden' }}>
        {screenState === ScreenStates.LOADING ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            {renderLoadingMessage()}
          </Box>
        ) : screenState === ScreenStates.CONTENT_AVAILABLE && url ? (
          <Box
            display="flex"
            alignItems="center"
            style={{ height: '500px', overflow: 'hidden' }}
          >
            <iframe
              id="dashboard-iframe"
              src={url}
              style={{ width: '100%', height: '100%', overflow: 'hidden' }}
              frameBorder="0"
              allowFullScreen
            />
          </Box>
        ) : (
          renderErrorMessage() 
        )}
      </DialogContent>
    </Dialog>
  );
}
