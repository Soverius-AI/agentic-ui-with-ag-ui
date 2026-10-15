/**
 * The MacroQuest agent on the talk's starting branch. CopilotKit owns the
 * model call. This file only names the model.
 */
import { BuiltInAgent } from '@copilotkit/runtime/v2';
import { modelApiKey, modelName } from './config';

export const agent = new BuiltInAgent({
  model: `openai/${modelName}`,
  apiKey: modelApiKey,
});
