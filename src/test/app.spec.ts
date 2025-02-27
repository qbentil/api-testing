// test/app.test.ts

import CreateServer from '../utils/server';
import request from 'supertest';

describe('CreateServer', () => {
  const APP = CreateServer();
  it('should return a 200 status code for health', async () => {
    const res = await request(APP).get('/api/heath');
    expect(res.status).toEqual(200);
  });
  it('should respond with 404 on a nonexistent route', async () => {
    const response = await request(APP).get('/api/v1/nonexistent');
    expect(response.status).toEqual(404);
  });
});
