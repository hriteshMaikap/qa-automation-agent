# Cockpit QA flow

This prototype turns the FlytBase Cockpit into a small, repeatable Level-1 QA workflow for the hackathon. The scope is the main Cockpit UI; the control panel is used only through its HTTP control API to make setup deterministic.

## What was added

- A `cockpit-qa-agent` plugin manifest registers the local skills and Playwright MCP server.
- The `scenario-generator` skill converts reviewed runtime flows into durable YAML scenarios.
- The `qa-agent` skill compiles scenarios into cached Playwright specs, runs them, preserves evidence, and permits one constrained locator repair.
- Playwright MCP was introduced for live DOM inspection and failed-test diagnosis. Its snapshots and console output are diagnostics; the cached Playwright spec remains the executable source of truth.
- A local Playwright package/configuration was added under `qa-agent/` so specs can run with `npx playwright test`.

## End-to-end process

1. Verify the stack before testing: `GET http://localhost:4000/api/health` must report the simulator connected and video up. Confirm Playwright MCP tools are listed/callable and both QA skills are discoverable.
2. Read the Cockpit UI source, subscription hook, README, and reference documentation. Freeze user-visible behavior in anchored sections of [`runtime-context/flows.md`](runtime-context/flows.md).
3. Select one flow anchor. The prototype uses `flows.md#takeoff-produces-in-air-flight-status`: an API takeoff command drives the selected Cockpit drone from `taking_off` to visible `in_flight`.
4. Generate one focused YAML scenario. [`scenarios/0001-takeoff-in-air.yaml`](scenarios/0001-takeoff-in-air.yaml) is category `states`, verifies `dom_state`, uses API setup/action, and asserts `[data-testid="status-flight"]` eventually equals `in_flight`.
5. Compile once into the reusable cached spec [`tests/0001-takeoff-in-air.spec.ts`](tests/0001-takeoff-in-air.spec.ts). The spec header records the scenario hash and flow anchor, so a changed scenario causes recompilation.
6. Run from `qa-agent/` with `npx playwright test`. Each run clears faults, resets and starts the simulator, loads the Cockpit, selects Drone 1, sends takeoff through `/api/control/command`, and checks the DOM. Video and trace are captured for the run.
7. Write one immutable JSON record under `logs/runs/`, alongside the scenario hash, result, flow anchor, attempts, and evidence paths. The passing prototype run is recorded in [`logs/runs/20260926-133333-0001.json`](logs/runs/20260926-133333-0001.json).

## Mutation/evaluation loop

The `mutations/` patches represent deliberate UI regressions such as a wrong status label, a status that never updates, or an incorrectly enabled takeoff button. Apply one mutation in an isolated evaluation run, execute the cached spec, preserve failure evidence, and classify the result against the unchanged flow oracle. Revert the mutation before the next baseline run. A mutation must not change the scenario’s intent or oracle.

## Evidence and boundaries

Evidence is stored under `evidence/<scenario>/<run-id>/` and includes the Playwright video and trace; failed attempts additionally capture screenshot, DOM, console, and request diagnostics. API calls establish preconditions, while browser automation observes the user-facing Cockpit. No second scenario is generated until the first YAML/spec format is reviewed.
