// MedicareDetails.js
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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

const medicareCardData = [
  {
    id: 1,
    cardType: 'Green',
    validity: '2023-12-31',
    usages: 5,
  },
  {
    id: 2,
    cardType: 'Blue',
    validity: '2023-11-30',
    usages: 3,
  },
  {
    id: 3,
    cardType: 'Yellow',
    validity: '2023-10-31',
    usages: 2,
  },
];

function MedicareDetails() {
  const { patientId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredMedicareCards, setFilteredMedicareCards] = useState(medicareCardData);

  // Handle search input change
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    // Filter medicareCardData based on search term, start date, and end date
    const filtered = medicareCardData.filter((card) => {
      const cardValidity = new Date(card.validity);
      const filterStartDate = startDate ? new Date(startDate) : null;
      const filterEndDate = endDate ? new Date(endDate) : null;

      // Check if card type or patientId matches search term, if provided
      const matchesSearchTerm =
        searchTerm.trim() === '' ||
        card.cardType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.id.toString() === searchTerm;

      // Check if card validity date is within the selected date range, if provided
      const isWithinDateRange =
        (!filterStartDate || cardValidity >= filterStartDate) &&
        (!filterEndDate || cardValidity <= filterEndDate);

      return matchesSearchTerm && isWithinDateRange;
    });

    setFilteredMedicareCards(filtered);
  };

  return (
    <div className="patient-demographics">
      <div className="left-column">
        <Typography variant="h6" gutterBottom>
          Dr. Nina Lee
        </Typography>
        <img src={doctorLogo} alt="Doctor Logo" className="doctor-logo" width="100" height="100" />
        <Link to={`/patient-visit/${patientId}`}>
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
              label="Search Medicare Card"
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
                <TableCell>ID</TableCell>
                <TableCell>Card Type</TableCell>
                <TableCell>Validity</TableCell>
                <TableCell>Usages</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMedicareCards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>{card.id}</TableCell>
                  <TableCell>{card.cardType}</TableCell>
                  <TableCell>{card.validity}</TableCell>
                  <TableCell>{card.usages}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default MedicareDetails;