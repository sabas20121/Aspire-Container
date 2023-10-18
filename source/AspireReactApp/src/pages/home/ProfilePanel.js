import React from 'react'
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  Typography
} from '@mui/material'

import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { SessionManager } from '../../services/SessionManager'

import './ProfilePanel.css'

export default function ProfilePanel(props) {
  const { userInitials } = props


  const handleSignOut = () => {
    SessionManager.signout();
  }

  const profileOptions = [
    { key: 'about', title: 'About' },
    { key: 'help', title: 'Help' },
    { key: 'language', title: 'Language' }
  ]

  return (
    <Box className="Profile-panel-container">
      <Box className="Top-content">
        <Box className="Profile-panel-header">
          <Avatar style={{ width: 24, height: 24, backgroundColor: '#403759' }}>
            <Typography className="Profile-panel-avatar-text">
              {userInitials}
            </Typography>
          </Avatar>
          <Box className="Profile-title-box">
            <Typography className="Profile-title-text">Profile</Typography>
          </Box>
        </Box>
        <Divider variant="middle" className="Divider" />
        <List>
          {profileOptions.map((option) => (
            <ListItemButton disableGutters className="Profile-list-item">
              <Typography className="Profile-item-text">
                {option.title}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box className="Profile-bottom-container">
        <Box id="signout" className="Logout-container">
          <Button
            startIcon={
              <LogoutOutlinedIcon
                style={{ width: 24, height: 24, color: '#10052F' }}
              />
            }
            onClick={handleSignOut}
          >
            <Typography className="Profile-item-text">Logout</Typography>
          </Button>
        </Box>
        <Box className="Session-container">
          <Box className="Last-login-container">
            <Typography className="Last-login-text">
              Last Login: 12/07/2021 08:19 AM GMT
            </Typography>
          </Box>
          <Box className="Active-sessions-container">
            <Typography className="Active-sessions-text">
              2 Active Sessions
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
