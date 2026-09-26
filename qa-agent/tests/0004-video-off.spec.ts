// scenario_id: 0004 | version: 1 | scenario_sha256: 63c53866bb3eec97cd898456c794886fa4b61354a6a912f9b2b50756f168a9d2
// target_flow: flows.md#fpv-video-display-and-recovery
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';

test.use({ video: 'on', trace: 'on' });

test('0004 disabled selected-drone video shows the off state', async ({ page, request }) => {
  await request.delete(`${API}/api/control/fault`);
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  await page.getByTestId('device-row-drone-1').click();
  const stop = await request.post(`${API}/api/control/video`, { data: { action: 'stop', deviceId: 'drone-1' } });
  expect(stop.ok()).toBeTruthy();

  await expect(page.getByTestId('video-state')).toHaveText('off', { timeout: 10000 });
  await expect(page.getByTestId('video-player')).toHaveText('Video off');
});
