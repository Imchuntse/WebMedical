import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------


export default function AppView() {

const [patientsCount, setPatientsCount] = useState(0);
const [gpCount, setGPsCount] = useState(0);
const [appointmentCount, setAppointmentsCount] = useState(0);
const [visitCount, setVisitsCount] = useState(0);

const apiRoute = 'http://localhost:5000/test';

const [chartData, setChartData] = useState({
  labels: [],
  series: [
    {
      name: 'GP 1',
      type: 'column',
      fill: 'solid',
      data: [],
    },
  ],
});

const [expectedWorkload, setExpectedWorkload] = useState(0);
const [numberAppointments, setNumberAppointments] = useState(0);
const currDate = new Date().toISOString().slice(0, 10);

// Total Patients Count
useEffect(() => {
  const getPatientsUrl = `${apiRoute}/get_patients`;

  fetch(getPatientsUrl)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        const totalPatients = data.length;
        setPatientsCount(totalPatients); // Update the state with the fetched value
        console.log(`Total patients: ${totalPatients}`);
      } else {
        console.log('Invalid API response format');
      }
    })
    .catch((error) => {
      console.error('Error fetching data from the API:', error);
    });
}, []); 

// Total GPs Count
useEffect(() => {
  const getGPsUrl = `${apiRoute}/get_GPs`;

  fetch(getGPsUrl)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        const totalGPs = data.length;
        setGPsCount(totalGPs); // Update the state with the fetched value
        console.log(`Total GPs: ${totalGPs}`);
      } else {
        console.log('Invalid API response format');
      }
    })
    .catch((error) => {
      console.error('Error fetching data from the API:', error);
    });
}, []); 


// Total Appointments Count
useEffect(() => {
  const getAppointmentsUrl = `${apiRoute}/get_appoinments`;

  fetch(getAppointmentsUrl)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        const totalAppointments = data.length;
        setAppointmentsCount(totalAppointments); // Update the state with the fetched value
        console.log(`Total Appointments: ${totalAppointments}`);
      } else {
        console.log('Invalid API response format');
      }
    })
    .catch((error) => {
      console.error('Error fetching data from the API:', error);
    });
}, []); 


// Total Patient Visits Count
useEffect(() => {
  const getVisitsUrl = `${apiRoute}/get_patients_visit`;

  fetch(getVisitsUrl)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        const totalVisits = data.length;
        setVisitsCount(totalVisits); // Update the state with the fetched value
        console.log(`Total Visits: ${totalVisits}`);
      } else {
        console.log('Invalid API response format');
      }
    })
    .catch((error) => {
      console.error('Error fetching data from the API:', error);
    });
}, []); 




// Dynamic date generation for one-week data
const generateOneWeekDates = () => {
  const currentDate = new Date();
  const dates = [];
  const oneWeekAgo = new Date(currentDate);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);

  while (oneWeekAgo <= currentDate) {
    dates.push(oneWeekAgo.toISOString().slice(5, 10).replace(/-/g, '/'));
    oneWeekAgo.setDate(oneWeekAgo.getDate() + 1);
  }

  return dates;
};

useEffect(() => {
  const dates = generateOneWeekDates();

  const newChartData = {
    labels: dates,
    series: [
      {
        name: 'GP 1',
        type: 'column',
        fill: 'solid',
        data: [308],
      }
    ],
  };

  setChartData(newChartData);
}, []);


// Get Expected Load
useEffect(() => {
  const getVisitsUrl = `${apiRoute}/number_appointments_and_expected_workload?start_date=${currDate}&end_date=${currDate}&gp_id=1`;

  fetch(getVisitsUrl)
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const workload = data[0].expected_workload;
        const appointments = data[0].number_appointments;
        setExpectedWorkload(workload);
        setNumberAppointments(appointments);
        console.log(`Expected Workload: ${workload}`);
        console.log(`Number Appointments: ${appointments}`);
      } else {
        console.log('Invalid API response format');
      }
    })
    .catch((error) => {
      console.error('Error fetching data from the API:', error);
    });
}, [currDate]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Patients"
            total={patientsCount}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total GPs"
            total={gpCount}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Appointments"
            total={appointmentCount}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Patient Visits"
            total={visitCount}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Patient Visits"
            subheader="GP"
            chart={chartData}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Expected Workload"
            chart={{
              series: [
                { label: 'Expected Workload', value: expectedWorkload },
                { label: 'Number Appointments', value: numberAppointments },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
