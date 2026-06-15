// // import { render, screen, fireEvent } from '@testing-library/react';
// // import Preferences from '../preferences';
// // import Home from '../../Home/Home';
 import { MemoryRouter, BrowserRouter, Routes, Route} from 'react-router-dom';
// // import Create from '../Create';

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



// // test('renders Set Your Preferences (Header)', () => {
// //   render(<MockPreferences />);
// //   const divElement = screen.getByText(/Set Your Preferences/i);
// //   expect(divElement).toBeInTheDocument();
// // });

// // describe('Home Button', () => {
// //     test('renders Home Button', () => {
// //     render(<MockPreferences />);
// //     const buttonElement = screen.getByTitle(/Home/i);
// //     expect(buttonElement).toBeInTheDocument();
// //     });

// //     test('Home buttom leads to Home page(mocked)', async () =>  {
// //     render(
// //         <MemoryRouter initialEntries={['/preferences']}>
// //             <Routes>
// //                 <Route path="/preferences" element={<Preferences />}/>
// //                 <Route path="/home" element={<Home />} />
// //             </Routes>
// //         </MemoryRouter> 
// //     );
// //     expect(screen.getByText(/Set Your Preferences/i)).toBeInTheDocument();
// //     const buttonElement = screen.getByTitle(/Home/i);
// //     fireEvent.click(buttonElement);
// //     expect(await screen.findByText(/Welcome Home/i)).toBeInTheDocument();
// //     });
// // });


// // describe('Create Button', () => {
// //     test('renders Create Button', () => {
// //     render(<MockPreferences />);
// //     const buttonElement = screen.getByRole("button", { name : /CREATE/i });
// //     expect(buttonElement).toBeInTheDocument();
// //     });
// //     test('Create buttom leads to Create page(mocked)', async () =>  {
// //     render(
// //         <MemoryRouter initialEntries={['/preferences']}>
// //             <Routes>
// //                 <Route path="/preferences" element={<Preferences />}/>
// //                 <Route path="/create" element={<Create />} />
// //             </Routes>
// //         </MemoryRouter> 
// //     );
// //     expect(screen.getByText(/Set Your Preferences/i)).toBeInTheDocument();
// //     const buttonElement = screen.getByRole("button", { name : /CREATE/i });
// //     fireEvent.click(buttonElement);
// //     expect(await screen.findByText(/Create Preferences/i)).toBeInTheDocument();
// //     });
// // });

// // describe('Set Time Preference', () => {
// //     test('renders Set Time Pref Button', () => {
// //     render(<MockPreferences />);
// //     const buttonElement = screen.getByRole("button", { name : /Set your time pref/i });
// //     expect(buttonElement).toBeInTheDocument();
// //     });
// //     // for the test below we dont interact with the browsers native time picker, so js set time
// //     //directly
// //     test('input for Set Time Preference changes based on user pref', () => {
// //     render(<MockPreferences />);
// //     const inputElement = screen.getByTestId("notification-time-input");
// //     fireEvent.change(inputElement, { target: { value: '15:30' } });
// //     expect(inputElement.value).toBe('15:30');
// //     });
// //     // i havent done the test with mocked up supabase
// // });

// import { render, screen, waitFor, fireEvent } from "@testing-library/react";
// import Preferences from "./../preferences";
// import supabase from "../../../config/supabaseClient";
// global.alert = jest.fn();
// // Mock supabase module
// jest.mock("../../../config/supabaseClient", () => ({
//   __esModule: true,
//   default: {
//     auth: {
//       getUser: jest.fn(),
//     },
//     from: jest.fn(),
//   },
// }));
// const mockSupabase = supabase;
// describe("Preferences component", () => {
//   //const mockSupabase = supabase;

//   beforeEach(() => {
//     jest.clearAllMocks();
//     mockSupabase.from.mockReset();
// mockSupabase.auth.getUser.mockReset();

//     // -------------------------
//     // AUTH MOCK
//     // -------------------------
//     mockSupabase.auth.getUser.mockResolvedValue({
//       data: { user: { id: "123" } },
//       error: null,
//     });

