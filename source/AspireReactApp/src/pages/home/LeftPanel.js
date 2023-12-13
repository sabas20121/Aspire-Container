import React, { useState, useRef, useEffect } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import {
  Avatar,
  Box,
  Button,
  IconButton,
  List as MUIList,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material'

import ms from '../../assets/ms.svg'
import ai from '../../assets/ai.svg'
import aispire from '../../assets/aispire.svg'
import metricstreamaispire from '../../assets/metricstream-aispire.svg'
import msai from '../../assets/ms-ai.svg'
import chatquestionicon from '../../assets/chatquestionicon.svg'
import chatquestioniconfilled from '../../assets/chatquestioniconfilled.svg'
import chevronleft from '../../assets/chevronleft.svg'
import chevronright from '../../assets/chevronright.svg'
import dashboard from '../../assets/dashboard.svg'
import dashboardfilled from '../../assets/dashboardfilled.svg'
import list from '../../assets/list.svg'
import report from '../../assets/report.svg'
import reportfilled from '../../assets/reportfilled.svg'
import logout from '../../assets/logout.svg'
import graph from '../../assets/graph.svg'
import graphfilled from '../../assets/graphfilled.svg'
import gear from '../../assets/gear.svg'
import gearfilled from '../../assets/gearfilled.svg'
import notification from '../../assets/notification.svg'
import notificationfilled from '../../assets/notificationfilled.svg'
import copyright from '../../assets/copyright.svg'
// import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { SessionManager } from '../../services/SessionManager'

import options from './Menu.json'
import settings from './Settings.json'
import SettingsPanel from './SettingsPanel'
import NotificationsPanel from './NotificationsPanel'
import ProfilePanel from './ProfilePanel'

import './Home.css'

import AskMePopUp from '../quicksight/AskMePopUp'
import { User } from '../../services/User'

const icons = {
  askme: [chatquestionicon, chatquestioniconfilled],
  dashboard: [dashboard, dashboardfilled],
  selfservice: [list, list],
  settings: [gear, gearfilled],
  reports: [report, reportfilled],
  graph: [graph, graphfilled],
  notifications: [notification, notificationfilled]
}

let components = {
  askme: {},
  profile: {},
  profilePanel: {},
  settingsPanel: {},
  notificationsPanel: {}
}

const Branding = ({ open }) => {
  return (
    <Box id="brand" className={`Brand ${open ? '' : 'Brand-closed'}`}>
      <img src={open ? metricstreamaispire : ms} alt="brand" width={open ? "208px" : "200px"} height={open ? "69px" : "48px"} />
    </Box>
  )
}

const MainMenu = ({ open }) => {
  const onMenuItemClick = (option, navigate) => {
    option.path && navigate(option.path)
  }

  const AskMe = () => {
    const [popup, setPopup] = useState(false)
    const showSearchPopup = () => {
      setPopup(true)
    }
    const hideSearchPopup = () => {
      setPopup(false)
    }

    return (
      <>
        <Button
          className="AskMe-button"
          startIcon={popup ? getIcon('askme', true) : getIcon('askme', false)}
          onClick={showSearchPopup}
        >
          {' '}

          <Typography className="List-item-text">Ask Me</Typography>
        </Button>
        <AskMePopUp open={popup} onClose={hideSearchPopup} />
      </>
    )
  }

  components['askme'] = <AskMe />

  return (
    <Box id="menu">
      <List options={options} open={open} onClick={onMenuItemClick} />
    </Box>
  )
}

const getIcon = (component, filled) => {
  let icon = filled ? icons[component][1] : icons[component][0]
  return (
    <Box className="List-geticon-container">
      <img src={icon} alt="icon" width={20} height={20} />
    </Box>
  )
}

const List = (props) => {
  const { options, open, onClick } = props
  const navigate = useNavigate()
  const location = useLocation()

  const getComponent = (component) => {
    return <Box>{components[component]}</Box>
  }

  return (
    <>
      <MUIList
        className={`List-main ${open ? '' : 'List-main-closed'} `}
        dense={true}
      >
        {options.map((option) => (
          <ListItem
            disablePadding
            key={option.key}
            style={
              location.pathname === option.path ||
                (location.pathname === '/' &&
                  option.path &&
                  option.path === options[0].path)
                ? { borderRadius: 4, background: '#10053F' }
                : null
            }
          >
            <Tooltip
              arrow={true}
              title={
                <Typography className="Tooltip-text">
                  {option.tooltip}
                </Typography>
              }
              placement="right"
              PopperProps={{
                sx: {
                  '&.MuiTooltip-popper .MuiTooltip-tooltip': {
                    backgroundColor: '#58506D'
                  },
                  '.MuiTooltip-arrow': {
                    color: '#58506D'
                  }
                }
              }}
            >
              <ListItemButton
                disableGutters
                className="Listitem-button"
                onClick={() => {
                  onClick && onClick(option, navigate)
                }}
              >
                {option.component ? (
                  <>{getComponent(option.component)}</>
                ) : (
                  <>
                    <ListItemIcon>
                      {location.pathname === option.path ||
                        (location.pathname === '/' &&
                          option.path &&
                          option.path === options[0].path)
                        ? getIcon(option.key, true)
                        : getIcon(option.key, false)}
                    </ListItemIcon>
                    <ListItemText>
                      {
                        <Typography className="List-item-text">
                          {option.title}
                        </Typography>
                      }
                    </ListItemText>
                  </>
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </MUIList>
    </>
  )
}

const ConfigMenu = ({ open, setPanel }) => {
  const onConfigMenuItemClick = (item) => {
    setPanel(item)
  }

  components['profile'] = <Profile />
  components['profilePanel'] = {
    component: ProfilePanel,
    props: { userInitials: getUserDetails().initials }
  }
  components['settingsPanel'] = { component: SettingsPanel, props: {} }
  components['notificationsPanel'] = {
    component: NotificationsPanel,
    props: {}
  }

  return (
    <Box id="profile" className="Config-container">
      {/* <List
        options={settings}
        open={open}
        // onClick={onConfigMenuItemClick}
      /> */}
      <Profile />
      <Logout />
      <Box
        className={`Config-copyright-container ${open ? '' : 'Config-copyright-container-closed'
          }`}
      >
        <img
          src={copyright}
          alt="copyright"
          width={16}
          height={16}
          minWidgh={16}
        />
        <Typography className="Config-copyright-text">
          Powered by MetricStream
        </Typography>
      </Box>
    </Box>
  )
}

const getUserDetails = () => {
  const userData = User.getUser()

  let user = userData.getName() ? userData.getName() : userData.getUserName()

  let nameArray = user.split(' ')
  let initials =
    nameArray.length > 1
      ? `${nameArray[0][0]}${nameArray[nameArray.length - 1][0]}`
      : nameArray[0][0]

  let displayName =
    nameArray.length > 1 && user.length > 15
      ? nameArray[0] + ' ' + nameArray[1][0] + '...'
      : user

  return { initials, displayName }
}

const Profile = () => {
  let { initials, displayName } = getUserDetails()
  return (
    <ListItemButton disableGutters className="Listitem-button">
      <Box sx={{ paddingLeft: '8px' }}>
        <ListItemIcon className="List-geticon-container">
          {
            <Avatar
              className="Profile-avatar"
              sx={{ left: '-3px', width: 24, height: 24 }}
            >
              <Typography className="Profile-avatar-text">
                {initials}
              </Typography>
            </Avatar>
          }
        </ListItemIcon>
      </Box>
      {/* <Box sx={{ paddingLeft: '8px' }}> */}
      <ListItemText>
        <Typography className="List-item-text" noWrap={true}>
          {displayName}
        </Typography>
      </ListItemText>
      {/* </Box> */}
    </ListItemButton>
  )
}

const handleSignOut = () => {
  SessionManager.signout()
}

const Logout = () => {
  return (
    <Box id="signout" className="Logout-container">
      <Button
        startIcon={
          <img src={logout} style={{
            width: 22,
            height: 22,
            color: '#FFF',
            paddingLeft: '8px',
            paddingRight: '8px'
          }} />
          // <LogoutOutlinedIcon
          // style={{
          //   width: 26,
          //   height: 26,
          //   color: '#FFF',
          //   paddingLeft: '4px',
          //   paddingRight: '8px'
          // }}
          // />
        }
        onClick={handleSignOut}
      >
        <Typography className="List-item-text">Logout</Typography>
      </Button>
    </Box>
  )
}

const ToggleButton = ({ open, setOpen }) => {
  function toggleLeftPanel() {
    setOpen(!open)
  }
  return (
    <Box
      className={`Toggle-container ${open ? '' : 'Toggle-container-closed'}`}
    >
      <IconButton className="Toggle-button" onClick={toggleLeftPanel}>
        <img
          src={open ? chevronleft : chevronright}
          alt="toggleButton"
          width={'7px'}
          height={'12px'}
        />
      </IconButton>
    </Box>
  )
}

const showConfigPanel = (setting, open) => {
  return (
    setting.expand &&
    React.createElement(components[setting.expand].component, {
      ...components[setting.expand].props
    })
  )
}

export default function LeftPanel() {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] =
    useState(false)

  let panelRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (!panelRef?.current?.contains(e.target)) {
        setPanel(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
    }
  })

  return (
    <>
      <Box className={`LeftPanel ${open ? '' : 'LeftPanel-closed'}`}>
        <Branding open={open} />
        <MainMenu open={open} />
        <ConfigMenu open={open} />
        <ToggleButton open={open} setOpen={setOpen} />
      </Box>
      <Box ref={panelRef}>{panel ? showConfigPanel(panel, open) : null}</Box>
    </>
  )
}