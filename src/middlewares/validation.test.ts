import { AppConstants } from '../constants';
import Joi from 'joi';
import { ValidationMiddleware } from '../middlewares';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
});

app.post('/test', ValidationMiddleware(schema), (req, res) => {
    res.status(200).json({ success: true, data: req.body });
});

describe('ValidationMiddleware', () => {
    it('should pass with valid request body', async () => {
        const validData = {
            title: 'Valid Title',
            description: 'Valid Description'
        };

        const response = await request(app)
            .post('/test')
            .send(validData)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(validData);
    });

    it('should return 400 if required fields are missing', async () => {
        const invalidData = { title: 'Title Only' }; 

        const response = await request(app)
            .post('/test')
            .send(invalidData)
            .expect(400);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(/"description" is required/i);
    });

    it('should return 400 if unknown fields are provided', async () => {
        const invalidData = {
            title: 'Title',
            description: 'Description',
            extraField: 'Not Allowed'
        };

        const response = await request(app)
            .post('/test')
            .send(invalidData)
            .expect(400);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(/"extraField" is not allowed/i);
    });

    it('should handle Joi validation errors gracefully', async () => {
        const invalidData = {};

        const response = await request(app)
            .post('/test')
            .send(invalidData)
            .expect(400);

        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(/"title" is required/i);
    });
});
