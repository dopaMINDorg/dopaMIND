import react from "react";
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./Reflection.css";
import { useNavigate } from "react-router-dom";


const Reflection = () => {
    const navigate = useNavigate();
    return (
        <>
            <head>
                <title>Reflection</title>
            </head>
            <div className="header-container">
                <div className="header">Reflection</div>
                <button title="Home" className="reflection" onClick={() => navigate("/Home")}><HomeIcon /></button>
            </div>
            <div className="reflection-container">
                    <div className="question1-container"> 
                        <h2 id="text">What went well today?</h2>
                        <textarea className="reflection-text" placeholder="Reflect here..."></textarea>
                    </div>
                    <div className="question2-container">
                        <h2 id="text">What is something you like about yourself?</h2>
                        <textarea className="reflection-text" placeholder="Reflect here..."></textarea>
                    </div>
            </div>
        </>
    )
};

export default Reflection;

