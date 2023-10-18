import React, { useState } from 'react'
import { Box } from '@mui/material';
import './GraphExplorer.css'

import {
  ScreenStates,
  renderLoadingMessage
} from '../../components/ScreenStates/screenState'

export default function Reports() {
  const [screenState, setScreenState] = useState(ScreenStates.LOADING)

  const handleLoad = () => {
    setScreenState(ScreenStates.CONTENT_AVAILABLE)
  }

  const MetaData = require('../../MetaData.json')

  const Configuration = MetaData.GraphConfiguration;
  const configFileParam = JSON.stringify(Configuration);

  const urlWithConfig = `/ge/?configFile=${encodeURIComponent(configFileParam)}`;

  return (
    <Box className="GraphExplorer-container">
      <Box className="GraphExplorer-iframe">
        {screenState === ScreenStates.LOADING ? renderLoadingMessage() : null}
        <iframe
          src={urlWithConfig}
          title="GraphExplorer"
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={handleLoad}
        />
      </Box>
    </Box>
  )
}
