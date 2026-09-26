# Level 1: Static UI and basic security testing

## Evaluation

**Level 1: Static UI and basic security testing**
The first level is the simplest: checking that each screen shows what it should. During evaluation we will introduce deliberate changes (mutations) into the app, and your testing system has to catch them.

A few examples of what a mutation might do:

* Remove the sign-in button from a login page that has email and OTP fields, so the user can no longer sign in
* Show a drone as online when it is offline
* Push the main action off screen at phone width
* Let a signed-out user open a page that should need sign-in

These are only examples. What else could go wrong on a screen, and how your system notices it, is up to you.

---

## What to submit

Each team submits one evaluation document. It has two parts.

### 1. System design

A short overview of the testing system you built: its main parts, what each one does, and how they work together to find issues in the product.

### 2. Scenarios

A numbered list of the scenarios you are submitting. You can add as many as you like, and each one is evaluated on its own.

**For each scenario:**

| What to include | Details |
| --- | --- |
| **Title** | A short name for the scenario |
| **Description** | What is being tested and what the user expects to happen |
| **Approach** | How your system tests this scenario and identifies the issue |
| **Video** | A link to a screen recording of the scenario running in real time |

> **Note:** The video is required. A scenario without one is not evaluated.

---

## Criteria

Results are judged on quality, not on the number of issues reported.

| Criterion | What is assessed |
| --- | --- |
| **Validity** | The problem is genuinely incorrect user-facing behaviour, not an acceptable difference in wording or presentation |
| **Reproducibility and evidence** | A clear starting state and steps that someone else can repeat, shown in the video |
| **Product understanding** | Understands the user's goal and connects behaviour across related parts of the product |
| **Breadth** | Covers different categories of frontend quality, including devices, states, users, live data and changing conditions |
| **Depth and impact** | Completes meaningful workflows and finds problems that materially affect users or operations |
| **Precision** | Avoids false positives and groups duplicate symptoms of the same underlying problem |

Strong results are clear, user-facing, reproducible, supported by evidence and tied to real product impact.