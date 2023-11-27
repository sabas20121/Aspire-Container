import React
// ,{useEffect} 
 from 'react';
import { Box } from '@mui/material';
import { BrowserRouter
  , Routes
  , Route
  // , Navigate 
} from 'react-router-dom';
import LeftPanel from './LeftPanel';
import Dashboard from '../quicksight/Dashboard';
import SelfServiceReporting from '../quicksight/SelfServiceReporting';
import ReportList from '../reports/ReportList';
import GraphExplorer from '../graphexplorer/GraphExplorer';

import './Home.css';

export default function Home() {
  // window.location.hash = '';

  // useEffect(() => {
  //   const newUrl = `${window.location.origin}${window.location.pathname}`;
  //   window.history.replaceState({}, document.title, newUrl);
  // }, []);
  return (

    <Box id="Home" className="Home">
      <BrowserRouter>
        <LeftPanel />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/selfservice" element={<SelfServiceReporting />} />
          <Route path="/reports" element={<ReportList />} />
          <Route path="/graph" element={<GraphExplorer />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}
