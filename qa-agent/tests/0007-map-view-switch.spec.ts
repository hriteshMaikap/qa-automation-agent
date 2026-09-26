// scenario_id: 0007 | version: 1 | scenario_sha256: df3b6710528ac745c11f71b8ef57cf3b4ec6e83b57cad383ba7babeddad45760
// target_flow: flows.md#map-device-and-track-visualization
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';

test.use({ video: 'on', trace: 'on' });

test('0007 operator can switch the live map to 2D view', async ({ page, request }) => {
  await request.delete(`${API}/api/control/fault`);
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  await expect(page.getByTestId('map-canvas')).toBeVisible({ timeout: 30000 });
  await page.getByTestId('map-view-2d').click();
  await expect(page.getByTestId('map-view-2d')).toHaveAttribute('aria-pressed', 'true');
});
