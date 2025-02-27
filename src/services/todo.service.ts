import { ITodo } from '../models/types';
import { QueryOptions } from 'mongoose';
import { TodoModel } from '../models';

export const createTodo = async (todo: Partial<ITodo>): Promise<ITodo> => {
  try {
    return await TodoModel.create(todo);
  } catch (error: any) {
    throw new Error(error);
  }
};


export const getTodos = async (query: QueryOptions, pagination: { limit: number, page: number }): Promise<ITodo[]> => {
  const { limit, page } = pagination;
  const skip = (page - 1) * limit;
  try {
    return await TodoModel.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

  } catch (error: any) {
    throw new Error(error);
  }
};

export const getTodo = async (query: QueryOptions) : Promise<ITodo | null> => {
  try {
    return await TodoModel.findOne(query);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateTodo = async (id: string, todo: Partial<ITodo>) : Promise<ITodo | null> => {
  try {
    return await TodoModel.findByIdAndUpdate(id, todo, { new: true });
  } catch (error: any) {
    throw new Error(error);
  }
}

export const deleteTodo = async (id: string): Promise<ITodo | null> => {
  try {
    return await TodoModel.findByIdAndDelete(id);
  } catch (error: any) {
    throw new Error(error);
  }
};
