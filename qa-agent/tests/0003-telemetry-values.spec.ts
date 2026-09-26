// scenario_id: 0003 | version: 1 | scenario_sha256: a41864a01cd0442fcd1acccc64f51948b9d13849d824d3554d6ea4117714e481
// target_flow: flows.md#drone-telemetry-display
import { test, expect } from '@playwright/test';

const API = 'http://localhost:4000';
const POPULATED_TELEMETRY = [
  'telemetry-alt-rlt',
  'telemetry-alt-agl',
  'telemetry-alt-asl',
  'telemetry-hspeed',
  'telemetry-vspeed',
  'telemetry-heading',
  'telemetry-wind',
  'telemetry-home-distance',
];

test.use({ video: 'on', trace: 'on' });

test('0003 selected drone telemetry renders published values', async ({ page, request }) => {
  await request.delete(`${API}/api/control/fault`);
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();

  await page.goto('/');
  await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  await page.getByTestId('device-row-drone-1').click();

  await expect(page.getByTestId('status-flight')).toHaveText('standby', { timeout: 10000 });
  await expect(page.getByTestId('telemetry-battery')).toHaveText('100 %', { timeout: 10000 });
  for (const testId of POPULATED_TELEMETRY) {
    await expect(page.getByTestId(testId)).not.toHaveText('—', { timeout: 10000 });
  }
});
