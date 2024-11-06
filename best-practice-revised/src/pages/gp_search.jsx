import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/gp_search/view';

// ----------------------------------------------------------------------

export default function GPSearchPage() {
  return (
    <>
      <Helmet>
        <title> GPSearch | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
