import { OpenAI } from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
const organization = process.env.OPENAI_ORGANIZATION;

const openai = new OpenAI({
  apiKey,
  organization,
});

export default openai;
