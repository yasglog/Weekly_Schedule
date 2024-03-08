import React, { useState, useEffect } from "react";
import "./Home.css"; // Assuming you have a CSS file for styling
import { GrFormPrevious } from "react-icons/gr";

import { MdOutlineNavigateNext } from "react-icons/md";

import { time_Stap } from "../data";

function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentDateAsDefult, setCurrentDateAsDefult] = useState(new Date());

  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  const goToPreviousWeek = () => {
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(previousWeek.getDate() - 7);
    setCurrentDate(previousWeek);
    loadWeeklySchedule2(previousWeek);

   
  };

  const goToNextWeek = () => {
    let nextMonday = new Date(currentDate);
    let daysUntilNextMonday = 1 - nextMonday.getDay();
    if (daysUntilNextMonday <= 0) {
      daysUntilNextMonday += 7; 
    }
    nextMonday.setDate(nextMonday.getDate() + daysUntilNextMonday);
    setCurrentDate(nextMonday);

    loadWeeklySchedule2(nextMonday);
  };
  const formatDateString = (dates) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return currentDateAsDefult.toLocaleDateString("en-US", options);
  };
const formatDateString2 = (dateString) => {
  const dateParts = dateString.split('/');
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const year = parseInt(dateParts[2], 10);
  
  const date = new Date(year, month - 1, day);
  
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
  // Function to handle timezone change
  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  // Function to load weekly working days and times

  const loadWeeklySchedule = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start from Monday
    const schedule = [];
    for (let i = 0; i < 5; i++) {
      // Monday to Friday
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      const dayStr = day.toLocaleDateString("en-US", { weekday: "long" });
      const dateStr = day.toLocaleDateString();
      schedule.push({ day: dayStr, date: dateStr });
    }
    setWeeklySchedule(schedule);
  };
  const loadWeeklySchedule2 = (nextMonday) => {
    const startDate = new Date(nextMonday);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start from Monday
    const schedule = [];
    for (let i = 0; i < 5; i++) {
      // Monday to Friday
      const day = new Date(startDate);
      day.setDate(day.getDate() + i);
      const dayStr = day.toLocaleDateString("en-US", { weekday: "long" });
      const dateStr = day.toLocaleDateString();
      const timestamps = generateTimestamps(day);
      schedule.push({ day: dayStr, date: dateStr, timestamps: timestamps });
    }
    setWeeklySchedule(schedule);
  };

  function compareDate(date1, date2) {
    const parsedDate1 = new Date(date1); 
    const parsedDate2 = new Date(date2); 

    if(parsedDate1>=parsedDate2){
       console.log('simpleformat equal1 ',date1+" complrex date "+parsedDate1)
       console.log('simpleformat equal2',date2+" complrex date "+parsedDate2)
       return true;
    }
    
    console.log('simpleformat1',date1+" complrex date "+parsedDate1)
    console.log('simpleformat2 ',date2+" complrex date "+parsedDate2)


    return false
}
function monthTreeLetter(day) {
  const dayStr = day.toLocaleDateString("en-US", { weekday: "long" }).substring(0, 3);
  return dayStr;
}

  const generateTimestamps = (date) => {
    const timestamps = [];
    const startTime = new Date(date);
    startTime.setUTCHours(8); 
    const endTime = new Date(date);
    endTime.setUTCHours(23); 
    while (startTime <= endTime) {
      timestamps.push(
        startTime.toLocaleTimeString("en-US", { timeZone: selectedTimezone })
      );
      startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
    }
    return timestamps;
  };

  

  useEffect(() => {
    loadWeeklySchedule();
  }, []); // Reload schedule when date or timezone changes

  return (
    <div className="container">
      <div className="header">
        <button onClick={goToPreviousWeek} className=" PrevButton"><GrFormPrevious></GrFormPrevious> <h4 className="buttonText">Previous Week</h4></button>
        <h1>{formatDateString(currentDateAsDefult.toDateString())}</h1>
        <button onClick={goToNextWeek } className=" PrevButton"><h4 className="buttonText">Next Week</h4><MdOutlineNavigateNext></MdOutlineNavigateNext></button>
      </div>
      <div className=" timeZone">
        <label htmlFor="timezoneSelect" id="timeZoneText">Select Timezone :</label>
        <select
          id="timezoneSelect"
          value={selectedTimezone}
          onChange={handleTimezoneChange}
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">America/New_York</option>{" "}
          
        </select>
      </div>
      <div className="schedule">
        {weeklySchedule.map((day, index) => (
          <div className="timeline" key={index}>
            <div className="daydate">
            <h4 className="day">{day.day.substring(0, 3)}</h4>
              <h4>{day.date}</h4>
            </div>

            <div className="timebox">
              {time_Stap.map((timestamp, index) =>
                compareDate(formatDateString2(day.date),formatDateString(currentDateAsDefult)) ? (
                  <div className="timestamp" key={timestamp.Id}>
                    <input type="checkbox" className="check"  id={timestamp.Id} />
                    <label htmlFor={timestamp.Id}>{timestamp.Time}</label>
                  </div>
                ) : index === 0 ? (
                  <div className="timestamp" key={timestamp.Id}>
                    Past
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
