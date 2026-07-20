import React, { useState } from "react";
import "./popup.css";


const MAX_PROMPT_LENGTH = 100;

function Popup({ onClose, onGenerate, loading}) {
    const [prompt, setPrompt] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_PROMPT_LENGTH) {
            setPrompt(value);
            if (error) {
                setError("");
            }
        }
    }

    const handleSubmit = () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt");
        return;
        }

        if (prompt.trim().length > MAX_PROMPT_LENGTH) {
            setError(`Prompt cannot exceed ${MAX_PROMPT_LENGTH} characters`);
            return;
        }

        setError("");
        console.log("Popup prompt:", prompt);
        onGenerate(prompt);

    };
    return (
    <div className="ai-popup">
        <h2>Need Help?</h2>
        <p> Tell me what hobbies you like. </p>
        <input type="text" 
            placeholder="Example: indoor relaxing activities" 
            value={prompt}
            onChange={handleChange}
            />

            <div className="char-count">
                {prompt.length}/{MAX_PROMPT_LENGTH}
            </div>
            {error && <div className="error">{error}</div>}
            
        <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
        </button>
        <button onClick={onClose}> Close </button>
    </div>
    );
}


export default Popup;