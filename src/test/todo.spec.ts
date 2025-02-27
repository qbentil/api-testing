import * as Services from '../services';
import * as db from './db';

import CreateServer from '../utils/server';
import mongoose from 'mongoose';
import request from 'supertest';

jest.mock('../services', () => ({
  createTodo: jest.fn(),
  getTodos: jest.fn(),
  getTodo: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn()
}));

const APP = CreateServer();

describe('Todo Router', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterEach(async () => {
    await db.clearDatabase();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /create', () => {
    it('should create a new todo with correct body', async () => {
      const newTodo = {
        title: 'Test Todo',
        description: 'Test Description'
      };
      (Services.createTodo as jest.Mock).mockResolvedValueOnce(newTodo);

      const requestBody = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      const response = await request(APP)
        .post('/api/todo')
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toEqual(true);
      expect(Services.createTodo).toHaveBeenCalledWith(requestBody);
    });

    it('should return todo item as data when created', async () => {
      const newTodo = {
        title: 'Test Todo',
        description: 'Test Description'
      };
      (Services.createTodo as jest.Mock).mockResolvedValueOnce(newTodo);

      const requestBody = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      const response = await request(APP)
        .post('/api/todo')
        .send(requestBody)
        .expect(200);

      expect(response.body.data).toHaveProperty('title', requestBody.title);
      expect(response.body.data).toHaveProperty(
        'description',
        requestBody.description
      );
      expect(Services.createTodo).toHaveBeenCalledWith(requestBody);
    });

    it('should throw error if todo body validation fails', async () => {
      const requestBody = {
        title: '',
        description: 'Test Description'
      };

      const response = await request(APP)
        .post('/api/todo')
        .send(requestBody)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/is not allowed to be empt/i);
      expect(Services.createTodo).not.toHaveBeenCalled();
    });
  });

  describe('GET /read', () => {
    it('should return todos with default pagination', async () => {
      const todos = [
        { title: 'Todo 1', description: 'Description 1' },
        { title: 'Todo 2', description: 'Description 2' },
        { title: 'Todo 3', description: 'Description 3' },
        { title: 'Todo 4', description: 'Description 4' },
        { title: 'Todo 5', description: 'Description 5' },
        { title: 'Todo 6', description: 'Description 6' },
        { title: 'Todo 7', description: 'Description 7' },
        { title: 'Todo 8', description: 'Description 8' },
        { title: 'Todo 9', description: 'Description 9' },
        { title: 'Todo 10', description: 'Description 10' },
        { title: 'Todo 11', description: 'Description 11' }
      ];
      (Services.getTodos as jest.Mock).mockImplementationOnce(
        (query, pagination) => {
          const { page = 1, limit = 10 } = pagination;
          const start = (page - 1) * limit;
          const end = start + limit;
          return Promise.resolve(todos.slice(start, end));
        }
      );

      const response = await request(APP).get('/api/todo').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(10);
      expect(Services.getTodos).toHaveBeenCalledWith(
        {},
        { limit: 10, page: 1 }
      );
    });

    it('should return paginated todos', async () => {
      const todos = [
        { title: 'Todo 1', description: 'Description 1' },
        { title: 'Todo 2', description: 'Description 2' }
      ];

      (Services.getTodos as jest.Mock).mockImplementationOnce(
        (query, pagination) => {
          const { page, limit } = pagination;
          const start = (page - 1) * limit;
          const end = start + limit;
          return Promise.resolve(todos.slice(start, end));
        }
      );

      const response = await request(APP)
        .get('/api/todo?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Todo 1');
      expect(Services.getTodos).toHaveBeenCalledWith({}, { limit: 1, page: 1 });
    });

    it('should return filtered todos', async () => {
      const todos = [
        {
          title: 'Filtered Todo',
          description: 'Filtered Description',
          completed: true
        },
        {
          title: 'Unfiltered Todo',
          description: 'Unfiltered Description',
          completed: false
        }
      ];

      (Services.getTodos as jest.Mock).mockImplementationOnce((query) => {
        const { completed } = query;
        const filteredTodos = todos.filter(
          (todo) => todo.completed == Boolean(completed)
        );
        return Promise.resolve(filteredTodos);
      });

      const response = await request(APP)
        .get('/api/todo?completed=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].completed).toBe(true);
      expect(Services.getTodos).toHaveBeenCalledWith(
        { completed: 'true' },
        { limit: 10, page: 1 }
      );
    });

    it('should return single todo with correct id', async () => {
      const todo = { title: 'Todo 1', description: 'Description 1' };
      (Services.getTodo as jest.Mock).mockResolvedValueOnce(todo);

      const response = await request(APP).get('/api/todo/read/123').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(todo);
      expect(Services.getTodo).toHaveBeenCalledWith({ _id: '123' });
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a todo with correct id', async () => {
      (Services.deleteTodo as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(APP)
        .delete('/api/todo/delete/123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Services.deleteTodo).toHaveBeenCalledWith('123');
    });

    it('should throw error id is not provided', async () => {
      (Services.deleteTodo as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid ID')
      );

      const response = await request(APP)
        .delete('/api/todo/delete')
        .expect(404);

      expect(response.status).toBe(404);
      expect(Services.deleteTodo).not.toHaveBeenCalled();
    });
  });
});
