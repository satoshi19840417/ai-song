---
name: create_vertical_lyric_video
description: Generate a Remotion lyric video with vertical writing (縦書き) display
---

# Create Vertical Lyric Video Skill

This skill creates lyric videos with **vertical writing** (縦書き), right-top aligned, featuring a fragile/transient aesthetic.

## When to Use

Use this skill when the user requests:
- Vertical lyric display (縦書き)
- Japanese-style lyric presentation
- Fragile/transient (はかなさ) aesthetic
- Melancholic or emotional song themes

## Workflow

1.  **Scan for New Files**
    *   Look in `public/suno_PJ/new` for pairs of `.lrc` and `.mp4` (or `.mp3`) files.

2.  **Generate Data File**
    *   Create `src/HelloWorld/[SongName]Data.ts`
    *   Use `staticFile("suno_PJ/done/[filename].mp4")` for videoSource

3.  **Generate Video Component**
    *   Use `SabishigariOniVideo.tsx` as the template for vertical lyric style.
    *   **Key Style Elements**:

    ### StandardLyricLine
    ```tsx
    style={{
        position: "absolute",
        top: 80,
        right: 80,
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        textAlign: "right",
        fontFamily: "'Shippori Mincho', 'Yuji Syuku', serif",
        fontWeight: 400,
        color: "#ffffff",
        textShadow: "0 0 8px rgba(255,255,255,0.3), 2px 2px 4px rgba(0,0,0,0.5)",
        letterSpacing: "0.15em",
        lineHeight: 1.8,
        maxHeight: "70vh",
    }}
    ```

    ### Animation
    - **Fade**: Slow fade in (30 frames), very slow fade out (60 frames)
    - **Drift**: Subtle horizontal floating `Math.sin(frame * 0.02) * 3`
    - **EmphasisLine**: Add glow pulse `10 + Math.sin(frame * 0.08) * 5`

    ### FinalLyricLine
    - Position: Center screen with vertical writing
    - Very slow fade out (120 frames)
    - Optional: Split text for staggered fade effect

    ### No Opening Title
    - Skip the OpeningTitle Sequence for this style

4.  **Register Composition**
    *   Edit `src/Root.tsx`
    *   Add new Composition with 1920x1080, 30fps
    *   Duration: Last timestamp + 12-15 seconds buffer

5.  **Move Processed Files**
    *   Move files from `new` to `done` folder

6.  **Start Development Server**
    *   Run `npm run dev` to preview

## Style Guidelines

| Element | Value |
|---------|-------|
| Writing Mode | `vertical-rl` |
| Position | Top-right (`top: 80, right: 80`) |
| Font | Shippori Mincho, Yuji Syuku |
| Color | White (#ffffff) |
| Fade Out | 60-120 frames (slow/dramatic) |
| Effect | Subtle drift + optional glow |

## Template Reference

Use `SabishigariOniVideo.tsx` as the golden master for vertical lyric style.
