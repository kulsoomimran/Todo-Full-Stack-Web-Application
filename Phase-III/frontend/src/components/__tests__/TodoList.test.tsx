// Mock the API client
jest.mock('../../lib/api-client', () => ({
  bffApiClient: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    getTodoById: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskList from '../Task/TaskList';
import { bffApiClient } from '../../lib/api-client';

// Mock the bffApiClient
const mockBffApiClient = bffApiClient as jest.Mocked<typeof bffApiClient>;

describe('TaskList Component', () => {
  const mockInitialTodos = [
    {
      id: 1,
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      user_id: 'user-123',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing and displays initial todos', async () => {
    // The TaskList component receives todos as props and doesn't make API calls directly
    // API calls are handled by parent components

    render(<TaskList initialTodos={mockInitialTodos} loading={false} onTodosChange={jest.fn()} />);

    // Verify that the component renders the initial todos
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('displays empty state when no todos provided', async () => {
    // The TaskList component should show an empty state when no todos are provided
    render(<TaskList initialTodos={[]} loading={false} onTodosChange={jest.fn()} />);

    // Verify that the empty state is displayed
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating your first task.')).toBeInTheDocument();
  });

  test('calls BFF to create a new task', async () => {
    mockBffApiClient.getTodos.mockResolvedValue([]);
    mockBffApiClient.createTodo.mockResolvedValue({
      id: 2,
      title: 'New Todo',
      description: 'New Description',
      completed: false,
      user_id: 'user-123',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    });

    render(<TaskList initialTodos={[]} loading={false} onTodosChange={jest.fn()} />);

    // Find the input field and enter a new todo
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'New Todo' } });

    // Find and click the add button
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(mockBffApiClient.createTodo).toHaveBeenCalledWith({
        title: 'New Todo',
      });
    });
  });
});