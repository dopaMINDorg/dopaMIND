import react from "react";
import CalendarApp from "./CalendarWeekly";
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./WeeklySpread.css";
import { useNavigate } from "react-router-dom";


const WeeklySpread = () => {
    const navigate = useNavigate();
return (
    <>
    <head>
        <title>Weekly Spread</title>
    </head>
    <div className="header-container">
        <div className="header">Weekly Spread</div>
        <button title="Home" className="home" onClick={() => navigate("/home")}><HomeIcon /></button>
    </div>
    <div> <CalendarApp /> </div>
    </>
)
};

export default WeeklySpread;