---
description: Create a new agent skill using the skill-creator and authoring guidelines
---

# Create New Skill Workflow

This workflow guides you through creating a new skill for the agent, ensuring it adheres to best practices and guidelines.

## Prerequisites

- [ ] Ensure `skill-creator` and `skill-authoring-guidelines` are present in `.agent/skills/`.

## Steps

1.  **Read Guidelines**
    - Review the [Skill Authoring Guidelines](../skills/skill-authoring-guidelines/SKILL.md) to understand the standards for creating skills.
    
    ```bash
    # View the guidelines
    type .agent\skills\skill-authoring-guidelines\SKILL.md
    ```

2.  **Initialize Skill**
    - Use the `skill-creator` script to initialize a new skill. Replace `<skill-name>` with your desired skill name (hyphen-case).
    
    ```bash
    # Rule: Use a descriptive name in hyphen-case (e.g., image-processing, database-query)
    python .agent/skills/skill-creator/scripts/init_skill.py <skill-name> --path .agent/skills
    ```

3.  **Edit Skill**
    - Modify the generated `SKILL.md` file in `.agent/skills/<skill-name>/`.
    - Fill in the YAML frontmatter (name, description).
    - Add instructions, scripts, and resources as needed.

4.  **Validate and Package (Optional)**
    - If you intend to distribute the skill, package it using the packaging script.
    
    ```bash
    python .agent/skills/skill-creator/scripts/package_skill.py .agent/skills/<skill-name>
    ```

5.  **Verify**
    - Test the skill by asking the agent to perform a task that triggers it.
