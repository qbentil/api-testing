import { NextFunction, Request, Response } from "express";

import { Errorhandler } from "./error-handler";

describe('Error Handler Middleware', () => {
    it('should handle errors and send correct response', () => {
        const mockError = new Error('Test Error');
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        Errorhandler(mockError, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Test Error',
            success: false,
            stack: expect.any(String)
        });
    });
});