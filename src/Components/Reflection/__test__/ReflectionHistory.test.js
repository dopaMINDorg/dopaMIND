import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ReflectionHistory from "../ReflectionHistory";
import supabase from "../../../config/supabaseClient";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../config/supabaseClient", () => ({
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(),
}));
const mockSupabase = supabase;

const mockData = [
      {
        id: 1,
        response: "I felt productive today",
        created_at: "2025-01-01T12:00:00Z",
        reflection_questions: {
          reflection_prompts: "How was your day?",
        },
      },
      {
        id: 2,
        response: "I exercised for 30 minutes",
        created_at: "2025-01-02T12:00:00Z",
        reflection_questions: {
          reflection_prompts: "What did you accomplish?",
        },
      },
    ];

const MockHistory = () => {
    return(
            // Memory router uses a fake starting router like /preferences and no real route changes occur, 
            // BrowserRouter uses the actual windows URL and routes change, so we use MemoryRouter for testing mocked 
            // routes 

            <MemoryRouter initialEntries={['/history']}>
                <ReflectionHistory />
            </MemoryRouter>
       
    );
}


describe("Reflection History Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: "user-123",
        },
      },
    });
  });

  test("renders loading state initially", () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn(
        () =>
          new Promise(() => {
          })
      ),
    });

    render(<MockHistory />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("renders reflection responses", async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    });

    render(<MockHistory />);
    expect(
      await screen.findByText("How was your day?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("I felt productive today")
    ).toBeInTheDocument();
    expect(
      screen.getByText("What did you accomplish?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("I exercised for 30 minutes")
    ).toBeInTheDocument();
  });

  test("shows empty state when no responses exist", async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    });

    render(<MockHistory />);

    expect(
      await screen.findByText(/no responses yet/i)
    ).toBeInTheDocument();
  });

  test("logs error when fetch fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: null,
        error: {
          message: "Database error",
        },
      }),
    });

    render(<MockHistory />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test("renders formatted date", async () => {
    const createdAt = "2025-01-01T12:00:00Z";
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
    });

    render(<MockHistory />);
    const formattedDate = new Date(createdAt).toLocaleString();
    expect(
      await screen.findByText(formattedDate)
    ).toBeInTheDocument();
  });

  describe("home", () => {
test("render home button", async () => {
    mockSupabase.from.mockReturnValue({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue({
      data: [],
      error: null,
    }),
  });

    render(<MockHistory />);
    const buttonElement = screen.findByTitle(/Home/i);
    expect(await buttonElement).toBeInTheDocument();
});

  test("navigates to home when home button is clicked", async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    });

    render(<MockHistory />);
    const homeButton = await screen.findByTitle("Home");
    fireEvent.click(homeButton);
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
  });


});