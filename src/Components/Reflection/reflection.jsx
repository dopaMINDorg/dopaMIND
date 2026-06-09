import React, {useEffect, useState} from "react";
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./Reflection.css";
import { useNavigate } from "react-router-dom";
import supabase from '../../config/supabaseClient';


const Reflection = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchQuestions = async () => {
        setLoading(true);
        const {data, error} = await supabase.rpc("get_random_questions");

        if(error) {
            console.error("Error fetching questions:", error);
        } else {
        setQuestions(data);     
        }

        setLoading(false);
    };

    useEffect(() => { fetchQuestions(); }, []);

    const handleChange = (id, value) => {
        setAnswers((prev) => ({
        ...prev,
        [id]: value,
     }));
  };

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const inserts = questions.map((q) => ({
      user_id: user.id,
      prompt_id: q.id,
      response: answers[q.id] || "",
    }));

    const { error } = await supabase
      .from("reflection")
      .insert(inserts);

    if (error) {
      console.log(error);
    } else {
      alert("Saved!");
      fetchQuestions(); // auto refresh new prompts
    }
  };



     return (
    <>
      <div className="reflection-header-container">
        <div className="reflection-header">Reflection</div>

        <button
          title="Home"
          className="reflection"
          onClick={() => navigate("/home")}
        >
          <HomeIcon />
        </button>
      </div>

      <div className="reflection-container">
        {loading ? (
          <p>Loading questions...</p>
        ) : (
          questions.map((q) => (
            <div className="question-container" key={q.id}>
              <h2>{q.reflection_prompts}</h2>

              <textarea
                className="reflection-text"
                placeholder="Reflect here..."
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            </div>
          ))
        )}

        <button onClick={handleSubmit}>Submit</button>
        <button onClick={fetchQuestions}>Change Prompts</button>
        <button
          onClick={() => navigate("/history")}
        >View Past Reflections</button>

      </div>
    </>
  );
};

export default Reflection;

