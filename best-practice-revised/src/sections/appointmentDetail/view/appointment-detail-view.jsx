import React, {useState,useEffect } from 'react';
import {useParams,Link } from 'react-router-dom';
import './AppointmentDetailPage.css'
import {
    Button,
  } from '@mui/material';
import BasicAccordion from './NoteAccordion';


const formatTimeStamp = (timeStamp) =>{
  const date = new Date(timeStamp)
  return date.toLocaleDateString('en-AU');
}
const formatTime = (timeStamp) =>{
  const date = new Date(timeStamp)
  return date.toLocaleTimeString('en-AU');
}
export const InfoComponent = ({ label, content }) => {
    return (
      <div className="InfoComponent" style={{fontSize:22,fontWeight:'bold'}}>
        <div className='left'>{label}</div>
        <div className='right'>{content}</div>
      </div>
    );
  };

const AppointmentPage = () => {
    const { appointmentId } = useParams();
    const [appointment,setAppointment] = useState({})
    const [createdBy,setCreatedBy] = useState('')
    const [bookedBy,setBookedBy] = useState('')
    useEffect(()=>{
      let initData;
      fetch(`http://127.0.0.1:5000/test/search_appoitment_by_app_id?input_id=${appointmentId}`).then((res)=>{
          if(!res.ok){
              throw new Error('Network response was not ok');
          }
          return res.json()
      })
      .then((data) =>{
        initData = data[0]
        setAppointment(data[0])
        return fetch(`http://127.0.0.1:5000/test/search_gp?input=${data[0].CREATEDBY}`);
      })
      .then((res) =>{
        if(!res.ok){
          throw new Error('Network response was not ok');
      }
      return res.json()
  })
    .then((data) =>{
      
    setCreatedBy(`${data[0].FIRSTNAME} ${data[0].SURNAME}`)
  return fetch(`http://127.0.0.1:5000/test/search_gp?input=${initData.BOOKEDBY}`);
})
  .then((res) =>{
    if(!res.ok){
      throw new Error('Network response was not ok');
  }
  return res.json()
  })
  .then((data) =>{

  setBookedBy(`${data[0].FIRSTNAME} ${data[0].SURNAME}`)})
      .catch((error) => {
        console.error("Error fetching data", error);
    })  
},[appointmentId])
    return (
      <div>
        <InfoComponent label="Appointment ID " content={appointment.RECORDID}/>
        <InfoComponent label="Patient Firstname" content={appointment.PATIENTS_FIRSTNAME}/>
        <InfoComponent label="Patient Surname" content={appointment.PATIENTS_SURNAME}/>
        <InfoComponent label="GP Firstname" content={appointment.users_firstname}/>
        <InfoComponent label="GP Surname" content={appointment.users_SURNAME}/>
        <InfoComponent label="Appointment Date" content={formatTimeStamp(appointment.APPOINTMENTDATE)}/>
        <InfoComponent label="Appointment Time" content={formatTime(appointment.APPOINTMENTTIME)}/>
        <InfoComponent label="Appointment Length" content={`${appointment.APPOINTMENTLENGTH/60} mins`}/>
        <InfoComponent label="Appointment State" content={appointment.app_code}/>
        <InfoComponent label="Appointment Type" content={appointment.app_type}/>
        <InfoComponent label="Appointment Reason" content={appointment.REASON}/>
        <InfoComponent label="Arrival Time " content={appointment.ARRIVALTIME !== 0 ? formatTimeStamp(appointment.ARRIVALTIME) : ''}/>
        <InfoComponent label="Duration" content={appointment.CONSULTATIONTIME !== 0 ? formatTime(appointment.CONSULTATIONTIME) : ''}/>
        <InfoComponent label="Room ID" content={appointment.ROOMID}/>
        <InfoComponent label="Created Date" content={formatTimeStamp(appointment.CREATED)}/>
        <InfoComponent label="Created By" content={createdBy}/>
        <InfoComponent label="Booked By" content={bookedBy}/>
        <InfoComponent label="Urgent" content={appointment.URGENT}/>
        <InfoComponent label="Item list" content={appointment.ITEMLIST}/>
        <InfoComponent label="Comment" content={appointment.COMMENT}/>
        
        <div className='accordion' style={{fontSize:22,fontWeight:'bold'}}>
        Note
        <BasicAccordion appointmentID={appointmentId}/>  
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop:'20px' }}>
        <Link to ={`/timesheet`}>
                    <Button>Back</Button>
        </Link>
        </div>
      </div>
    );
  };
  
  export default AppointmentPage;