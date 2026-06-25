import React from "react";
import { useEffect, useState } from "react";
import supabase from '../../config/supabaseClient';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./ReflectionHistory.css";

const ReflectionHistory = () => {
    const navigate = useNavigate();
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResponses();
    }, []);

    async function fetchResponses() {
        setLoading(true);

        const user = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("reflection")
            .select(`
                id,
                response,
                created_at,
                reflection_questions (
                reflection_prompts
                )
    `         )
            .eq("user_id", user.data.user.id)
            .order("created_at", { ascending: false })
            .limit(10);

        if (error) {
            console.error("Error in fetching reflections:", error);
        } else {
            setResponses(data);
        }

        setLoading(false);
    }

    if (loading) { return <p>Loading...</p>; }
    // the below header and home icon uses the same styles from reflection.css

    return (
        <>
        <head>
            <title>Reflection History</title>
        </head> 
        
        <div className="reflection-header-container"> 
        <div className="reflection-header">Past Responses</div>

        <button
          title="Home" 
          onClick={() => navigate("/home")}
        >
          <HomeIcon /> 
        </button> 
        </div> 
        
        {responses.length === 0 ? (
            <p>No responses yet.</p>
        ) : (
            responses.map((item) => (
            <div className= "response-container" key={item.id}>
                <div className="reflection-question"> {item.reflection_questions?.reflection_prompts} </div>
                <div className="reflection-response"> {item.response} </div>
                <div className="reflection-date"> {new Date(item.created_at).toLocaleString()} </div>
            
            </div>
            
            ))
        )
    }
    </>
            
        
    );
}

export default ReflectionHistory;