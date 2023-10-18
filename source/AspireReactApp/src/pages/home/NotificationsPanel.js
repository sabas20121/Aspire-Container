import React from 'react'
import { Box, InputAdornment, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import notificationfilled from '../../assets/notificationfilled.svg'

import './NotificationsPanel.css'

export default function NotificationsPanel() {
  return (
    <Box className="Notifications-panel-container">
      <Box className="Notifications-header-container">
        <Box className="Notifications-title-container">
          <Box className="Notifications-icon-container">
            <img
              src={notificationfilled}
              width={20}
              height={20}
              alt="notification"
            />
          </Box>
          <Typography className="Notifications-title-text">
            Notifications
          </Typography>
        </Box>
        <TextField
          className="Notifications-search"
          size="small"
          variant="outlined"
          placeholder="Search"
          InputProps={{
            type: 'search',
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
  )
}
