import { computed } from '@angular/core';
import { type AttachmentsConfig, connectAgentContext } from '@copilotkit/angular';
import { signalStoreFeature, type, withHooks, withProps } from '@ngrx/signals';
import { getMealTotals } from '../../domain/nutrition';
import { MacroQuestDerivedSignals, MacroQuestStateSlice } from '../macroquest-store.types';

/**
 * Forwards the store snapshot to the CopilotKit agent. Must be composed after
 * {@link withMacroQuest}. The `onInit` hook supplies the injection context
 * `connectAgentContext` requires.
 */
export function withCopilotKit() {
  return signalStoreFeature(
    {
      state: type<MacroQuestStateSlice>(),
      props: type<MacroQuestDerivedSignals>(),
    },
    withProps(() => ({
      mealPhotoAttachments: {
        enabled: true,
        accept: 'image/png,image/jpeg,image/webp',
        // Demo plates in public/meals include ~10MB JPEGs.
        maxSize: 12 * 1024 * 1024,
      } satisfies AttachmentsConfig as AttachmentsConfig,
    })),
    withHooks({
      onInit(store) {
        const agentContext = computed(() => {
          const selectedMeal = store.selectedMeal();

          return {
            description:
              'MacroQuest trusted Angular state from NgRx Signal Store. Use these exact values when answering questions about the meal log.',
            value: JSON.stringify({
              activeDate: store.activeDate(),
              goals: store.goals(),
              dailyTotals: store.dailyTotals(),
              remaining: store.remaining(),
              selectedMeal: selectedMeal
                ? {
                    title: selectedMeal.title,
                    status: selectedMeal.status,
                    totals: getMealTotals(selectedMeal),
                  }
                : null,
              meals: store
                .activeMeals()
                .slice(0, 12)
                .map((meal) => ({
                  title: meal.title,
                  capturedAt: meal.capturedAt,
                  status: meal.status,
                  totals: getMealTotals(meal),
                })),
            }),
          };
        });

        connectAgentContext(agentContext);
      },
    }),
  );
}
