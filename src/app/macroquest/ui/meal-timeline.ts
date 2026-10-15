import { Component, input, output } from '@angular/core';
import { MealEntry } from '../domain/macroquest.models';
import { getMealTotals } from '../domain/nutrition';

@Component({
  selector: 'mq-meal-timeline',
  templateUrl: './meal-timeline.html',
})
export class MealTimeline {
  readonly meals = input.required<MealEntry[]>();
  readonly selectedMealId = input.required<string>();
  readonly dayLabel = input.required<string>();
  readonly canGoPreviousDay = input.required<boolean>();
  readonly canGoNextDay = input.required<boolean>();

  readonly mealSelected = output<string>();
  readonly previousDay = output<void>();
  readonly nextDay = output<void>();

  protected mealTotals(meal: MealEntry) {
    return getMealTotals(meal);
  }
}
