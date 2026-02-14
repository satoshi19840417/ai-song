# Windows reserved names and Git staging

## Reserved names

Windows treats these as device names, not normal files:

- `CON`, `PRN`, `AUX`, `NUL`
- `COM1` to `COM9`
- `LPT1` to `LPT9`

Git on Windows can fail when these names appear in repository paths, especially during `git add -A`.

## Typical failure signature

- `error: invalid path 'NUL'`
- `error: unable to add 'NUL' to index`
- `fatal: adding files failed`

## Prevention in shells

- In PowerShell, discard output with:
  - `> $null`
  - `| Out-Null`
- Avoid `> NUL` in PowerShell scripts.
- `> NUL` is safe only inside `cmd.exe` command context.

## Safe response flow

1. Detect reserved-name paths with `scripts/preflight_git_add.ps1`.
2. Ask for deletion approval.
3. Run `-Fix` mode.
4. Re-run detection.
5. Stage with `git add -A -- .`.
