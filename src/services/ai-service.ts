import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export interface AIService {
  generateContent(prompt: string): Promise<string>;
}

export class GeminiService implements AIService {
  constructor(private apiKey: string, private model: string) {}

  async generateContent(prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(this.apiKey);
    const modelName = this.model === 'gemini-1.5-flash' ? 'gemini-1.5-pro' : 'gemini-pro';
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

export class OpenAIService implements AIService {
  constructor(private apiKey: string, private model: string) {}

  async generateContent(prompt: string): Promise<string> {
    const client = new OpenAI({ apiKey: this.apiKey });
    const response = await client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }]
    });
    return response.choices[0].message.content || '';
  }
}

export function createAIService(provider: string, apiKey: string, model: string): AIService {
  switch (provider) {
    case 'gemini':
      return new GeminiService(apiKey, model);
    case 'openai':
      return new OpenAIService(apiKey, model);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}