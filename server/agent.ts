/**
 * The MacroQuest agent on the talk's starting branch: every run is a chat
 * reply. The system prompt includes the Angular state snapshot. There are no
 * frontend tools, no A2UI surfaces, and no sandboxed widgets.
 */
import { randomUUID } from 'node:crypto';
import type { Context, Message } from '@ag-ui/core';
import { BuiltInAgent } from '@copilotkit/runtime/v2';
import { contextBlock, textChunk, toChatHistory } from './agui';
import { maxOutputTokens } from './config';
import { streamChat } from './model-client';
import { assistantCopy, buildChatSystemPrompt } from './prompts';

export const agent = new BuiltInAgent({
  type: 'custom',
  factory: async ({ input, abortSignal }) =>
    (async function* () {
      const messages = input.messages as Message[];
      const context = (input.context ?? []) as Context[];
      const messageId = randomUUID();

      try {
        const stream = streamChat({
          messages: [
            { role: 'system', content: buildChatSystemPrompt(contextBlock(context)) },
            ...toChatHistory(messages, 12),
          ],
          maxTokens: Math.min(maxOutputTokens, 768),
          temperature: 0.4,
          abortSignal,
        });
        for await (const delta of stream) {
          yield textChunk(messageId, delta);
        }
      } catch (error) {
        console.warn('Chat generation failed:', error);
        yield textChunk(messageId, assistantCopy.modelUnreachable);
      }
    })(),
});
