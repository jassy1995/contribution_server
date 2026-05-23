import ChatDao from '../dao/chat.ts';
import systemPrompt from '../lib/prompts/system.ts';
import FMService, { type ToolOutputItem } from './fm.ts';
import { MAX_TOOL_ITERATIONS } from '../config/constants.ts';
import executeToolCall from '../lib/tools/tool-function.ts';
import { normalizeCurrencyInText, formatAmount } from '../helpers/currency.ts';
import ContributionDao from '../dao/contribution.ts';
import { isAllTimeContributionQuery } from '../helpers/query-intent.ts';

export type ChatStreamEvent =
  | { type: 'chunk'; content: string }
  | { type: 'status'; message: string }
  | { type: 'done'; chatId: string; reply: string }
  | { type: 'error'; message: string };

const UNAVAILABLE_MESSAGE =
  'Sorry, I could not retrieve a response. Please try again or rephrase your question.';

const getResponseText = (response: any, streamedText: string): string => {
  if (response?.output_text) return response.output_text;
  if (streamedText) return streamedText;

  const output = response?.output as any[] | undefined;
  if (!output) return '';

  return output
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content ?? [])
    .filter((part) => part.type === 'output_text')
    .map((part) => part.text)
    .join('');
};

const ChatService = {
  async *chatStream(
    userId: string,
    userMessage: string,
    chatId?: string,
  ): AsyncGenerator<ChatStreamEvent> {
    let previousResponseId: string | undefined;

    if (chatId) {
      const session = await ChatDao.getOne({ _id: chatId, user: userId });
      if (session) previousResponseId = session.latestResponseId;
    }

    if (isAllTimeContributionQuery(userMessage)) {
      yield { type: 'status', message: 'Fetching data...' };

      const result = await ContributionDao.getSum({});
      const total = result?.[0]?.total ?? 0;
      const reply = `The total amount contributed across all records is ${formatAmount(total)}.`;

      yield { type: 'chunk', content: reply };

      const stream = await FMService.sendMessageStream(
        { role: 'user', content: userMessage },
        {
          previousResponseId,
          instructions: `${systemPrompt()}\n\nThe verified all-time contribution grand total is ${formatAmount(total)}. Confirm this exact amount in your reply.`,
          withTools: false,
        },
      );

      let fmResponse: any;
      for await (const event of stream) {
        if (event.type === 'response.completed') fmResponse = event.response;
      }

      if (!fmResponse?.id) {
        yield { type: 'error', message: UNAVAILABLE_MESSAGE };
        return;
      }

      let savedChatId: string;
      if (chatId && previousResponseId) {
        await ChatDao.update(chatId, { latestResponseId: fmResponse.id });
        savedChatId = chatId;
      } else {
        const session = await ChatDao.create({
          user: userId,
          latestResponseId: fmResponse.id,
          title: userMessage.slice(0, 120),
        });
        savedChatId = (session._id as any).toString();
      }

      yield { type: 'done', chatId: savedChatId, reply };
      return;
    }

    let response: any;
    let toolOutputs: ToolOutputItem[] | null = null;
    let parentResponseId: string | undefined;
    let isFirstMessage = true;
    let finalStreamedReply = '';

    for (let iterations = 0; iterations < MAX_TOOL_ITERATIONS; iterations++) {
      const stream = isFirstMessage
        ? await FMService.sendMessageStream(
            { role: 'user', content: userMessage },
            { previousResponseId, instructions: systemPrompt() },
          )
        : await FMService.submitToolOutputsStream(
            toolOutputs!,
            parentResponseId!,
            systemPrompt(),
          );

      isFirstMessage = false;

      let rawReply = '';
      let lastNormalized = '';

      for await (const event of stream) {
        if (event.type === 'response.output_text.delta') {
          rawReply += event.delta;
          const normalized = normalizeCurrencyInText(rawReply);
          const chunk = normalized.slice(lastNormalized.length);
          lastNormalized = normalized;
          if (chunk) yield { type: 'chunk', content: chunk };
        }

        if (event.type === 'response.completed') {
          response = event.response;
        }
      }

      if (!response?.output) {
        yield { type: 'error', message: UNAVAILABLE_MESSAGE };
        return;
      }

      const functionCalls = (response.output as any[]).filter(
        (item: any) => item.type === 'function_call',
      );

      if (functionCalls.length === 0) {
        finalStreamedReply = rawReply;
        break;
      }

      yield { type: 'status', message: 'Fetching data...' };

      toolOutputs = await Promise.all(
        functionCalls.map(async (tc: any) => ({
          type: 'function_call_output' as const,
          call_id: tc.call_id,
          output: await executeToolCall(tc.name, JSON.parse(tc.arguments), userMessage),
        })),
      );

      parentResponseId = response.id;
    }

    const replyText = getResponseText(response, finalStreamedReply).trim();
    if (!replyText) {
      yield { type: 'error', message: UNAVAILABLE_MESSAGE };
      return;
    }

    const reply = normalizeCurrencyInText(replyText);

    if (!response?.id) {
      yield { type: 'error', message: UNAVAILABLE_MESSAGE };
      return;
    }

    let savedChatId: string;

    if (chatId && previousResponseId) {
      await ChatDao.update(chatId, { latestResponseId: response.id });
      savedChatId = chatId;
    } else {
      const session = await ChatDao.create({
        user: userId,
        latestResponseId: response.id,
        title: userMessage.slice(0, 120),
      });
      savedChatId = (session._id as any).toString();
    }

    yield { type: 'done', chatId: savedChatId, reply };
  },
};

export default ChatService;
