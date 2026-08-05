import { useState, useEffect, useCallback } from "react"
import { useMode } from "../../Context/ModeContext"
import supabase from "../../config/supabaseClient"
import "./EventPopup.css"
//
export default function EventPopup({
  isOpen,
  onClose,
  onSave,
  onDelete,
  draftEvent
}) {
  const [form, setForm] = useState({
    id: null,
    title: "",
    start: new Date(),
    end: new Date()
  })

  const { mode } = useMode();
  const [fetchError, setFetchError] = useState(null)
  const [prefs, setPrefs] = useState(null)

  const dynamicTerm = mode === "relax" ? "Preference" : "Event";

  const slotDurationInMinutes = draftEvent
    ? Math.floor((new Date(draftEvent.end) - new Date(draftEvent.start)) / 60000)
    : 0;

  const fetchPreferences = useCallback(async () => {
    const { data, error } = await supabase
      .from('Preferences')
      .select()

    if (error) {
      setFetchError('Could not fetch the preferences')
      setPrefs(null)
      console.log(error)
      return
    }

    if (data) {
      setPrefs(data)
      setFetchError(null)

      const eligible = data.filter(pref => {
        const totalPrefMinutes = ((pref.time_hours || 0) * 60) + pref.time_minutes;
        return totalPrefMinutes <= slotDurationInMinutes;
      });

      if (!draftEvent?.id && !form.id && eligible.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligible.length);
        const randomPreference = eligible[randomIndex];
        
        setForm(prev => ({
          ...prev,
          title: randomPreference.activity
        }));
      }
    }
  }, [slotDurationInMinutes, draftEvent?.id, form.id]);

  
  useEffect(() => {
    if (mode === "relax" && isOpen) {
      fetchPreferences()
    }
  }, [mode, isOpen, fetchPreferences]) 

  useEffect(() => {
  if (isOpen && draftEvent) {
    setForm({
      id: draftEvent.id || null,
      title: draftEvent.title || "",
      start: new Date(draftEvent.start),
      end: new Date(draftEvent.end),
    });
  }
}, [isOpen, draftEvent]);


  if (!isOpen) return null

  const handleChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const availablePrefs = prefs?.filter(pref => {
    const totalPrefMinutes = ((pref.time_hours || 0) * 60) + pref.time_minutes;
    return totalPrefMinutes <= slotDurationInMinutes;
  }) || [];

  const handleSubmit = () => {
    onSave({
      ...form,
      start: new Date(form.start),
      end: new Date(form.end)
    })
  }

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h3>{form.id ? `Edit ${dynamicTerm}` : `Add ${dynamicTerm}`}</h3>
        {mode === "relax" && (
          <div className="preference-selector" >
            <label >
              Relax Preference ({Math.floor(slotDurationInMinutes / 60)}h {slotDurationInMinutes % 60}m block):
            </label>
            {fetchError && <p className="error">{fetchError}</p>}
            
            <select 
              onChange={(e) => handleChange("title", e.target.value)}
              value={form.title}
              
            >
              <option value="">-- Choose an eligible preference --</option>
              {availablePrefs.map(pref => (
                <option key={pref.id} value={pref.activity}>
                  {pref.activity} ({pref.time_hours ? `${pref.time_hours}h ` : ""}{pref.time_minutes}m)
                </option>
              ))}
            </select>
          </div>
        )}
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder={`${dynamicTerm} title`}
          
        />
        <input
          type="datetime-local"
          value={formatDateTimeLocal(form.start)}
          onChange={(e) => handleChange("start", new Date(e.target.value))}
        />

        <input
          type="datetime-local"
          value={formatDateTimeLocal(form.end)}
          onChange={(e) => handleChange("end", new Date(e.target.value))}
        />

        <button onClick={handleSubmit}>
          {form.id ? "Update" : "Create"}
        </button>
        
        {form.id && (
          <button
            onClick={() => {
              if (window.confirm(`Delete this ${dynamicTerm.toLowerCase()}?`)) {
                onDelete(form.id)
              }
            }}
          >
            Delete
          </button>
        )}

        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

// helper
function formatDateTimeLocal(date) {
  if (!date) return ""
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, "0")

  return (
    d.getFullYear() + "-" +
    pad(d.getMonth() + 1) + "-" +
    pad(d.getDate()) + "T" +
    pad(d.getHours()) + ":" +
    pad(d.getMinutes())
  )
}