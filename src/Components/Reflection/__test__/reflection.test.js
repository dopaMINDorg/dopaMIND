import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Reflection from "../reflection";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

jest.mock("../../../config/supabaseClient", () => ({
  __esModule: true,
  default: {
    rpc: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  },
}));

import supabase from "../../../config/supabaseClient";
const mockSupabase = supabase;
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const MockReflection = () => {
    return(
            // Memory router uses a fake starting router like /preferences and no real route changes occur, 
            // BrowserRouter uses the actual windows URL and routes change, so we use MemoryRouter for testing mocked 
            // routes 

            <MemoryRouter initialEntries={['/reflection']}>
                <Reflection />
            </MemoryRouter>
       
    );
}

const mockQuestions = [
  { id: 1, reflection_prompts: "Q1" },
  { id: 2, reflection_prompts: "Q2" },
  { id: 3, reflection_prompts: "Q3" }
];

describe("Reflection Component", () => {

beforeEach(() => {
  jest.clearAllMocks();
});

test("shows loading initially", () => {
  supabase.rpc.mockResolvedValue({
    data: [],
    error: null,
  });

  render(<MockReflection />);
  expect(screen.getByText(/loading questions/i)).toBeInTheDocument();
});

test("renders questions and textboxes", async () => {
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });

  render(<MockReflection />);
  expect(await screen.findByText("Q1")).toBeInTheDocument();
  expect(screen.getByText("Q2")).toBeInTheDocument();
  expect(screen.getByText("Q3")).toBeInTheDocument();
  const textareas = screen.getAllByRole("textbox");
  expect(textareas).toHaveLength(3);
});

test("updates textarea input correctly", async () => {
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
  render(<MockReflection />);
  const textarea = await screen.findAllByRole("textbox");
  fireEvent.change(textarea[0], {
    target: { value: "My answer" },
  });

  expect(textarea[0].value).toBe("My answer");
});

test("shows alert if both answers are empty", async () => {
  window.alert = jest.fn();
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
  render(<MockReflection />);
  const button = await screen.findByText("Submit");
  await screen.findByText("Q1");
  fireEvent.click(button);
  expect(window.alert).toHaveBeenCalledWith(
    "Please answer all questions before submitting."
  );
});

test("shows alert if 1 answer is empty", async () => {
  window.alert = jest.fn();
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
  render(<MockReflection />);
  const textarea = await screen.findAllByRole("textbox");
  fireEvent.change(textarea[0], {
    target: { value: "My answer" },
  });
  const button = await screen.findByText("Submit");
  fireEvent.click(button);
  expect(window.alert).toHaveBeenCalledWith(
    "Please answer all questions before submitting."
  );
});

describe("submit", () => {

test("renders submit button", () => {
supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
    render(<MockReflection />);
    const buttonElement = screen.getByRole("button", { name : /Submit/i});
    expect(buttonElement).toBeInTheDocument();
});

test("successfully submits answers", async () => {
  //window.alert = jest.fn();
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
  supabase.auth.getUser.mockResolvedValue({
    data: { user: { id: "user-123" } },
  });
  const insertMock = jest.fn().mockResolvedValue({ error: null });
  supabase.from.mockReturnValue({
    insert: insertMock,
  });

  render(<MockReflection/>);
  const textareas = await screen.findAllByRole("textbox");
  fireEvent.change(textareas[0], {
    target: { value: "Answer 1" },
  });
  fireEvent.change(textareas[1], {
    target: { value: "Answer 2" },
  });
  fireEvent.change(textareas[2], {
    target: { value: "Answer 3" },
  });
  fireEvent.click(screen.getByText("Submit"));
  await waitFor(() => {
    expect(insertMock).toHaveBeenCalled();
  });
  expect(global.alert).toHaveBeenCalledWith("Saved!");
});

test("clears answers after successful submit", async () => {
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });

  supabase.auth.getUser.mockResolvedValue({
    data: {
      user: { id: "123" },
    },
  });

  const insertMock = jest.fn().mockResolvedValue({
    error: null,
  });

  supabase.from.mockReturnValue({
    insert: insertMock,
  });

  render(<MockReflection />);

  const textareas = await screen.findAllByRole("textbox");

  fireEvent.change(textareas[0], {
    target: { value: "Answer 1" },
  });

  fireEvent.change(textareas[1], {
    target: { value: "Answer 2" },
  });

  fireEvent.change(textareas[2], {
    target: { value: "Answer 3" },
  });

  fireEvent.click(screen.getByText("Submit"));

  await waitFor(() => {
    expect(insertMock).toHaveBeenCalled();
  });
  // text boxes cleared after submittinng
  expect(textareas[0]).toHaveValue("");
  expect(textareas[1]).toHaveValue("");
  expect(textareas[2]).toHaveValue("");
});
});

describe("home", () => {
test("render home button", async () => {
    supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
    render(<MockReflection />);
    const buttonElement = screen.getByTitle(/Home/i);
    expect(buttonElement).toBeInTheDocument();
});

test("navigates to home", async () => {
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });


  render(<MockReflection/>);
  const button = await screen.findByTitle("Home");
  fireEvent.click(button);
  expect(mockNavigate).toHaveBeenCalledWith("/home");
});
});

describe("Past Reflection", () => {

test("render Past Reflections button", async () => {
    supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
    render(<MockReflection />);
    const buttonElement = screen.getByRole("button", { name : /View Past Reflections/i});
    expect(buttonElement).toBeInTheDocument();
});

test("navigates to Past Reflections page", async () => {
  supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });

  render(<MockReflection/>);
  const button = await screen.findByText("View Past Reflections");
  fireEvent.click(button);
  expect(mockNavigate).toHaveBeenCalledWith("/history");
});
});

describe("Change Prompts", () =>{
test("render Change Prompts button", async () => {
    supabase.rpc.mockResolvedValue({
    data: mockQuestions,
    error: null,
  });
    render(<MockReflection />);
    const buttonElement = screen.getByRole("button", { name : /Change Prompts/i});
    expect(buttonElement).toBeInTheDocument();
});


test("change prompts fetches new questions", async () => {
  supabase.rpc
    .mockResolvedValueOnce({
      data: [{ id: 1, reflection_prompts: "Old Question" }],
      error: null,
    })
    .mockResolvedValueOnce({
      data: [{ id: 2, reflection_prompts: "New Question" }],
      error: null,
    });

  render(<MockReflection />);
  expect(await screen.findByText("Old Question")).toBeInTheDocument();
  fireEvent.click(screen.getByText("Change Prompts"));
  expect(await screen.findByText("New Question")).toBeInTheDocument();
});

test("clears textboxes when Change Prompts is clicked", async () => {
  supabase.rpc
    .mockResolvedValueOnce({
      data: mockQuestions,
      error: null,
    })
    .mockResolvedValueOnce({
      data: mockQuestions,
      error: null,
    });

  render(<MockReflection />);

  const textareas = await screen.findAllByRole("textbox");

  fireEvent.change(textareas[0], {
    target: { value: "My reflection" },
  });

  expect(textareas[0]).toHaveValue("My reflection");

  fireEvent.click(screen.getByText("Change Prompts"));

  const updatedTextareas = await screen.findAllByRole("textbox");

  expect(updatedTextareas[0]).toHaveValue("");
});
});

});