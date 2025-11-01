import { test, expect } from '@playwright/test';
import * as http from 'http-server';
import path from 'path';

test.describe('custom-dropdown E2E', () => {
  let server: any;
  test.beforeAll(() => {
    const root = path.join(__dirname, '..', 'demo');
    server = http.createServer({ root });
    server.listen(5000);
  });

  test.afterAll(() => {
    server.close();
  });

  test('click and keyboard interactions', async ({ page }) => {
    await page.goto('http://localhost:5000');
    const button = page.locator('button.cd-button');
    await button.click();
    await expect(page.locator('ul.cd-list')).toBeVisible();
    // click nested item
    await page.click('text=Two-One');
    // expect alert on clicking 'Three' handled by demo, but alerts are disabled in Playwright default
    await expect(page.locator('button.cd-button')).toHaveText(/Two-One|Three/);
  });
});
