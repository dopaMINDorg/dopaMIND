import { useState, useEffect } from "react";
import "./CompletionPopup.css";

export default function CompletionPopup({
  isOpen,
  event,
  onClose,
  onSave
}) {

  console.log("CompletionPopup rendered", {
  isOpen,
  event
});
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (event) {
      setCompleted(event.completed ?? false);
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleSubmit = () => {
    onSave({
      ...event,
      completed
    });
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>Event Completed?</h3>

        <p>
          <strong>{event.title}</strong>
        </p>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "20px 0"
          }}
        >
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Mark this event as completed
        </label>

        <button onClick={handleSubmit}>
          Save
        </button>

        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}