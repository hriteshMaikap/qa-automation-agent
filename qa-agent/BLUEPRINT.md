# QA automation agent blueprint

## Decision

Yes. This is a practical Level-1 design: durable scenario intent is separate
from a cached executable test, while a fixed flow oracle prevents the agent
from explaining away a mutation.

Two prerequisites must be explicit:

1. `runtime-context/flows.md` is the versioned oracle. It is currently empty,
   so no scenario should run until it contains anchored, observable flows.
2. Browser automation must be bootstrapped once: `@playwright/test`, a
   `playwright.config.ts`, and a browser. Browser MCP is optional; the
   Playwright spec and CLI are the runnable source of truth.

Test execution is 100% LLM-free (`npx playwright test`, deterministic CLI).
The only LLM invocations in this pipeline are: (1) Scenario Generator, run once
per scenario at authoring time, and (2) self-heal diagnosis, run only on
deterministic failure, bounded to one locator-repair attempt. No LLM call
happens during a passing test run.

## Repository contract

```text
qa-agent/
  meta/                         evaluation material; excluded from runtime skills
  runtime-context/
    flows.md                    frozen oracle with heading anchors
    product-brief.md            reviewed runtime copy, if generation needs it
    source-manifest.json        revision/hash of oracle inputs
  scenarios/<id>.yaml           durable declarative test intent
  tests/<id>.spec.ts            cached executable compilation
  evidence/<id>/<run-id>/       video, screenshot, trace, observed state
  logs/runs/<run-id>.json       immutable execution record
  logs/procedural/<id>.json     replaceable selector/baseline memory
  skills/scenario-generator/    discovery skill
  skills/qa-agent/              compilation/execution skill
```

`meta/` must not be read by either runtime skill. Copy and review its product
brief into `runtime-context/` before the first run; this makes all test inputs
inspectable and keeps evaluation-only material out of runtime context.

## Scenario contract

Scenario categories are:

`visual_ui, responsive_ui, functional_ui, api_data, map_geospatial, video_media, telemetry, realtime_multiuser, state_persistence, network_recovery, performance, long_running, security_permissions, audit_history`

Keep the agreed five fields and add deterministic details:

```yaml
id: "0001"
version: 1
category: functional_ui
title: Socket status recovers after a server kick
target_flow: flows.md#socket-recovery
expected: Cockpit returns to connected after a one-time server socket kick.
preconditions: [simulator_reset, cockpit_loaded]
actions:
  - api: { method: POST, path: /api/control/fault, body: { kind: socket-kick } }
assertions:
  - { locator: '[data-testid="socket-status"]', condition: text_eventually_equals, value: socket reconnecting, timeout_ms: 10000 }
  - { locator: '[data-testid="socket-status"]', condition: text_eventually_equals, value: socket connected, timeout_ms: 30000 }
verify: dom_state
tags: [baseline, fault]
```

- IDs are zero-padded strings and never reused. Increment `version` only when
  intent changes; a changed YAML hash recompiles its spec.
- `target_flow` must name exactly one existing flow anchor.
- Use control API calls for deterministic setup/actions; use the browser for
  the user-visible workflow and assertion.
- Assertions are observable behavior. Prefer test ids, then role/name, then
  scoped text; never use coordinates or implementation classes.
- One scenario represents one user-impacting failure; group duplicate symptoms.

## Execution and repair state machine

```text
scenario -> cached spec matches hash? -- no -> compile -> run
                | yes                              ^
                +----------------------------------+ selector healed once

run -> pass -> immutable record
 |
 fail -> evidence + DOM snapshot -> unique usable selector candidate?
                                    | yes                 | no
                                    v                     v
                               patch and rerun     compare evidence to exact flow
                                                       | matches    | violates
                                                       v            v
                                                     pass record  fail record
```

Every generated spec resets/starts the simulator and clears faults using the
control API; uses bounded Playwright assertions rather than sleeps; has a
header containing scenario ID/version/SHA-256; and stores artifacts under the
scenario/run evidence directory. Put common reset, API, and evidence helpers in
a hand-written harness rather than regenerating them into every spec.

Mechanical selector repair requires exactly one visible, enabled element with a
matching remembered test-id or role/name fingerprint, and it must satisfy the
pre-action condition. Patch once, rerun once. Procedural memory may change a
locator only; it never changes the expected assertion or flow.

For all other failures, an LLM compares the scenario, exact flow section,
actions, DOM snapshot, console/network errors, and evidence. Its only outcomes
are `matches_expected` and `violates_expected`. It cannot change a flow,
scenario, or memory during judgment. The former is a `pass` with a reason; the
latter is a genuine `fail`.

## Durable records

Use JSON for machine-written records. A run file is append-only and contains:
`schema_version`, `run_id`, `scenario_id`, `scenario_sha256`, `started_at`,
`result` (`pass` | `fail` | `healed`), `tier_reached`, `attempts`, app revision,
flow anchor, evidence directory, and a reason when judgment was used.

Each replace-in-place procedural file holds the last known selector, its
role/name fingerprint, source evidence run, stable-run count, and update time.
It is advisory only and updates after a deterministic pass or successful heal.

## Bootstrap a new Codex session

1. Verify the local stack and record its URL/revision.
2. Freeze `runtime-context/product-brief.md`, complete anchored `flows.md`, and
   write a source manifest. Do not use an empty oracle.
3. Add/configure Playwright and a shared test harness; prove a smoke test saves
   video, trace, and failure screenshot before generating coverage.
4. Ask `$scenario-generator` for a small, non-duplicate batch across at least
   two categories; review each YAML against its anchor.
5. Ask `$qa-agent` to compile/run it. Later sessions reuse matching specs and
   only generate or heal when the content hash or locator requires it.
6. Assemble `submission/evaluation_document.md` from selected YAML, immutable
   records, and evidence. Only this final step may read `meta/` for format.

Example prompts:

```text
Use $scenario-generator to create three baseline scenarios for the current
cockpit. Cover devices, states, and changing conditions. Do not read qa-agent/meta
and do not run the app.

Use $qa-agent to compile and run scenarios 0001 through 0003 against
http://localhost:4010. Start the stack if needed, preserve scenarios, and
report evidence paths and genuine findings.
```

For a fresh Codex session, either register `qa-agent/skills/` as a capability
directory in the harness, or install/package `qa-agent/` as the
`cockpit-qa-agent` plugin using its `.codex-plugin/plugin.json`. A plain folder
under the repository is not automatically discovered by Codex. The plugin
registers its `playwright` MCP server from `qa-agent/.mcp.json`; its local
settings live in `qa-agent/playwright-mcp.config.json`.

The system is ready for evaluation when all scenarios have valid anchors, the
unmutated baseline passes, every run has video, a deliberate UI mutation fails,
and selector drift demonstrably produces `healed` without changing behavior.
