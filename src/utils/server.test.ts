import CreateServer from './server';

describe('CreateServer', () => {
  const APP = CreateServer();

  it('should create an express app', () => {
    expect(APP).toBeInstanceOf(Function);
  });
  it('should use express.json middleware', () => {
    expect(APP._router.stack[2].handle.name).toBe('jsonParser');
  });

  it('should use express.urlencoded middleware', () => {
    expect(APP._router.stack[3].handle.name).toBe('urlencodedParser');
  });

  it('should use Cors middleware', () => {
    expect(APP._router.stack[4].handle.name).toBe('corsMiddleware');
  });

  it('should use ROUTES middleware', () => {
    expect(APP._router.stack[6].name).toBe('router');
  });

  it('should use ErrorHandler middleware', () => {
    expect(APP._router.stack[7].handle.name).toBe('Errorhandler');
  });
});
