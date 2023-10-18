import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import QuickSightAPI from '../../services/QuickSightAPI'


import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

import {
  ScreenStates,
  renderLoadingMessage,
  renderEmptyMessage,
  renderErrorMessage
} from '../../components/ScreenStates/screenState'
import './Dashboard.css'



export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0)
  const [url, setUrl] = useState('')
  const [dashboardList, setDashboardList] = useState([])
  const [screenState, setScreenState] = useState(ScreenStates.LOADING)

  const sortDashboardList = (list) => {
    return list.sort((a, b) => {
      return new Date(a.PublishDate) - new Date(b.PublishDate)
    })
  }

  useEffect(() => {
    const fetchDashboardsList = async () => {
      try {
        const response = await QuickSightAPI.fetchDashboardsList()

        if (response.status === 200 && response.payload.empty) {
          setScreenState(ScreenStates.EMPTY)
        } else if (response.status === 200) {
          const sortedList = sortDashboardList(response.payload)
          setDashboardList(sortedList)
          setScreenState(ScreenStates.CONTENT_AVAILABLE)
        } else {
          setScreenState(ScreenStates.ERROR)
        }
      } catch (error) {
        console.error('Error:', error)
        setScreenState(ScreenStates.ERROR)
      }
    }

    fetchDashboardsList()
  }, [])

  useEffect(() => {
    const fetchDashboardUrl = async () => {
      try {
        const response = await QuickSightAPI.generateDashboardURL()

        if (response.status === 200) {
          setUrl(response.payload.url)
        } else if (response.status === 500) {
          setScreenState(ScreenStates.ERROR)
        }
      } catch (error) {
        console.error('Error:', error)
        setScreenState(ScreenStates.ERROR)
      }
    }

    if (screenState === ScreenStates.CONTENT_AVAILABLE) {
      fetchDashboardUrl()
    }
  }, [activeTab, screenState])

  const handleChange = (index) => {
    setUrl()
    setActiveTab(index)
  }

  useEffect(() => {
    const handleResize = () => {
      dashboardList.forEach((_, index) => {
        const iframe = document.getElementById(`embedding-container-${index}`)
        if (iframe) {
          const { clientWidth, clientHeight } = iframe.parentNode
          iframe.style.width = `${clientWidth}px`
          iframe.style.height = `${clientHeight}px`
        }
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [dashboardList])


  const renderContent = (dashboardList, url) => {
    return dashboardList.map((dashboard, index) =>
      renderTabPanel(dashboard, index, url)
    )
  }

  const renderTabPanel = (dashboard, index, url) => {
    if (url && typeof url === 'string' && index === activeTab) {
      url = url.replace(/non-existent-id/, dashboard.DashboardId);
      try {
        embedQuickSightDashboard(url, index)
      } catch (error) {
        console.error('Error on embedding context:', error);
        setScreenState(ScreenStates.ERROR)
      }

    }

    return (
      <>
        {url ? (
          <TabPanel
            style={{
              width: '100%',
              height: '100%'
            }}
          >
            <div
              className='iframe'
              id={`embedding-container-${index}`} />
          </TabPanel>
        ) : (
          renderLoadingMessage()
        )}
      </>
    )
  }

  const embedQuickSightDashboard = async (url, index) => {
    try {
      const embeddingContext = await createEmbeddingContext();
      const containerDiv = document.getElementById(`embedding-container-${index}`);

      const frameOptions = {
        url: url,
        container: containerDiv,
        height: "100%",
        width: "100%",
      };

      const contentOptions = {
        toolbarOptions: {
          reset: false,
          undoRedo: false,
        },
      };

      await embeddingContext.embedDashboard(frameOptions, contentOptions);
    } catch (error) {
      console.error('Error on embedding context:', error);
      setScreenState(ScreenStates.ERROR)
    }
  };

  return (
    <Box id="Dashboard-container">
      <Tabs selectedIndex={activeTab} onSelect={handleChange} className="Tabs">
        <TabList className="TabList">
          {screenState === ScreenStates.CONTENT_AVAILABLE &&
            dashboardList.length > 0 &&
            dashboardList.map((dashboard, index) => (
              <Tab key={dashboard.Name} className="Tab">
                <Typography
                  className={
                    activeTab === index
                      ? 'Tab-button-label-active'
                      : 'Tab-button-label'
                  }
                >
                  {dashboard.Name}
                </Typography>
              </Tab>
            ))}
        </TabList>
        <Box className="TabPanelContainer">
          {screenState === ScreenStates.CONTENT_AVAILABLE && url
            ? renderContent(dashboardList, url)
            : screenState === ScreenStates.EMPTY
              ? renderEmptyMessage()
              : screenState === ScreenStates.ERROR
                ? renderErrorMessage()
                : renderLoadingMessage()}
        </Box>
      </Tabs>
    </Box>
  )
}
