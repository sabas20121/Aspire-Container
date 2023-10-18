import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const AddDashboardPopup = ({ onClose, onSubmit }) => {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [dashboardId, setDashboardId] = useState("");

  const handleSubmit = () => {
    const newDashboard = {
      key,
      label,
      dashboardId,
    };
    onSubmit(newDashboard);
  };

  return (
    <Box className="popup-container">
      <h2>Add Dashboard</h2>
      <TextField
        label="Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <TextField
        label="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <TextField
        label="Dashboard ID"
        value={dashboardId}
        onChange={(e) => setDashboardId(e.target.value)}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
      <Button variant="contained" onClick={onClose}>
        Cancel
      </Button>
    </Box>
  );
};

export default AddDashboardPopup;
