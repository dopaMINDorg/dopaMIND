import React from "react";
import "./Logout.css";
import { useNavigate } from "react-router-dom";

const Logout = () => {
     const navigate = useNavigate();
    return (
        <>
            <head>
                <title>Logout</title>
            </head>
            <div className="page">
                <div className="logout-container"> 
                    <button className="logout-button" onClick={() => navigate("/login-sign-up")}>Confirm Logout</button>
                    <button className="go-home-button" onClick={() => navigate("/home")}>Go Home</button>
                </div>
            </div>
        </>
    )
};

export default Logout;