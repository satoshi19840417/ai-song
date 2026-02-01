---
name: skill-authoring-guidelines
description: Create or update skills while aligning with Claude, Antigravity, and OpenAI Codex skill docs; adapt doc URLs to the current environment before use.
---
# Skill Authoring Guidelines

Use this skill whenever you build or revise a skill so outputs stay consistent with the latest guidance from the three vendor docs. Replace doc URLs with the mirrors for your environment before sharing.

## 0) Resolve doc URLs (environment-dependent)
- Set working links up front: `CLAUDE_SKILL_DOC_URL` (default https://code.claude.com/docs/ja/skills), `ANTIGRAVITY_SKILL_DOC_URL` (default https://antigravity.google/docs/skills), `CODEX_SKILL_DOC_URL` (default https://developers.openai.com/codex/skills/create-skill/). Swap to your internal mirrors if needed.

## 1) Cross-platform fundamentals
- Keep frontmatter minimal: `name` (hyphen-case, <64 chars) and `description` covering what/when/who triggers the skill.
- Keep SKILL.md lean (<500 lines); push bulky variants, schemas, or examples into references and link to them.
- Prefer imperative voice; assume the agent is already capable—add only non-obvious, procedural knowledge.

## 2) Claude-specific essentials
- Skills live under the user skill path for the environment (e.g., `~/.claude/skills`); deploy via `claude skills add <file>` if using the CLI.
- Basic skill = frontmatter + instruction blocks; advanced skill may add files, examples, and simple templating with `{{placeholder}}` values.
- Avoid over-constraining; give clear tasks rather than persona fluff.

## 3) Antigravity-specific essentials
- Structure: `title`, `description`, optional `model`/`tools`, then content blocks for **User-Control**, **Policies**, **Predefined Steps**. Keep user-control boundaries explicit.
- Categorize the skill (documents, writing, data, code, productivity, browsing, image) to aid discovery.

## 4) OpenAI Codex-specific essentials
- Progressive disclosure: frontmatter → SKILL.md → optional `scripts/`, `references/`, `assets/`. Link to references only when needed.
- Put all triggering guidance in `description`; omit “when to use” sections in the body.
- Test any scripts you add; keep examples short; avoid duplicating content across files.

## 5) Build checklist
1. Choose a hyphen-case folder name; if available, run `scripts/init_skill.py <name> --path .agent/skills --resources references,assets,scripts`.
2. Write frontmatter (what/when/who) then outline the lean body; include links/placeholders for the three doc URLs.
3. Add reusable resources and cite paths in SKILL.md with when/how to load them.
4. Validate against each vendor’s expectations (frontmatter fields, categories, user-control/policy blocks, progressive disclosure).
5. Package or register as required (e.g., `claude skills add`, `scripts/package_skill.py`) and smoke-test any scripts.

## 6) Minimal SKILL.md template
```
---
name: your-skill-name
description: What the skill does; triggers; target artifacts/users.
---
# Title

## Quick start
- Core steps or command to run.

## Key details
- User-control / boundaries (Antigravity style).
- References or assets to load when needed.
- Templating slots (Claude `{{placeholder}}`) if helpful.
```

## 7) URL substitution note
- Before handing off, replace the default doc URLs with the live ones for this environment (internal mirrors, air-gapped copies, etc.). If unknown, leave placeholders and flag the gap.