//     // -------------------------
//     // TABLE MOCKS
//     // -------------------------
//     mockSupabase.from.mockImplementation((table) => {
//       // Preferences table
//       if (table === "Preferences") {
//         return {
//           select: jest.fn().mockResolvedValue({
//             data: [
//               { id: 1, name: "Preference 1" },
//               { id: 2, name: "Preference 2" },
//             ],
//             error: null,
//           }),
//         };
//       }

//       // Notification Time table (SELECT)
//       if (table === "Notification Time") {
//         return {
//           select: jest.fn(() => ({
//             eq: jest.fn(() => ({
//               single: jest.fn().mockResolvedValue({
//                 data: {
//                   notif_time: "2026-01-01T10:00:00Z",
//                 },
//                 error: null,
//               }),
//             })),
//           })),

//           // Notification Time table (UPDATE)
//           update: jest.fn(() => ({
//             eq: jest.fn(() => ({
//               select: jest.fn().mockResolvedValue({
//                 data: [{ notif_time: "2026-01-01T12:00:00Z" }],
//                 error: null,
//               }),
//             })),
//           })),
//         };
//       }

//       return {};
//     });
//   });

//   // -------------------------
//   // TEST 1: RENDER PAGE
//   // -------------------------
//   test("renders preferences and notification time", async () => {
//     render(<MockPreferences />);

//     await waitFor(() => {
//       expect(screen.getByText("Set Your Preferences")).toBeInTheDocument();
//     });

//     await waitFor(() => {
//       expect(
//         screen.getByText(/Current notification time/i)
//       ).toBeInTheDocument();
//     });
//   });

//   // -------------------------
//   // TEST 2: LOAD PREFERENCES
//   // -------------------------
//   test("loads and displays preferences", async () => {
//     render(<MockPreferences />);

//     await waitFor(() => {
//       expect(screen.getAllByText("delete").length).toBe(2);
//     });
//   });

//   // -------------------------
//   // TEST 3: UPDATE NOTIFICATION TIME
//   // -------------------------
//   test("updates notification time", async () => {
//     render(<MockPreferences />);
//     //global.alert = jest.fn();

//     const input = screen.getByTestId("notification-time-input");
//     const button = screen.getByText(/Set your time pref/i);

//     fireEvent.change(input, { target: { value: "12:00" } });
//     fireEvent.click(button);

//     await waitFor(() => {
//      expect(global.alert).toHaveBeenCalledWith(
//   expect.stringContaining("Notification time updated")
// );
//   });
// });

//   // -------------------------
//   // TEST 4: NAVIGATION BUTTON EXISTS
//   // -------------------------
//   test("renders home and create buttons", async () => {
//     render(<MockPreferences />);

//     expect(screen.getByTitle("Home")).toBeInTheDocument();
//     expect(screen.getByText("CREATE")).toBeInTheDocument();
//   });
// });

// test("shows error when notification time is empty", async () => {
//   render(<MockPreferences />);

//   const input = screen.getByTestId("notification-time-input");
//   const button = screen.getByText(/Set your time pref/i);

//   fireEvent.change(input, { target: { value: "" } });
//   fireEvent.click(button);

//   expect(
//     await screen.findByText(/Please fill in all the fields correctly/i)
//   ).toBeInTheDocument();
// });

// test("shows alert when user is not logged in", async () => {
//   mockSupabase.auth.getUser.mockResolvedValue({
//     data: { user: null },
//     error: new Error("no user"),
//   });

//   render(<MockPreferences />);

//   const input = screen.getByTestId("notification-time-input");
//   const button = screen.getByText(/Set your time pref/i);

//   fireEvent.change(input, { target: { value: "12:00" } });
//   fireEvent.click(button);

//   await waitFor(() => {
//     expect(global.alert).toHaveBeenCalledWith("User not logged in");
//   });
// });

// test("shows error when notification time update fails", async () => {
//   mockSupabase.from.mockImplementation((table) => {
//     if (table === "Notification Time") {
//       return {
//         update: jest.fn(() => ({
//           eq: jest.fn(() => ({
//             select: jest.fn().mockResolvedValue({
//               data: null,
//               error: new Error("update failed"),
//             }),
//           })),
//         })),
//       };
//     }
//   });

