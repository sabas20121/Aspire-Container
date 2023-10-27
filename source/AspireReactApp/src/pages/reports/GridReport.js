import React, { useState, useEffect, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { CookieManager } from '../../services/CookieManager';
import {
  Box,
  //  Button,
  AppBar,
  Toolbar,
  Typography
} from '@mui/material'
import csvtojson from 'csvtojson'
import './GridReport.css'
import { BarWave } from 'react-cssfx-loading'
import { LicenseManager } from 'ag-grid-enterprise'

import {
  ScreenStates,
  //renderLoadingMessage,
  renderErrorMessage
} from '../../components/ScreenStates/screenState'
import QuickSightAPI from '../../services/QuickSightAPI'

import reporticon from '../../assets/reporticon.svg'

LicenseManager.setLicenseKey(
  '[TRIAL]_this_AG_Grid_Enterprise_key_( AG-043118 )_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_purchasing_a_production_key_please_contact_( info@ag-grid.com )___All_FrontEnd_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_( 31 July 2023 )____[v2]_MTY5MDc1ODAwMDAwMA==f7deb9985cb10bc1921d8a43ac3c1b44'
)

const renderLoadingMessage = () => (
  <div className="loading-container">
    <BarWave color="#42335b" />
  </div>
)

function GridReport({ reportKey, columnFilters }) {
  const [rowData, setRowData] = useState([])
  const [reportName, setReportName] = useState('')
  const [appliedFilterCardFilters, setAppliedFilterCardFilters] = useState([])
  const [rootFilter, setRootFilter] = useState({})
  const [originalData, setOriginalData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [columnDetails, setColumnDefs] = useState([])
  const [url, setUrl] = useState(null)
  const [screenState, setScreenState] = useState('')
  const [dashboardId, setDashboardId] = useState('')

  const MetaData = require('../../MetaData.json')
  const reportMetaData = localStorage.getItem('ReportMetaData');
  const AGGridReportMetaData = reportMetaData ? JSON.parse(reportMetaData) : [];

  useEffect(() => {

    // if (reportKey === 'Trending_Issues' && columnFilters.ISSUE_IDENTIFIED_ON) {
    //     columnFilters.ISSUE_IDENTIFIED_ON = formatDate(columnFilters.ISSUE_IDENTIFIED_ON);
    //   }

    if (reportKey) {
      const report = AGGridReportMetaData.find((item) => item.key === reportKey)
      if (report) {
        const { reportName, filePath, columnDefs } = report
        setReportName(reportName)
        const clientID = MetaData.ClientDetails.cognitoClientId;
        const payload = {
          tenantId: clientID,
          fileName: filePath
        };
        fetchCsvData(payload)
          .then((jsonData) => {
            setRowData(jsonData)
            setOriginalData(jsonData)
            setColumnDefs(columnDefs)
            applyColumnFilters(jsonData, columnFilters)
            setIsLoading(false)
            capturePreviousDashboardId();
          })
          .catch((error) => {
            console.error('Error fetching CSV data:', error)
            setIsLoading(false)
          })

      }
    }
  }, [reportKey, columnFilters]);

  // const formatDate = (inputDate) => {
  //   const dateObj = new Date(inputDate);
  //   // const month = dateObj.toLocaleString('default', { month: 'short' });
  //   // const month = dateObj.getMonth() + 1;
  //   // const day = dateObj.getDate();
  //   const year = dateObj.getFullYear();
  //   return year;
  // };

  const fetchCsvData = (payload) => {
    const apiUrl = `/metricstream/api/fetch-reportobjects`;
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error fetching CSV data:', error);
      });
  }
  const applyColumnFilters = (data, filters) => {
    let filteredData = data
    filteredData = filteredData.filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === 'All') {
          return true
        }
        if (reportKey === 'Trending_Issues' && key === 'ISSUE_IDENTIFIED_ON') {
          const year = new Date(row[key]).getFullYear().toString();
          return year.includes(value);
        }
        return row[key] === value
      })
    })

    const updatedFilterCardFilters = Object.entries(filters).filter(
      ([key, value]) => value !== 'All'
    )
    setRowData(filteredData)
    setAppliedFilterCardFilters(updatedFilterCardFilters)
    setRootFilter({ ...rootFilter, ...filters })
  }

  const removeFilter = (field) => {
    const newFilterCardFilters = appliedFilterCardFilters.filter(
      ([filterField]) => filterField !== field
    )
    const newRootFilter = { ...rootFilter }
    delete newRootFilter[field]

    setAppliedFilterCardFilters(newFilterCardFilters)
    setRootFilter(newRootFilter)

    let filteredData = originalData
    for (const [filterField, filter] of newFilterCardFilters) {
      filteredData = filteredData.filter((row) =>
        row[filterField].toString().toLowerCase().includes(filter.toLowerCase())
      )
    }

    setRowData(filteredData)
  }

  const handleRowDragEnd = (event) => {
    const { node, overIndex } = event
    const updatedRowData = [...rowData]
    updatedRowData.splice(node.rowIndex, 1)
    updatedRowData.splice(overIndex, 0, node.data)
    setRowData(updatedRowData)
  }

  const popupParent = useMemo(() => {
    return document.body
  }, [])

  const capturePreviousDashboardId = () => {
    const dashboardId = sessionStorage.getItem('dashboardId');
    if (dashboardId) {
      setDashboardId(dashboardId);
    } else {
      console.error("ID not found ");
    }
  }

  function goBack() {
    if (dashboardId) {
      fetchDashboardUrl();
    }
    // else {
    // window.history.back()
    // }
  }

  const fetchDashboardUrl = async () => {
    try {
      const response = await QuickSightAPI.generateDashboardURL();

      if (response.status === 200) {
        setUrl(response.payload.url);
        setScreenState(ScreenStates.CONTENT_AVAILABLE);
      } else if (response.status === 500) {
        setScreenState(ScreenStates.ERROR);
        renderErrorMessage()
      }
    } catch (error) {
      console.error('Error:', error);
      setScreenState(ScreenStates.ERROR);
      renderErrorMessage()
    }
  };

  useEffect(() => {
    const goBackToDashboard = async () => {
      if (url && screenState === ScreenStates.CONTENT_AVAILABLE) {

        if (dashboardId) {
          let DashboardURL = url.replace(/non-existent-id/, dashboardId);
          window.location.href = DashboardURL;
          // sessionStorage.removeItem('dashboardId');
        }
      }
    };

    goBackToDashboard();

  }, [url, screenState]);

  const getRowHeight = (params) => {
    const maxRowHeight = 200
    const lineHeight = 20

    const wrappedTextLines = Math.ceil(
      params.data[params.colDef.field].length / 25
    )
    const calculatedHeight = wrappedTextLines * lineHeight

    return Math.min(calculatedHeight, maxRowHeight)
  }

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      resizable: true,
      floatingFilter: true,
      enablePivot: true,
      autoHeaderHeight: true,
      enableFilter: true,
      minWidth: 300,
      autoHeight: true,
      wrapText: true,
      getRowHeight: getRowHeight
    }
  }, [])

  const sideBar = {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        minWidth: 225,
        maxWidth: 225,
        width: 225
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
        minWidth: 180,
        maxWidth: 400,
        width: 250
      }
    ],
    position: 'left'
    // defaultToolPanel: "filters",
  }

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit()
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit()
      })
    })
  }

  const statusBar = useMemo(() => {
    return {
      statusPanels: [
        // { statusPanel: 'agTotalRowCountComponent', align: 'left' },
        { statusPanel: 'agSelectedRowCountComponent', align: 'left' }
      ]
    }
  }, [])

  const HeaderAppBar = () => {
    return (
      <AppBar position="static" className="drilldown-appbar" >
        <Toolbar className="drilldown-toolbar" >
          <Box className="drilldown-title-container">
            <img
              src={reporticon}
              alt="report-icon"
              width={36}
              height={36}
              style={{ marginRight: '10px' }}
            />
            <Typography className="drilldown-title">{reportName}</Typography>
          </Box>
          {/* <Button
            className="drilldown-back-button"
            variant="contained"
            onClick={goBack}
          >
            <Typography className="drilldown-back-button-text">Back</Typography>
          </Button> */}
        </Toolbar>
      </AppBar >
    )
  }

  return (
    <>
      {isLoading && (
        <div className="loading-message">{renderLoadingMessage()}</div>
      )}
      <div
        id="root"
        className="ag-theme-alpine"
        style={{ height: '87vh', width: '100%' }}
      >
        {isLoading ? (
          <div className="loading-message">{renderLoadingMessage()}</div>
        ) : (
          <>
            <HeaderAppBar />
            <div className="filter-cards">
              {appliedFilterCardFilters.map(([field, filter]) => (
                <div key={field} className="filter-card">
                  <span>{field}:</span>
                  <span>{filter}</span>
                  <span
                    className="remove-filter"
                    onClick={() => removeFilter(field)}
                  >
                    &#x2716;
                  </span>
                </div>
              ))}
            </div>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDetails}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={100}
              rowSelection={'multiple'}
              rowMultiSelectWithClick={true}
              animateRows={true}
              enableCharts={true}
              enableRangeSelection={true}
              enableRangeHandle={true}
              suppressMoveWhenRowDragging={false}
              suppressBrowserResizeObserver={true}
              pivotMode={false}
              rowHeight={100}
              sideBar={sideBar}
              statusBar={statusBar}
              // onFirstDataRendered={(params) => params.api.sizeColumnsToFit()}
              popupParent={popupParent}
              onRowDragEnd={handleRowDragEnd}
              onGridReady={onGridReady}
            />
          </>
        )}
      </div>
    </>
  )
}

export default GridReport;
