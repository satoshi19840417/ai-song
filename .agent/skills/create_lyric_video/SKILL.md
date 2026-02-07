---
name: create_lyric_video
description: Generate a Remotion lyric video from files in public/suno_PJ/new
---

# Create Lyric Video Skill

This skill automates the process of creating a new lyric video component in the Remotion project using media and LRC files found in `public/suno_PJ/new`.

## Workflow

1.  **Scan for New Files**
    *   Look in `public/suno_PJ/new` for pairs of `.lrc` and `.mp4` (or `.mp3`) files.
    *   Target the first pair found.

2.  **Generate Data File**
    *   Read the `.lrc` file content.
    *   Create a new TypeScript file at `src/HelloWorld/[SongName]Data.ts`.
    *   **Import format**: `import { staticFile } from "remotion";`
    *   **Variable name**: `[camelCaseSongName]Data`
    *   **Content**:
        *   `title`: Use filename (without extension) or infer from content.
        *   `artist`: Default to "Suno AI" or infer.
        *   `videoSource`: `staticFile("suno_PJ/done/[filename].mp4")`  **IMPORTANT**: Use `done` not `new` here, as file will be moved.
        *   `lyrics`: Array of objects `{ timeTag: string, text: string }`.
    *   **Linting**: Add `/* eslint-disable no-irregular-whitespace */` at the top if the lyrics contain Japanese full-width spaces.

3.  **Generate Video Component**
    *   Create `src/HelloWorld/[SongName]Video.tsx`.
    *   Use `ValentineVideo.tsx` as the Golden Master template.
    *   **Import Animation Utilities**:
        ```typescript
        import { SPRING_CONFIGS, fadeInOut, audioFadeCurve, typewriterText, getPremountDuration, FONTS, TEXT_SHADOWS } from "./animationUtils";
        ```
    *   **Style Guidelines**:
        *   **StandardLyricLine**:
            *   Clear, readable font (`FONTS.zenKurenaido`).
            *   Central alignment, bottom positioned.
            *   Subtle text shadow (`TEXT_SHADOWS.subtle`).
            *   Use `fadeInOut()` for opacity animation.
        *   **EmphasisLyricLine** (for key phrases):
            *   **Spring Animation**: Use `spring({ frame, fps, config: SPRING_CONFIGS.lyricEmphasis })` for bouncy scale.
            *   **Glow Effect**: Use `TEXT_SHADOWS.warmGlow`.
            *   Avoid harsh colors. Use soft pinks/whites.
        *   **OpeningTitle**:
            *   **Typewriter Effect**: Use `typewriterText()` with pause support.
            *   **Visuals**: Floating particles, sparkling glow.
            *   **Duration**: At least 10 seconds.
        *   **FinalLyricLine**:
            *   **Position**: Center screen.
            *   **Spring Animation**: Use `SPRING_CONFIGS.heavy` for dramatic entrance.
            *   **Glow**: Use `TEXT_SHADOWS.strongGlow`.
            *   **Duration**: Ensure enough time for full display.

4.  **Apply Sequence Best Practices**
    *   **Premounting**: Add `premountFor` to ALL `<Sequence>` components:
        ```tsx
        <Sequence from={startFrame} durationInFrames={duration} premountFor={getPremountDuration(fps)}>
        ```
    *   This prevents lyrics from "popping in" abruptly.

5.  **Audio Control**
    *   Use volume fade-in/out for smooth audio:
        ```tsx
        <Audio src={props.videoSource} volume={audioFadeCurve(fps, durationInFrames, 1, 2)} />
        ```
    *   Parameters: fade-in 1 second, fade-out 2 seconds.

6.  **Register Composition**
    *   Edit `src/Root.tsx`.
    *   Import the new component and data file.
    *   Add a new `<Composition />` entry.
    *   **ID**: `[PascalCaseSongName]`
    *   **Dimensions**: 1920x1080, 30fps.
    *   **Duration**: Calculate based on the last lyric timestamp + **10-15 seconds buffer**.

7.  **Move Processed Files**
    *   **CRITICAL**: Move source files from `public/suno_PJ/new` to `public/suno_PJ/done`.
    *   Create the `done` directory if it doesn't exist.

8.  **Launch Preview Via Dedicated Skill**
    *   Use `remotion-preview-launch` after generation.
    *   Return the detected Remotion URL, PID, and stop command.
    *   Do not assume `http://localhost:3000`; always report the detected URL.

## Animation Best Practices Reference

For advanced patterns, refer to `remotion-best-practices` skill:
- **Spring Animations**: Use `spring()` instead of linear `interpolate()` for natural motion.
- **Easing Curves**: Use `Easing.inOut(Easing.quad)` for smooth transitions.
- **No CSS Animations**: CSS transitions/animations are FORBIDDEN in Remotion.
- **Frame-based**: All animations must be driven by `useCurrentFrame()`.

See: `.agent/skills/remotion-best-practices/rules/` for detailed patterns.

## Usage

When the user asks to "create a lyric video" or "process new songs", invoke this skill.
Always verify the build or lint status after making changes.
