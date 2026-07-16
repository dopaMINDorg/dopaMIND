import "./Home.css";
import PreferenceIcon from '@mui/icons-material/Settings'; 
import WeeklyIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import ReflectionIcon from '@mui/icons-material/Notes';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../../config/supabaseClient";
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Home = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([])
    const [points, setPoints] = useState(null)

    useEffect(() => {
  const fetchPoints = async () => {
    const { data, error } = await supabase
      .from("points")
      .select("points")
      .single();

    if (error) {
      console.error("Error fetching points:", error);
      return;
    }

    setPoints(data.points);
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*");

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    const formattedEvents = data.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      tags: event.tags,
    }));

    setEvents(formattedEvents);
  };

  const loadData = async () => {
    await Promise.all([
      fetchEvents(),
      fetchPoints(),
    ]);
  };

  loadData();
}, []);
    const CustomToolbar = (toolbar) => {
      return (
        <div className="rbc-toolbar">
          <span className="rbc-toolbar-label" style={{ fontSize: '25px', fontWeight: 'bold' }}>
            {toolbar.label}
          </span>
        </div>
      );
    };

const getLevel = (points) => {
  if (points === null) return 1;

  if (points < 100) return 1;
  if (points < 500) return 2;
  if (points < 1000) return 3;
  if (points < 1500) return 4;

  // Levels 5-10 (500 point difference)
  if (points < 4500) {
    return 5 + Math.floor((points - 1500) / 500);
  }

  // Levels 11-20 (1000 point difference)
  if (points < 14500) {
    return 11 + Math.floor((points - 4500) / 1000);
  }

  // Levels 21-30 (2000 point difference)
  if (points < 34500) {
    return 21 + Math.floor((points - 14500) / 2000);
  }

  return 30;
};

const currentLevel = getLevel(points);
const currentLevelImage = `/GameLevels/Level${currentLevel}.png`;

    return(
        <>
        <head>
        <title>Home page</title>
        </head>
        <div className="welcome-msg">Welcome Home</div>
        <div className="wrapper">
            <div className="box">   
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    views={['month']} 
                    defaultView={Views.MONTH}
                    components={{
                        toolbar: CustomToolbar, 
                      }}
                    />
            </div>
            <div className="box">
                <div className ="events-container">
                    <div className="reminder-container"> 
                        <h2 id="text">Current Points</h2>

                          {points !== null && (
                            <>
                              <img
                                src={currentLevelImage}
                                alt={`Level ${currentLevel}`}
                                className="level-image"
                              />

                              <h3>Level {currentLevel}</h3>
                            </>
                          )}

                          <p className={points === null ? "loading" : ""}>
                            {points ?? "--"} pts
                          </p>
                        
                    </div>
                    <div className="event-container">
                        <h2 id="text">Na</h2>
                        <p>More features coming soon</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="icon-container">
            <button title="Set Preferences" onClick={() => navigate("/preferences")}><PreferenceIcon /></button> 
            <button title="Weekly Spread" onClick={() => navigate("/weekly-spread")}><WeeklyIcon /></button>      
            <button title="Reflection" onClick={() => navigate("/reflection")}><ReflectionIcon /></button>
            <button title="Logout" onClick={() => navigate("/logout")}><LogoutIcon /></button> 
        </div>

    

        </>
    ) 
};

export default Home;
