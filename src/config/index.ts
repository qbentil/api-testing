import dotenv from 'dotenv';

dotenv.config();

type Config = {
  app: {
    env: string;
    port: number;
    name: string;
  };
  mongo: {
    uri: string;
  };
};

const config: Config = {
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000'),
    name: process.env.APP_NAME || ''
  },
  mongo: {
    uri: process.env.MONGO_URI || ''
  }
};

export default config;
