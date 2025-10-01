import { test, expect } from '@playwright/test';

test.describe('Character Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/generate');
    await page.evaluate(() => localStorage.clear());
  });

  test('should create a new character', async ({ page }) => {
    await page.getByRole('button', { name: /create first character/i }).click();

    // Fill form
    await page.getByLabel(/character name/i).fill('Aragorn');
    await page.getByLabel(/race/i).fill('Human');
    await page.getByLabel(/class/i).fill('Ranger');
    await page.getByLabel(/level/i).fill('15');
    await page.getByLabel(/backstory/i).fill('Heir of Isildur');

    // Submit
    await page.getByRole('button', { name: /create character/i }).click();

    // Verify character appears in selector
    await expect(page.getByText('Aragorn')).toBeVisible();
  });

  test('should edit an existing character', async ({ page }) => {
    // Create character first
    await page.getByRole('button', { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill('Legolas');
    await page.getByRole('button', { name: /create character/i }).click();

    // Click edit button
    await page.getByRole('button', { name: /edit character/i }).click();

    // Update name
    await page.getByLabel(/character name/i).fill('Legolas Greenleaf');
    await page.getByRole('button', { name: /update character/i }).click();

    // Verify updated name
    await expect(page.getByText('Legolas Greenleaf')).toBeVisible();
  });

  test('should delete a character', async ({ page }) => {
    // Create character
    await page.getByRole('button', { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill('Boromir');
    await page.getByRole('button', { name: /create character/i }).click();

    // Setup dialog handler
    page.on('dialog', (dialog) => dialog.accept());

    // Delete character
    await page.getByRole('button', { name: /delete character/i }).click();

    // Should show no character state
    await expect(page.getByText('No Character Selected')).toBeVisible();
  });

  test('should switch between characters', async ({ page }) => {
    // Create first character
    await page.getByRole('button', { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill('Frodo');
    await page.getByRole('button', { name: /create character/i }).click();

    // Create second character
    await page.getByRole('button', { name: /select character/i }).click();
    await page.getByRole('menuitem', { name: /create new character/i }).click();
    await page.getByLabel(/character name/i).fill('Sam');
    await page.getByRole('button', { name: /create character/i }).click();

    // Switch to Frodo
    await page.getByRole('button', { name: /sam/i }).click();
    await page.getByRole('menuitem', { name: /frodo/i }).click();

    // Verify active character
    await expect(page.getByRole('button', { name: /frodo/i })).toBeVisible();
  });

  test('should persist characters across page reload', async ({ page }) => {
    // Create character
    await page.getByRole('button', { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill('Gimli');
    await page.getByRole('button', { name: /create character/i }).click();

    // Reload page
    await page.reload();

    // Verify character persists
    await expect(page.getByText('Gimli')).toBeVisible();
  });
});
