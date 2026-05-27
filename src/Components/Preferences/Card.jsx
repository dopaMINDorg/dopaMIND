import { useNavigate } from "react-router-dom"
import supabase from '../../config/supabaseClient'
import "./Card.css"
    const PreferenceCard = ({ pref, onDelete }) => {
      const navigate = useNavigate();
        const handleDelete = async () => { const {data, error} = await supabase
            .from('Preferences')
            .delete()
            .eq('id', pref.id)

        if (error) {
            console.log(error)
        }

        if (data) {
            console.log(data)
            onDelete(pref.id)
        }
     }
        
    return (
    <div className="activity-card">
      <div className="activity">{pref.activity}</div>

      <div className="time">
        {pref.time_hours} hrs {pref.time_minutes} mins
      </div>

      <div className="buttons">
        <button 
          onClick= {() => navigate("/" + pref.id)}
          className="material-icons"
        >
          edit
        </button>

        <button
          className="material-icons"
          onClick={handleDelete}
        >
          delete
        </button>
      </div>
    </div>
  )
    
}
export default PreferenceCard