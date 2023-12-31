import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter
  , Routes
  , Route
  // , Navigate
} from 'react-router-dom';
import { NotificationHandler } from '../../services/NotificationHandler';
import LeftPanel from './LeftPanel';
import Dashboard from '../quicksight/Dashboard';
import SelfServiceReporting from '../quicksight/SelfServiceReporting';
import ReportList from '../reports/ReportList';
import GraphExplorer from '../graphexplorer/GraphExplorer';

import './Home.css';

export default function Home() {

  return (

    <Box id="Home" className="Home">
      <NotificationHandler/>
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
