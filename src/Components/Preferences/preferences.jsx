import supabase from '../../config/supabaseClient'
import { useEffect, useState } from "react"
import PreferenceCard from "./Card"
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./preferences.css"

const Preferences = () => {
  const navigate = useNavigate();
  const [fetchError, setFetchError] = useState(null)
  const [prefs, setPrefs] = useState(null)
  const [notifTime, setNotifTime] = useState("00:00")
  const [formError, setFormError] = useState('')

  const handleDelete = async (id) => {
    setPrefs(prevPrefs => {
      return prevPrefs.filter(pr => pr.id !== id)
    })
  }
  
  const handleNotifTime = async (e) => {
  e.preventDefault();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    alert("User not logged in");
    return;
  }

  if (!notifTime) {
    setFormError("Please fill in all the fields correctly");
    return;
  }

  const [hours, minutes] = notifTime.split(":");

  const pendingDate = new Date();
  pendingDate.setHours(Number(hours));
  pendingDate.setMinutes(Number(minutes));
  pendingDate.setSeconds(0);
  pendingDate.setMilliseconds(0);

  const pending_notif_time = pendingDate.toISOString();

  const { data, error } = await supabase
    .from("Notification Time")
    .update({ pending_notif_time })
    .eq("id", user.id)
    .select();

  if (error) {
    console.error(error);
    alert("Unable to update time");
    return;
  }

  setFormError(null);
  console.log(data);
};
  
  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from('Preferences')
      .select()

    if (error) {
      setFetchError('Could not fetch the preferences')
      setPrefs(null)
      console.log(error)
    }

    if (data) {
      console.log(data)
      setPrefs(data)
      setFetchError(null)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])



  return (
    <>
      <head>
        <title>Preferences</title>
      </head>
      {fetchError && <p>{fetchError}</p>}
      <div className="preference-header-container">
      <div className="preference-header">Set Your Preferences</div>
      <button title="Home" className="preference-home-button" onClick={() => navigate("/home")}><HomeIcon /></button>
      </div>
      
      <div className="preference-content">
      <form className="time-form" onSubmit={handleNotifTime}>
        <input 
          type="time"
          id="notification-time"
          value={notifTime}
          onChange={(e) => setNotifTime(e.target.value)}
        />
        <button className="pref-btn">Set your time pref</button>
      </form>
      {formError && <p>{formError}</p>}
      <button className="create-button" onClick={() => navigate("/create")}>CREATE</button>
      </div>


      {prefs && (
        <div className="preferences">
          <div className="preferences-grid">
            {prefs.map(pref => (
              <PreferenceCard
                key={pref.id}
                pref={pref}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Preferences