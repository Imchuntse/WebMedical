import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import DashboardPage from './components/DashboardPage';
import PatientDemographics from './components/PatientDemographics'; 
import PatientVisit from './components/PatientVisit';
import MedicareDetails from './components/MedicareDetails';
import Timesheet from './components/Timesheet';
import AppointmentPage from './components/AppointmentPage'
import SearchGPAndPatients from './components/GP_PatientSearch'
import ViewGPAppointments from './components/GPsAppointmentHistory';
import PatientAppointmentHistory from './components/PatientAppHistory_Dimo'
import NavigationList from './components/NavigationList';
import ViewAppointmentsPage from './components/ViewAppointmentsPage';

function App() {
  return (
    <Router>
      <NavigationList/>
      <div className="App">
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/patient-demographics" element={<PatientDemographics />} />
          <Route path="/patient-visit/:patientId" element={<PatientVisit />} />
          <Route path="//medicare-details/:patientId" element={<MedicareDetails />} />
          <Route path="/" element={<LoginPage />} /> {/* Set Login page as the default landing page */}
          <Route path="/timesheet" element={<Timesheet />} />
          <Route path='/appointment-detail/:appointmentId' element={<AppointmentPage />}/>
          <Route path='/gp-appointment-search' element={<ViewGPAppointments />}/>
          <Route path='/patient-appointment-search' element={<PatientAppointmentHistory/>} />
          <Route path='/appointments' element={<ViewAppointmentsPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
