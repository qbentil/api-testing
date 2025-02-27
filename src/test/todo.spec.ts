import * as Services from '../services';
import * as db from './db';

import { ApiError } from '../utils';
import CreateServer from '../utils/server';
import { TodoController } from '../controllers';
import { getID } from './factory';
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
  const ID = getID();
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
      expect(response.body.message).toMatch(/is not allowed to be empty/i);
      expect(Services.createTodo).not.toHaveBeenCalled();
    });
    it('should return 500 if createTodo service fails', async () => {
      (Services.createTodo as jest.Mock).mockRejectedValueOnce(
        new Error('Database error')
      );

      const requestBody = {
        title: 'Test Todo',
        description: 'Test Description'
      };
      const response = await request(APP)
        .post('/api/todo')
        .send(requestBody)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Database error/i);
      expect(Services.createTodo).toHaveBeenCalledWith(requestBody);
    });
  });

  describe('GET /', () => {
    it('should return a list of todos', async () => {});
    it('should return paginated todos', async () => {
      const todos = [
        { title: 'Todo 1', description: 'Description 1' },
        { title: 'Todo 2', description: 'Description 2' }
      ];
      (Services.getTodos as jest.Mock).mockResolvedValueOnce(todos);

      const response = await request(APP)
        .get('/api/todo?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(Services.getTodos).toHaveBeenCalledWith({}, { limit: 2, page: 1 });
    });
    it('should return 500 if getTodos fails', async () => {
      (Services.getTodos as jest.Mock).mockRejectedValueOnce(
        new Error('Database error')
      );

      const response = await request(APP)
        .get('/api/todo?page=1&limit=2')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Database error/i);
    });
    it('should return a single todo', async () => {
      const todo = { title: 'Test Todo', description: 'Test Description' };
      (Services.getTodo as jest.Mock).mockResolvedValueOnce(todo);

      const response = await request(APP).get('/api/todo/read/123').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(todo);
      expect(Services.getTodo).toHaveBeenCalledWith({ _id: '123' });
    });
    it('should return 404 if todo is not found', async () => {
      (Services.getTodo as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(APP).get('/api/todo/read/123').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found/i);
    });
  });

  describe('PUT /update/:id', () => {
    it('should update a todo with valid id and body', async () => {
      const updatedTodo = {
        title: 'Updated Todo',
        description: 'Updated Description'
      };
      (Services.updateTodo as jest.Mock).mockResolvedValueOnce(updatedTodo);
      const requestBody = {
        title: 'Updated Todo',
        description: 'Updated Description'
      };

      const response = await request(APP)
        .put(`/api/todo/${ID}`)
        .send(requestBody)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedTodo);
      expect(Services.updateTodo).toHaveBeenCalledWith(ID, requestBody);
    });

    it('should return 400 for invalid ID format', async () => {
      (Services.updateTodo as jest.Mock).mockRejectedValueOnce(
        new Error('Invalid ID format')
      );

      const requestBody = { title: 'Updated Todo' };
      const response = await request(APP)
        .put('/api/todo/invalid')
        .send(requestBody)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid ID/i);
      expect(Services.updateTodo).not.toHaveBeenCalled();
    });

    it('should return 400 if not a valid id', async () => {
      const response = await request(APP).put('/api/todo/invalid').expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid ID/i);
      expect(Services.updateTodo).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a todo with correct id', async () => {
      (Services.deleteTodo as jest.Mock).mockResolvedValueOnce(true);
      const id = getID();
      const response = await request(APP)
        .delete(`/api/todo/delete/${id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Services.deleteTodo).toHaveBeenCalledWith(id);
    });

    it('should return error if id is not provided', async () => {
      (Services.deleteTodo as jest.Mock).mockRejectedValueOnce(
        new ApiError('Todo not found', 404)
      );

      const response = await request(APP)
        .delete('/api/todo/delete')
        .expect(404);

      expect(response.status).toBe(404);
      expect(Services.deleteTodo).not.toHaveBeenCalled();
    });
    it('should return 400 if id is invalid', async () => {
      (Services.deleteTodo as jest.Mock).mockRejectedValueOnce(null);

      const response = await request(APP)
        .delete('/api/todo/delete/123')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/Invalid ID/i);
      expect(Services.deleteTodo).not.toHaveBeenCalled();
    });
  });
});
