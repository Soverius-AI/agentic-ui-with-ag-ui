import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideCopilotChatLabels, provideCopilotKit } from '@copilotkit/angular';
import { mockMealsInterceptor } from './macroquest/application/mock-meals.interceptor';

if (typeof globalThis.fetch === 'function') {
  globalThis.fetch = globalThis.fetch.bind(globalThis);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([mockMealsInterceptor])),
    provideCopilotKit({
      runtimeUrl: 'http://127.0.0.1:3210/api/copilotkit',
      suggestionsConfig: [
        {
          available: 'before-first-message',
          suggestions: [
            {
              title: 'What does this track?',
              message: 'What does this app track?',
            },
            {
              title: 'How much is left?',
              message: 'How much can I still eat today?',
            },
          ],
        },
      ],
    }),
    provideCopilotChatLabels({
      chatInputPlaceholder: 'Ask Gemma about a meal...',
      chatDisclaimerText:
        'MacroQuest estimates nutrition for demo purposes and is not medical advice.',
    }),
  ],
};
