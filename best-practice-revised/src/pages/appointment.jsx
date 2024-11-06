import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/appointment/view';

// ----------------------------------------------------------------------

export default function AppointmentPage() {
  return (
    <>
      <Helmet>
        <title> Appointment | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
