import React, { useState, useRef, useEffect,} from 'react';
import { DayPilot, DayPilotCalendar, DayPilotNavigator } from "@daypilot/daypilot-lite-react";
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import './Timesheet.css'

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

const Timesheet = () => {
  const [appts, setAppts] = React.useState([]);
  const [event, setEvent] = React.useState([]);
  const calendarRef = useRef()

  async function fetAppts () {
    const data = await fetch(`http://127.0.0.1:5000/test/get_appoinments`).then((res)=>{
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
          // top: "70%",
          // text: (args.data.medicare==3500158281 ? ">12 month" : ''),
          backColor: "#f00000",
          fontColor: "#000000",
          horizontalAlignment: "right",
          verticalAlignment: "bottom",
        },
        {
          width: (args.data.medicare=="null" ? "40%" : 0),
          height: (args.data.medicare=="null" ? "100%" : 0),
          left: 0,
          // top: "70%",
          // text: (args.data.medicare==3500158281 ? "no medicare" : ''),
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
          // horizontalAlignment: "right",
          // verticalAlignment: "bottom",
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
    fetAppts();
    // console.log(appts);
    // console.log(appts[0]);
  }, []);

  async function initEvents () {
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
      var medicare = null;
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

      const data = await fetch(`http://127.0.0.1:5000/test/search_patient?input=${patientId}`).then((res)=>{
        if(!res.ok){
            throw new Error('Network response was not ok');
        }
        return res.json()
      })
      medicare = data[0].MEDICARENO

      var lastAttend = 1;

      if ((appts[i].app_type == "Telehealth Consult") || (appts[i].app_type == "Telephone Consult") || (appts[i].app_type == "Recall") || (appts[i].app_type == "Internet")) {
        var date = new Date(appts[i].APPOINTMENTDATE); 
        date.setFullYear(date.getFullYear() - 1);
        var aYearAgo = date.toISOString().split('T')[0];
        
        var date = new Date(appts[i].APPOINTMENTDATE); 
        date.setDate(date.getDate() - 1);
        var currentDate = date.toISOString().split('T')[0];
  
        const history = await fetch
        (`http://127.0.0.1:5000/test/search_appoitment_by_patient_id?input_id=${patientId}&start_date=${aYearAgo}&end_date=${currentDate}`)
        .then((res)=>{
          if(!res.ok){
              throw new Error('Network response was not ok');
          }
          return res.json()
        })
        
        if (history.length == 0) {
          lastAttend = 0
        }

        for (var j = 1; j <= history.length; j++) {
          if (history[j]) {
            const type = history[j].app_type;
            if ((type == "Telehealth Consult") || (type == "Telephone Consult") || (type == "Recall") || (type == "Internet")) {
              continue
            }
          }
          lastAttend = 1
        }

      }

      // if (patientId === 111) {
      //   console.log(currentDate, aYearAgo);
      //   console.log(lastAttend);
      //   console.log(medicare);
      // }

      events.push({
        "id": id,
        "appid": `${appid}`,
        // "text": `${appts[i].PATIENTS_FIRSTNAME} ${appts[i].PATIENTS_SURNAME} - ${appts[i].app_type}`,
        "start": new DayPilot.Date(time, true),
        "end": new DayPilot.Date(end, true),
        "resource": r,
        // "backColor": `${backColor}`,
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
    <div>
      <div style={styles.wrap}>
        <div style={styles.left}>
          <DayPilotNavigator
            selectMode={"Day"}
            showMonths={1}
            skipMonths={1}
            startDate={"2011-08-11"}
            selectionDay={"2011-08-11"}
            onTimeRangeSelected={ args => {
              calendarRef.current.control.update({
                startDate: args.day
              });
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
      <Link to ={`/dashboard`}>
        <Button variant="outlined" color="primary">Back</Button>
      </Link>
    </div>

  );
}

export default Timesheet;