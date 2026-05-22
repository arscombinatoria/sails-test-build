const { test, expect } = require('@playwright/test');

test('dashboard page loads and key UI elements are visible', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Product Dashboard' })).toBeVisible();
  await expect(page.locator('#product-list')).toBeVisible();
});
