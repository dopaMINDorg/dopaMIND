import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import supabase from "../../../config/supabaseClient";
import Update from "../Update";


const MockUpdate = () => {
    return(
            // Memory router uses a fake starting router like /preferences and no real route changes occur, 
            // BrowserRouter uses the actual windows URL and routes change, so we use MemoryRouter for testing mocked 
            // routes 

            <MemoryRouter>
                <Update />
            </MemoryRouter>
       
    );
}

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

global.alert = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Update Component", () => {

    beforeEach(() => {
  jest.clearAllMocks();

  mockSupabase.auth.getUser.mockResolvedValue({
    data: {
      user: {
        id: "123",
      },
    },
    error: null,
  });
});


describe("input fields", () => {
test("renders input with Activity placeholder", () => {
    render(<MockUpdate />);
    const placeholder = screen.getByPlaceholderText(/Activity:/i);
    expect(placeholder).toBeInTheDocument();
});

test("user can change Activity input", () => {
    render(<MockUpdate />);
    const placeholder = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(placeholder, { target : { value : "swimming"} });
    expect(placeholder).toHaveValue("swimming");
});

test("renders input with Hours placeholder", () => {
    render(<MockUpdate />);
    const placeholder = screen.getByPlaceholderText(/Hours:/i);
    expect(placeholder).toBeInTheDocument();
});

test("user can change Hour input", () => {
    render(<MockUpdate />);
    const placeholder = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(placeholder, { target : { value : 10} });
    expect(placeholder).toHaveValue(10);
});

test("renders input with Minutes placeholder", () => {
    render(<MockUpdate />);
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    expect(placeholder).toBeInTheDocument();
});

test("user can change Minutes input", () => {
    render(<MockUpdate />);
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 37} });
    expect(placeholder).toHaveValue(37);
});

});

test("renders Add activity button", () => {
    render(<MockUpdate />);
    const button = screen.getByRole("button", {name : /Update Activity/i });
    expect(button).toBeInTheDocument();
});

describe("error handling with invalid inputs", () => {

test("shows error when empty fields are submitted", async () => {
    render(<MockUpdate />);
    const button = screen.getByRole("button", {name : /Update Activity/i });
    fireEvent.click(button);
    const errorText = screen.findByText(/Please enter valid Duration/i);
    expect(await errorText).toBeInTheDocument();
});

test("shows error when duration is set to Ohr and 0min", async () => {
    render(<MockUpdate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 0} });
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 0} });
    
    const button = screen.getByRole("button", {name : /Update Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.findByText(/Please enter valid Duration/i);
    expect(await errorText).toBeInTheDocument();
});

test("shows error when minutes are negative", async () => {
    render(<MockUpdate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 0} });
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : -30} });
    
    const button = screen.getByRole("button", {name : /Update Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.findByText(/Please enter valid Duration/i);
    expect(await errorText).toBeInTheDocument();
});

test("shows error when hours are negative", async () => {
    render(<MockUpdate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : -21 }});
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 0} });
    
    const button = screen.getByRole("button", {name : /Update Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.findByText(/Please enter valid Duration/i);
    expect(await errorText).toBeInTheDocument();
});

test("shows error when minutes are greater 59", async () => {
    render(<MockUpdate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 10 }});
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 60} });
    
    const button = screen.getByRole("button", {name : /Update Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.findByText(/Please enter valid Duration/i);
    expect(await errorText).toBeInTheDocument();
});

test("shows error when hours are greater 24", async () => {
    render(<MockUpdate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 25 }});
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 0} });
    
    const button = screen.getByRole("button", {name : /Update Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.findByText(/Please enter valid Duration/i);
    expect(await errorText).toBeInTheDocument();
});

});

test('shows auth error when no user is logged in', async () => {
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: null,
  });

  render(<MockUpdate />);

  fireEvent.change(screen.getByPlaceholderText('Activity:'), {
    target: { value: 'Gym' },
  });

  fireEvent.change(screen.getByPlaceholderText('Hours:'), {
    target: { value: '1' },
  });

  fireEvent.change(screen.getByPlaceholderText('Minutes:'), {
    target: { value: '30' },
  });

  fireEvent.click(
    screen.getByRole('button', { name: /Update activity/i })
  );

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("User not logged in");
  });
  jest.clearAllMocks();
})


test("navigates to preferences on successful update", async () => {
  mockSupabase.from.mockReturnValue({
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: { id: 1 },
              error: null,
            }),
        }),
      }),
    }),
  });

  render(<MockUpdate />);

  fireEvent.change(screen.getByPlaceholderText(/Activity:/i), {
    target: { value: "swimming" },
  });

  fireEvent.change(screen.getByPlaceholderText(/Hours:/i), {
    target: { value: 1 },
  });

  fireEvent.change(screen.getByPlaceholderText(/Minutes:/i), {
    target: { value: 30 },
  });

  fireEvent.click(screen.getByRole("button", { name: /Update Activity/i }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/preferences");
  });
});

test("shows error when supabase update fails", async () => {
  mockSupabase.from.mockReturnValue({
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: new Error("update failed"),
            }),
        }),
      }),
    }),
  });

  render(<MockUpdate />);

  fireEvent.change(screen.getByPlaceholderText(/Activity:/i), {
    target: { value: "swimming" },
  });

  fireEvent.change(screen.getByPlaceholderText(/Hours:/i), {
    target: { value: 1 },
  });

  fireEvent.change(screen.getByPlaceholderText(/Minutes:/i), {
    target: { value: 30 },
  });

  fireEvent.click(screen.getByRole("button", { name: /Update Activity/i }));

  expect(
    await screen.findByText(/Please fill in all the fields correctly/i)
  ).toBeInTheDocument();
});


});