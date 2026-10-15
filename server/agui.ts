/**
 * AG-UI message plumbing: reading the run input (messages, context) and
 * emitting the text events the agent streams back. No model calls and no
 * business logic live here.
 */
import { EventType } from '@ag-ui/core';
import type {
  AssistantMessage,
  Context,
  Message,
  TextMessageChunkEvent,
  UserMessage,
} from '@ag-ui/core';

export function userText(content: UserMessage['content']): string {
  if (typeof content === 'string') return content;
  return content
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n');
}

export function userImageUrl(content: UserMessage['content']): string | undefined {
  if (typeof content === 'string') return undefined;
  const image = content.find((part) => part.type === 'image');
  if (!image) return undefined;
  return image.source.type === 'data'
    ? `data:${image.source.mimeType};base64,${image.source.value}`
    : image.source.value;
}

export const isUser = (message: Message): message is UserMessage => message.role === 'user';
export const isAssistant = (message: Message): message is AssistantMessage =>
  message.role === 'assistant';

export type ChatHistoryMessage = { role: 'user' | 'assistant'; content: string };

/**
 * Conversation history as plain chat messages for the model. Tool traffic is
 * skipped; attached images are replaced with a marker so the text history
 * stays small.
 */
export function toChatHistory(messages: Message[], limit: number): ChatHistoryMessage[] {
  const history: ChatHistoryMessage[] = [];

  for (const message of messages) {
    if (isUser(message)) {
      const marker = userImageUrl(message.content) ? '\n[user attached a food photo]' : '';
      const text = `${userText(message.content)}${marker}`.trim();
      if (text) history.push({ role: 'user', content: text });
    } else if (isAssistant(message) && message.content?.trim()) {
      history.push({ role: 'assistant', content: message.content });
    }
  }

  return history.slice(-limit);
}

/**
 * Trusted Angular store state forwarded by the frontend via
 * connectAgentContext. This is what lets the model answer questions about
 * logged meals, goals, and remaining macros.
 */
export function contextBlock(context: Context[]): string {
  const lines = context
    .filter((entry) => entry.value.trim())
    .map((entry) => `- ${entry.description || 'context'}: ${entry.value}`);

  return lines.length > 0 ? `Trusted app state:\n${lines.join('\n')}` : '';
}

// ---------------------------------------------------------------------------
// Outgoing AG-UI events
// ---------------------------------------------------------------------------

export function textChunk(messageId: string, delta: string): TextMessageChunkEvent {
  return {
    type: EventType.TEXT_MESSAGE_CHUNK,
    role: 'assistant',
    messageId,
    delta,
  };
}
