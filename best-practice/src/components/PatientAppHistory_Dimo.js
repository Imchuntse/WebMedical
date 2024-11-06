import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

import { Typography } from '@mui/material';

function PatientAppointmentHistory() {
  const [patientSearchText, setPatientSearchText] = useState('');
  const [patientDetails, setPatientDetails] = useState({
    demographics: {},
    appointmentHistory: [],
    futureAppointments: [],
  });
  const navigate = useNavigate();

  const patients = [
    {
      name: "Todd",
      appointmentHistory: [
        "2023-10-01: Checkup: 15 min: Dr.Cure",
        "2023-09-15: Dental Cleaning: 50 min: Dr.Helen",
        "2023-08-20: X-ray: 30 min: Dr.Susan"
      ],
      futureAppointments: [
        "2023-11-25: Follow-up: 30 min: Dr.Susan",
        "2023-12-10: Annual Physical: 45 min: Dr.Cure"
      ],
      demographics: {
        INTERNALID: 5,
        FIRSTNAME: "Todd",
        MIDDLENAME: "Arther",
        SURNAME: "Arthurson",
        PREFERREDNAME: "Todd",
        ADDRESS1: "6/122 Gympie Road",
        ADDRESS2: "NULL",
        CITY: "Lutwyche",
        POSTCODE: "4030",
        DOB: "1986-01-16",
        HOMEPHONE: "07 68745221",
        WORKPHONE: "747613287",
        MOBILEPHONE: "04000000"
      }
    },
    // Add more patient data here...
  ];

  const searchPatientAppointments = () => {
    const patientSearchTextTrimmed = patientSearchText.trim().toLowerCase();

    const patient = patients.find((p) =>
      p.name.toLowerCase() === patientSearchTextTrimmed ||
      p.demographics.FIRSTNAME.toLowerCase() === patientSearchTextTrimmed ||
      p.demographics.MIDDLENAME.toLowerCase() === patientSearchTextTrimmed ||
      p.demographics.SURNAME.toLowerCase() === patientSearchTextTrimmed ||
      p.demographics.DOB === patientSearchTextTrimmed
    );

    if (patient) {
      setPatientDetails({
        demographics: patient.demographics,
        appointmentHistory: patient.appointmentHistory,
        futureAppointments: patient.futureAppointments,
      });
    } else {
      setPatientDetails({
        demographics: {},
        appointmentHistory: [],
        futureAppointments: [],
      });
    }
  };

  const goBack = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Patient Appointment History</h1>
      <label htmlFor="patientSearch">Search for Patients:</label>
      <input
        type="text"
        id="patientSearch"
        placeholder="Enter patient name or DOB"
        value={patientSearchText}
        onChange={(e) => setPatientSearchText(e.target.value)}
      />
      <button onClick={searchPatientAppointments}>Search</button>

      {Object.keys(patientDetails.demographics).length > 0 && (
        <div id="patientDetails">
          <Typography variant="h6">Patient Demographics:</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle1"><b>INTERNALID</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>FIRSTNAME</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>MIDDLENAME</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>SURNAME</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>PREFERREDNAME</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>ADDRESS1</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>ADDRESS2</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>CITY</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>POSTCODE</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>DOB</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>HOMEPHONE</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>WORKPHONE</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>MOBILEPHONE</b></Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={1}>
                  <TableCell>{patientDetails.demographics.INTERNALID}</TableCell>
                  <TableCell>{patientDetails.demographics.FIRSTNAME}</TableCell>
                  <TableCell>{patientDetails.demographics.MIDDLENAME}</TableCell>
                  <TableCell>{patientDetails.demographics.SURNAME}</TableCell>
                  <TableCell>{patientDetails.demographics.PREFERREDNAME}</TableCell>
                  <TableCell>{patientDetails.demographics.ADDRESS1}</TableCell>
                  <TableCell>{patientDetails.demographics.ADDRESS2}</TableCell>
                  <TableCell>{patientDetails.demographics.CITY}</TableCell>
                  <TableCell>{patientDetails.demographics.POSTCODE}</TableCell>
                  <TableCell>{patientDetails.demographics.DOB}</TableCell>
                  <TableCell>{patientDetails.demographics.HOMEPHONE}</TableCell>
                  <TableCell>{patientDetails.demographics.WORKPHONE}</TableCell>
                  <TableCell>{patientDetails.demographics.MOBILEPHONE}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {patientDetails.appointmentHistory.length > 0 && (
        <div id="appointmentHistory">
          <Typography variant="h6">Appointment History:</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle1"><b>Date</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>Appointment</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>Duration</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>GPs Name</b></Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientDetails.appointmentHistory.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell>{appointment.split(':')[0]}</TableCell>
                    <TableCell>{appointment.split(':')[1]}</TableCell>
                    <TableCell>{appointment.split(':')[2]}</TableCell>
                    <TableCell>{appointment.split(':')[3]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      {patientDetails.futureAppointments.length > 0 && (
        <div id="futureAppointments">
          <Typography variant="h6">Future Appointments:</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="subtitle1"><b>Date</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>Appointment</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>Duration</b></Typography></TableCell>
                  <TableCell><Typography variant="subtitle1"><b>GPs Name</b></Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patientDetails.futureAppointments.map((appointment, index) => (
                  <TableRow key={index}>
                    <TableCell>{appointment.split(':')[0]}</TableCell>
                    <TableCell>{appointment.split(':')[1]}</TableCell>
                    <TableCell>{appointment.split(':')[2]}</TableCell>
                    <TableCell>{appointment.split(':')[3]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}

      <button onClick={goBack}>Back</button>
    </div>
  );
}

export default PatientAppointmentHistory;
