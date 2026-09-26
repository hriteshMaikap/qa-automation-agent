// scenario_id: 0006 | version: 1 | scenario_sha256: 5b88ebfeaaeb5e1ce0dbfc56917b2f12357a45cbfca4ac2e4af0ba6de2c739c3
// target_flow: flows.md#cockpit-connects-and-loads-devices
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';

test.use({ video: 'on', trace: 'on' });

test('0006 Cockpit loads the connected device list', async ({ page, request }) => {
  await request.delete(`${API}/api/control/fault`);
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  await expect(page.getByTestId('device-row-drone-1')).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('device-row-drone-4')).toBeVisible({ timeout: 30000 });
  await expect(page.getByTestId('device-row-drone-1').locator('.pill:last-child')).toBeVisible();
  await expect(page.getByTestId('device-row-drone-4').locator('.pill:last-child')).toBeVisible();

});
