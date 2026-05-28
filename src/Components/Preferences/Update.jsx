import { useParams, useNavigate} from "react-router-dom"
import { useState } from "react"
import supabase from '../../config/supabaseClient'


const Update = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const [activity, setActivity] = useState(null)
  const [time_hours, setHours] = useState(null)
  const [time_minutes, setMinutes] = useState(null)
  const [formError, setFormError] = useState('')
    
  const handleSubmit = async (e) => {

    e.preventDefault()

    const { data: { user }, error: userError } = await supabase.auth.getUser()


    if (userError || !user) {
      alert("User not logged in")
      return
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
    <div className="page create">
      <h2>Update</h2>
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

export default Update