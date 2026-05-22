const { test, expect } = require('@playwright/test');

test('dashboard page loads and key UI elements are visible', async ({ page }) => {
  await page.goto('/dashboard');

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Product Dashboard' })).toBeVisible();
  await expect(page.locator('#product-list')).toBeVisible();
});
