import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/upapp/view';

// ----------------------------------------------------------------------

export default function UpcomingAppPage() {
  return (
    <>
      <Helmet>
        <title> UpcomingApp | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
