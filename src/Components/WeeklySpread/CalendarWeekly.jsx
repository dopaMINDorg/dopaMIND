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
 
const CalendarApp = () => {
  const eventsService = useState(() => createEventsServicePlugin())[0]
 
  const calendar = useCalendarApp({
    views: [createViewWeek()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: Temporal.PlainDate.from('2026-05-26'),
        end: Temporal.PlainDate.from('2026-05-26'),
      },
    ],
    plugins: [eventsService]
  })
 
  useEffect(() => {
    // get all events
    eventsService.getAll()
  }, [])
 
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  )
}
 
export default CalendarApp