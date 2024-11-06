// PatientVisit.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
  TextField, // Import TextField
  InputAdornment, // Import InputAdornment
  IconButton, // Import IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './PatientDemographics.css';
import doctorLogo from './assets/doctor.png';

const patientVisitData = [
    {
      id: 1,
      patientId: 1, // Match this with the patient's id in patientsData
      date: '2023-10-15',
      diagnosis: 'Fever',
      prescription: 'Antibiotics',
      Appointment: 'In-Person',
      MedicareCard: 'No',
      Status: 'Finished'
    },
    {
      id: 2,
      patientId: 1, // Match this with the patient's id in patientsData
      date: '2023-10-17',
      diagnosis: 'Sore Throat',
      prescription: 'Throat Lozenges',
      Appointment: 'Virtual',
      MedicareCard: 'No',
      Status: 'Finished'
    },
    {
      id: 3,
      patientId: 2, // Match this with the patient's id in patientsData
      date: '2023-10-18',
      diagnosis: 'Headache',
      prescription: 'Painkillers',
      Appointment: 'In-Person',
      MedicareCard: 'No',
      Status: 'Finished'
    },
    {
      id: 4,
      patientId: 3, // Match this with the patient's id in patientsData
      date: '2023-10-20',
      diagnosis: 'Cough',
      prescription: 'Cough Syrup',
      Appointment: 'In-Person',
      MedicareCard: 'Yes',
      Status: 'Finished'
    },
    {
      id: 5,
      patientId: 3, // Match this with the patient's id in patientsData
      date: '2023-10-22',
      diagnosis: 'Fever',
      prescription: 'Antibiotics',
      Appointment: 'In-Person',
      MedicareCard: 'No',
      Status: 'Awaiting'
    },
  ];
  

  function PatientVisit() {

    const { patientId } = useParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredVisits, setFilteredVisits] = useState(patientVisitData);

      // Filter patientVisitData based on the patientId
      const filteredVisitsByPatientId = patientVisitData.filter((visit) => visit.patientId === parseInt(patientId));
  
    // Handle search input change
    const handleSearchChange = (event) => {
      const { value } = event.target;
      setSearchTerm(value);
    };
  
    // Handle filter button click
    const handleFilterClick = () => {
      // Filter patientVisitData based on search term, start date, and end date
      const filtered = patientVisitData.filter((visit) => {
        const visitDate = new Date(visit.date);
        const filterStartDate = startDate ? new Date(startDate) : null;
        const filterEndDate = endDate ? new Date(endDate) : null;
  
        // Check if visit date matches search term, if provided
        const matchesSearchTerm =
          searchTerm.trim() === '' ||
          visit.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
  
        // Check if visit date is within the selected date range, if provided
        const isWithinDateRange =
          (!filterStartDate || visitDate >= filterStartDate) &&
          (!filterEndDate || visitDate <= filterEndDate);
  
        return matchesSearchTerm && isWithinDateRange;
      });
  
      setFilteredVisits(filtered);
    };
  
    return (
      <div className="patient-demographics">
        <div className="left-column">
          <Typography variant="h6" gutterBottom>
            Dr. Nina Lee
          </Typography>
          <img src={doctorLogo} alt="Doctor Logo" className="doctor-logo" width="100" height="100" />
          <Link to="/">
            <Button variant="contained" color="primary" className="patient-button">
              Patient
            </Button>
          </Link>
        </div>
        <div className="separator"></div>
        <div className="right-column">
          <div className="search-and-filter">
            <div className="search-bar">
              <TextField
                label="Search Patient Visit"
                variant="outlined"
                onChange={handleSearchChange}
                value={searchTerm}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleFilterClick} color="primary">
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
            </div>
          </div>
          <TableContainer component={Paper} className="table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Diagnosis</TableCell>
                  <TableCell>Prescription</TableCell>
                  <TableCell>Appointment</TableCell>
                  <TableCell>MedicareCard</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {filteredVisitsByPatientId.map((patient) => (
              <TableRow key={patient.id}>
              <TableCell>{patient.date}</TableCell>
              <TableCell>{patient.diagnosis}</TableCell>
              <TableCell>{patient.prescription}</TableCell>
              <TableCell>{patient.Appointment}</TableCell>
              <TableCell>{patient.MedicareCard}</TableCell>
              <TableCell>{patient.Status}</TableCell>
              <TableCell>
                <Link to={`/medicare-details/${patient.id}`}>
                <Button variant="outlined" color="primary">
                  View Medicare
                </Button>
                </Link>
              </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          </TableContainer>
        </div>
      </div>
    );
  }
  
  export default PatientVisit;