import { useParams, useNavigate} from "react-router-dom"
import { useState } from "react"
import supabase from '../../config/supabaseClient'


const Update = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const [activity, setActivity] = useState('')
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [formError, setFormError] = useState('')
    
  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!activity || !minutes){
      setFormError('Please fill in all the fields correctly')
      return 
    }

    const { data, error } = await supabase
      .from('Preferences')
      .update({activity,hours,minutes})
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
      navigate('/preferences')//if we have updated the smoothie then we redirect back home
    }

    
  }
  //there should be code over here to update without refreshing i just haven't put it in yet
  
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
          value={hours}
          onChange={(e) => setHours(e.target.value)}
        />

        <label htmlFor="time-minutes">Minutes:</label>
        <input
          type="number"
          id="time-minutes"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
        />


        <button>Add a New Activity</button>
        {formError && <p className="error">{formError}</p>}  
      </form>
    </div>
  )
}

export default Update