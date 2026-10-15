# MacroQuest talk script

The `init` branch contains beats 1 and 2. Beats 3 through 6 are not in this branch.

Five beats, then one optional closer. Each beat adds one idea. Load mock data and stay on Today before you start.

Say the names out loud the first time they appear:

- **Agentic UI** is the product: a person and an agent share one screen.
- **AG-UI** is the protocol that carries messages, the state snapshot, and tool calls.
- **Human in the loop** is a pause before a write. The chat is where it shows up. The pause is the feature.
- **Generative UI** is the family name.
- **A2UI** is the declarative band: the model fills a catalog the app already renders.
- **Open Generative UI** is the open band: the model writes a page, and the app runs it in a sandbox.

The four pills on the empty chat are prewritten prompts. Say that before anyone clicks one, or they will be taken for generated UI. Leave **Lighter swap** and **Chart my macros** unclicked until the closer.

## 1. Chat and a system prompt

Ask something the log cannot answer, for example: "What does this app track?"

The answer comes from the system prompt in `buildChatSystemPrompt`. Nothing on the dashboard moves. This already works.

## 2. The state snapshot

Ask: "How much can I still eat today?"

The same chat now answers from the NgRx snapshot attached by `connectAgentContext`. On the mock day that is 0 kcal left and 38 g of protein left. The server does not read the store. It receives a copy on that run.

Do not ask about yesterday yet. The snapshot only contains the day on screen.

## 3. A frontend tool

Say: "Switch to yesterday."

The day arrows move, and Yesterday's log is on screen (2207 kcal). Ask how much is left again. The numbers change because the next run brought a new snapshot, not because the server remembered the log.

`showPreviousDay` exists on the store. It is not a CopilotKit tool yet, so this beat still has to be built.

## 4. Human in the loop

Ask to add a meal, already behind a confirmation. The tool that only switches the day runs immediately. The tool that writes the log waits.

Do not show a silent add first, and do not put a second confirmation on the A2UI Apply button later.

This beat is not built. The snapshot has meal totals for the active day only, so a copy such as "add the muesli from yesterday" cannot be done from the current context.

## 5. A2UI, inside the chat

Say: "Analyze a grilled chicken bowl with rice and beans."

A card appears in the chat. Click Apply. The dashboard updates. Say that the model drew the card from the catalog, and the button writes back through a tool. This beat is not on the `init` branch.

## 6. Closer, if there is a minute: Open Generative UI

Name the sandbox before you click. Then ask for the macro chart.

The chart only reads the snapshot and draws a picture the app did not design. The swap lab is the deeper example, because its button may call only `applyMacroSwap`, but it is model-written JavaScript and the beat most likely to fail live. Show the chart.

## Leave out

- "How much did I eat yesterday?" while Today is still on screen.
- A generated card placed on the dashboard. The page already shows meals outside the chat, so that looks like the existing layout.
- The swap lab, unless the chart has already landed and you still want the sandbox boundary.
- Calling human in the loop "chat UI", or calling agentic UI "AG-UI".
