import { NextFunction, Request, Response } from 'express';

import { AppConstants } from '../constants';

export const ValidationMiddleware = (
  schema: any,
  property: string = AppConstants.REQUEST_TYPE.BODY
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = {
        abortEarly: true, 
        allowUnknown: false, 
        convert: true
      };

      // @ts-ignore
      const { error } = schema.validate(req[property], options);
      if (!error) {
        return next();
      }

      const messages = error.details.map((err: any) => err.message).join(',');
      res.status(400).json({ message: messages });
    } catch (error) {
      return next(error);
    }
  };
};
