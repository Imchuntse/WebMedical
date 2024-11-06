import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/appointmentDetail/view';

// ----------------------------------------------------------------------

export default function AppointmentDetailPage() {
  return (
    <>
      <Helmet>
        <title> Appointment Detail | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
