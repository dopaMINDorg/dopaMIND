import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./LoginSignUp.css";

import PasswordIcon from '@mui/icons-material/Password';
import EmailIcon from '@mui/icons-material/Email';
import FaceIcon from '@mui/icons-material/Face';
import Logo from './logo_new.png';

const LoginSignUp = () => {
  const [action, setAction] = useState("Sign Up");
  const navigate = useNavigate();

  function handleLogin(value) {
   if (value === "Login") {
    //alert might not be the best way to handle this - change later
      alert("Login successful!");
    } else {
      alert("New Account created! Login successful!");
    }
      navigate("/home");
  }
    


  return (
    <>
    <img src={Logo} alt="" id="logo"/>
    <div className="container">
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="action-container">
          <div className={action==="Login"?"action gray":"action"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
          <div className={action==="Sign Up"?"action gray":"action"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
        <div className="inputs">
            <Input value="text" imgType={<FaceIcon className="icon"/>} dummy="Name" />
            <Input value="email" imgType={<EmailIcon className="icon"/>} dummy="Email ID"/>
            <Input value="password" imgType={<PasswordIcon className="icon" />} dummy="Password" />
        </div>
        <button id="enter-button" onClick={() => handleLogin(action)}>Enter</button>
    </div>
    </>
  );
};

function Input({value, imgType, dummy}) {
  return (<div className="input">
            {imgType}
            <input type={value} placeholder={dummy} />
            </div>);
}


export default LoginSignUp;

