//import Home from '../../Home/Home';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Preferences from "./../preferences";
import supabase from "../../../config/supabaseClient";

const MockPreferences = () => {
    return(
            // Memory router uses a fake starting router like /preferences and no real route changes occur, 
            // BrowserRouter uses the actual windows URL and routes change, so we use MemoryRouter for testing mocked 
            // routes 

            <MemoryRouter initialEntries={['/preferences']}>
                <Preferences />
            </MemoryRouter>
       
    );
}

global.alert = jest.fn();


// Mock supabase module
jest.mock("../../../config/supabaseClient", () => ({
  __esModule: true,
  default: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

const mockSupabase = supabase;
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Preferences component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

   
    mockSupabase.from.mockImplementation((table) => {
      
      if (table === "Preferences") {
        return {
          select: jest.fn().mockResolvedValue({
            data: [
              { id: 1, name: "Preference 1" },
              { id: 2, name: "Preference 2" },
            ],
            error: null,
          }),
        };
      }

       
      if (table === "Notification Time") {
        return {
          // GET
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: {
                  notif_time: "2026-01-01T10:00:00",
                },
                error: null,
              }),
            })),
          })),

          
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn().mockResolvedValue({
                data: [{ notif_time: "2026-01-01T12:00:00" }],
                error: null,
              }),
            })),
          })),
        };
      }

      return {
        select: jest.fn().mockResolvedValue({ data: null, error: null }),
        update: jest.fn(),
      };
    });
  });

  
    test("shows alert when user is not logged in", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error("no user"),
    });

    render(<MockPreferences />);

    const input = screen.getByTestId("notification-time-input");
    const button = screen.getByText(/Set your time pref/i);

    fireEvent.change(input, { target: { value: "12:00" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("User not logged in");
    });
  });

    test('renders Set Your Preferences (Header)', () => {
    render(<MockPreferences />);
    const divElement = screen.getByText(/Set Your Preferences/i);
    expect(divElement).toBeInTheDocument();
    });

    test("loads and displays preferences", async () => {
        render(<MockPreferences />);

        await waitFor(() => {
        expect(screen.getAllByText("delete").length).toBe(2);
        });
    });

    
    test("shows error when preferences fail to load", async () => {
    mockSupabase.from.mockImplementation((table) => {
        if (table === "Preferences") {
        return {
            select: jest.fn().mockResolvedValue({
            data: null,
            error: new Error("fetch failed"),
            }),
        };
        }

        if (table === "Notification Time") {
        return {
            select: jest.fn(() => ({
            eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                data: null,
                error: null,
                }),
            })),
            })),
        };
        }
    });

    render(<MockPreferences />);

    expect(
        await screen.findByText(/Could not fetch the preferences/i)
    ).toBeInTheDocument();
    });

  




describe('Home Button', () => {
    test('renders Home Button', () => {
    render(<MockPreferences />);
    const buttonElement = screen.getByTitle(/Home/i);
    expect(buttonElement).toBeInTheDocument();
    });

  test("navigates to home", async () => {
  render(<MockPreferences/>);
  const button = await screen.findByTitle("Home");
  fireEvent.click(button);
  expect(mockNavigate).toHaveBeenCalledWith("/home");
});
});


describe('Create Button', () => {
    test('renders Create Button', () => {
    render(<MockPreferences />);
    const buttonElement = screen.getByRole("button", { name : /CREATE/i });
    expect(buttonElement).toBeInTheDocument();
    });
    test('Create buttom leads to Create page(mocked)', async () =>  {
      render(<MockPreferences/>);
 const button = screen.getByRole("button", { name : /CREATE/i });
  fireEvent.click(button);
  expect(mockNavigate).toHaveBeenCalledWith("/create");
});
   
});

describe('Set Time Preference', () => {
    test('renders Set Time Pref Button', () => {
    render(<MockPreferences />);
    const buttonElement = screen.getByRole("button", { name : /Set your time pref/i });
    expect(buttonElement).toBeInTheDocument();
    });
    // for the test below we dont interact with the browsers native time picker, so js set time
    //directly
    test('input for Set Time Preference changes based on user pref', () => {
    render(<MockPreferences />);
    const inputElement = screen.getByTestId("notification-time-input");
    fireEvent.change(inputElement, { target: { value: '15:30' } });
    expect(inputElement.value).toBe('15:30');
    });
    

    test("updates notification time with the alert", async () => {
        render(<MockPreferences />);

        const input = screen.getByTestId("notification-time-input");
        const button = screen.getByText(/Set your time pref/i);

        fireEvent.change(input, { target: { value: "12:00" } });
        fireEvent.click(button);

        await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith(
            expect.stringContaining("Notification time updated")
        );
        });
    });

    //by right this test below is not possible for the users to encounter
    test("shows error when notification time is empty", async () => {
        render(<MockPreferences />);

        const input = screen.getByTestId("notification-time-input");
        const button = screen.getByText(/Set your time pref/i);

        fireEvent.change(input, { target: { value: "" } });
        fireEvent.click(button);

        expect(
        await screen.findByText(/Please fill in all the fields correctly/i)
        ).toBeInTheDocument();
    });

    test("shows error when notification time update fails", async () => {
    mockSupabase.from.mockImplementation((table) => {
        if (table === "Preferences") {
        return {
            select: jest.fn().mockResolvedValue({
            data: [],
            error: null,
            }),
        };
        }

        if (table === "Notification Time") {
        return {
            // fetchNotifTime()
            select: jest.fn(() => ({
            eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                data: {
                    notif_time: "2026-01-01T10:00:00Z",
                },
                error: null,
                }),
            })),
            })),

            // handleNotifTime()
            update: jest.fn(() => ({
            eq: jest.fn(() => ({
                select: jest.fn().mockResolvedValue({
                data: null,
                error: new Error("update failed"),
                }),
            })),
            })),
        };
        }
    });

    render(<MockPreferences />);

    await userEvent.clear(
    screen.getByTestId("notification-time-input")
    );

    await userEvent.type(
    screen.getByTestId("notification-time-input"),
    "12:00"
    );

    await userEvent.click(
    screen.getByRole("button", {
        name: /set your time pref/i,
    })
    );

    await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith(
        "unable to update time"
    );
    });
});

test("renders Current Notification Time", async () => {
render(<MockPreferences />);
//waits for load
const text = await screen.findByText(/Current notification time/i);
expect(text).toBeInTheDocument();
});

test("Current notification time(text) shows updated notif time", async () => {
  render(<MockPreferences />);
  const input = screen.getByTestId("notification-time-input");
  await userEvent.clear(input);
  await userEvent.type(input, "18:45");
  const button = screen.getByRole("button", {
    name: /Set your time pref/i,
  });
  await userEvent.click(button);
  expect(
    await screen.findByText(/current notification time/i)
  ).toHaveTextContent("6:45 PM");
});

})
});

