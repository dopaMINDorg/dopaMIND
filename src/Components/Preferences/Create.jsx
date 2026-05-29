import { useState } from "react"
import supabase from '../../config/supabaseClient'
import { useNavigate } from "react-router-dom"
import "./Create.css";

const Create = () => {
  const navigate = useNavigate()
  const [activity, setActivity] = useState('')
  const [time_hours, setHours] = useState('')
  const [time_minutes, setMinutes] = useState('')
  const [formError, setFormError] = useState('')

  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!activity || !time_minutes ||!time_hours){
      setFormError('Please fill in all the fields correctly')
      return 
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      setFormError('You must be logged in to save preferences.')
      console.error("Authentication error:", authError)
      return
    }
    
  const { data, error } = await supabase
    .from('Preferences')
    .insert([{activity, time_hours, time_minutes, user_id: user.id}])
    .select()

    if (error){
      console.log(error)
    }
    if (data){
      console.log(data)
      setFormError(null) 
      navigate("/preferences")
    }
  }

  return (
    <>
      <head>
        <title>Preferences</title>
      </head>
      <div className="create-header">Create Preferences</div>
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


        <button className="create-add-btn">Add Activity</button>
        {formError && <p className="create-error">{formError}</p>}  
      </form>
      </div>
    </>
  )
}

export default Create