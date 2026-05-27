import { useState } from "react"
import supabase from '../../config/supabaseClient'
import { useNavigate } from "react-router-dom"

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
    <div className="page create">
      <h2>Create</h2>
      <label htmlFor="Activity">Activity:</label>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          id="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
        />


        <label htmlFor="time-hours">Hours:</label>
        <input
          type="number"
          id="time-hours"
          value={time_hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <label htmlFor="time-minutes">Minutes:</label>
        <input
          type="number"
          id="time-minutes"
          value={time_minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />


        <button>Add a New Activity</button>
        {formError && <p className="error">{formError}</p>}  
      </form>
    </div>
  )
}

export default Create