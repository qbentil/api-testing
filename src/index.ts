import CreateServer from './utils/server';
import { MONGODB_CONNECT } from './database';
import config from './config';

const APP = CreateServer();

MONGODB_CONNECT(() => {
  APP.listen(config.app.port, () => {
    console.log(`[⚡🕹️]: Server is running on port ${config.app.port}`);
  });
});
