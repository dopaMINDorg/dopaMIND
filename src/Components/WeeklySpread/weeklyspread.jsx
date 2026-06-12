import React, { useState } from 'react'
import CalendarApp from "./CalendarWeekly";
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./WeeklySpread.css";
import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";



const WeeklySpread = () => {
    const navigate = useNavigate();

    const [task_name, setTaskName] = useState("");
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
   //this code can successfully add a task for the database
   //it cannot however, check for overlapping events or anything of the sort
    const handleTask = async (e) => {
        e.preventDefault()

        if (!start_time || !end_time) {
        alert("Please select both start and end times")
        return
        }

        if(!task_name){
            alert("Please give task name")
            return
        }

        const formattedStart = new Date(start_time).toISOString()
        const formattedEnd = new Date(end_time).toISOString()

        const { data, error } = await supabase
            .from('Tasks')
            .insert({
            start_time: formattedStart,
            end_time: formattedEnd,
            task_name
            })

        if (error) {
            console.log(error)
            alert("Unable to schedule event")
        }

        if (data) {
            console.log(data)
        }
    }
     

    return (
        <>
        <head>
            <title>Weekly Spread</title>
        </head>

        <div className="weekly-header-container">
            <div className="weekly-header">Weekly Spread</div>
            <button title="Home" className="reflection-home" onClick={() => navigate("/home")}><HomeIcon /></button>
        </div>

        <div className="inputTask">
             <form onSubmit={handleTask}>
                <label htmlFor="task-name">Task</label>
                <input 
                type="text"
                id="Task"
                value={task_name}
                onChange={(e) => setTaskName(e.target.value)}
                />

                 <label htmlFor="start-time">Start Time:</label>
                <input
                type="datetime-local"
                id="start-time"
                value={start_time}
                onChange={(e) => setStartTime(e.target.value)}
                />

                <label htmlFor="end-time">End Time:</label>
                <input
                type="datetime-local"
                id="end-time"
                value={end_time}
                onChange={(e) => setEndTime(e.target.value)}
                />
                <button id="enter-button">Set Task</button> 
            </form>
        </div>
       
        <div> <CalendarApp /> </div>

    
        </>
    )

};



export default WeeklySpread;