import { Mongoose } from 'mongoose';
import logger from './logger.ts';

const uri = process.env.DB_CONNECTION_STRING_MAIN;

const main = new Mongoose();
if (uri) {
  main
    .connect(uri)
    .then(() => logger.info('🛢️ Main db connected'))
    .catch((e) => logger.error(`DB connect error: ${e.message}`));
} else {
  logger.error('DB_CONNECTION_STRING_MAIN environment variable is not defined');
}

export default {
  main,
};
