import React, { useState, useEffect } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewWeekAgenda,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { Temporal } from 'temporal-polyfill'
import supabase from '../../config/supabaseClient'


 
const CalendarApp = () => {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const [fetchError, setFetchError] = useState("")
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('Tasks')
      .select()

    if (error) {
      setFetchError('Could not fetch Tasks')
      setTasks(null)
      console.log(error)
    }

    if (data) {
      console.log(data)
      setTasks(data)
      setFetchError(null)
    }
  }
  
  
  const eventsArr = tasks.map((task) => {
  // Helper to extract the offset (e.g., "+08:00") from the timestamptz string
  const getOffset = (str) => str?.match(/[+-]\d{2}:\d{2}$|Z$/)?.[0] || "UTC";

  const startOffset = getOffset(task.start_time);
  const endOffset = getOffset(task.end_time);

  return {
    id: String(task.id),
    title: task.task_name,
    // Convert start time using its own offset
    start: Temporal.Instant.from(task.start_time).toZonedDateTimeISO(startOffset),
    // Convert end time using its own offset
    end: Temporal.Instant.from(task.end_time).toZonedDateTimeISO(endOffset),
  };
});
  
  const calendar = useCalendarApp({
    views: [createViewWeek()],
    events: eventsArr,
    plugins: [eventsService]
  })

  useEffect(() => {
  fetchTasks()
}, [])

useEffect(() => {
  if (tasks.length > 0) {
    eventsService.set(eventsArr)
  }
}, [tasks])
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
     
  )
}
 
export default CalendarApp 