import "./Home.css";
import PreferenceIcon from '@mui/icons-material/Settings'; 
import WeeklyIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import ReflectionIcon from '@mui/icons-material/Notes';
import Calendar from "./Calendar";
import { useNavigate } from "react-router-dom";



const Home = () => {
    const navigate = useNavigate();

    return(
        <>
        <head>
        <title>Home page</title>
        </head>
        <div className="welcome-msg">Welcome Home</div>
        <div className="wrapper">
            <div className="box">   
                <Calendar />
            </div>
            <div className="box">
                <div className ="events-container">
                    <div className="reminder-container"> 
                        <h2 id="text">Reminders</h2>
                        <p>No Reminders Avaliable</p>
                        
                    </div>
                    <div className="event-container">
                        <h2 id="text">Events</h2>
                        <p>No Events Avaliable</p>
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
