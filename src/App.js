import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import LoginSignUp from './Components/LoginSignUp/LoginSignUp';
import Home from './Components/Home/Home';
import WeeklySpread from "./Components/WeeklySpread/WeeklySpread";
import Reflection from "./Components/Reflection/Reflection";
import Logout from "./Components/Logout/Logout";
import Preferences from "./Components/Preferences/preferences.jsx"
import Create from "./Components/Preferences/Create.jsx"
import Update from "./Components/Preferences/Update.jsx"



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/WeeklySpread" element={<WeeklySpread />} />
        <Route path="/Reflection" element={<Reflection />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="*" element={<LoginSignUp />} />
        <Route path="/preferences" element={<Preferences />}/>
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
