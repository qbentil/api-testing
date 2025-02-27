import * as Services from '../services';

import { NextFunction, Request, Response } from 'express';

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newTodo = await Services.createTodo(req.body);
    res.status(200).json({
      message: 'Todo created successfully',
      data: newTodo,
      success: true
    });
  } catch (error: any) {
    next(error);
  }
};

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { completed, limit, page } = req.query;
    const query = {
      ...(completed && { completed })
    };
    const pagination = {
      limit: limit ? parseInt(limit as string) : 10,
      page: page ? parseInt(page as string) : 1
    };
    const todos = await Services.getTodos(query, pagination);
    res.status(200).json({
      message: 'Todos retrieved successfully',
      data: todos,
      success: true
    });
  } catch (error: any) {
    next(error);
  }
};

export const getTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Services.getTodo({
      _id: req.params.id
    });
    res.status(200).json({
      message: 'Todo retrieved successfully',
      data: todo,
      success: true
    });
  } catch (error: any) {
    next(error);
  }
};

export const updateTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Services.updateTodo(req.params.id, req.body);
    res.status(200).json({
      message: 'Todo updated successfully',
      data: todo,
      success: true
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const todo = await Services.deleteTodo(req.params.id);
    res.status(200).json({
      message: 'Todo deleted successfully',
      data: todo,
      success: true
    });
  } catch (error: any) {
    next(error);
  }
};
