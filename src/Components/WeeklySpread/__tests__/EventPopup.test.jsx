jest.mock("../../../config/supabaseClient", () => ({
  __esModule: true,
  default: {
    from: () => ({
      select: () =>
        Promise.resolve({
          data: [
            { id: 1, activity: "Reading", time_hours: 1, time_minutes: 0 },
            { id: 2, activity: "Workout", time_hours: 0, time_minutes: 30 },
          ],
          error: null,
        }),
    }),
  },
}));



jest.mock("../../../Context/ModeContext", () => ({
  useMode: jest.fn(),
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventPopup from "../EventPopup";
import { useMode } from "../../../Context/ModeContext";


const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSave: jest.fn(),
  onDelete: jest.fn(),
  draftEvent: null,
};

describe("EventPopup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });



  describe("render tests", () =>{
    test("renders Add Event title in focus mode", async () => {
    useMode.mockReturnValue({ mode: "focus" });

    render(<EventPopup {...defaultProps} />);

    expect(await screen.findByText(/Add Event/i)).toBeInTheDocument();
  });
    test("renders Add Preference title in relax mode", async () => {
    useMode.mockReturnValue({ mode: "relax" });

    render(<EventPopup {...defaultProps} />);

    expect(await screen.findByText(/Add Preference/i)).toBeInTheDocument();
  });
  })

  describe("input tests", () => {
      test("allows typing into title input", async () => {
      const user = userEvent;

      useMode.mockReturnValue({ mode: "focus" });

      render(<EventPopup {...defaultProps} />);

      const input = await screen.findByPlaceholderText(/Event title/i);

      await user.type(input, "Meeting");

      expect(input).toHaveValue("Meeting");
    });
  })

  describe("Save Tests", () => {
    test("create button calls onSave", async () => {
    const user = userEvent;

    useMode.mockReturnValue({ mode: "focus" });

    render(<EventPopup {...defaultProps} />);

    const button = await screen.findByRole("button", { name: /Create/i });

    await user.click(button);

    expect(defaultProps.onSave).toHaveBeenCalled();
  });
  })

  

  describe("Cancel Test", () =>{
    test("cancel button calls onClose", async () => {
    const user = userEvent;

    useMode.mockReturnValue({ mode: "focus" });

    render(<EventPopup {...defaultProps} />);

    const button = await screen.findByRole("button", { name: /Cancel/i });

    await user.click(button);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });
  })


  
  describe("relax mode dropdown", () =>{
    test("shows preference dropdown in relax mode", async () => {
    useMode.mockReturnValue({ mode: "relax" });

    render(<EventPopup {...defaultProps} />);

    const dropdown = await screen.findByRole("combobox");

    expect(dropdown).toBeInTheDocument();
  });

  test("loads eligible preferences only", async () => {
    useMode.mockReturnValue({ mode: "relax" });

    render(<EventPopup {...defaultProps} />);

    expect(screen.getByText(/Choose an eligible preference/i)).toBeInTheDocument();
  });
  })


  describe("edit mode", () => {
    test("edit mode shows update and delete buttons", async () => {
    useMode.mockReturnValue({ mode: "focus" });

    const draftEvent = {
      id: 1,
      title: "Existing Event",
      start: new Date(),
      end: new Date(),
    };

    render(<EventPopup {...defaultProps} draftEvent={draftEvent} />);

    expect(await screen.findByRole("button", { name: /Update/i })).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });
  })

  
});
