import { Component, inject, viewChild } from '@angular/core';
import { CopilotChat } from '@copilotkit/angular';
import { MacroQuestStore } from '../application/macro-quest-store';
import { DemoMealPlates } from './demo-meal-plates';
import { MacroDashboard } from './macro-dashboard';
import { MealTimeline } from './meal-timeline';

@Component({
  selector: 'mq-shell',
  imports: [CopilotChat, DemoMealPlates, MacroDashboard, MealTimeline],
  templateUrl: './macroquest-shell.html',
})
export class MacroQuestShell {
  protected readonly chat = viewChild(CopilotChat);
  protected readonly store = inject(MacroQuestStore);
}
