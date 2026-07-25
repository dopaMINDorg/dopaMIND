import supabase from '../../config/supabaseClient'
import { useEffect, useState } from "react"
import PreferenceCard from "./Card"
import { useNavigate } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/HomeFilled';
import "./preferences.css"
import Popup from './popup'

const Preferences = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [fetchError, setFetchError] = useState(null)
  const [prefs, setPrefs] = useState(null)
  const [notifTime, setNotifTime] = useState("00:00")
  const [currentNotifTime, setCurrentNotifTime] = useState("00:00")
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(true)
  const [aiError, setAiError] = useState("")

  const generatePreferences = async (prompt) => {
  try {
    setLoading(true);
    setAiError("");

    console.log("1. Starting AI generation");
    console.log("Prompt:", prompt);

    const { data: sessionData } = await supabase.auth.getSession();

    const session = sessionData.session;

    if (!session) {
      setAiError("You are not logged in.");
      return;
    }

    const { data, error } = await supabase.functions.invoke(
      "generate-preferences",
      {
        body: {
          prompt,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );

    console.log("AI response:", data);
    console.log("AI error:", error);

    if (error) {
      try {
        const errorBody = await error.context.json();

        console.log("Edge Function error:", errorBody);

        setAiError(errorBody.error);
      } catch {
        setAiError("AI generation failed. Please try again.");
      }

      return;
    }

    await fetchPreferences();
    setShowPopup(false);

  } catch (error) {
    console.error("Generate failed:", error);
    setAiError("Something went wrong generating preferences.");

  } finally {
    setLoading(false);
  }
};


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
      alert("User not logged in")
      setLoading(false);
      return
    }

    if(!notifTime){
      setFormError('Please fill in all the fields correctly')
      return 
    }

    const [hours, minutes] = notifTime.split(":")
    const notifDate = new Date()
    notifDate.setHours(hours)
    notifDate.setMinutes(minutes)
    notifDate.setSeconds(0)
    notifDate.setMilliseconds(0)

    const notif_time = notifDate.toISOString()


    const { data, error } = await supabase
      .from("Notification Time")
      .update({
        notif_time
      })

    if (error){
      console.log(error)
      alert("unable to update time")
      return
    } 
    
      setFormError(null)
      setCurrentNotifTime(notifTime)

      alert(`Notification time updated to ${formatToAMPM(notifTime)}`) 
      console.log(data)
    
  }

  const fetchNotifTime = async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("User not logged in")
      setLoading(false);
      return
    }

    const { data, error } = await supabase
    .from('Notification Time')
    .select('notif_time')
    .eq('id', user.id)
    .single()

  if (error) {
    console.log(error)
    setLoading(false)
    return
  }

  if (data?.notif_time) {
    const date = new Date(data.notif_time)

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    setNotifTime(`${hours}:${minutes}`)
    setCurrentNotifTime(`${hours}:${minutes}`)
  }

  setLoading(false);
}


  
  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from('Preferences')
      .select()

    if (error) {
      setFetchError('Could not fetch the preferences')
      setPrefs(null)
      console.log(error)
      return
    }

    
      console.log(data)
      setPrefs(data)
      setFetchError(null)
    
  }

  useEffect(() => {
    fetchPreferences()
    fetchNotifTime()
  }, [])

  // helper function that formats 24hr time to am pm
  const formatToAMPM = (time24) => {
  if (!time24) {
    return '';
  }
  const [hourStr, minute] = time24.split(':');
  let hour = Number(hourStr);
  const ampm = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12
  hour = hour ? hour : 12
  return `${hour}:${minute} ${ampm}`
}



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
            data-testid="notification-time-input"
            value={notifTime}
            onChange={(e) => setNotifTime(e.target.value)}
          />
          <button className="pref-btn">Set your time pref</button>
        </form>
      {formError && <p>{formError}</p>}
      <div className="add-button-container">
      <button className="add-buttons" onClick={() => navigate("/create")}>CREATE</button>
      {!showPopup && (
        <button
        className="add-buttons"
        onClick={() => setShowPopup(true)}
        > Need Help? </button>
        )}
      </div>
       {showPopup && (
        <Popup 
        onClose={() => setShowPopup(false)}
        onGenerate={generatePreferences}
        loading={loading}
        aiError={aiError} />
      )} 


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

      {loading ? (
        null
      ) : (
        <p>Current notification time: {formatToAMPM(currentNotifTime)}</p>
      )}
      </div>
    </>
  )
}

export default Preferences