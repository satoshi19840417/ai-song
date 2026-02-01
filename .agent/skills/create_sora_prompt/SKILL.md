---
name: create_sora_prompt
description: Create a comprehensive prompt for Sora2 video generation based on a user's concept.
---

# Create Sora Prompt Skill

This skill allows the agent to generate a structured `prompt.md` file for Sora2 video generation, ensuring high quality and consistency.

## Usage

When the user provides a video concept or idea (e.g., "A futuristic city in rain", "A girl dream of figure skating"), follow these steps.

## Steps

1.  **Analyze the Request**: Understand the core theme, mood, and visual elements the user wants.
2.  **Determine Project Name**: Create a short, English, snake_case project name based on the concept (e.g., `futuristic_city_rain`, `figure_skating_dream`).
3.  **Create Directory**: Check if `sora_projects/<project_name>` exists. If not, create it.
4.  **Generate Content**: Construct the content for `sora_projects/<project_name>/prompt.md`.
    *   **Theme**: A brief description in Japanese.
    *   **Length**: 15 seconds (unless specified otherwise).
    *   **Concept**: Detailed explanation of the video's intent in Japanese.
    *   **Sequence**: A 15-second breakdown (e.g., 0-5s, 5-10s, 10-15s) describing the scenes in Japanese.
    *   **English Prompt**: A high-quality, detailed English prompt suitable for Sora2. This should include:
        *   Camera angles/movement.
        *   Lighting details.
        *   Subject description.
        *   Mood/Atmosphere.
        *   Technical keywords (e.g., "photorealistic", "8k", "cinematic", "16:9 aspect ratio").
    *   **Japanese Translation**: A literal translation of the English prompt for user verification.
5.  **Write File**: Save the content to `sora_projects/<project_name>/prompt.md`.
6.  **Notify User**: Inform the user that the prompt has been created and provide the path.

## Example Output Format (prompt.md)

```markdown
# Sora2 プロンプト: [Title in Japanese]

**テーマ**: [Theme]
**長さ**: 15秒

## コンセプト
[Detailed concept in Japanese]

---

## 構成案 (シークエンス)

### 00:00 - 00:05: [Scene 1 Title]
**シーン内容**: [Description]
**視覚的詳細**: [Visual details]

... (Repeat for other segments)

---

## 生成用プロンプト (英語)

```text
[High quality English prompt]
```

## 生成用プロンプト (日本語参考)

```text
[Japanese translation of the English prompt]
```
```
