import { getAppointmentUrl } from './url';

// ----------------------------------------------------------------------
export const users = [];

fetch(getAppointmentUrl)
  .then(response => response.json())
  .then(data => {
    // Process the API response and format the data
    const formattedData = data.map(patient => {
      // Convert the timestamp to a Date object
      const appointmentDate = new Date(patient.APPOINTMENTDATE);

      // Format the Date as 'yyyy-mm-dd'
      const formattedDate = appointmentDate.toISOString().split('T')[0];

      return {
        id: patient.INTERNALID.toString(), // Convert to a string
        name: `${patient.PATIENTS_FIRSTNAME} ${patient.PATIENTS_SURNAME}`,
        company: formattedDate, // Use the formatted date
        isVerified: Boolean(patient.INTERNALID), // Format DOB
        status: patient.app_code, // Use HomePhone for status
        role: patient.app_type,
      };
    });

    // Assign the 'formattedData' to the 'users' array
    users.push(...formattedData);

    // Now, 'users' contains the data from the API response
    console.log(users);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });