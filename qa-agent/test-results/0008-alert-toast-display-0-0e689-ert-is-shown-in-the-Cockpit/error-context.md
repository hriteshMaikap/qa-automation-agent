# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 0008-alert-toast-display.spec.ts >> 0008 takeoff alert is shown in the Cockpit
- Location: tests\0008-alert-toast-display.spec.ts:9:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('alert-toast')
Expected substring: "drone-1 Drone 1 taking off"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByTestId('alert-toast') with timeout 10000ms
  - waiting for getByTestId('alert-toast')

```

```yaml
- banner:
  - text: FlytBase Cockpit socket connected
  - link "Control panel →":
    - /url: http://localhost:4000/dashboard
- complementary:
  - heading "Devices" [level=2]
  - list:
    - listitem: Drone 1 Dock 1 dock — —
    - listitem: Drone 2 Dock 2 dock — —
    - listitem: Drone 3 Dock 3 dock — —
    - listitem: Drone 4 Dock 4 dock — —
  - heading "Drone Telemetry · Drone 1 unknown" [level=2]
  - term: Battery
  - definition: —
  - term: Altitude RLT
  - definition: —
  - term: Altitude AGL
  - definition: —
  - term: Altitude ASL
  - definition: —
  - term: H-Speed
  - definition: —
  - term: V-Speed
  - definition: —
  - term: Heading
  - definition: —
  - term: Wind
  - definition: —
  - term: Dist. from home
  - definition: —
- main:
  - group "Map view":
    - button "2D"
    - button "3D" [pressed]
  - text: FPV · Drone 1 off Video off
```

# Test source

```ts
  1  | // scenario_id: 0008 | version: 1 | scenario_sha256: decbac2eeaea4ca3a2c05fce849eeec2b77868f3e81aab2e548af43614e4934c
  2  | // target_flow: flows.md#alert-toast-display-and-dismissal
  3  | import { test, expect } from '@playwright/test';
  4  | 
  5  | const API = 'http://localhost:4000';
  6  | 
  7  | test.use({ video: 'on', trace: 'on' });
  8  | 
  9  | test('0008 takeoff alert is shown in the Cockpit', async ({ page, request }) => {
  10 |   await request.delete(`${API}/api/control/fault`);
  11 |   expect((await request.post(`${API}/api/control/sim`, { data: { action: 'reset' } })).ok()).toBeTruthy();
  12 |   expect((await request.post(`${API}/api/control/sim`, { data: { action: 'start' } })).ok()).toBeTruthy();
  13 | 
  14 |   await page.goto('/');
  15 |   await expect(page.getByTestId('socket-status')).toHaveText('socket connected', { timeout: 30000 });
  16 |   await page.getByTestId('device-row-drone-1').click();
  17 |   const takeoff = await request.post(`${API}/api/control/command`, {
  18 |     data: { deviceId: 'drone-1', type: 'takeoff' },
  19 |   });
  20 |   expect(takeoff.ok()).toBeTruthy();
  21 | 
> 22 |   await expect(page.getByTestId('alert-toast')).toContainText('drone-1 Drone 1 taking off', { timeout: 10000 });
     |                                                 ^ Error: expect(locator).toContainText(expected) failed
  23 | });
  24 | 
```