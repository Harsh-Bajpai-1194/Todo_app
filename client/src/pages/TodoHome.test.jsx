import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthContext } from '../context/AuthContext';
import { TodoProvider } from '../context/TodoContext';
import TodoHome from './TodoHome';
import api from '../api';

// Mock the entire API module to prevent real network requests
jest.mock('../api');

// A custom render function that wraps the UI in all necessary providers
const renderTodoHome = () => {
  const authProviderProps = {
    token: 'fake-token',
    isAuthenticated: true,
    user: { name: 'Test User' },
    // Provide dummy functions for other context values if needed
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  };

  return render(
    <AuthContext.Provider value={authProviderProps}>
      <TodoProvider>
        <TodoHome />
      </TodoProvider>
    </AuthContext.Provider>
  );
};

describe('TodoHome Integration Test', () => {
  beforeEach(() => {
    // Reset mocks before each test to ensure a clean state
    api.get.mockResolvedValue({ data: [] });
    // Mock the POST request to simulate adding a todo
    api.post.mockImplementation((url, data) =>
      Promise.resolve({ data: { ...data, _id: 'new-id-123', completed: false } })
    );
  });

  it('should allow a user to add a task and see it in the list', async () => {
    const user = userEvent.setup();
    renderTodoHome();

    // Initially, the list should show a "no tasks" message
    expect(await screen.findByText(/no tasks found/i)).toBeInTheDocument();

    const taskInput = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: /add/i });

    // Add a new task
    await user.type(taskInput, 'My new integrated task');
    await user.click(addButton);

    // The new task should now be visible in the document.
    // We use `waitFor` because the state update after the API call is asynchronous.
    await waitFor(() => {
      expect(screen.getByText('My new integrated task')).toBeInTheDocument();
    });

    // The "no tasks" message should be gone
    expect(screen.queryByText(/no tasks found/i)).not.toBeInTheDocument();
  });

  it('should filter the list of todos when a filter button is clicked', async () => {
    const user = userEvent.setup();
    // Provide initial todos for this specific test
    const initialTodos = [
      { _id: '1', task: 'Completed Task', completed: true },
      { _id: '2', task: 'Pending Task', completed: false },
    ];
    api.get.mockResolvedValue({ data: initialTodos });

    renderTodoHome();

    // Wait for initial todos to be loaded and displayed
    expect(await screen.findByText('Completed Task')).toBeInTheDocument();
    expect(await screen.findByText('Pending Task')).toBeInTheDocument();

    // Click 'Pending' filter
    await user.click(screen.getByRole('button', { name: /^pending$/i }));
    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });
});