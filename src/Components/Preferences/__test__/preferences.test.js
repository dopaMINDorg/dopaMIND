import { render, screen, fireEvent } from '@testing-library/react';
import Preferences from '../preferences';
import Home from '../../Home/Home';
import { MemoryRouter, BrowserRouter, Routes, Route} from 'react-router-dom';
import Create from '../Create';

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



test('renders Set Your Preferences', () => {
  render(<MockPreferences />);
  const divElement = screen.getByText(/Set Your Preferences/i);
  expect(divElement).toBeInTheDocument();
});


describe('Home Button', () => {
    test('renders Home Button', () => {
    render(<MockPreferences />);
    const buttonElement = screen.getByTitle(/Home/i);
    expect(buttonElement).toBeInTheDocument();
    });

    test('Home buttom leads to Home page(mocked)', async () =>  {
    render(
        <MemoryRouter initialEntries={['/preferences']}>
            <Routes>
                <Route path="/preferences" element={<Preferences />}/>
                <Route path="/home" element={<Home />} />
            </Routes>
        </MemoryRouter> 
    );
    expect(screen.getByText(/Set Your Preferences/i)).toBeInTheDocument();
    const buttonElement = screen.getByTitle(/Home/i);
    fireEvent.click(buttonElement);
    expect(await screen.findByText(/Welcome Home/i)).toBeInTheDocument();
    });
});


describe('Create Button', () => {
    test('renders Create Button', () => {
    render(<MockPreferences />);
    const buttonElement = screen.getByRole("button", { name : /CREATE/i });
    expect(buttonElement).toBeInTheDocument();
    });
    test('Create buttom leads to Create page(mocked)', async () =>  {
    render(
        <MemoryRouter initialEntries={['/preferences']}>
            <Routes>
                <Route path="/preferences" element={<Preferences />}/>
                <Route path="/create" element={<Create />} />
            </Routes>
        </MemoryRouter> 
    );
    expect(screen.getByText(/Set Your Preferences/i)).toBeInTheDocument();
    const buttonElement = screen.getByRole("button", { name : /CREATE/i });
    fireEvent.click(buttonElement);
    expect(await screen.findByText(/Create Preferences/i)).toBeInTheDocument();
    });
});

describe('Set Time Preference', () => {
    test('renders Set Time Pref Button', () => {
    render(<MockPreferences />);
    const buttonElement = screen.getByRole("button", { name : /Set your time pref/i });
    expect(buttonElement).toBeInTheDocument();
    });
    // for the test below we dont interact with the browsers native time picker, so js set time
    //directly
    test('input for Set Time Preference changes based on user pref', () => {
    render(<MockPreferences />);
    const inputElement = screen.getByTestId("notification-time-input");
    fireEvent.change(inputElement, { target: { value: '15:30' } });
    expect(inputElement.value).toBe('15:30');
    });
    // i havent done the test with mocked up supabase
});
