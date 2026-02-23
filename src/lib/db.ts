import { Mongoose } from 'mongoose';
import logger from './logger.ts';

const uri = process.env.DB_CONNECTION_STRING_MAIN;

if (!uri) {
  throw new Error('DB_CONNECTION_STRING_MAIN environment variable is not defined');
}

const main = new Mongoose();
main.connect(uri).then(() => logger.info('🛢️ Main db connected'));

export default {
  main,
};
