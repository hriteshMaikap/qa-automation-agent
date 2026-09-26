// scenario_id: 0001 | version: 1 | scenario_sha256: 7a3b47f629b15982d97a609ef5a4f57abf5961727fea1c07c74ff7bb0388a9da
// target_flow: flows.md#takeoff-produces-in-air-flight-status
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';

test.use({
  video: 'on',
  trace: 'on',
});

test('0001 takeoff changes the selected drone to in-flight', async ({ page, request }) => {
  // Preconditions: simulator_reset, simulator_started, faults_cleared.
  await request.delete(`${API}/api/control/fault`);
  const reset = await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } });
  expect(reset.ok()).toBeTruthy();
  const start = await request.post(`${API}/api/control/sim`, { data: { action: 'start' } });
  expect(start.ok()).toBeTruthy();

  // Preconditions: cockpit_loaded, drone_1_selected.
  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  await expect(page.getByTestId('device-row-drone-1')).toBeVisible({ timeout: 30000 });
  await page.getByTestId('device-row-drone-1').click();
  await expect(page.getByTestId('status-flight')).toHaveText('standby');

  // Scenario action: API command, not a UI click.
  const takeoff = await request.post(`${API}/api/control/command`, {
    data: { deviceId: 'drone-1', type: 'takeoff' },
  });
  expect(takeoff.ok()).toBeTruthy();

  // Assertion: [data-testid="status-flight"] eventually equals in_flight.
  await expect(page.getByTestId('status-flight')).toHaveText('in_flight', { timeout: 30000 });
});
