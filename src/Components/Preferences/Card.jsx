import { Link } from "react-router-dom"
import supabase from '../../config/supabaseClient'
    const PreferenceCard = ({ pref, onDelete }) => {
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
    <div className="smoothie-card">
      <h3>{pref.activity}</h3>

      <p style={{ color: "red", fontSize: "20px" }}>
        {pref.time_hours} hrs {pref.time_minutes} mins
      </p>

      <div className="buttons">
        <Link to={"/" + pref.id}>
          <i className="material-icons">edit</i>
        </Link>

        <i
          className="material-icons"
          onClick={handleDelete}
        >
          delete
        </i>
      </div>
    </div>
  )
    
}
export default PreferenceCard