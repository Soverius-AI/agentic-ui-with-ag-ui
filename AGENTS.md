# MacroQuest implementation guidance

This branch is the talk's starting point. MacroQuest is an Angular 22 meal log
with a CopilotKit chat and an NgRx Signal Store. The agent answers from a
system prompt and the store snapshot. A2UI, Open Generative UI, and frontend
tools are intentionally absent. Add one of them only when implementing that
beat in `talk-script.md`. Keep implementation changes small, visible, and
reliable enough for a live talk.

The Angular feature lives under `src/app/macroquest/`. Preserve its existing
boundaries: pure nutrition types and calculations belong in `domain/`, state
and CopilotKit integration belong in `application/`, and standalone Angular UI
belongs in `ui/`. `MacroQuestStore` composes `withMacroQuest()` before
`withCopilotKit()` because the CopilotKit feature consumes the store state and
methods established by the domain feature.

The runtime under `server/` streams chat text through CopilotKit. It reads the
store snapshot from `input.context` and does not emit tool calls.

Use the repository's Angular 22 and signal-based patterns. Preserve keyboard
and assistive-technology behavior for UI changes. Do not alter secrets, local
model files, generated build output, or presentation assets unless the issue
explicitly requires it.

Before finishing, run `pnpm build`. Run focused tests relevant to the change
when available. Do not start or download a model unless the issue explicitly
requires live-model validation.
