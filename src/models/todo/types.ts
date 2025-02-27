import mongoose, { Document } from 'mongoose';

export interface ITodo {
  title: string;
  description: string;
  completed: boolean;
}

export interface ITodoModel extends ITodo, Document {
  createdAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
}
