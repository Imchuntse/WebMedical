// import { sample } from 'lodash';
// import { faker } from '@faker-js/faker';
import { getPatientsUrl } from './url';

// ----------------------------------------------------------------------
export const users = [];

// Make a request to the API
fetch(getPatientsUrl)
  .then(response => response.json())
  .then(data => {
    // Process the API response and format the data
    const formattedData = data.map(patient => ({
      id: patient.INTERNALID.toString(), // Convert to a string
      name: `${patient.FIRSTNAME} ${patient.SURNAME}`,
      company: `${patient.ADDRESS1}, ${patient.CITY}`,
      isVerified: Boolean(patient.MEDICARENO), // Format DOB
      status: patient.HOMEPHONE || null, // Use HomePhone for status
      role: patient.POSTCODE,
    }));

    // Assign the 'formattedData' to the 'users' array
    users.push(...formattedData);

    // Now, 'users' contains the data from the API response
    console.log(users);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });