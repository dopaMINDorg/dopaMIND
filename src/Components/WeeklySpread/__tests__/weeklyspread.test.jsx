import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WeeklySpread from '../weeklyspread';

const mockToggleMode = jest.fn();
let mockCurrentMode = 'focus';


jest.mock('../../../Context/ModeContext', () => ({
  useMode: () => ({
    mode: mockCurrentMode, 
    toggleMode: mockToggleMode,
  }),
}));

jest.mock('../CalendarWeekly', () => {
  return function MockCalendarApp() {
    return <div data-testid="mock-calendar-app">Mock Calendar App</div>;
  };
});

const renderWeeklySpread = (initialEntries = ['/weekly']) => {
  return render(
      <MemoryRouter 
        initialEntries={initialEntries} 
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <WeeklySpread />
      </MemoryRouter>
  );
};

describe("Title for Weekly Spread", () => {
    it("should be visible to the user", () => {
        renderWeeklySpread();
        expect(screen.getByText(/weekly spread/i)).toBeVisible();
    });
});

describe("Descriptor for Relax and Focus mode", () => {
  it("should display Focus Mode title and description when theme is focus", () => {
    mockCurrentMode = 'focus'; 
    renderWeeklySpread();
    
    expect(screen.getByText(/Focus Mode:/i)).toBeVisible();
    expect(screen.getByText(/Prioritize tasks and deep work/i)).toBeVisible();
  });

  it("should display Relax Mode title and description when theme is relax", () => {
    mockCurrentMode = 'relax'; 
    renderWeeklySpread();

    expect(screen.getByText(/Relax Mode:/i)).toBeVisible();
    expect(screen.getByText(/Balance productivity with wellbeing/i)).toBeVisible();
  });
});

describe("Mode Change Button functionality", () => {
  it("Mode Button should indicate focus when theme is relax", () => {
    mockCurrentMode = 'relax'; 
    renderWeeklySpread();
    expect(screen.getByRole('button', { name: /Focus Mode/i })).toBeInTheDocument();
  });

  it("Mode Button should indicate relax when theme is focus", () => {
    mockCurrentMode = 'focus'; 
    renderWeeklySpread();
    expect(screen.getByRole('button', { name: /Relax Mode/i })).toBeInTheDocument();
  });

  it("should trigger toggleMode function when clicked", () => {
    mockCurrentMode = 'focus';
    renderWeeklySpread();
    
    const modeButton = screen.getByRole('button', { name: /Relax Mode/i });
    fireEvent.click(modeButton);
    
    expect(mockToggleMode).toHaveBeenCalledTimes(1);
  });
});

describe("Weekly Container Style States", () => {
  it("should apply the 'focus' class hook when theme is focus", () => {
    mockCurrentMode = 'focus';
    const { container } = renderWeeklySpread();
    
    const containerDiv = container.firstChild;
    
    expect(containerDiv).toHaveClass('weekly-container');
    expect(containerDiv).toHaveClass('focus');
    expect(containerDiv).not.toHaveClass('relax');
  });

  it("should apply the 'relax' class hook when theme is relax", () => {
    mockCurrentMode = 'relax';
    const { container } = renderWeeklySpread();
    
    const containerDiv = container.firstChild;
    
    expect(containerDiv).toHaveClass('weekly-container');
    expect(containerDiv).toHaveClass('relax');
    expect(containerDiv).not.toHaveClass('focus');
  });
});
describe("Home Button Routing functionality", () => {
  it("should navigate back to the home route (/) when clicked", () => {
    renderWeeklySpread(['/weekly-spread']);
    const homeButton = screen.getByTitle('Home');
    expect(homeButton).toBeInTheDocument();
    fireEvent.click(homeButton);
  });
});