---
name: git-windows-reserved-path-guard
description: Prevent and remediate Git failures caused by Windows reserved names (NUL, CON, PRN, AUX, COM1-9, LPT1-9). Use when git add/git commit fails with messages like "error: invalid path 'NUL'", when users ask for recurrence prevention, or before staging changes on Windows as a preflight check.
---

# Git Windows Reserved Path Guard

## Quick Start

Run from `my-remotion-01` root. If running from workspace root, prefix paths with `my-remotion-01/`.

1. Run preflight detection:
   - `powershell -ExecutionPolicy Bypass -File .agent/skills/git-windows-reserved-path-guard/scripts/preflight_git_add.ps1 -AsJson`
2. If reserved-name paths are detected and deletion is approved:
   - `powershell -ExecutionPolicy Bypass -File .agent/skills/git-windows-reserved-path-guard/scripts/preflight_git_add.ps1 -Fix -AsJson`
3. Stage changes:
   - `git add -A -- .`
4. If a specific reserved path still blocks staging, use temporary exclude pathspec:
   - `git add -A -- . ':(exclude)NUL'`
5. Re-check:
   - `git status --short`

## Required Workflow

1. Confirm failure signature from Git output.
2. Run `scripts/preflight_git_add.ps1` to detect reserved-name paths tracked/untracked by Git.
3. For each detected path:
   - Explain the risk (Windows reserved name cannot be indexed normally).
   - Ask before deletion.
   - Run `-Fix` mode only after approval.
4. Re-run preflight with no fix flag and confirm `detected_count = 0`.
5. Run `git add -A -- .` and proceed with normal commit flow.
6. If staging still fails due to unrelated lock/permission errors, treat those separately (`.git/index.lock`, ACL, active Git process).

## Prevention Rules

- In PowerShell, discard output with `> $null` or `| Out-Null`.
- Do not use `> NUL` in PowerShell. It can create a real `NUL` path entry in the repo.
- Use preflight script before `git add` when running automation scripts that create files.
- Keep remediation deterministic: detect -> approve -> fix -> verify -> add.

## References

- `references/windows-reserved-names.md` for reserved-name behavior and shell-specific prevention notes.
