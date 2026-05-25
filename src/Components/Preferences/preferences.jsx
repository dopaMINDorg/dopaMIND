import supabase from '../../config/supabaseClient'
import { useEffect, useState } from "react"
import PreferenceCard from "./Card"
import { Link } from 'react-router-dom'

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [prefs, setPrefs] = useState(null)

  /*const checkUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  console.log(data)
  console.log(error)
  }
  checkUser()*/



  const handleDelete = async (id) => {
    setPrefs(prevPrefs => {
      return prevPrefs.filter(pr => pr.id !== id)
    })
  }

  
  const fetchPreferences = async () => {
    const { data, error } = await supabase
      .from('Preferences')
      .select()

    if (error) {
      setFetchError('Could not fetch the preferences')
      setPrefs(null)
      console.log(error)
    }

    if (data) {
      console.log(data)
      setPrefs(data)
      setFetchError(null)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [])


  

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      <Link to={"/Create"}>
          <i className="material-icons">CREATE</i>
      </Link>

      {prefs && (
        <div className="Preferences">
          <div className="Preferences-grid">
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
    </div>
  )
}

export default Home