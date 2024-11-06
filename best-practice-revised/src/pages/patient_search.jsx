import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/patient_search/view';

// ----------------------------------------------------------------------

export default function PatientSearchPage() {
  return (
    <>
      <Helmet>
        <title> PatientSearch | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
