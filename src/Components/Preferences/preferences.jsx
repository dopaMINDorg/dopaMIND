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
  const [loading, setLoading] = useState(true)

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
      .from('Notification Time')
      .update({notif_time})
      .eq('id', user.id)
      .select()

    if (error){
      console.log(error)
      alert("unable to update time")
      return
    } 
    
      setFormError(null)
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

      {loading ? (
        null
      ) : (
        <p>Current notification time: {formatToAMPM(notifTime)}</p>
      )}
    </>
  )
}

export default Preferences