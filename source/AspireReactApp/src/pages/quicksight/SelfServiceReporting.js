import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material'
import 'react-tabs/style/react-tabs.css';
import './Dashboard.css';
import QuickSightAPI from '../../services/QuickSightAPI';
import { ScreenStates, renderLoadingMessage, renderErrorMessage } from '../../components/ScreenStates/screenState'


export default function SelfServiceReporting() {
  const [url, setUrl] = useState('');
  const [screenState, setScreenState] = useState(ScreenStates.LOADING);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await QuickSightAPI.generateSelfServiceURL();
        if (response.status === 200 && response.payload.url) {
          setUrl(response.payload.url);
          setScreenState(ScreenStates.CONTENT_AVAILABLE);
        } else {
          setScreenState(ScreenStates.ERROR);
        }
      } catch (error) {
        console.error('Error:', error);
        setScreenState(ScreenStates.ERROR);
      }
    };

    fetchData();
  }, []);

  return (
    <Box className='SelfService-container'>
      <Box className='SelfService-iframe'>
        {screenState === ScreenStates.LOADING &&
          renderLoadingMessage()
        }

        {screenState === ScreenStates.CONTENT_AVAILABLE && url && (
          <iframe
            id="dashboard-iframe"
            src={url}
            style={{ width: '100%', height: '100%' }}
            frameBorder="0"
            allowFullScreen
          />
        )}

        {screenState === ScreenStates.ERROR && renderErrorMessage()}
      </Box>
    </Box>
  );
}
