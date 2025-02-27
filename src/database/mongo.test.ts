import { MONGODB_CONNECT } from './mongo';
import config from '../config';
import mongoose from 'mongoose';

jest.mock('mongoose');

describe('MongoDB Connection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.restoreAllMocks();
  });

  it('should have a valid mongo uri', () => {
    expect(config.mongo.uri).toBeTruthy();
  });

  // it('should handle connection errors', async () => {
  //     const mockError = new Error('Connection failed');
  //     (mongoose.connect as jest.Mock).mockRejectedValueOnce(mockError);

  //     const mockCallback = jest.fn();

  //     await expect(MONGODB_CONNECT(mockCallback)).rejects.toThrow('Error connecting to database');
  //     expect(mockCallback).not.toHaveBeenCalled();
  // });

  // it('should not connect if URI is invalid', async () => {
  //     const originalUri = config.mongo.uri;
  //     config.mongo.uri = '';

  //     (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error('Error connecting to database'));

  //     const mockCallback = jest.fn();
  //     await expect(MONGODB_CONNECT(mockCallback)).rejects.toThrow('Error connecting to database');

  //     config.mongo.uri = originalUri; // Restore original URI
  // });
});
