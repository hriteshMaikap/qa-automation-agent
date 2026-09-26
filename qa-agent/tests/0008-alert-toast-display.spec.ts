// scenario_id: 0008 | version: 1 | scenario_sha256: decbac2eeaea4ca3a2c05fce849eeec2b77868f3e81aab2e548af43614e4934c
// target_flow: flows.md#alert-toast-display-and-dismissal
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';

test.use({ video: 'on', trace: 'on' });

test('0008 takeoff alert is shown in the Cockpit', async ({ page, request }) => {
  await request.delete(`${API}/api/control/fault`);
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  await page.getByTestId('device-row-drone-1').click();
  const takeoff = await request.post(`${API}/api/control/command`, {
    data: { deviceId: 'drone-1', type: 'takeoff' },
  });
  expect(takeoff.ok()).toBeTruthy();

  await expect(page.getByTestId('alert-toast')).toContainText('drone-1 Drone 1 taking off', { timeout: 10000 });
});
