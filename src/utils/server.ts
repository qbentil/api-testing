import express, { Express, Request, Response } from 'express';

import { Errorhandler } from '../middlewares';
import { TODO_ROUTE } from '../routes';
import cors from 'cors';

const CreateServer = (): express.Application => {
const APP: Express = express();

APP.use(express.json());
APP.use(express.urlencoded({ extended: true }));
APP.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);



  APP.get('/api/heath', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Server is healthy'
    });
  });
  APP.use('/api/todo', TODO_ROUTE);
  
  
  // Error Handler
  APP.use(Errorhandler);

  return APP;
};

export default CreateServer;