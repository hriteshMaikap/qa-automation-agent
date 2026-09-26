# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 0001-takeoff-in-air.spec.ts >> 0001 takeoff changes the selected drone to in-flight
- Location: tests\0001-takeoff-in-air.spec.ts:12:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  getByTestId('status-flight')
Expected: "standby"
Received: "unknown"
Timeout:  5000ms

Call log:
  - Expect "toHaveText" getByTestId('status-flight') with timeout 5000ms
  - waiting for getByTestId('status-flight')
    14 × locator resolved to <span class="pill pill-unknown" data-testid="status-flight">unknown</span>
       - unexpected value "unknown"

```

```yaml
- text: unknown
```

# Test source

```ts
  1  | // scenario_id: 0001 | version: 1 | scenario_sha256: 7a3b47f629b15982d97a609ef5a4f57abf5961727fea1c07c74ff7bb0388a9da
  2  | // target_flow: flows.md#takeoff-produces-in-air-flight-status
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | const API = 'http://localhost:4000';
  6  | 
  7  | test.use({
  8  |   video: 'on',
  9  |   trace: 'on',
  10 | });
  11 | 
  12 | test('0001 takeoff changes the selected drone to in-flight', async ({ page, request }) => {
  13 |   // Preconditions: simulator_reset, simulator_started, faults_cleared.
  14 |   await request.delete(`${API}/api/control/fault`);
  15 |   const reset = await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } });
  16 |   expect(reset.ok()).toBeTruthy();
  17 |   const start = await request.post(`${API}/api/control/sim`, { data: { action: 'start' } });
  18 |   expect(start.ok()).toBeTruthy();
  19 | 
  20 |   // Preconditions: cockpit_loaded, drone_1_selected.
  21 |   await page.goto('/');
  22 |   await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  23 |   await expect(page.getByTestId('device-row-drone-1')).toBeVisible({ timeout: 30000 });
  24 |   await page.getByTestId('device-row-drone-1').click();
> 25 |   await expect(page.getByTestId('status-flight')).toHaveText('standby');
     |                                                   ^ Error: expect(locator).toHaveText(expected) failed
  26 | 
  27 |   // Scenario action: API command, not a UI click.
  28 |   const takeoff = await request.post(`${API}/api/control/command`, {
  29 |     data: { deviceId: 'drone-1', type: 'takeoff' },
  30 |   });
  31 |   expect(takeoff.ok()).toBeTruthy();
  32 | 
  33 |   // Assertion: [data-testid="status-flight"] eventually equals in_flight.
  34 |   await expect(page.getByTestId('status-flight')).toHaveText('in_flight', { timeout: 30000 });
  35 | });
  36 | 
```