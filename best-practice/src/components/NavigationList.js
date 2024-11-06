import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import backgroundImage from './assets/backg.jpg';

function NavigationList() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const currPath = useLocation();
  const [title, setTitle] = React.useState("Best Practice");
  React.useEffect(() => {
    switch(true){
        case currPath.pathname === '/Dashboard':
            setTitle("Dashboard")
            break;
        case currPath.pathname === "/patient-demographics":
            setTitle("Patient")
            break;
        case currPath.pathname === "/timesheet":
            setTitle("Timesheet")
            break;
        case currPath.pathname === "/gp-appointment-search":
            setTitle("GP Search")
            break;
        // case currPath.pathname === "/patient-appointment-search":
        //     setTitle("Patient Appointment Search")
        //     break;
        case currPath.pathname === "/settings":
            setTitle("Settings")
            break;
        case currPath.pathname === "/appointments":
            setTitle("Appointments")
            break;
        case currPath.pathname.startsWith( "/appointment-detail"):
            setTitle("Appointment Detail")
            break;
        case currPath.pathname === '/statistics':
            setTitle("Statistics")
            break;    
        default:
            setTitle("Best Practice")
            break;
      }
  })


  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggleDrawer}>
        <List>
        <ListItem component={Link} to="/Dashboard" onClick={toggleDrawer}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/patient-demographics" onClick={toggleDrawer}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Patient" />
          </ListItem>
          <ListItem button component={Link} to="/timesheet" onClick={toggleDrawer}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Timesheet" />
          </ListItem>
          <ListItem button component={Link} to="/appointments" onClick={toggleDrawer}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Appointments" />
          </ListItem>
          <ListItem button component={Link} to="/gp-appointment-search" onClick={toggleDrawer}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="GP Appointment Search" />
          </ListItem>
          <ListItem button component={Link} to="/patient-appointment-search" onClick={toggleDrawer}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Patient Appointment Search" />
          </ListItem>
          <ListItem button component={Link} to="/settings" onClick={toggleDrawer}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default NavigationList;
