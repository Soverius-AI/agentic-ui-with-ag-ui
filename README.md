# Agentic UI with Angular and CopilotKit

Example code for the article [Agentic UI with Angular and CopilotKit](https://soverius.ai/blog/agentic-ui-with-angular-and-copilotkit).

## Chapter branches

Each branch contains the code up to and including that chapter:

- [Starting with a Basic Chat](https://github.com/Soverius-AI/agentic-ui-with-ag-ui/tree/article/01-basic-chat)
- [Agent Context — A Shared Understanding](https://github.com/Soverius-AI/agentic-ui-with-ag-ui/tree/article/02-agent-context)
- [Frontend Tool Calling](https://github.com/Soverius-AI/agentic-ui-with-ag-ui/tree/article/03-frontend-tool-calling)
- [Backend Tool Calling](https://github.com/Soverius-AI/agentic-ui-with-ag-ui/tree/article/04-backend-tool-calling)
- [Human in the Loop](https://github.com/Soverius-AI/agentic-ui-with-ag-ui/tree/article/05-human-in-the-loop)
- [Activity Messages](https://github.com/Soverius-AI/agentic-ui-with-ag-ui/tree/article/06-activity-messages)

## Model

OpenRouter is the default setup. Install dependencies with `pnpm install`, copy `.env.example` to `.env`, and configure your OpenRouter key and Gemma 4 model:

```dotenv
COPILOT_MODEL_PROVIDER=openrouter
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it
```

Run `pnpm run start:all:openrouter`.

Alternatively, use local inference with llama.cpp. Install llama.cpp, set `COPILOT_MODEL_PROVIDER=local` in `.env`, and run `pnpm run start:all`. The local server script downloads the Gemma 4 model on first use.

Open the application at http://127.0.0.1:4302.
