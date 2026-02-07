STATUS=failed
URL=
PORT=
PID=24510
OUT_LOG=C:\repo\project\remotion-dev.out.log
ERR_LOG=C:\repo\project\remotion-dev.err.log
STOP=Stop-Process -Id 24510
NOTE=Startup timed out. Check log tails.

OUT_LOG_TAIL<<EOF
> my-remotion-01@1.0.0 dev
> remotion studio
EOF

ERR_LOG_TAIL<<EOF
Error: spawn EPERM
EOF

