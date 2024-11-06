import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/medicare/view';

// ----------------------------------------------------------------------

export default function MedicarePage() {
  return (
    <>
      <Helmet>
        <title> Medicare | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
