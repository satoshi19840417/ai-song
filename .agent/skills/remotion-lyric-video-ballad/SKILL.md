---
name: remotion-lyric-video-ballad
description: Create a "Quiet Ballad Style" lyric video using Remotion. Features white text with pink highlights, gentle animations, and specific typography (Klee One, Dancing Script).
---

# Lyric Video: Quiet Ballad Style (おとなしめバラード風)

This skill guides the creation of a lyric video with a "Quiet Ballad" aesthetic. Ideally suited for emotional, slow-tempo songs where the focus should be on the lyrics and a gentle atmosphere.

## Characteristics
- **Visuals**: Primary White text (`#ffffff`) with Soft Pink (`#f48fb1`) highlights for key emotional words (e.g., "Spring", "Love").
- **Typography**: 
    - Lyrics: `Klee One` (Handwritten style)
    - Artist Name: `Dancing Script` (Cursive, Bold)
- **Decorations**: Subtle transparent underlines (`1.5px`) resembling stationery lines.
- **Animations**:
    - **Opening**: Title fades in at **Bottom-Left** (positioned below center).
    - **Lyrics**: Gentle fade-in/out, subtle scaling. No complex movements.
    - **Ending**: Song title appears 5s before end, fades out 0.5s before end.

## Usage

### 1. Prerequisite
Ensure the following fonts are available in `src/index.css` or loaded via `Google Fonts`:
- `Klee One`
- `Dancing Script`

### 2. Implementation Steps
1.  **Copy the Template**: 
    Use the provided template `resources/BalladVideoTemplate.tsx` as a base.
    
2.  **Customize Data**:
    - Update `PINK_KEYWORDS` const with words relevant to the song (e.g., "桜", "涙", "君").
    - Connect real `lyrics` data (LRC parsed).
    
3.  **Adjust Timings**:
    - If there are long interludes, manually cap the duration of the pre-interlude lyric line to ~5 seconds using the logic:
      ```typescript
      if (line.text === "Pre-interlude line") {
          durationFrames = Math.min(durationFrames, 150);
      }
      ```

4.  **Verify Layout**:
    - Title/Artist should be at the bottom-left with significant padding (`paddingBottom: 350` or similar) to sit "below center".

## Template Reference
See [BalladVideoTemplate.tsx](resources/BalladVideoTemplate.tsx) for the complete component structure.
