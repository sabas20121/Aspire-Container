import React from 'react';
import { Box } from '@mui/material';
import { BarWave } from "react-cssfx-loading";
import '../../pages/quicksight/Dashboard.css'

export const ScreenStates = {
  LOADING: 0,
  ERROR: 1,
  EMPTY: 2,
  INVALID: 3,
  CONTENT_AVAILABLE: 4,
};

export const renderLoadingMessage = () => (
  // <Box className="TabPanelContainer">
     <Box position="absolute" top="49%" left="48%" transform="translate(-50%, -50%)">
      <BarWave color="#42335b" />
     </Box>
    // </Box>

);

export const renderEmptyMessage = () => (
  <Box position="absolute" top="49%" left="48%" transform="translate(-50%, -50%)">
    <div>
      <h2>No dashboards</h2>
      <h5>When someone shares a dashboard with you, it'll show up here.</h5>
    </div>
  </Box>
);

export const renderInvalidMessage = () => (
  <Box position="absolute" top="49%" left="48%" transform="translate(-50%, -50%)">
    <div>
      <h2>Invalid response</h2>
      <h5>The server returned an invalid response. Please try again later.</h5>
    </div>
  </Box>
);

export const renderErrorMessage = () => (
  <Box position="absolute" top="49%" left="48%" transform="translate(-50%, -50%)">
    <div>
      <h2>Error</h2>
      <h5>There was an error fetching the data. Please try again later.</h5>
    </div>
  </Box>
);
