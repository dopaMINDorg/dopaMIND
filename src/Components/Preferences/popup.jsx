function Popup({onClose}) {
    return (
        <div className="overlay">
        <div className="popup">
            <h2>Hello!</h2>
            <p>This is a popup.</p>

            <button onClick={onClose}>Close</button>
        </div>
        </div>
    );
}

export default Popup;