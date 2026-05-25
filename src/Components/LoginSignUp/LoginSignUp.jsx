import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./LoginSignUp.css";

import supabase from "../../config/supabaseClient"

import PasswordIcon from '@mui/icons-material/Password';
import EmailIcon from '@mui/icons-material/Email';
import FaceIcon from '@mui/icons-material/Face';
import Logo from './logo_new.png';

const LoginSignUp = () => {

  //this is changing from Signup to login action
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAuth = async () => {
    if (action === "Sign Up") {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        })
      if (error) {
        console.error(error.message)
        alert("Sign up unsuccessful")
        return
      }
      if (data) {
        console.log(data)
        alert("Sign up successful!")
        navigate("/home")
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) {
        console.error(error.message)
        alert("Login unsuccessful")
        return;
      }
      if (data){
        console.log(data)
        alert("Login successful!")
        navigate("/preferences")
      }
    }
  };

    


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
            <Input value="text" imgType={<FaceIcon className="icon"/>} dummy="Name" inputValue={name} setInputValue={setName}/>
            <Input value="email" imgType={<EmailIcon className="icon"/>} dummy="Email ID"inputValue={email} setInputValue={setEmail}/>
            <Input value="password" imgType={<PasswordIcon className="icon" />} dummy="Password" inputValue={password} setInputValue={setPassword}/>
        </div>
        <button id="enter-button" onClick={() => handleAuth(action)}>Enter</button>
    </div>
    </>
  );
}
function Input({value, imgType, dummy, inputValue, setInputValue}) {
  return (<div className="input">
            {imgType}
            <input type={value} placeholder={dummy} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>);
}


export default LoginSignUp;

