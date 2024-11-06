import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/patient-visit/view';

// ----------------------------------------------------------------------

export default function PatientPage() {
  return (
    <>
      <Helmet>
        <title> Patient | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
