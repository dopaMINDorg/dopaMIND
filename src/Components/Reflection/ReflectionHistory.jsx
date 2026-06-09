import React from "react";
import { useEffect, useState } from "react";
import supabase from '../../config/supabaseClient';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/HomeFilled';

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
    response,
    created_at,
    reflection_questions (
      reflection_prompts
    )
  `)
  .eq("user_id", user.data.user.id)
  .order("created_at", { ascending: false })
  .limit(10);

    if (error) {
      console.error(error);
    } else {
      setResponses(data);
    }

    setLoading(false);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <div>
      <h2>Latest Responses</h2>
      <button
          title="Home"
          className="reflection"
          onClick={() => navigate("/home")}
        >
          <HomeIcon />
        </button>
      </div>

      {responses.length === 0 ? (
        <p>No responses yet.</p>
      ) : (
        responses.map((item) => (
          <div key={item.created_at} style={{ marginBottom: "20px" }}>
            
            <p><strong>Q:</strong> {item.reflection_questions?.reflection_prompts}</p>
            <p><strong>A:</strong> {item.response}</p>
            <p style={{ fontSize: "12px", color: "gray" }}>
              {new Date(item.created_at).toLocaleString()}
            </p>
           
          </div>
        
        ))
    )
}
</>
        
    
  );
}

export default ReflectionHistory;