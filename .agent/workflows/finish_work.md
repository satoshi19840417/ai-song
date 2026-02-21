---
description: Automatically sync finished work to GitHub, including changed submodules.
---

# Finish Work Workflow

Use this workflow when the user says work is finished and wants GitHub sync.

// turbo-all

1. **Check root status**
   ```powershell
   git status --short --branch
   ```

2. **If submodule is modified, sync submodule first**
   - Replace `<submodule>` with the modified submodule path from step 1.
   ```powershell
   git -C <submodule> status --short --branch
   git -C <submodule> add .
   git -C <submodule> commit -m "chore: sync work at $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
   git -C <submodule> push -u origin main
   ```

3. **Sync root repository**
   ```powershell
   git add .
   git commit -m "chore: sync work at $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
   git push -u origin main
   ```

4. **Final verification**
   ```powershell
   git status --short --branch
   git -C <submodule> status --short --branch
   ```
