import * as Services from '../services';

import CreateServer from '../utils/server';
import request from 'supertest';

// import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from '../controllers'

jest.mock('../services');

describe('Todo Controller', () => {
  const APP = CreateServer();

  describe('POST /create', () => {
    it('should create a new todo', async () => {
      const todo = { title: 'New Todo', description: 'New Description' };
      (Services.createTodo as jest.Mock).mockResolvedValueOnce(todo);

      const response = await request(APP).post('/api/todo').send(todo);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(todo);
    });
  });

  describe('GET /', () => {
    it('should return a list of todos', async () => {
      const todos = [
        { title: 'Todo 1', description: 'Description 1' },
        { title: 'Todo 2', description: 'Description 2' }
      ];
      (Services.getTodos as jest.Mock).mockResolvedValueOnce(todos);

      const response = await request(APP).get('/api/todo');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(todos);
    });
  });

  describe('GET /:id', () => {
    it('should return a single todo', async () => {
      const todo = { title: 'Todo 1', description: 'Description 1' };
      (Services.getTodo as jest.Mock).mockResolvedValueOnce(todo);

      const response = await request(APP).get('/api/todo/read/123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(todo);
    });
  });

  describe('PUT /update/:id', () => {
    it('should update a todo', async () => {
      const updatedTodo = {
        title: 'Updated Todo',
        description: 'Updated Description'
      };
      (Services.updateTodo as jest.Mock).mockResolvedValueOnce(updatedTodo);

      const response = await request(APP)
        .put('/api/todo/123')
        .send(updatedTodo);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedTodo);
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a todo', async () => {
      (Services.deleteTodo as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(APP).delete('/api/todo/delete/123');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
