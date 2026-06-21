import React from "react";
import "./Logout.css";
import { useNavigate } from "react-router-dom";
import supabase from "../../config/supabaseClient";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }
  };

  return (
    <div className="logout-page">
      <div className="logout-container">
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Confirm Logout
        </button>

        <button
          className="go-home-button"
          onClick={() => navigate("/home")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default Logout;