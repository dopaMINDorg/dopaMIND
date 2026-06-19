import { MemoryRouter, BrowserRouter, Routes, Route} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import Create from "../Create";
import Preferences from "../preferences";

const MockCreate = () => {
    return(
            // Memory router uses a fake starting router like /preferences and no real route changes occur, 
            // BrowserRouter uses the actual windows URL and routes change, so we use MemoryRouter for testing mocked 
            // routes 

            <MemoryRouter initialEntries={['/create']}>
                <Create />
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

import supabase from "../../../config/supabaseClient";
const mockSupabase = supabase;

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Create Component", () => {

describe("input fields", () => {
test("renders input with Activity placeholder", () => {
    render(<MockCreate />);
    const placeholder = screen.getByPlaceholderText(/Activity:/i);
    expect(placeholder).toBeInTheDocument();
});

test("user can change Activity input", () => {
    render(<MockCreate />);
    const placeholder = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(placeholder, { target : { value : "swimming"} });
    expect(placeholder).toHaveValue("swimming");
});

test("renders input with Hours placeholder", () => {
    render(<MockCreate />);
    const placeholder = screen.getByPlaceholderText(/Hours:/i);
    expect(placeholder).toBeInTheDocument();
});

test("user can change Hour input", () => {
    render(<MockCreate />);
    const placeholder = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(placeholder, { target : { value : 10} });
    expect(placeholder).toHaveValue(10);
});

test("renders input with Minutes placeholder", () => {
    render(<MockCreate />);
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    expect(placeholder).toBeInTheDocument();
});

test("user can change Minutes input", () => {
    render(<MockCreate />);
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 37} });
    expect(placeholder).toHaveValue(37);
});

});

test("renders Add activity button", () => {
    render(<MockCreate />);
    const button = screen.getByRole("button", {name : /Add Activity/i });
    expect(button).toBeInTheDocument();
});

describe("error handling with invalid inputs", () => {

test("shows error when empty fields are submitted", () => {
    render(<MockCreate />);
    const button = screen.getByRole("button", {name : /Add Activity/i });
    fireEvent.click(button);
    const errorText = screen.getByText(/Please fill in all the fields correctly/i);
    expect(errorText).toBeInTheDocument();
});

test("shows error when duration is set to Ohr and 0min", () => {
    render(<MockCreate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 0} });
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 0} });
    
    const button = screen.getByRole("button", {name : /Add Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.getByText(/Please enter valid Duration/i);
    expect(errorText).toBeInTheDocument();
});

test("shows error when minutes are negative", () => {
    render(<MockCreate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 0} });
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : -30} });
    
    const button = screen.getByRole("button", {name : /Add Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.getByText(/Please enter valid Duration/i);
    expect(errorText).toBeInTheDocument();
});

test("shows error when hours are negative", () => {
    render(<MockCreate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : -21 }});
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 0} });
    
    const button = screen.getByRole("button", {name : /Add Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.getByText(/Please enter valid Duration/i);
    expect(errorText).toBeInTheDocument();
});

test("shows error when minutes are greater 59", () => {
    render(<MockCreate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 10 }});
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 60} });
    
    const button = screen.getByRole("button", {name : /Add Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.getByText(/Please enter valid Duration/i);
    expect(errorText).toBeInTheDocument();
});

test("shows error when hours are greater 24", () => {
    render(<MockCreate />);
    const activity = screen.getByPlaceholderText(/Activity:/i);
    fireEvent.change(activity, { target : { value : "swimming"} });
    const hours = screen.getByPlaceholderText(/Hours:/i);
    fireEvent.change(hours, { target : { value : 25 }});
    const placeholder = screen.getByPlaceholderText(/Minutes:/i);
    fireEvent.change(placeholder, { target : { value : 0} });
    
    const button = screen.getByRole("button", {name : /Add Activity/i });
    fireEvent.click(button);
    
    const errorText = screen.getByText(/Please enter valid Duration/i);
    expect(errorText).toBeInTheDocument();
});

});

test('shows auth error when no user is logged in', async () => {
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: null },
    error: null,
  });

  render(<MockCreate />);

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
    screen.getByRole('button', { name: /add activity/i })
  );

  await waitFor(() => {
    expect(
      screen.getByText('You must be logged in to save preferences.')
    ).toBeInTheDocument()
  });
  jest.clearAllMocks();
})

test('creates preference successfully', async () => {
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: { id: '123' } },
    error: null,
  })

  const selectMock = jest.fn().mockResolvedValue({
    data: [{ id: 1 }],
    error: null,
  })

  const insertMock = jest.fn(() => ({
    select: selectMock,
  }))

  mockSupabase.from.mockReturnValue({
    insert: insertMock,
  })

  render(<MockCreate />);

  fireEvent.change(screen.getByPlaceholderText('Activity:'), {
    target: { value: 'Swimming' },
  })

  fireEvent.change(screen.getByPlaceholderText('Hours:'), {
    target: { value: '1' },
  })

  fireEvent.change(screen.getByPlaceholderText('Minutes:'), {
    target: { value: '15' },
  })

  fireEvent.click(
    screen.getByRole('button', { name: /add activity/i })
  )

  await waitFor(() => {
    expect(insertMock).toHaveBeenCalledWith([
      {
        activity: 'Swimming',
        time_hours: '1',
        time_minutes: '15',
        user_id: '123',
      },
    ])
  })

  jest.clearAllMocks();
})

test("navigates to preferences page after successful create", async () => {
  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: { id: "123" } },
    error: null,
  });

  const selectMock = jest.fn().mockResolvedValue({
    data: [{ id: 1 }],
    error: null,
  });

  const insertMock = jest.fn(() => ({
    select: selectMock,
  }));

  mockSupabase.from.mockReturnValue({
    insert: insertMock,
  });

  render(<MockCreate />);

  fireEvent.change(screen.getByPlaceholderText(/activity:/i), {
    target: { value: "Swimming" },
  });

  fireEvent.change(screen.getByPlaceholderText(/hours:/i), {
    target: { value: "1" },
  });

  fireEvent.change(screen.getByPlaceholderText(/minutes:/i), {
    target: { value: "15" },
  });

  fireEvent.click(
    screen.getByRole("button", { name: /add activity/i })
  );

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/preferences");
  });
});

});