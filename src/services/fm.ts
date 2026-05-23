import openai from '../lib/openai.ts';
import tools from '../lib/tools/tool-schema.ts';

type UserInputItem = { role: 'user'; content: string };
type ToolOutputItem = { type: 'function_call_output'; call_id: string; output: string };
type InputItem = UserInputItem | ToolOutputItem;

const FMService = {
  sendMessageStream(
    input: UserInputItem,
    opts: { previousResponseId?: string; instructions: string; withTools?: boolean },
  ) {
    return openai.responses.create({
      model: 'gpt-4o',
      instructions: opts.instructions,
      input: [input] as any,
      stream: true,
      ...(opts.withTools !== false && { tools: tools as any }),
      ...(opts.previousResponseId && { previous_response_id: opts.previousResponseId }),
    });
  },
  submitToolOutputsStream(
    outputs: ToolOutputItem[],
    previousResponseId: string,
    instructions?: string,
  ) {
    return openai.responses.create({
      model: 'gpt-4o',
      ...(instructions && { instructions }),
      input: outputs as any,
      tools: tools as any,
      previous_response_id: previousResponseId,
      stream: true,
    });
  },
};

export type { InputItem, ToolOutputItem, UserInputItem };
export default FMService;
