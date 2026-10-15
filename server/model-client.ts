/**
 * Transport to the active OpenAI-compatible chat-completions endpoint
 * (local llama.cpp or OpenRouter). Callers pass fully composed prompts;
 * this module only speaks HTTP.
 */
import { completionUrl, modelApiKey, modelName, modelProvider } from './config';

function modelRequestHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    authorization: `Bearer ${modelApiKey}`,
  };
  if (modelProvider === 'openrouter') {
    headers['HTTP-Referer'] = 'http://127.0.0.1:4302';
    headers['X-Title'] = 'MacroQuest';
  }
  return headers;
}

async function* streamCompletionContent(
  requestBody: Record<string, unknown>,
  abortSignal: AbortSignal,
): AsyncGenerator<string> {
  const response = await fetch(completionUrl, {
    method: 'POST',
    headers: modelRequestHeaders(),
    body: JSON.stringify({
      model: modelName,
      ...requestBody,
      stream: true,
    }),
    signal: abortSignal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Model request failed: ${response.status} ${await response.text()}`);
  }

  const decoder = new TextDecoder();
  let buffer = '';

  for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
    buffer += decoder.decode(chunk, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);

      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;

      try {
        const delta = JSON.parse(data).choices?.[0]?.delta?.content;
        if (typeof delta === 'string' && delta) {
          yield delta;
        }
      } catch {
        // partial line; ignore
      }
    }
  }
}

/** Streams a plain chat completion, yielding text deltas as they arrive. */
export function streamChat(options: {
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  maxTokens: number;
  temperature: number;
  abortSignal: AbortSignal;
}): AsyncGenerator<string> {
  return streamCompletionContent(
    {
      messages: options.messages,
      max_tokens: options.maxTokens,
      temperature: options.temperature,
    },
    options.abortSignal,
  );
}
