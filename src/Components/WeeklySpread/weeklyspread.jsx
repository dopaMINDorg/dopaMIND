/*import react from "react";
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

    const handleTask = async (e) => {
        e.preventDefault()
        const { data: { user_id }, error: userError } = await supabase.auth.getUser()
    
        setStartTime(new Date(start_time).toISOString)
        setEndTime(new Date(end_time).toISOString)

        const {data, error} = await supabase
            .from('Tasks')
            .insert({start_time, end_time, user_id})
        if (error) {
            console.log(error)
            alert("Unable to schedule event")
        }
        if (data){
            console.log(data)
        }
    }
     

    return (
        <>
        <head>
            <title>Weekly Spread</title>
        </head>
        <div className="header-container">
            <div className="header">Weekly Spread</div>
            <button title="Home" className="home" onClick={() => navigate("/Home")}><HomeIcon /></button>
        </div>
        <div> <CalendarApp /> </div>
        <div className="inputTask">
            <div className="eventInput">
                <Input value="text"  dummy="Task" inputValue={task_name} setInputValue={setTaskName}/>
                <Input value="datetime-local"  dummy="Start"inputValue={start_time} setInputValue={setStartTime}/>
                <Input value="datetime-local"  dummy="End" inputValue={end_time} setInputValue={setEndTime}/>
            </div>
            <button id="enter-button" onClick={() => handleTask(action)}>Set Task</button>
        </div>
    
        </>
    )
};

export default WeeklySpread;*/