import CalendarApp from "./CalendarWeekly";
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./WeeklySpread.css";
import { useMode } from "../../Context/ModeContext";
import { useNavigate } from "react-router-dom";;

const WeeklySpread = () => {
    const navigate = useNavigate();
    const { mode, toggleMode } = useMode();

    return (
        <div className={`weekly-container ${mode}`}>
            <div className="weekly-header-container">
                <div className="weekly-header">Weekly Spread</div>
                <button
                    title="Home"
                    className="reflection-home"
                    onClick={() => navigate("/home")}
                >
                    <HomeIcon />
                </button>
                </div>


                <div className="weekly-mode-description">
                    {mode === "focus" ? (
                        <>
                            <strong>Focus Mode:</strong> Prioritize tasks and deep work.
                        </>
                    ) : (
                        <>
                            <strong>Relax Mode:</strong> Balance productivity with wellbeing.
                        </>
                    )}
                  
                <button className="mode-btn" title="Mode" onClick={toggleMode}>
                    {mode === "focus" ? "Relax Mode" : "Focus Mode"}
                </button>
            </div>

            <CalendarApp />

        </div>
    );
};

export default WeeklySpread;