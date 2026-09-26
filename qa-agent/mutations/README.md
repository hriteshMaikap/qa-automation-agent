# QA mutation patches

These reversible patches validate whether existing scenarios detect known-bad states before trusting them for submission.

Apply a mutation with:

    git apply qa-agent/mutations/<file>.patch

Revert it with:

    git apply -R qa-agent/mutations/<file>.patch
