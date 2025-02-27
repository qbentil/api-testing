import {
  createTodo,
  deleteTodo,
  getTodo,
  getTodos,
  updateTodo
} from '../services';

import { TodoModel } from '../models';
import mongoose from 'mongoose';

jest.mock('../models', () => ({
  TodoModel: {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

describe('Todo Service', () => {
  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const todo = { title: 'New Todo', description: 'New Description' };
      (TodoModel.create as jest.Mock).mockResolvedValueOnce(todo);

      const result = await createTodo(todo);
      expect(result).toEqual(todo);
      expect(TodoModel.create).toHaveBeenCalledWith(todo);
    });
  });

  describe('getTodos', () => {
    it('should return a list of todos', async () => {
      const todos = [
        { title: 'Todo 1', description: 'Description 1' },
        { title: 'Todo 2', description: 'Description 2' }
      ];
      (TodoModel.find as jest.Mock).mockReturnValueOnce({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValueOnce(todos)
      });

      const result = await getTodos({}, { limit: 10, page: 1 });
      expect(result).toEqual(todos);
      expect(TodoModel.find).toHaveBeenCalled();
    });
  });

  describe('getTodo', () => {
    it('should return a single todo', async () => {
      const todo = { title: 'Todo 1', description: 'Description 1' };
      (TodoModel.findOne as jest.Mock).mockResolvedValueOnce(todo);

      const result = await getTodo({ title: 'Todo 1' });
      expect(result).toEqual(todo);
      expect(TodoModel.findOne).toHaveBeenCalledWith({ title: 'Todo 1' });
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const updatedTodo = {
        title: 'Updated Todo',
        description: 'Updated Description'
      };
      (TodoModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(
        updatedTodo
      );

      const result = await updateTodo('123', updatedTodo);
      expect(result).toEqual(updatedTodo);
      expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        updatedTodo,
        { new: true }
      );
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      (TodoModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(true);

      const result = await deleteTodo('123');
      expect(result).toBe(true);
      expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });
  });
});
