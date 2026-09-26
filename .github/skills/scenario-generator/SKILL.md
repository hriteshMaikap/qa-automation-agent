---
name: scenario-generator
description: Create durable cockpit QA scenario YAML from frozen runtime flows and source risk analysis, without running the app or writing Playwright tests.
---

Use this skill to discover, add, or refine declarative Level-1 QA scenarios.

Read `qa-agent/runtime-context/flows.md` first. It is the oracle and every
scenario must refer to one exact heading anchor. Read a reviewed runtime product
brief only if it exists under `qa-agent/runtime-context/`; never read
`qa-agent/meta/`. Inspect source code for user-risk gaps and stable selectors,
but do not start services, use browser automation, write Playwright, or modify
application code.

Read `qa-agent/logs/runs/` and `qa-agent/logs/procedural/` before generating.
Treat procedural memory as context, not as an oracle: it records behavior that
has already been observed and must not change the frozen flow or expected result.
Each `qa-agent/logs/procedural/<id>.json` file may contain this shape:

```json
{
  "schema_version": 1,
  "scenario_id": "0001",
  "flow_anchor": "flows.md#takeoff-produces-in-air-flight-status",
  "behavior_observations": [
    {
      "assertion": "[data-testid=\"status-flight\"] eventually equals in_flight",
      "result": "pass",
      "run_id": "20260926-133333",
      "evidence_directory": "qa-agent/evidence/0001/20260926-133333",
      "observed_at": "2026-09-26T13:33:33+05:30"
    }
  ],
  "updated_at": "2026-09-26T13:33:33+05:30"
}
```

Merge duplicate observations by scenario, flow anchor, and assertion while
preserving the latest result and evidence reference. Use this history to skip
adequately covered behavior, prefer uncovered assertions, and prioritize
`healed`, repeated `fail`, or conflicting observations for review. Never treat
procedural memory alone as proof that a flow passes, and never generate an
assertion that is absent from the exact flow anchor. Use the category set:
visual_ui,
responsive_ui, functional_ui, api_data, map_geospatial, video_media, telemetry,
realtime_multiuser, state_persistence, network_recovery, performance,
long_running, security_permissions, audit_history.

Write one focused `qa-agent/scenarios/<id>.yaml` per workflow using the contract
in `qa-agent/BLUEPRINT.md`. Preserve IDs and avoid action/assertion duplicates.
Use control API preconditions/actions for reproducibility. Assert only
user-visible behavior defined in the target flow; prefer a test id, then
accessible role/name. Do not assert a proposed feature absent from frozen flows.

Before finishing, validate required fields and anchors, deduplicate by user
impact, and report generated IDs, anchors, categories, and missing oracle detail.