//   render(<MockPreferences />);

//   const input = screen.getByTestId("notification-time-input");
//   const button = screen.getByText(/Set your time pref/i);

//   fireEvent.change(input, { target: { value: "12:00" } });
//   fireEvent.click(button);

//   await waitFor(() => {
//     expect(global.alert).toHaveBeenCalledWith("unable to update time");
//   });
// });

// // test("shows error when preferences fail to load", async () => {
// //   mockSupabase.from.mockImplementation((table) => {
// //     if (table === "Preferences") {
// //       return {
// //         select: jest.fn().mockResolvedValue({
// //           data: null,
// //           error: new Error("fetch failed"),
// //         }),
// //       };
// //     }
// //   });

// //   render(<MockPreferences />);

// //   expect(
// //     await screen.findByText(/Could not fetch the preferences/i)
// //   ).toBeInTheDocument();
// // });

// test("shows error when preferences fail to load", async () => {
//   mockSupabase.auth.getUser.mockResolvedValue({
//     data: { user: { id: "123" } },
//     error: null,
//   });

//   mockSupabase.from.mockImplementation((table) => {
//     if (table === "Preferences") {
//       return {
//         select: jest.fn().mockResolvedValue({
//           data: null,
//           error: new Error("fetch failed"),
//         }),
//       };
//     }

//     return {};
//   });

//   render(<MockPreferences />);

//   expect(
//     await screen.findByText(/Could not fetch the preferences/i)
//   ).toBeInTheDocument();
// });


import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Preferences from "./../preferences";
import supabase from "../../../config/supabaseClient";

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

describe("Preferences component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // -------------------------
    // DEFAULT AUTH MOCK
    // -------------------------
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "123" } },
      error: null,
    });

    // -------------------------
    // DEFAULT SUPABASE MOCK
    // -------------------------
    mockSupabase.from.mockImplementation((table) => {
      // -------------------------
      // Preferences table
      // -------------------------
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

      // -------------------------
      // Notification Time table
      // -------------------------
      if (table === "Notification Time") {
        return {
          // GET
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

          // UPDATE
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn().mockResolvedValue({
                data: [{ notif_time: "2026-01-01T12:00:00Z" }],
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

  // -------------------------
  // TEST 1
  // -------------------------
  test("renders preferences and notification time", async () => {
    render(<MockPreferences />);

    await waitFor(() => {
      expect(screen.getByText("Set Your Preferences")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Current notification time/i)
      ).toBeInTheDocument();
    });
  });

  // -------------------------
  // TEST 2
  // -------------------------
  test("loads and displays preferences", async () => {
    render(<MockPreferences />);

    await waitFor(() => {
      expect(screen.getAllByText("delete").length).toBe(2);
    });
  });

  // -------------------------
  // TEST 3
  // -------------------------
  test("updates notification time", async () => {
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

  // -------------------------
  // TEST 4
  // -------------------------
  test("renders home and create buttons", async () => {
    render(<MockPreferences />);

    expect(screen.getByTitle("Home")).toBeInTheDocument();
    expect(screen.getByText("CREATE")).toBeInTheDocument();
  });

  // -------------------------
  // TEST 5
  // -------------------------
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

  // -------------------------
  // TEST 6
  // -------------------------
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

  // -------------------------
  // TEST 7
  // -------------------------
  test("shows error when notification time update fails", async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === "Notification Time") {
        return {
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

    const input = screen.getByTestId("notification-time-input");
    const button = screen.getByText(/Set your time pref/i);

    fireEvent.change(input, { target: { value: "12:00" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("unable to update time");
    });
  });

  // -------------------------
  // TEST 8
  // -------------------------
  test("shows error when preferences fail to load", async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === "Preferences") {
        return {
          select: jest.fn().mockResolvedValue({
            data: null,
            error: new Error("fetch failed"),
          }),
        };

         return {
                select: jest.fn().mockResolvedValue({ data: null, error: null }),
                update: jest.fn(),
            };
      }
    });

    render(<MockPreferences />);

    expect(
      await screen.findByText(/Could not fetch the preferences/i)
    ).toBeInTheDocument();
  });
});