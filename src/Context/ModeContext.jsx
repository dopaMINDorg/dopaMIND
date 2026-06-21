import { createContext, useContext, useState } from "react";

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
    const [mode, setMode] = useState("focus"); // default

    const toggleMode = () => {
        setMode(prev => (prev === "focus" ? "relax" : "focus"));
    };

    return (
        <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => useContext(ModeContext);