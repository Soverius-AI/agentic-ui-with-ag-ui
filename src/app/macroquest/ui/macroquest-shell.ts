import { Component, inject, viewChild } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';
import { MacroQuestStore } from '../application/macro-quest-store';
import { MacroDashboard } from './macro-dashboard';
import { MealTimeline } from './meal-timeline';
import { DemoMealPlates } from './demo-meal-plates';

@Component({
  selector: 'mq-shell',
  imports: [MacroDashboard, MealTimeline, DemoMealPlates, CopilotChat],
  templateUrl: './macroquest-shell.html',
})
export class MacroQuestShell {
  protected readonly chat = viewChild(CopilotChat);
  protected readonly store = inject(MacroQuestStore);
}
