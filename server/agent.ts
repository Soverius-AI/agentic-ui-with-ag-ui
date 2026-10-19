/**
 * The MacroQuest agent on the talk's starting branch. CopilotKit owns the
 * model call and tool selection. Meal analysis is a server-side tool.
 */
import { BuiltInAgent } from '@copilotkit/runtime/v2';
import { modelApiKey } from './config';

export const agent = new BuiltInAgent({
  model: `openai/google/gemma-4-26b-a4b-it`,
  apiKey: modelApiKey,
  prompt:
    'You are MacroQuest, you are a food logger. Only answer questions about food and similar things.',
});
