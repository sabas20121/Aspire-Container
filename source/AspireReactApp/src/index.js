import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey(
  "Using_this_AG_Grid_Enterprise_key_( AG-045127 )_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_( legal@ag-grid.com )___For_help_with_changing_this_key_please_contact_( info@ag-grid.com )___( MetricStream, Inc. )_is_granted_a_( Single Application )_Developer_License_for_the_application_( Aspire )_only_for_( 2 )_Front-End_JavaScript_developers___All_Front-End_JavaScript_developers_working_on_( Aspire )_need_to_be_licensed___( Aspire )_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_AG_Grid_Enterprise_versions_released_before_( 28 August 2024 )____[v2]_MTcyNDc5OTYwMDAwMA==b8d4343ad2b1d1dce894140d73cdaa00");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
