import React, { useState, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import {
  AppBar,
  Box,
  InputAdornment,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import GridReport from './GridReport'
import { CookieManager } from '../../services/CookieManager';
import './ReportList.css'
import reporticon from '../../assets/reporticon.svg'

const ReportDetails = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [gridSize, setGridSize] = useState({ width: '100%', height: '300px' })
  const [selectedReportKey, setSelectedReportKey] = useState(null);

  const metaData = localStorage.getItem('ReportMetaData');
  const data = metaData ? JSON.parse(metaData) : [];

  const filteredData = data.filter((item) =>
    item.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit()
  }

  const handleWindowResize = () => {
    const availableWidth = window.innerWidth - 40
    const availableHeight = window.innerHeight - 100
    setGridSize({
      width: `${availableWidth}px`,
      height: `${availableHeight}px`
    })
  }

  useEffect(() => {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const handleReportClick = (key) => {
    setSelectedReportKey(key);
    // const url = `${window.location.origin}/report/?key=${key}`
    // window.open(url, '_self')
    // return (<GridReport reportKey={key} />)
  }


  const columnDefs = [
    {
      headerName: 'Name',
      field: 'reportName',
      sortable: true,
      cellRendererFramework: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={reporticon} alt="report-icon" width={20} height={20} />
          <span
            style={{ marginLeft: '10px', cursor: 'pointer' }}
            onClick={() => handleReportClick(params.data.key)}
          >
            {params.data.reportName}
          </span>
        </div>
      )
    },

    // { headerName: "URL", field: "url", sortable: true },
  ]

  const defaultColDef = {
    resizable: true,
    sortable: true
  }

  return (

    <>
      {selectedReportKey ? (
        <div style={{ flex: 1 }}>
          <GridReport reportKey={selectedReportKey} />
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          <div>
            <AppBar position="static" className="reports-appbar">
              <Toolbar className="reports-toolbar">
                <Box className="reports-title-container">
                  <img
                    src={reporticon}
                    alt="report-icon"
                    width={30}
                    height={30}
                    style={{ marginRight: '10px' }}
                  />
                  <Typography className="reports-title">Reports</Typography>
                </Box>
                <TextField
                  className="reports-search-input"
                  size="small"
                  variant="outlined"
                  placeholder="Search"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                  InputProps={{
                    type: 'search',
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon sx={{ width: '20px', height: '20px' }} />
                      </InputAdornment>
                    )
                  }}
                />
              </Toolbar>
            </AppBar>
          </div>
          <div
            className="ag-theme-alpine ag-theme-aispire"
            style={{
              height: gridSize.height
            }}
          >
            <AgGridReact
              rowData={filteredData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              // domLayout="autoHeight"
              onGridReady={onGridReady}
              pagination={false}
              suppressHorizontalScroll={false}
              style={{ height: '100%' }}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ReportDetails
