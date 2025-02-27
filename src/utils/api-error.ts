import { HttpStatus } from './response.utils';

export class ApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode: number = HttpStatus.Success) {
    super(message);
    this.statusCode = statusCode;
  }
}
