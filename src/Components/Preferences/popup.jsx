import React, { useState } from "react";


function Popup({
  onClose,
  onGenerate,
  loading
}) {

    const [prompt, setPrompt] = useState("");



    const handleSubmit = () => {

        if (!prompt.trim()) {
        return;
        }
        console.log("Popup prompt:", prompt);
        onGenerate(prompt);

    };



    return (

        <div className="overlay">

        <div className="popup">

            <h2>Need Help?</h2>


            <p>
            Tell me what hobbies you like.
            </p>


            <input
            type="text"
            placeholder="Example: indoor relaxing activities"
            value={prompt}
            onChange={(e) =>
                setPrompt(e.target.value)
            }
            />



            <button
            onClick={handleSubmit}
            disabled={loading}
            >

            {loading
                ? "Generating..."
                : "Generate"
            }

            </button>



            <button onClick={onClose}>
            Close
            </button>


        </div>

        </div>

    );
}


export default Popup;