import React, { useState } from 'react';

function SearchGPAndPatients() {
    const [gpSearchText, setGpSearchText] = useState('');
    const [patientSearchText, setPatientSearchText] = useState('');

    const search = () => {
        let searchResult = '';

        if (gpSearchText && GPs.includes(gpSearchText)) {
            // Search for GP
            searchResult = `GP Found: ${gpSearchText}`;
        } else if (patientSearchText && Patients.includes(patientSearchText)) {
            // Search for Patient
            searchResult = `Patient Found: ${patientSearchText}`;
        } else {
            // No match found
            searchResult = 'Name not found in the list.';
        }

        // Display the search result in an alert
        alert(searchResult);
    };

    const goBack = () => {
        // Navigate back to the previous page
        window.history.back();
    };

    return (
        <div>
            <h1>Search GP and Patients</h1>
            <label htmlFor="gpSearch">Search for GP:</label>
            <input
                type="text"
                id="gpSearch"
                placeholder="Enter GP name"
                value={gpSearchText}
                onChange={(e) => setGpSearchText(e.target.value)}
            />
            <label htmlFor="patientSearch">Search for Patients:</label>
            <input
                type="text"
                id="patientSearch"
                placeholder="Enter patient name"
                value={patientSearchText}
                onChange={(e) => setPatientSearchText(e.target.value)}
            />
            <button onClick={search}>Search</button>
            <button onClick={goBack}>Back</button>
        </div>
    );
}

export default SearchGPAndPatients;

// Array of GP and Patient names
const GPs = [
    "Findacure",
    "Dr. I Cure",
    "Cure",
    "Reception",
    "Nurse",
    "Susan Senior Reception",
    "Technician",
    "Specialist",
    "Educator",
    "Best Practice",
    "ExternalVendor"
];

const Patients = [
    "Todd",
    "Terrance",
    "Elizabeth Jean",
    "Annie",
    "Sandra",
    "Desmond",
    "Catherine",
    "Leon",
    "Brittany",
    "Jackson",
    "Joanna",
    "Michaela",
    "Rochelle",
    "Tamara",
    "Harold",
    "Gracie",
    "Walter",
    "Mandy",
    "John",
    "Alan",
    "Madeline",
    "Benjamin",
    "Anastasia",
    "Tegan",
    "Felix",
    "Kenneth",
    "Fay",
    "Leonard",
    "David",
    "Janelle",
    "Jessica",
    "Mitchell",
    "Alfred Charles",
    "Ashley",
    "Maree",
    "Raymond",
    "Kathleen",
    "Rose",
    "David Charles",
    "Gwenda",
    "Frances",
    "Rhonda",
    "Jason"
];
