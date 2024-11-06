import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  TextField,
  Box,
  Container,
  Grid,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import backgroundImage from './assets/backgr.jpg'; // Add a background image

function DashboardPage() {
  const currentDate = new Date();
  const defaultStartDate = currentDate.toISOString().substr(0, 10);
  const defaultEndDate = currentDate.toISOString().substr(0, 10);

  const [gpId, setGpId] = useState(1);
  const [start_date, setStartDate] = useState(defaultStartDate);
  const [end_date, setEndDate] = useState(defaultEndDate);
  const [statisticsData, setStatisticsData] = useState([]);

  const baseUrl = 'http://127.0.0.1:5000';

  const fetchData = () => {
    fetch(
      `${baseUrl}/test/number_appointments_and_expected_workload?start_date=${start_date}&end_date=${end_date}&gp_id=${gpId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setStatisticsData(data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();
  }, [start_date, end_date, gpId]);

  const handleGpIdChange = (e) => {
    setGpId(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div
      style={{
        background: `url(${backgroundImage}) center/cover no-repeat fixed`,
        height: '100vh',
        padding: '20px',
        color: 'white',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Workload
      </Typography>
      <Container maxWidth="sm">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="gpId"
              label="GP ID"
              value={gpId}
              onChange={handleGpIdChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="start_date"
              label="Start Date"
              type="date"
              value={start_date}
              onChange={handleStartDateChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="end_date"
              label="End Date"
              type="date"
              value={end_date}
              onChange={handleEndDateChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchData}
              fullWidth
            >
              Get Appointments
            </Button>
          </Grid>
        </Grid>
      </Container>
      <div className="chart-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BarChart width={600} height={300} data={statisticsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="gp_id" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="number_appointments" fill="#FF6F61" name="Number of Appointments" />
        <Bar dataKey="expected_workload" fill="#75D7E0" name="Expected Workload" />
      </BarChart>
      </div>
    </div>
  );
}

export default DashboardPage;
