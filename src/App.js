import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; 

import LoginSignUp from "./Components/LoginSignUp/LoginSignUp";
import Home from "./Components/Home/Home";
import WeeklySpread from "./Components/WeeklySpread/weeklyspread.jsx";
import Reflection from "./Components/Reflection/reflection.jsx";
import Logout from "./Components/Logout/logout.jsx";

import Preferences from "./Components/Preferences/preferences.jsx"
import Create from "./Components/Preferences/Create.jsx"
import Update from "./Components/Preferences/Update.jsx"
import ReflectionHistory from "./Components/Reflection/ReflectionHistory.jsx"
/* i think it has to have .jsx at the end for vercel*/


import { ModeProvider } from "./Context/ModeContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

import supabase from "./config/supabaseClient";

function App() {

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ModeProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>

            {/* Login Routes */}
            <Route
              path="/"
              element={
                session ? (
                  <Navigate to="/home" replace />
                ) : (
                  <LoginSignUp />
                )
              }
            />

            <Route
              path="/login-sign-up"
              element={
                session ? (
                  <Navigate to="/home" replace />
                ) : (
                  <LoginSignUp />
                )
              }
            />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute session={session}>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/weekly-spread"
              element={
                <ProtectedRoute session={session}>
                  <WeeklySpread />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reflection"
              element={
                <ProtectedRoute session={session}>
                  <Reflection />
                </ProtectedRoute>
              }
            />

            <Route
              path="/logout"
              element={
                <ProtectedRoute session={session}>
                  <Logout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/preferences"
              element={
                <ProtectedRoute session={session}>
                  <Preferences />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create"
              element={
                <ProtectedRoute session={session}>
                  <Create />
                </ProtectedRoute>
              }
            />

            <Route
              path="/:id"
              element={
                <ProtectedRoute session={session}>
                  <Update />
                </ProtectedRoute>
              }
            />

             <Route
              path="/history"
              element={
                <ProtectedRoute session={session}>
                  <ReflectionHistory />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </ModeProvider>

  );
}

export default App;