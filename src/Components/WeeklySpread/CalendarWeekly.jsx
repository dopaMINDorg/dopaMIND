import React, { useState, useEffect } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { Temporal } from 'temporal-polyfill'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import supabase from '../../config/supabaseClient'

const toZDT = (isoString, timeZone) => {
  const fixed = isoString
    .replace(' ', 'T')
    .replace(/\+00$/, '+00:00')  // only replace if +00 is at the end
  return Temporal.Instant.from(fixed)
    .toZonedDateTimeISO(timeZone)
}

  const CalendarApp = () => {
  const [eventsService] = useState(() => createEventsServicePlugin())
  const [fetchError, setFetchError] = useState(null)
  const [tasks, setTasks] = useState([])

  const calendar = useCalendarApp({
    views: [createViewWeek()],
    events: [],
    plugins: [eventsService],
    locale: 'en-SG',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase.from('Tasks').select()
      if (error) {
        setFetchError('Could not fetch tasks')
        console.error(error)
        return
      }
      setTasks(data)
      setFetchError(null)
    }
    fetchTasks()
  }, [])

  useEffect(() => {
    if (!tasks.length) return

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const formatted = tasks.map((task) => ({
      id: String(task.id),
      title: task.task_name,
      start: toZDT(task.start_time, timeZone),
      end: toZDT(task.end_time, timeZone),
    }))

    eventsService.set(formatted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks])

  return (
    <div>
      {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
  }

export default CalendarApp