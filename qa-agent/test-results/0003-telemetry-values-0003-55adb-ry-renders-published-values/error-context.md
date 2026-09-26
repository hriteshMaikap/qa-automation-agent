# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 0003-telemetry-values.spec.ts >> 0003 selected drone telemetry renders published values
- Location: tests\0003-telemetry-values.spec.ts:19:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByTestId('status-flight')
Expected: "standby"
Received: "unknown"
Timeout:  10000ms

Call log:
  - Expect "toHaveText" getByTestId('status-flight') with timeout 10000ms
  - waiting for getByTestId('status-flight')
    23 × locator resolved to <span class="pill pill-unknown" data-testid="status-flight">unknown</span>
       - unexpected value "unknown"

```

```yaml
- text: unknown
```

# Test source

```ts
  1  | // scenario_id: 0003 | version: 1 | scenario_sha256: a41864a01cd0442fcd1acccc64f51948b9d13849d824d3554d6ea4117714e481
  2  | // target_flow: flows.md#drone-telemetry-display
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | const API = 'http://localhost:4000';
  6  | const POPULATED_TELEMETRY = [
  7  |   'telemetry-alt-rlt',
  8  |   'telemetry-alt-agl',
  9  |   'telemetry-alt-asl',
  10 |   'telemetry-hspeed',
  11 |   'telemetry-vspeed',
  12 |   'telemetry-heading',
  13 |   'telemetry-wind',
  14 |   'telemetry-home-distance',
  15 | ];
  16 | 
  17 | test.use({ video: 'on', trace: 'on' });
  18 | 
  19 | test('0003 selected drone telemetry renders published values', async ({ page, request }) => {
  20 |   await request.delete(`${API}/api/control/fault`);
  21 |   expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  22 |   expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();
  23 | 
  24 |   await page.goto('/');
  25 |   await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  26 |   await page.getByTestId('device-row-drone-1').click();
  27 | 
> 28 |   await expect(page.getByTestId('status-flight')).toHaveText('standby', { timeout: 10000 });
     |                                                   ^ Error: expect(locator).toHaveText(expected) failed
  29 |   await expect(page.getByTestId('telemetry-battery')).toHaveText('100 %', { timeout: 10000 });
  30 |   for (const testId of POPULATED_TELEMETRY) {
  31 |     await expect(page.getByTestId(testId)).not.toHaveText('—', { timeout: 10000 });
  32 |   }
  33 | });
  34 | 
```