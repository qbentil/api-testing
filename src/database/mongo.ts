import config from '../config';
import mongoose from 'mongoose';

export const MONGODB_CONNECT = async (callback: () => void) => {
  try {
    await mongoose.connect(config.mongo.uri as string, {
      autoIndex: true,
    });
    console.log(`Database connected in ${config.app.env?.toUpperCase()} mode 🚀`);

    mongoose.connection.on('disconnected', () => {
      console.log('Database disconnected');
    });

    callback();
  } catch (error) {
    console.error('Error connecting to database:', error); 
    throw new Error('Error connecting to database');
  }
};
