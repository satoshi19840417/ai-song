---
name: finish_work
description: Finalize and sync work to GitHub when user says 作業終了, 作業完了, GitHubにpush, 同期して, or similar completion commands.
---

# Finish Work Skill

Use this skill when the user indicates work is complete and asks to sync to GitHub.

## Workflow

1. **Map repository structure**
   - Run `git status --short --branch`.
   - If a directory appears as modified and is a submodule, treat it as a separate repository.
   - Check each changed submodule with `git -C <submodule> status --short --branch`.

2. **Verify `.gitignore` before staging**
   - In root and changed submodules, confirm large media files are excluded.
   - Required safety patterns: `*.mp4`, `*.mp3`, `*.wav`, `public/suno_PJ/**/*.mp4`.

3. **Commit and push changed submodules first**
   ```powershell
   git -C <submodule> add .
   git -C <submodule> commit -m "feat|fix|chore: [summary]"
   git -C <submodule> push -u origin main
   ```
   - If there is nothing to commit, continue.

4. **Commit and push root repository**
   ```powershell
   git add .
   git commit -m "feat|fix|chore: [summary]"
   git push -u origin main
   ```

5. **Verify completion**
   ```powershell
   git status --short --branch
   git -C <submodule> status --short --branch
   ```
   - Root and changed submodules should be clean.

6. **Notify user**
   - Report commit hashes and push targets.
   - Report any warning or error that needs follow-up.

## Failure handling

- If push is rejected:
  ```powershell
  git pull --rebase
  git push -u origin main
  ```
  Run in the repository where the rejection happened (submodule or root).
- If upstream is missing:
  ```powershell
  git push -u origin <branch>
  ```

## Triggers

This skill is activated when the user says:
- 作業終了
- 作業完了
- GitHubにpush
- 同期して
- "finished work"
- "sync to github"
- /finish_work

## Notes

- Prefer descriptive commit messages over generic timestamp-only messages.
- Always push submodules before pushing the root repository so submodule pointers stay valid.
- The workflow at `.agent/workflows/finish_work.md` provides quick execution commands.
