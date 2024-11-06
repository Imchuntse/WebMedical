import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/timesheet/view';

// ----------------------------------------------------------------------

export default function TimesheetPage() {
  return (
    <>
      <Helmet>
        <title> Timesheet | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}
