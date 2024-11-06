import React, { useState, useRef, useEffect,} from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import './Timesheet.css'

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { getAppointByDatementUrl } from 'src/_mock/url.js';
import { getIfMedicareUrl } from 'src/_mock/url.js';
import { getIfVisit12MonthUrl } from 'src/_mock/url.js';

// ----------------------------------------------------------------------
const styles = {
  wrap: {
    display: "flex"
  },
  left: {
    marginRight: "10px"
  },
  main: {
    flexGrow: "1"
  }
};

export default function UserPage() {
  const [appts, setAppts] = useState([]);
  const [event, setEvent] = useState([]);
  const calendarRef = useRef()

  async function fetAppts (selectDay) {
    if (selectDay == null) {
      return
    }

    // const data = await fetch(`http://127.0.0.1:5000/test/search_appoitment_by_date?start_date=${selectDay}&end_date=${selectDay}`).then((res)=>{
    const data = await fetch(getAppointByDatementUrl + `?start_date=${selectDay}&end_date=${selectDay}`).then((res)=>{
      if(!res.ok){
          throw new Error('Network response was not ok');
      }
      return res.json()
    })
    setAppts(data);
  }
  
  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Resources",
    // cellDuration: 15,
    // timeHeaderCellDuration: 15,
    cellHeight: 40,
    columns: [
      {name: "Dr Ivor Cure", id: "R1"},
      {name: "Mrs. Doanetes Educator", id: "R2"},
      {name: "Dr Frederick Findacure", id: "R3"},
      {name: "Ms. Nadine Nurse", id: "R4"},
      {name: "Mrs. Psychology Specialist", id: "R5"},
    ],
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onEventClick: async args => {
      
      // await editEvent(args.e);
      const clickedEventAppId = args.e.data.appid;
  
      
      window.location.href = `/appointment-detail/${args.e.data.appid}`;

    },

    onBeforeEventRender: args => {

      args.data.areas = [
        {
          width: (args.data.lastAttend==0 ? "40%" : 0),
          height: (args.data.lastAttend==0 ? "100%" : 0),
          right: 0,
          backColor: "#f00000",
          fontColor: "#000000",
          horizontalAlignment: "right",
          verticalAlignment: "bottom",
        },
        {
          width: (args.data.medicare=="False" ? "40%" : 0),
          height: (args.data.medicare=="False" ? "100%" : 0),
          left: 0,
          backColor: "#f0cc00",
          fontColor: "#000000",
          horizontalAlignment: "right",
          verticalAlignment: "bottom",
        },

        {
          width: "100%",
          height: "100%",
          right: 0,
          text: args.data.name,
          fontColor: "#000000",
        },
      ];

      const participants = args.data.participants;
      if (participants > 0) {
        // show one icon for each participant
        for (let i = 0; i < participants; i++) {
          args.data.areas.push({
            bottom: 5,
            right: 5 + i * 30,
            width: 24,
            height: 24,
            action: "None",
            image: `https://picsum.photos/24/24?random=${i}`,
            style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
          });
        }
      }
    }
  });

  useEffect(() => { 
    fetAppts(new Date().toJSON().slice(0, 10));
  }, []);

  async function initEvents (selectDay) {
    fetAppts(selectDay);

    var events = []

    for (var i = 1; i <= appts.length; i++) {
      if (appts[i] == null) {
        break;
      }

      const id = i;
      const time = new Date(appts[i].APPOINTMENTDATE - 32400000 + appts[i].APPOINTMENTTIME*1000);
      const end = new Date(appts[i].APPOINTMENTDATE - 32400000 + appts[i].APPOINTMENTTIME*1000 + appts[i].APPOINTMENTLENGTH*1000);
      const appid = appts[i].RECORDID;
      const patientId = appts[i].INTERNALID;
      var medicare = "True";
      let r = '';
      switch (appts[i].users_SURNAME) {
        case "Cure":
          r = "R1"
          break;
        case "Educator":
          r = "R2"
          break;
        case "Findacure":
          r = "R3"
          break;
        case "Nurse":
          r = "R4"
          break;
        case "Specialist":
          r = "R5"
          break;
      }
      
      // const data = await fetch(`http://127.0.0.1:5000/test/if_medicare?id=${patientId}`).then((res)=>{
      const data = await fetch(`${getIfMedicareUrl}?id=${patientId}`).then((res)=>{
        if(!res.ok){
            throw new Error('Network response was not ok');
        }
        return res.text()
      })
      medicare = data

      var lastAttend = 1;

      if ((appts[i].app_type == "Telehealth Consult") || (appts[i].app_type == "Telephone Consult") || (appts[i].app_type == "Recall") || (appts[i].app_type == "Internet")) {
        var date = new Date(appts[i].APPOINTMENTDATE); 
        date.setFullYear(date.getFullYear() - 1);
        var aYearAgo = date.toISOString().split('T')[0];
  
        const history = await fetch
        (`${getIfVisit12MonthUrl}?input_id=${patientId}&start_date=${aYearAgo}`)
        // (`http://127.0.0.1:5000/test//if_visit_prior_12_month?input_id=${patientId}&start_date=${aYearAgo}`)
        .then((res)=>{
          if(!res.ok){
              throw new Error('Network response was not ok');
          }
          return res.text()
        })
        
        if (history == "False") {
          lastAttend = 0
        }
      }

      events.push({
        "id": id,
        "appid": `${appid}`,
        "start": new DayPilot.Date(time, true),
        "end": new DayPilot.Date(end, true),
        "resource": r,
        "medicare": `${medicare}`,
        "lastAttend": `${lastAttend}`,
        "name": `${appts[i].PATIENTS_FIRSTNAME} ${appts[i].PATIENTS_SURNAME} - ${appts[i].app_type}`,
      });

    }
    setEvent(events);
  }

  useEffect(() => { 
    initEvents();
  }, [appts]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Timesheet</Typography>
  
      </Stack>
  
      <Card>
        <div>
          <div style={styles.wrap}>
            <div style={styles.left}>
            <DayPilotNavigator
              selectMode={"Day"}
              showMonths={1}
              skipMonths={1}
              startDate={new Date("2012-04-18")} // 设置为2011年1月1日
              onTimeRangeSelected={args => {
                calendarRef.current.control.update({
                  startDate: args.day
                });
                var selectDay = args.day.toString().split('T')[0];
                fetAppts(selectDay);
              }}
              />
              <div>
                <p>Legend:</p>
                <div className="yellow"></div>
                <p>patients without medicare:</p>
                <div className="red"></div>
                <p>patient's last physical attendance occurred more than 12 months ago:</p>
              </div>
            </div>
            <div style={styles.main}>
              <DayPilotCalendar
                {...calendarConfig}
                ref={calendarRef}
                events={event}
              />
            </div>
          </div>
        </div>
      </Card>
    </Container>
  );
}