import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import LoginSignUp from './Components/LoginSignUp/LoginSignUp';
import Home from './Components/Home/Home';
import WeeklySpread from "./Components/WeeklySpread/weeklyspread.jsx";
import Reflection from "./Components/Reflection/Reflection.jsx";
import Logout from "./Components/Logout/Logout.jsx";
import Preferences from "./Components/Preferences/preferences.jsx"
import Create from "./Components/Preferences/Create.jsx"
import Update from "./Components/Preferences/Update.jsx"
/* i think it has to have .jsx at the end for vercel*/


function App() {
  return (
    
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/login-sign-up" element={<LoginSignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/weekly-spread" element={<WeeklySpread />} />
        <Route path="/reflection" element={<Reflection />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/preferences" element={<Preferences />}/>
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
        <Route path="*" element={<div> Not Found</div>} />

      </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
