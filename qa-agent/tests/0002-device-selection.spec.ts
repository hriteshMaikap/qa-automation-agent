// scenario_id: 0002 | version: 1 | scenario_sha256: b0d2c3eae72460c0d702647cb4366b6950b7124ad7d485c27c7d76d7f751e04e
// target_flow: flows.md#device-selection-and-map-pan
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';

test.use({ video: 'on', trace: 'on' });

test('0002 selecting a device updates the Cockpit detail panels', async ({ page, request }) => {
  await request.delete(`${API}/api/control/fault`);
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  await page.getByTestId('device-row-drone-2').click();

  await expect(page.locator('h2.panel-title > span:first-child')).toHaveText('Drone Telemetry · Drone 2');
  await expect(page.locator('.video-header')).toContainText('FPV · Drone 2');
});
