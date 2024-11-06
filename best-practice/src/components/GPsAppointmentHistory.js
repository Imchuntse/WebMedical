import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';

function ViewGPAppointments() {
  const [gpSearchText, setGpSearchText] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState([]);
  const navigate = useNavigate();

  const GPs = [
    { id: 1, firstname: "Findacure", surname: "Cure" },
    { id: 2, firstname: "Findacure", surname: "Ivor" },
    { id: 3, firstname: "Cure", surname: "Don" },
    { id: 4, firstname: "Susan", surname: "Gread" },
    { id: 5, firstname: "Nina", surname: "Gigi" },
    { id: 6, firstname: "Sarah", surname: "Alin" },
  ];

  const Appointments = [
    {
      type: "Routine Checkout",
      patient: "Todd Alen",
      date: "1/12/2023",
      gpId: 1,
    },
    {
      type: "Surgery",
      patient: "Sara Alen",
      date: "21/12/2023",
      gpId: 1,
    },
    {
      type: "Post-Surgery checkup",
      patient: "Todd Alen",
      date: "10/1/2024",
      gpId: 1,
    },
    {
      type: "Surgery",
      patient: "Suzan Blake",
      date: "26/11/2023",
      gpId: 2,
    },
    // Add more appointment data here...
  ];

  const displayAppointments = (gpName) => {
    setAppointmentStatus([]);
    const foundGP = GPs.find((gp) =>
      gp.surname.toLowerCase() === gpName.toLowerCase() ||
      gp.firstname.toLowerCase() === gpName.toLowerCase()
    );

    if (foundGP) {
      const gpAppointments = Appointments.filter((appointment) =>
        appointment.gpId === foundGP.id
      );

      if (gpAppointments.length > 0) {
        const gpAppointmentsTable = (
          <div key={foundGP.id}>
            <h3>Appointments for GP {foundGP.firstname} {foundGP.surname}:</h3>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Type</b></TableCell>
                    <TableCell><b>Patient</b></TableCell>
                    <TableCell><b>Date</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {gpAppointments.map((appointment, index) => (
                    <TableRow key={index}>
                      <TableCell>{appointment.type}</TableCell>
                      <TableCell>
                        <Link to={`/appointment-detail/${index}`}>{appointment.patient}</Link>
                      </TableCell>
                      <TableCell>{appointment.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        );

        setAppointmentStatus([gpAppointmentsTable]);
      } else {
        setAppointmentStatus([`No appointments found for GP ${foundGP.firstname} ${foundGP.surname}.`]);
      }
    } else {
      setAppointmentStatus(['GP not found.']);
    }
  };

  const search = () => {
    const gpSearchTextTrimmed = gpSearchText.trim();
    displayAppointments(gpSearchTextTrimmed);
  };

  const goBack = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>View GP Appointments</h1>
      <label htmlFor="gpSearch">Search for GP:</label>
      <input
        type="text"
        id="gpSearch"
        placeholder="Enter GP name"
        value={gpSearchText}
        onChange={(e) => setGpSearchText(e.target.value)}
      />
      <button onClick={search}>Search</button>
      <div id="appointments">
        <h2>Appointments</h2>
        {appointmentStatus.map((status, index) => (
          <div key={index}>{status}</div>
        ))}
      </div>
      <button onClick={goBack}>Back</button>
    </div>
  );
}

export default ViewGPAppointments;
