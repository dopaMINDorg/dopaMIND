
jest.mock("react-big-calendar/lib/addons/dragAndDrop", () => ({
  __esModule: true,
  default: Calendar => Calendar,
}))
jest.mock("date-fns/format", () => () => "mock")
jest.mock("date-fns/parse", () => () => new Date())
jest.mock("date-fns/startOfWeek", () => () => new Date())
jest.mock("date-fns/getDay", () => () => 1)
jest.mock("date-fns/locale/en-US", () => ({
  default: {}
}))
jest.mock("../../../config/supabaseClient", () => ({
  __esModule: true,
  default: {
    from: jest.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
    })),
  },
}))
jest.mock("../../../Context/ModeContext", () => ({
  __esModule: true,
  useMode: () => ({
    mode: "focus",
    toggleMode: jest.fn(),
  }),
}))
import supabase from "../../../config/supabaseClient"
import { render, screen, waitFor, act } from "@testing-library/react"
import CalendarApp from "../CalendarWeekly"


let calendarProps

jest.mock("react-big-calendar", () => {
  const React = require("react")

  return {
    Calendar: props => {
      calendarProps = props

      return (
        <div data-testid="calendar">
          {props.events?.map(event => (
            <div key={event.id}>{event.title}</div>
          ))}
        </div>
      )
    },
    Views: { WEEK: "week" },
    dateFnsLocalizer: jest.fn(() => ({}))
  }
})

it("loads events from Supabase on mount", async () => {
  supabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Test Event",
          start_time: "2026-06-17T10:00:00.000Z",
          end_time: "2026-06-17T11:00:00.000Z",
          tags: ["focus"]
        }
      ],
      error: null
    })
  })

  render(<CalendarApp />)

  expect(await screen.findByText("Test Event"))
    .toBeInTheDocument()
})

let popupProps

jest.mock("../EventPopup", () => props => {
  popupProps = props
  return <div data-testid="popup" />
})

it("creates a new event", async () => {
  const insertSelect = jest.fn().mockResolvedValue({
    data: [{
      id: 99,
      tags: ["focus"]
    }],
    error: null
  })

  const insert = jest.fn(() => ({
    select: insertSelect
  }))

  supabase.auth = {
    getUser: jest.fn().mockResolvedValue({
      data: {
        user: { id: "user123" }
      }
    })
  }

  supabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: [],
      error: null
    }),
    insert
  })

  render(<CalendarApp />)

  await act(async () => {
  calendarProps.onSelectSlot({
    start: new Date(),
    end: new Date(),
  })
})

  await act(async () => {
    await popupProps.onSave({
      title: "New Event",
      start: new Date(),
      end: new Date(),
      tags: ["focus"]
    })
  })

  expect(insert).toHaveBeenCalled()
})
it("updates an existing event", async () => {
  const eq = jest.fn().mockResolvedValue({
    error: null
  })

  const update = jest.fn(() => ({
    eq
  }))

  supabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: [{
        id: 1,
        title: "Old Event",
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        tags: ["focus"]
      }],
      error: null
    }),
    update
  })

  render(<CalendarApp />)

  await waitFor(() =>
    expect(screen.getByText("Old Event"))
      .toBeInTheDocument()
  )
await act(async () => {
  calendarProps.onSelectSlot({
    start: new Date(),
    end: new Date(),
  })
})
  await act(async () => {
    await popupProps.onSave({
      id: 1,
      title: "Updated Event",
      start: new Date(),
      end: new Date(),
      tags: ["focus"]
    })
  })

  expect(update).toHaveBeenCalled()
  expect(eq).toHaveBeenCalledWith("id", 1)
})
it("deletes an event", async () => {
  const eq = jest.fn().mockResolvedValue({
    error: null
  })

  const deleteFn = jest.fn(() => ({
    eq
  }))

  supabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: [],
      error: null
    }),
    delete: deleteFn
  })

  render(<CalendarApp />)

  await act(async () => {
  calendarProps.onSelectEvent({
    id: 5,
    title: "X",
    start: new Date(),
    end: new Date(),
  })
})

await act(async () => {
  popupProps.onDelete(5)
})
  expect(deleteFn).toHaveBeenCalled()
  expect(eq).toHaveBeenCalledWith("id", 5)
})

it("updates event time when dragged", async () => {
  const eq = jest.fn().mockResolvedValue({
    error: null
  })

  const update = jest.fn(() => ({
    eq
  }))

  supabase.from.mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: [],
      error: null
    }),
    update
  })

  render(<CalendarApp />)

  await act(async () => {
    await calendarProps.onEventDrop({
      event: { id: 1 },
      start: new Date(),
      end: new Date()
    })
  })

  expect(update).toHaveBeenCalled()
  expect(eq).toHaveBeenCalledWith("id", 1)
})

