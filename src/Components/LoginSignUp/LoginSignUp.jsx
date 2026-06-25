/*import React, { useState } from 'react';
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
    alert("Sign up successful! Please Login to continue.")
    navigate("/login-sign-up")
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
    navigate("/home")
    }
  }
};


return (
  <>
  <img src={Logo} alt="" id="logo"/>
  <div className="login-container">
  <div className="login-header">
  <div className="text">{action}</div>
  <div className="underline"></div>
  </div>
  <div className="action-container">
  <div className={action==="Login"?"action gray":"action"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
  <div className={action==="Sign Up"?"action gray":"action"} onClick={()=>{setAction("Login")}}>Login</div>

  </div>

  <div className="login-inputs">
  <Input value="text" dummy= "Name" inputValue={name} setInputValue={setName} imgType={<FaceIcon className="icon"/>}/>
  <Input value="email" dummy="Email ID"inputValue={email} setInputValue={setEmail} imgType={<EmailIcon className="icon"/>}/>
  <Input value="password" dummy="Password" inputValue={password} setInputValue={setPassword} imgType={<PasswordIcon className="icon" />}/>
  </div>

  <button id="enter-button" onClick={() => handleAuth(action)}>Enter</button>

  </div>

  </>

);

}

function Input({value, dummy, inputValue, setInputValue, imgType}) {
  return (<div className="login-input">
  {imgType}
  <input type={value} placeholder={dummy} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
  </div>);

}

export default LoginSignUp;*/





import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./LoginSignUp.css";

import supabase from "../../config/supabaseClient"

import PasswordIcon from '@mui/icons-material/Password';
import EmailIcon from '@mui/icons-material/Email';
import FaceIcon from '@mui/icons-material/Face';
import Logo from './logo_new.png';

const LoginSignUp = () => {

  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAuth = async () => {
    if (action === "Sign Up") {
      // 1. Pass the name in the options.data object
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            display_name: name, // Stores name in user_metadata
          }
        }
      })
      if (error) {
        console.error(error.message)
        alert("Sign up unsuccessful")
        return
      }
      if (data) {
        console.log(data)
        alert(/*"Sign up successful! Please Login to continue."*/
          "Account created Successfully! Welcome home!")
        // Reset action to Login so they can immediately sign in
        setAction("Login") 
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
        navigate("/home")
      }
    }
  };

  return (
    <>
    <img src={Logo} alt="DopaMIND" id="logo"/>
    <div className="login-container">
        <div className="login-header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="action-container">
          <div data-testid="SignUp" className={action==="Login"?"action gray":"action"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
          <div data-testid="Login" className={action==="Sign Up"?"action gray":"action"} onClick={()=>{setAction("Login")}}>Login</div>
        </div>
        <div className="login-inputs">
            {/* 2. Conditionally render the Name input only during Sign Up */}
            {action === "Sign Up" && (
              <Input value="text" dummy= "Name" inputValue={name} setInputValue={setName} imgType={<FaceIcon className="icon"/>}/>
            )}
            
            <Input value="email"  dummy="Email ID"inputValue={email} setInputValue={setEmail} imgType={<EmailIcon className="icon"/>}/>
            <Input value="password"  dummy="Password" inputValue={password} setInputValue={setPassword} imgType={<PasswordIcon className="icon" />}/>
        </div>
        {/* Fixed: You don't need to pass 'action' into handleAuth here since it's already in state */}
        <button id="enter-button" onClick={handleAuth}>Enter</button>
    </div>
    </>
  );
}

function Input({value, dummy, inputValue, setInputValue, imgType}) {
  return (
    <div className="login-input">
      {imgType}
      <input type={value} placeholder={dummy} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
    </div>
  );
}

export default LoginSignUp;