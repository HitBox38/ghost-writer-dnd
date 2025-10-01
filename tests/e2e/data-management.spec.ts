import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Data Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/generate');
    await page.evaluate(() => localStorage.clear());
  });

  test('should export data as JSON', async ({ page }) => {
    // Create a character first
    await page.getByRole('button', { name: /create first character/i }).click();
    await page.getByLabel(/character name/i }).fill('Test Character');
    await page.getByRole('button', { name: /create character/i }).click();

    // Open settings
    await page.getByRole('button', { name: /settings/i }).click();
    await page.getByRole('tab', { name: 'Data' }).click();

    // Setup download handler
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /download backup json/i }).click();
    const download = await downloadPromise;

    // Verify download
    expect(download.suggestedFilename()).toMatch(/dnd-flavor-backup-.*\.json/);
  });

  test('should import data from JSON', async ({ page }) => {
    const testData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      characters: [
        {
          id: '1',
          name: 'Imported Character',
          class: 'Paladin',
          race: 'Human',
          level: 10,
          backstory: 'Imported',
          appearance: 'Shiny armor',
          worldSetting: 'Test World',
          favorites: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
      settings: {
        provider: 'openai',
        temperature: 0.7,
      },
    };

    // Create temp file
    const dataStr = JSON.stringify(testData);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const file = new File([blob], 'test-backup.json', { type: 'application/json' });

    // Open settings
    await page.getByRole('button', { name: /settings/i }).click();
    await page.getByRole('tab', { name: 'Data' }).click();

    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-backup.json',
      mimeType: 'application/json',
      buffer: Buffer.from(dataStr),
    });

    // Wait for import toast
    await expect(page.getByText(/data imported successfully/i)).toBeVisible();

    // Verify character was imported
    await expect(page.getByText('Imported Character')).toBeVisible();
  });

  test('should clear all data with confirmation', async ({ page }) => {
    // Create a character
    await page.getByRole('button', { name: /create first character/i }).click();
    await page.getByLabel(/character name/i).fill('To Be Deleted');
    await page.getByRole('button', { name: /create character/i }).click();

    // Open settings
    await page.getByRole('button', { name: /settings/i }).click();
    await page.getByRole('tab', { name: 'Data' }).click();

    // Setup confirmation dialog
    page.on('dialog', (dialog) => {
      expect(dialog.message()).toContain('clear ALL data');
      dialog.accept();
    });

    // Clear data
    await page.getByRole('button', { name: /clear all data/i }).click();

    // Verify data is cleared
    await expect(page.getByText('No Character Selected')).toBeVisible();
  });
});
