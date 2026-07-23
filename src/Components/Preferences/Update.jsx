import { useParams, useNavigate} from "react-router-dom"
import { useState, useEffect } from "react"
import supabase from '../../config/supabaseClient'
//uses create css styling


const Update = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const [activity, setActivity] = useState('')
  const [time_hours, setHours] = useState('')
  const [time_minutes, setMinutes] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
  const fetchPreference = async () => {
    const { data, error } = await supabase
      .from('Preferences')
      .select('activity, time_hours, time_minutes')
      .eq('id', id)
      .single()

    if (error) {
      console.log(error)
      setFormError('Could not fetch preference')
      return
    }

    setActivity(data.activity)
    setHours(data.time_hours)
    setMinutes(data.time_minutes)
  }
  fetchPreference() }, [id])
    
  const handleSubmit = async (e) => {

    e.preventDefault()

    const { data: { user }, error: userError } = await supabase.auth.getUser()


    if (userError || !user) {
      alert("User not logged in")
      return
    }

    const hours = Number(time_hours);
    const minutes = Number(time_minutes);

    if(!activity || !time_minutes ||!time_hours){
      setFormError('Please fill in all the fields correctly')
      return 
    }

    if(hours < 0 || minutes < 0 ) {
      setFormError('Please enter valid Duration (hours and minutes cannot be negative)')
      return;
    }
    
    if(minutes >= 60 || hours > 24 ) {
      setFormError('Please enter valid Duration (minutes should not exceed 59 and hours should not exceed 24)')
      return;
    }

    if(hours === 0 && minutes === 0) {
      setFormError('Please enter valid Duration (dont leave duration as 0 hours and 0 minutes)')
      return;
    }


    const { data, error } = await supabase
      .from('Preferences')
      .update({activity, time_hours, time_minutes, user_id: user.id})
      .eq('id', id)
      .select()
      .single()
  
    if(error) {
        console.log(error)
        setFormError('Please fill in all the fields correctly')
        
    }
    if(data){
      console.log(data)
      setFormError(null)
      navigate('/preferences')
    }

    
  }

 
  
  return (
    <>
      <head>
        <title>Preferences</title>
      </head>
      <div className="create-header">Update Preferences</div>
      <div className="create-container">
      <form className="create-form" onSubmit={handleSubmit}>
        <input 
          className="create-input"
          placeholder="Activity:"
          type="text"
          id="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />

        <input
          className="create-input"
          placeholder="Hours:"
          type="number"
          id="time-hours"
          value={time_hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <input
          className="create-input"
          placeholder="Minutes:"
          type="number"
          id="time-minutes"
          value={time_minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />


        <button className="create-add-btn">Update Activity</button>
        {formError && <p className="create-error">{formError}</p>}  
      </form>
      </div>
    </>
  )
}

export default Update