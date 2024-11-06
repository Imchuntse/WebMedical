// import { sample } from 'lodash';
// import { faker } from '@faker-js/faker';
import { getPatientsVisitUrl } from './url';

// ----------------------------------------------------------------------
export const users = [];

// Make a request to the API
fetch(getPatientsVisitUrl)
  .then(response => response.json())
  .then(data => {
    // Process the API response and format the data
    const formattedData = data.map(patient => ({
      id: patient.INTERNALID.toString(), // Convert to a string
      name: `${patient.PATIENTS_FIRSTNAME} ${patient.PATIENTS_SURNAME}`,
      company: `${patient.DRNAME}`,
      isVerified: Boolean(patient.RECORDSTATUS), // Format DOB
      status: patient.VISITTYPE, // Use HomePhone for status
      role: patient.REASON,
    }));

    // Assign the 'formattedData' to the 'users' array
    users.push(...formattedData);

    // Now, 'users' contains the data from the API response
    console.log(users);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });