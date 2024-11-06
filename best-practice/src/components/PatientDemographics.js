// PatientDemographics.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import './PatientDemographics.css';
import doctorLogo from './assets/doctor.png';
import backgroundImage from './assets/backgr.jpg';

const patientsData = [
  {
    id: 1,
    name: 'John Doe',
    age: 35,
    gender: 'Male',
    address: '123 Main St, City',
    appointmentDate: '2023-10-15',
    visits: [
      {
        date: '2023-10-15',
        diagnosis: 'Fever',
        prescription: 'Antibiotics',
      },
      {
        date: '2023-10-17',
        diagnosis: 'Sore Throat',
        prescription: 'Throat Lozenges',
      },
    ],
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 28,
    gender: 'Female',
    address: '456 Elm St, Town',
    appointmentDate: '2023-10-18',
    visits: [
      {
        date: '2023-10-18',
        diagnosis: 'Headache',
        prescription: 'Painkillers',
      },
    ],
  },
  // Add more dummy patient data as needed
  {
    id: 3,
    name: 'Alice Johnson',
    age: 42,
    gender: 'Female',
    address: '789 Oak St, Village',
    appointmentDate: '2023-10-20',
    visits: [
      {
        date: '2023-10-20',
        diagnosis: 'Cough',
        prescription: 'Cough Syrup',
      },
      {
        date: '2023-10-22',
        diagnosis: 'Fever',
        prescription: 'Antibiotics',
      },
    ],
  },
  {
    id: 4,
    name: 'Bob Brown',
    age: 50,
    gender: 'Male',
    address: '555 Pine St, Suburb',
    appointmentDate: '2023-10-25',
    visits: [],
  },
];


function PatientDemographics() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patientsData);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Handle search input change
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    // Filter patients based on the search term
    const filtered = patientsData.filter((patient) =>
      patient.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    // Filter patients based on the selected date range
    const filtered = patientsData.filter((patient) => {
      const appointmentDate = new Date(patient.appointmentDate);
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return appointmentDate >= start && appointmentDate <= end;
      }
      return true; // If no dates are selected, show all patients
    });
    setFilteredPatients(filtered);
  };

  const dashboardStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '100vh', 
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
    <div className="patient-demographics" >
      <div className="left-column">
        <div className="doctor-info">
          <Typography variant="h6" gutterBottom>
            Dr. Nina Lee
          </Typography>
          <img src={doctorLogo} alt="Doctor Logo" className="doctor-logo" width="100" height="100" />
        </div>
        <Button variant="contained" color="primary" className="patient-button">
          Patient
        </Button>
      </div>
      <div className="separator"></div>
      <div className="right-column">
        <div className="search-and-filter">
          <div className="search-bar">
            <TextField
              label="Search Patient"
              variant="outlined"
              onChange={handleSearchChange}
              value={searchTerm}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="date-filter">
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <IconButton onClick={handleFilterClick} color="primary">
              <SearchIcon />
            </IconButton>
          </div>
        </div>
        <TableContainer component={Paper} className="table-container">
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Patient's Name</TableCell>
        <TableCell>Age</TableCell>
        <TableCell>Gender</TableCell>
        <TableCell>Address</TableCell>
        <TableCell>Date of Appointment</TableCell>
        <TableCell>View</TableCell> {/* New column for View button */}
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredPatients.map((patient) => (
        <React.Fragment key={patient.id}>
          <TableRow>
            <TableCell>{patient.name}</TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>{patient.address}</TableCell>
            <TableCell>{patient.appointmentDate}</TableCell>
            <TableCell>
              <Link to={`/patient-visit/${patient.id}`}>
                <Button variant="outlined" color="primary">
                  VIEW
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        </React.Fragment>
      ))}
    </TableBody>
  </Table>
</TableContainer>


      </div>
    </div>
    </div>
  );
}

export default PatientDemographics;
