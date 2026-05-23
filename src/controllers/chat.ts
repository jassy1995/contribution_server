import type { Context } from 'hono';
import { streamSSE } from 'hono/streaming';
import ChatService from '../services/chat.ts';
import { ChatBody } from '../schemas/chat.ts';

const ChatController = {
  chat(c: Context) {
    const user: any = c.get('user');
    const body = c.req.valid('json' as never) as ChatBody;
    const { message, chatId } = body;

    return streamSSE(c, async (stream) => {
      try {
        for await (const event of ChatService.chatStream(user.id, message, chatId)) {
          await stream.writeSSE({
            event: event.type,
            data: JSON.stringify(event),
          });
        }
      } catch (err: any) {
        await stream.writeSSE({
          event: 'error',
          data: JSON.stringify({
            type: 'error',
            message: err?.message ?? 'An error occurred while generating a response.',
          }),
        });
      }
    });
  },
};

export default ChatController;
