import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Patient',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Timesheet',
    path: '/timesheet',
    icon: icon('ic_timesheet'),
  },
  {
    title: 'Appointment',
    path: '/appointment',
    icon: icon('ic_appointment'),
  },
  {
    title: 'GP Search',
    path: '/gp_search',
    icon: icon('ic_gp_search'),
  },
  // {
  //   title: 'Patient Appointment Search',
  //   path: '/patient_search',
  //   icon: icon('ic_patient_search'),
  // },
];

export default navConfig;
