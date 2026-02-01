---
name: finish_work
description: Finalize and sync work to GitHub when user says 作業終了
---

# Finish Work Skill

Use this skill when the user indicates work is complete (作業終了, finished, done, etc.).

## Workflow

1.  **Verify .gitignore**
    - Ensure large media files (mp4, mp3, wav) are excluded
    - Check that `public/suno_PJ/**/*.mp4` pattern exists

2.  **Check Git Status**
    ```powershell
    git status
    ```

3.  **Stage All Changes**
    ```powershell
    git add .
    ```

4.  **Commit with Descriptive Message**
    - Use a meaningful commit message describing the work done
    ```powershell
    git commit -m "feat: [description of changes]"
    ```

5.  **Push to GitHub**
    ```powershell
    git push -u origin main
    ```
    - If push fails, check remote with `git remote -v`
    - May need to set upstream: `git push -u origin main`

6.  **Notify User**
    - Confirm successful sync to GitHub
    - Report any errors encountered

## Triggers

This skill is activated when the user says:
- 作業終了
- 作業完了
- "finished work"
- "sync to github"
- /finish_work

## Notes

- Always verify .gitignore before committing to avoid accidentally pushing large media files
- The workflow at `.agent/workflows/finish_work.md` provides turbo-mode commands for quick execution
