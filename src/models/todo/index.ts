import mongoose, { Model, Schema } from 'mongoose';

import { ITodoModel } from './types';

const TodoSchema = new Schema<ITodoModel>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const TodoModel: Model<ITodoModel> =
  mongoose.models['Todo'] || mongoose.model<ITodoModel>('Todo', TodoSchema);
