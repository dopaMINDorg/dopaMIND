import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US'
import { useMode } from "../../Context/ModeContext";
import { useState, useEffect } from 'react'
import "react-big-calendar/lib/css/react-big-calendar.css"
import EventPopup from './EventPopup'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import "react-big-calendar/lib/addons/dragAndDrop/styles.css"
import supabase from '../../config/supabaseClient'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})



const DnDCalendar = withDragAndDrop(Calendar)

export default function CalendarApp () {
  const [events, setEvents] = useState([])

  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [draftEvent, setDraftEvent] = useState(null)
  const [isOpenEvent, setIsOpenEvent] = useState(false)

  const { mode /*, toggleMode*/} = useMode();

  const currentTag = mode === "relax" ? "relax" : "focus";

  //only load the initial events from Supabase (anything created in previous sessions)
  useEffect(() => {
  const fetchEvents = async () => {

    const { data, error } = await supabase
      .from("events")
      .select("*")

    if (error) {
      console.error("Fetch error:", error)
      return
    }

    const formattedEvents = data.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      tags: event.tags 
    }))

        console.log("Fetched events:", formattedEvents)

        setEvents(formattedEvents)
      }

      fetchEvents()
    }, [])
  

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    console.log(`The calendar view swapped to: ${newView}`);
  };

  //current date that USER IS VIEWING 
  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  //handleSelect functions prep the eventPopup
  const handleSelectEvent = (event) => {
    console.log(event)
    setDraftEvent({
      id: event.id,
      title: event.title,
      start: new Date(event.start),
      end: new Date(event.end),
      tags: [currentTag]
    })
    setIsOpenEvent(true)
  }
 
  const handleSelectSlot = (slotInfo) => {
    setDraftEvent({
      id: null,
      title: "",
      start: slotInfo.start,
      end: slotInfo.end || new Date(slotInfo.start.getTime() + 60 * 60 * 1000),
      tags: [currentTag]
    })
    setIsOpenEvent(true)
  }

  const handleSave = async (eventData) => {
    if (!eventData.title || eventData.title.trim() === "") {
      alert("Please enter a title before saving.");
      return; // Stops the function from executing any database queries or closing the popup

    }
    if (eventData.id) {
      const existingEvent = events.find(ev => ev.id === eventData.id);
      const updatedTags = eventData.tags || existingEvent?.tags;

      const { error } = await supabase
      .from("events")
      .update({
        title: eventData.title,
        start_time: eventData.start.toISOString(),
        end_time: eventData.end.toISOString(),
        tags: updatedTags
      })
      .eq("id", eventData.id)
      if (error) {
        console.error(error)
        return
      }
      setEvents(prev => prev.map(ev =>
        ev.id === eventData.id ? {...ev, 
          title: eventData.title, 
          start: eventData.start,
          end: eventData.end,
          tags: updatedTags
        }
        : ev)
      )} else {
        const {data: { user }} = await supabase.auth.getUser()
        const { data, error } = await supabase
        .from("events")
        .insert({user_id: user.id,
          title: eventData.title,
          start_time: eventData.start.toISOString(),
          end_time: eventData.end.toISOString(),
          tags: eventData.tags || (typeof currentTag === 'string' ? currentTag : [currentTag])
        })
        .select()
        console.log("data", data)
        console.log("error", error)
        console.log("after insert")
        if (error) {
          console.error(error)
          return
        }
        const insertedEvent = {
          id: data[0].id,
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          tags: data[0].tags
        }
        setEvents(prev => [...prev, insertedEvent])

  }
  setDraftEvent(null)
  setIsOpenEvent(false)
}

  const handleDelete = async (eventId) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)

    if (error) {
      console.error("Delete error:", error)
      return
    }

    setEvents(prev =>
      prev.filter(event => event.id !== eventId)
    )

    setDraftEvent(null)
    setIsOpenEvent(false)
  }

  const handleEventDrop = async ({ event, start, end }) => {
  const { error } = await supabase
    .from("events")
    .update({
      start_time: start.toISOString(),
      end_time: end.toISOString()
    })
    .eq("id", event.id)

  if (error) {
    console.error(error)
    return
  }

  const updatedEvent = {
    ...event,
    start,
    end
  }

  setEvents(prev =>
    prev.map(ev =>
      ev.id === event.id ? updatedEvent : ev
    )
  )
}

  return (
    <>
  <div style={{ marginLeft: "100px", marginRight: "100px", marginTop: "100px"}}>
    <DnDCalendar
      selectable 
      localizer={localizer}
      events={events}
      view={currentView}
      date={currentDate}
      onView={handleViewChange}
      onNavigate={handleNavigate}
      views={['week']} //to ensure there is only the weekly spread 
      defaultView={Views.WEEK} 
      startAccessor="start"
      endAccessor="end"
      onSelectSlot={handleSelectSlot}
      onSelectEvent={handleSelectEvent}
      onEventDrop={handleEventDrop}
      style={{ height: '77vh' }}
      eventPropGetter={(event) => {
    // Handle both array format ["focus"] or pure text format "focus"
    const tag = Array.isArray(event.tags) ? event.tags[0] : event.tags;
    
    if (tag === 'relax') {
      return { className: 'event-relax' };
    }
    if (tag === 'focus') {
      return { className: 'event-focus' };
    }
    
    return {}; // Default styling if no matching tag
  }}
    />
  </div>
  {isOpenEvent && (
   <EventPopup
      isOpen={isOpenEvent}
      onClose={() => {
        setDraftEvent(null)
        setIsOpenEvent(false)
      }}
      onSave={handleSave}
      onDelete={handleDelete}
      draftEvent={draftEvent}
    />
  )}
  </>
  );
}
  