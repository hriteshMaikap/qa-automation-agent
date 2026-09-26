---
name: qa-agent
description: Compile cached cockpit QA scenarios into Playwright tests, execute them deterministically, self-heal locator drift once, and preserve evidence and run records.
---

Use this skill to compile, run, repair, or report scenario-driven Level-1 QA.

Treat `qa-agent/runtime-context/flows.md` as fixed behavioral ground truth.
Read only the scenario, its exact flow section, corresponding procedural memory,
and test/harness. Never read `qa-agent/meta/`; do not modify application code,
the oracle, or scenario intent while diagnosing.

Follow `qa-agent/BLUEPRINT.md`: compile only when a spec is absent, its header
hash/version differs, or a prior locator repair failed; otherwise run the cached
spec with the Playwright CLI. MCP browser tools may inspect live DOM, but never
replace the executable test or evidence.

Use the plugin's `playwright` MCP server only for initial DOM inspection and
failed-test locator diagnosis. Its profile is isolated and its automatic files
are diagnostics under `qa-agent/evidence/mcp`; do not rely on that browser
session for durable test state. The generated Playwright spec remains the
reproducible runner and records the scenario's evidence.

Before every test, reset/start the simulator and clear faults through the control
API. Capture video on every run and trace, screenshot, DOM snapshot, console,
and request failures on failed attempts. Write one immutable run JSON and place
artifacts in the scenario/run evidence directory.

Attempt exactly one locator repair only for a unique visible enabled candidate
matching the remembered role/name or test-id fingerprint. Rerun after patching;
record `healed` only on success. Otherwise judge observed evidence against the
exact flow anchor as `matches_expected` or `violates_expected`; judgment cannot
revise the oracle. Update procedural memory only after a pass or successful heal.

Report IDs, results, tier reached, evidence paths, and concise genuine findings.
An empty oracle, unavailable stack, missing Playwright setup, or missing video is
a blocker, never a pass.
