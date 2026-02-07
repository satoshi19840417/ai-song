# Troubleshooting

## EPERM on startup (`spawn EPERM`)
1. Re-run with elevated permissions if available in the environment.
2. Check antivirus / endpoint protection quarantine logs for `node`, `npm`, or `esbuild`.
3. Check whether another process locks files under `node_modules` or project logs.
4. Reinstall dependencies if corruption is suspected:
   - `npm ci`
5. If still failing, return:
   - exact error line
   - stderr tail
   - attempted command

## Port conflict or unknown port
1. Never assume `3000`.
2. Run `check_remotion_dev.ps1` with `3000-3020`.
3. If no URL found but process exists, inspect `remotion-dev.out.log` for `Server ready - Local:`.
4. Return actual URL if discovered.

## Startup timeout
1. If process is still alive, return timeout status with log tails.
2. If process exited, return exit condition with stdout/stderr tail.
3. Suggest next action:
   - retry startup
   - stop old process and retry
   - run `npm run dev` foreground for direct logs

## Browser verification not available
1. Provide URL and manual verification instruction.
2. Do not block completion only because browser automation is unavailable.

