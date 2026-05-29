import { useParams, useNavigate} from "react-router-dom"
import { useState } from "react"
import supabase from '../../config/supabaseClient'
//uses create css styling


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


        <button className="create-add-btn">Add a New Activity</button>
        {formError && <p className="create-error">{formError}</p>}  
      </form>
      </div>
    </>
  )
}

export default Update