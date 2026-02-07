---
name: remotion-preview-launch
description: Start or check Remotion Studio and return preview URL/PID/log paths after lyric video work, or when user asks to launch development preview. Use for requests like "start Remotion", "open preview", "開発環境を起動して確認", or "リリック動画作成後の確認".
---

# Remotion Preview Launch

## Quick Start
- Run `scripts/check_remotion_dev.ps1` first.
- If running, return URL/PID/log info without restarting.
- If not running, run `scripts/start_remotion_dev.ps1`.
- Return output in the fixed format described below.

## スキル運用（Remotion）
- リリック動画作成後のプレビュー確認は、`.agent/skills/remotion-preview-launch` を優先して使う。
- `create_lyric_video` / `create_vertical_lyric_video` 実行後は、開発サーバーを直接固定ポートで案内せず、検出されたURLを返す。
- ポートは `3000` 固定前提にしない（`3000-3020` の範囲で確認する）。
- 返却時は `URL / PID / 停止コマンド` を含める。

## Required Workflow
1. Check running state:
   - `powershell -ExecutionPolicy Bypass -File .agent/skills/remotion-preview-launch/scripts/check_remotion_dev.ps1 -AsJson`
2. Start only when needed:
   - `powershell -ExecutionPolicy Bypass -File .agent/skills/remotion-preview-launch/scripts/start_remotion_dev.ps1 -AsJson`
3. If start fails, read `references/troubleshooting.md` and follow the matching branch.
4. For stop requests:
   - `powershell -ExecutionPolicy Bypass -File .agent/skills/remotion-preview-launch/scripts/stop_remotion_dev.ps1 -ProcessId <PID> -AsJson`

## Output Contract
Always report these fields:
- `STATUS`: `running`, `started`, `failed`, `stopped`, or `not_running`
- `URL`: preview URL (`http://localhost:<port>`) when available
- `PID`: process ID when available
- `OUT_LOG`: path to stdout log when available
- `ERR_LOG`: path to stderr log when available
- `STOP`: `Stop-Process -Id <PID>` when PID exists

## Browser Verification (Optional)
- If browser automation tooling is available in the environment, open the detected URL and optionally capture a screenshot.
- If browser tooling is not available, provide the URL and fallback to manual verification instructions.

## Port Policy
- Search range is `3000-3020`.
- Do not assume `3000`; always return detected URL.

## Failure Handling
- Use `references/troubleshooting.md` for EPERM, timeout, and lock scenarios.
- Include brief log-tail summary when startup fails.

## Examples
- Use files in `examples/` as expected output samples.
