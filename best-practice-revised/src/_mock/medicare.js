// import { sample } from 'lodash';
// import { faker } from '@faker-js/faker';
import { getMedicareUrl } from './url';

// ----------------------------------------------------------------------
export const users = [];

// Make a request to the API
fetch(getMedicareUrl)
  .then(response => response.json())
  .then(data => {
    // Process the API response and format the data
    const formattedData = data.map(patient => ({
      id: patient.INTERNALID.toString(), // Convert to a string
      name: `${patient.PATIENTS_FIRSTNAME} ${patient.PATIENTS_SURNAME}`,
      company: `${patient.ITEMTEXT}`,
      isVerified: Boolean(patient.RECORDSTATUS), // Format DOB
      status: patient.STATUSCODE, // Use HomePhone for status
      role: patient.YEAR,
    }));

    // Assign the 'formattedData' to the 'users' array
    users.push(...formattedData);

    // Now, 'users' contains the data from the API response
    console.log(users);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });