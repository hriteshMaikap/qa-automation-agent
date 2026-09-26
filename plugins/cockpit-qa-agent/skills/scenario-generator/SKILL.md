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

Write one focused `qa-agent/scenarios/<id>.yaml` per workflow using the contract
in `qa-agent/BLUEPRINT.md`. Preserve IDs and avoid action/assertion duplicates.
Use control API preconditions/actions for reproducibility. Assert only
user-visible behavior defined in the target flow; prefer a test id, then
accessible role/name. Do not assert a proposed feature absent from frozen flows.

Before finishing, validate required fields and anchors, deduplicate by user
impact, and report generated IDs, anchors, categories, and missing oracle detail.
