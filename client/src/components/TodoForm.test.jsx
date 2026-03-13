import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoContext } from '../context/TodoContext';
import TodoForm from './TodoForm';

// A custom render function to provide the component with a mock context
const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <TodoContext.Provider value={providerProps}>{ui}</TodoContext.Provider>,
    renderOptions
  );
};

describe('TodoForm', () => {
  let mockAddTodo;
  let providerProps;

  beforeEach(() => {
    // Create a fresh mock for each test to ensure isolation
    mockAddTodo = jest.fn();
    providerProps = {
      addTodo: mockAddTodo,
    };
  });

  it('should render the input fields and a disabled Add button', () => {
    renderWithContext(<TodoForm />, { providerProps });

    // Check for the task input
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    // Check for the time input
    expect(screen.getByLabelText('Task time')).toBeInTheDocument();
    // The button should be present and disabled initially
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('should enable the Add button when text is entered into the task input', async () => {
    const user = userEvent.setup();
    renderWithContext(<TodoForm />, { providerProps });

    const taskInput = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: /add/i });

    expect(addButton).toBeDisabled(); // Confirm initial state
    await user.type(taskInput, 'My new test task');
    expect(addButton).toBeEnabled(); // Should be enabled after typing
  });

  it('should call addTodo with the task and time, then clear the form on submit', async () => {
    const user = userEvent.setup();
    renderWithContext(<TodoForm />, { providerProps });

    const taskInput = screen.getByPlaceholderText('What needs to be done?');
    const timeInput = screen.getByLabelText('Task time');
    const addButton = screen.getByRole('button', { name: /add/i });

    await user.type(taskInput, 'A new task');
    await user.type(timeInput, '10:30');
    await user.click(addButton);

    // Expect our mock function to have been called with the correct data
    expect(mockAddTodo).toHaveBeenCalledWith({ task: 'A new task', time: '10:30' });
    expect(mockAddTodo).toHaveBeenCalledTimes(1);

    // The form inputs should be cleared after submission
    expect(taskInput).toHaveValue('');
    expect(timeInput).toHaveValue('');
  });
});