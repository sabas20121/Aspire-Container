import React, { useEffect, useState } from 'react';
import Home from './pages/home/Home.js'
import Login from './pages/login/Login.js'
import { SessionManager } from './services/SessionManager.js'
// import { CookieManager } from './services/CookieManager.js'
import GridReport from './pages/reports/GridReport.js';
import './App.css'
import '@fontsource-variable/open-sans'

function App() {

    const [reportKey, setReportKey] = useState(null);
    const [columnFilters, setColumnFilters] = useState({});
    // const [customQSRegistrationEnabled, setQSRegistrationFlag] = useState(null);


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
    SessionManager.init();
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
