import { ITodo } from '../models/types';
import mongoose from 'mongoose';

// only title and description
export const NewTodoFaction = (todo: {
  title: string;
  description: string;
}) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    title: todo.title,
    description: todo.description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const getID = (): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId();
};
