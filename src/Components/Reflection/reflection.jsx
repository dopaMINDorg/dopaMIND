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
    //const [userError, setUserError] = useState(false); // these are errors that users need to handle, not system errors

    const fetchQuestions = async () => {
        setLoading(true);
        const {data, error} = await supabase.rpc("get_random_questions");

        if(error) {
            console.error("Error fetching questions:", error);
            return;
        } else {
            setAnswers({}); // clear response textbox when new questions are generated
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
    const hasEmptyAnswer = questions.some((q) => !answers[q.id]?.trim());

    if(hasEmptyAnswer) {
        //setUserError(true);
        alert("Please answer all questions before submitting.");
        return;
    }

    //setUserError(false);

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
      console.error("Error in submitting response:", error);
    } else {
      alert("Saved!");
      setAnswers({}); // clear response textbox after submission
      fetchQuestions(); // refreshes questions after submit
    }
  };



     return (
    <>
    <head>
            <title>Reflection</title>
    </head>
      <div className="reflection-header-container">
        <div className="reflection-header">Reflection</div>

        <button
          title="Home"
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
              <h2 id="question">{q.reflection_prompts}</h2>

              <textarea
                className="reflection-text"
                placeholder="Reflect here..."
                value={answers[q.id] || ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            </div>
          ))
        )}
        
        <div className="reflection-buttons-container">
        <button id="other-button-other" onClick={fetchQuestions}>Change Prompts</button>
        <button id="other-button" onClick={handleSubmit}>Submit</button>
        </div>
        
        <button
          id="history-button"
          onClick={() => navigate("/history")}
        >
            View Past Reflections
        </button>

      </div>
    </>
  );
};

export default Reflection;

