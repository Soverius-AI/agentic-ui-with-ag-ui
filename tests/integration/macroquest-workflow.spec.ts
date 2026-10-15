import { expect, type APIRequestContext, type Page, test } from '@playwright/test';

async function expectRuntimeReady(request: APIRequestContext) {
  const runtimeHealth = await request.get('http://127.0.0.1:3210/health');
  expect(runtimeHealth.ok()).toBe(true);
  await expect(runtimeHealth.json()).resolves.toEqual(
    expect.objectContaining({
      ok: true,
      runtime: 'macroquest',
      modelBaseUrl: 'http://127.0.0.1:8080/v1',
      modelName: 'gemma-4-26b-a4b-it-qat',
    }),
  );
}

function collectConsoleErrors(page: Page) {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });
  return consoleErrors;
}

async function openMacroQuest(page: Page) {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'MacroQuest' })).toBeVisible();
  await expect(
    page.getByRole('textbox', {
      name: 'Ask Gemma about a meal...',
    }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: '0% on track' })).toBeVisible();
}

test('MacroQuest meal log updates trusted Angular state', async ({ page, request }) => {
  await expectRuntimeReady(request);
  const consoleErrors = collectConsoleErrors(page);

  await openMacroQuest(page);

  await page.getByRole('button', { name: "Load mock data" }).click();

  const draftCard = page.getByRole('button', { name: /Meal draft Muesli/ });
  await expect(draftCard).toBeVisible();
  await expect(draftCard).toContainText('368 kcal · 28g protein · 45g carbs · 8g fat');
  await expect(draftCard).toContainText('confirmed');

  // The servings workbench lives in the modal behind the meal-draft card.
  await draftCard.click();
  await expect(page.getByRole('heading', { name: 'Muesli', exact: true })).toBeVisible();

  // Honey is the second item. Halving it drops 15 kcal and 4 g carbs.
  await page.getByRole('spinbutton', { name: 'Servings' }).nth(1).fill('0.5');

  await expect(page.getByText('353 kcal', { exact: true })).toBeVisible();
  await expect(page.getByText('28g protein', { exact: true })).toBeVisible();
  await expect(page.getByText('41g carbs', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Confirm meal' }).click();

  await expect(draftCard).toContainText('confirmed');
  expect(consoleErrors).toEqual([]);
});
