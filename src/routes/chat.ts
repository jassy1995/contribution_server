import { Hono } from 'hono';
import ChatController from '../controllers/chat.ts';
import authenticate from '../middlewares/authenticate.ts';
import validate from '../middlewares/validate.ts';
import { chatSchema } from '../schemas/chat.ts';

const router = new Hono();

router.post('/', authenticate.user, validate('json', chatSchema), ChatController.chat);

export default router;
