---
description: Automatically sync changes to GitHub when work is finished.
---

# Finish Work Workflow

Use this workflow to quickly save your work and push it to GitHub. This is triggered when you declare "work finished" (作業終了).

// turbo-all

1.  **Check Status**
    ```powershell
    git status
    ```

2.  **Add and Commit**
    - Adds all changes and commits with a timestamped message.
    ```powershell
    git add .
    git commit -m "chore: auto-sync work at $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    ```

3.  **Push**
    - Pushes to the current branch.
    ```powershell
    git push
    ```
