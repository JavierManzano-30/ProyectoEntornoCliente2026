import { test, expect } from '@playwright/test';

test.describe('BPM smoke', () => {
  test('carga el dashboard BPM', async ({ page }) => {
    await page.goto('/bpm');
    await expect(page.getByRole('heading', { name: 'Dashboard BPM' })).toBeVisible();
  });

  test('abre la bandeja de tareas', async ({ page }) => {
    await page.goto('/bpm/tareas');
    await expect(page.getByRole('heading', { name: 'Mis Tareas' })).toBeVisible();
  });
});
