// scenario_id: 0005 | version: 1 | scenario_sha256: fad8c8f37bf6a303b4b223b68aff953f7766f54904a4ff2f2edd75fd240b4f28
// target_flow: flows.md#socket-status-and-reconnect
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';

test.use({ video: 'on', trace: 'on' });

test('0005 Cockpit reconnects after a server socket kick', async ({ page, request }) => {
  await request.delete(`${API}/api/control/fault`);
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  const kick = await request.post(`${API}/api/control/fault`, { data: { kind: 'socket-kick' } });
  expect(kick.ok()).toBeTruthy();

  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
});
