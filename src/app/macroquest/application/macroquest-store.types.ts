import { Signal } from '@angular/core';
import {
  MacroGoals,
  MacroQuestState,
  MacroTotals,
  MealDraftInput,
  MealEntry,
} from '../domain/macroquest.models';

export type MacroQuestStateSlice = Pick<MacroQuestState, 'activeDate' | 'goals'>;

export interface MacroQuestDerivedSignals {
  activeMeals: Signal<MealEntry[]>;
  dailyTotals: Signal<MacroTotals>;
  remaining: Signal<MacroTotals>;
  selectedMeal: Signal<MealEntry | undefined>;
}

/**
 * Declared as a `type`, not an `interface`, so it keeps an implicit index
 * signature and stays assignable to NgRx's `MethodsDictionary` when used as a
 * `signalStoreFeature` input.
 */
export type MacroQuestMethods = {
  applyMealDraft(input: MealDraftInput): MealEntry;
  setGoals(goals: Partial<MacroGoals>): void;
};
