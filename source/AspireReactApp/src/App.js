import React, { useEffect, useState } from 'react';
import Home from './pages/home/Home.js'
import Login from './pages/login/Login.js'
import { SessionManager } from './services/SessionManager.js'
import { CookieManager } from './services/CookieManager.js'
import GridReport from './pages/reports/GridReport.js';
import './App.css'
import '@fontsource-variable/open-sans'

function App() {

  const [reportKey, setReportKey] = useState(null);
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(() => {

    function processReport() {
      const urlParams = new URLSearchParams(window.location.search);

      if (!urlParams.has("key")) return;

      extractReportParams(urlParams);
    }

    function extractReportParams(urlParams) {
      const key = urlParams.get('key');
      setReportKey(key);

      const filters = {};
      urlParams.forEach((value, key) => {
        if (key !== 'key') {
          filters[key] = value;
        }
      });
      setColumnFilters(filters);
    }
    processReport();

  }, []);

  const fetchReportMetaData = () => {
    const payload = { };
  
    fetch('/metricstream/api/tasks/fetch-ReportMetaData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.data && data.data.reportMetaData) {
          localStorage.setItem('ReportMetaData', JSON.stringify(data.data.reportMetaData));
        } else {
          console.error('Error: Invalid response data format.');
        }
      })
      .catch((error) => {
        console.error('Error fetching report data:', error);
      });
  };

  (function processRequest() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1))

    if (!urlParams.has('id_token')) return

    const idToken = urlParams.get('id_token')
    CookieManager.setCookie('OptimizerID', idToken)
    fetchReportMetaData();
  })()

  SessionManager.init()
  const isSessionValid = SessionManager.isActive()

  return (
    <div className="App">
      {isSessionValid ? (
        reportKey ? (
          <GridReport reportKey={reportKey} columnFilters={columnFilters} />
        ) : (
          <Home />
        )
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App
