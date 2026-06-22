import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginSignUp from "../LoginSignUp"
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import supabase from "../../../config/supabaseClient";

const mockNavigate = jest.fn();

jest.mock("../../../config/supabaseClient", () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

global.alert = jest.fn();

const MockLogin = () => {
    return(
            // Memory router uses a fake starting router like /preferences and no real route changes occur, 
            // BrowserRouter uses the actual windows URL and routes change, so we use MemoryRouter for testing mocked 
            // routes 

            <MemoryRouter>
                <LoginSignUp />
            </MemoryRouter>
       
    );
}

describe("Login Component", () => {
test("renders DopaMIND logo", () => {
    render(<MockLogin/>);
    const logo = screen.getByAltText("DopaMIND");
    expect(logo).toBeInTheDocument();
});

test("renders enter button", () => {
    render(<MockLogin/>);
    const button = screen.getByRole("button", { name : /Enter/i } );
    expect(button).toBeInTheDocument();
});

test("defaults to Sign Up mode", () => {
    render(<MockLogin />);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
});

test("switches between Sign Up and Login mode", () => {
    render(<MockLogin/>);
    const mode = screen.getByTestId("SignUp");
    fireEvent.click(mode);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    const otherMode = screen.getByTestId("Login");
    fireEvent.click(otherMode);
    expect(screen.queryByPlaceholderText("Name")).not.toBeInTheDocument();
});

describe("input fields", () => {

test("user can change Name input", () => {
    render(<MockLogin />);
    const placeholder = screen.getByPlaceholderText(/Name/i);
    fireEvent.change(placeholder, { target : { value : "John"} });
    expect(placeholder).toHaveValue("John");
});

test("user can change Email input", () => {
    render(<MockLogin />);
    //test works because default state is sign up
    const placeholder = screen.getByPlaceholderText(/Email ID/i);
    fireEvent.change(placeholder, { target : { value : "abc@gmail.com"} });
    expect(placeholder).toHaveValue("abc@gmail.com");
});

test("user can change Password input", () => {
    render(<MockLogin />);
    const placeholder = screen.getByPlaceholderText(/Password/i);
    fireEvent.change(placeholder, { target : { value : "abc"} });
    expect(placeholder).toHaveValue("abc");
});

});


test("navigates to home upon successful login", async () => {
  supabase.auth.signInWithPassword.mockResolvedValue({
    data: { user: { id: "1" } },
    error: null,
  });

  render(<LoginSignUp />);

  // switch to Login mode
  fireEvent.click(screen.getByTestId("Login"));

  fireEvent.change(screen.getByPlaceholderText("Email ID"), {
    target: { value: "test@gmail.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /enter/i }));

  await waitFor(() => {
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@gmail.com",
      password: "123456",
    });
  });

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("Login successful!");
    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });
});

test("shows alert on login failure", async () => {
  supabase.auth.signInWithPassword.mockResolvedValue({
    data: null,
    error: { message: "Invalid credentials" },
  });

  render(<LoginSignUp />);

  fireEvent.click(screen.getByTestId("Login"));

  fireEvent.change(screen.getByPlaceholderText("Email ID"), {
    target: { value: "wrong@gmail.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "wrongpass" },
  });

  fireEvent.click(screen.getByRole("button", { name: /enter/i }));

  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("Login unsuccessful");
  });

  expect(mockNavigate).not.toHaveBeenCalled();
});

test("signs up successfully and switches to login mode", async () => {
  supabase.auth.signUp.mockResolvedValue({
    data: { user: { id: "1" } },
    error: null,
  });

  render(<LoginSignUp />);

  fireEvent.change(screen.getByPlaceholderText("Name"), {
    target: { value: "John" },
  });

  fireEvent.change(screen.getByPlaceholderText("Email ID"), {
    target: { value: "john@gmail.com" },
  });

  fireEvent.change(screen.getByPlaceholderText("Password"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /enter/i }));

  await waitFor(() => {
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "john@gmail.com",
      password: "123456",
      options: {
        data: {
          display_name: "John",
        },
      },
    });
  });

  expect(global.alert).toHaveBeenCalledWith(
    "Sign up successful! Please Login to continue."
  );

  //should switch to Login mode
  expect(screen.getByText("Login")).toBeInTheDocument();
});

});