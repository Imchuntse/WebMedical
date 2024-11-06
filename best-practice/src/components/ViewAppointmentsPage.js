import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from '@mui/material';

function ViewAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    useEffect(()=>{
            fetch("http://127.0.0.1:5000/test/get_appoinments").then((res)=>{
                console.log(res)
                if(!res.ok){
                    throw new Error('Network response was not ok');
                }
                
                return res.json()
            })
            .then((data) =>{setAppointments(data)})
            .catch((error) => {
                console.error("Error fetching appointments:", error);
            });
        
    },[])
  return (
    <div>
      <div className="content">
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
      {appointments.map((appointment) => (
        <React.Fragment key={appointment.RECORDID}>
          <TableRow>
            <TableCell>{appointment.APPOINTMENTDATE}</TableCell>
            <TableCell>{appointment.APPOINTMENTLENGTH}</TableCell>
            <TableCell>{appointment.APPOINTMENTTIME}</TableCell>
            <TableCell>{appointment.ARRIVALTIME}</TableCell>
            <TableCell>{appointment.BOOKEDBY}</TableCell>
            <TableCell>
              <Link to={`/appointment-detail/${appointment.RECORDID}`}>
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
  );
}

export default ViewAppointmentsPage;
