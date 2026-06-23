import { MemoryRouter} from 'react-router-dom';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
//import userEvent from '@testing-library/user-event';
import supabase from "../../../config/supabaseClient";
import PreferenceCard from "../Card";


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

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Card Component", () => {

beforeEach(() => {
  mockNavigate.mockClear();
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

test("renders preference data", () => {
  render(
    <MemoryRouter>
        <PreferenceCard pref={{
            id: 1,
            activity: "Swimming",
            time_hours: 2,
            time_minutes: 30
        }} onDelete={jest.fn()} />
  </MemoryRouter>);

  expect(screen.getByText("Swimming")).toBeInTheDocument();
  expect(screen.getByText(/2 hrs 30 mins/i)).toBeInTheDocument();
});

test("navigates to Update page when edit button clicked", () => {
  render(
    <MemoryRouter>
        <PreferenceCard pref={{
            id: 101,
            activity: "Swimming",
            time_hours: 2,
            time_minutes: 30
        }} onDelete={jest.fn()} />
  </MemoryRouter>);


  fireEvent.click(screen.getByText(/edit/i));

  expect(mockNavigate).toHaveBeenCalledWith("/101");
});

test("deletes preference", async () => {
  const onDeleteMock = jest.fn();

  mockSupabase.from.mockReturnValue({
    delete: () => ({
      eq: () => Promise.resolve({ data: {}, error: null }),
    }),
  });

  render(
  <MemoryRouter>
        <PreferenceCard
        pref={{ id: 3, activity: "Gym", time_hours: 1, time_minutes: 0 }}
        onDelete={onDeleteMock}
    />
  </MemoryRouter>);

  fireEvent.click(screen.getByText(/delete/i));

  await waitFor(() => {
    expect(onDeleteMock).toHaveBeenCalledWith(3);
  });
});

});