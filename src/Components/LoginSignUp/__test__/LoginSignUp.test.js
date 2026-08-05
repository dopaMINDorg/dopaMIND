import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginSignUp from "../LoginSignUp"
import { MemoryRouter } from "react-router-dom";
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

});