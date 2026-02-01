import { AbsoluteFill, useCurrentFrame, useVideoConfig, Video, spring, interpolate } from "remotion";
import { useMemo } from "react";
import { z } from "zod";
import "../index.css";
import { kamisamaData } from "./KamisamaData";

export const kamisamaVideoSchema = z.object({
    fontSize: z.number().min(10).max(200).step(1),
    bottomOffset: z.number().min(0).max(1000).step(10),
    timeShift: z.number().min(-10).max(10).step(0.1).describe("Global timing adjustment (seconds)"),
    lyrics: z.array(z.object({
        timeTag: z.string(),
        text: z.string(),
        offset: z.number().optional().describe("Per-line timing adjustment (seconds)"),
    })),
});

const parseTimeTag = (tag: string): number => {
    const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
    if (match) {
        const minutes = parseInt(match[1], 10);
        const seconds = parseFloat(match[2]);
        return minutes * 60 + seconds;
    }
    return 0;
};

export const KamisamaVideo: React.FC<z.infer<typeof kamisamaVideoSchema>> = ({
    fontSize,
    bottomOffset,
    timeShift,
    lyrics,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;
    const effectiveTime = currentTime - timeShift;

    // Convert props to usable structure
    const parsedLyrics = useMemo(() => {
        return lyrics.map(l => ({
            time: parseTimeTag(l.timeTag) + (l.offset || 0),
            text: l.text
        })).sort((a, b) => a.time - b.time);
    }, [lyrics]);

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Video
                src={kamisamaData.videoSource}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            {/* Render all active lyrics */}
            {parsedLyrics.map((lyric, index) => {
                const nextLyric = parsedLyrics[index + 1];
                const startTime = lyric.time;
                // Default end time is next lyric start, or +5s for last lyric
                const endTime = nextLyric ? nextLyric.time : lyric.time + 5;

                const lingerDuration = 0.6; // Allow time for slide out

                if (effectiveTime < startTime || effectiveTime > endTime + lingerDuration) {
                    return null;
                }

                const animationTime = effectiveTime - startTime;
                const timeSinceExitStart = effectiveTime - endTime;
                const isExiting = timeSinceExitStart > 0;

                const containerStyle: React.CSSProperties = {
                    position: "absolute",
                    bottom: bottomOffset,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 5,
                    whiteSpace: "nowrap", // Keep text on one line for sliding
                };

                // EXIT ANIMATION (Slide to Left)
                let exitX = 0;
                let exitOpacity = 1;
                if (isExiting) {
                    // Slide out to -100% (left)
                    // Use spring-like curve for exit to match entry feel or just ease
                    const exitProgress = interpolate(timeSinceExitStart, [0, lingerDuration], [0, 1], { extrapolateRight: "clamp" });
                    // Accelerate out
                    exitX = interpolate(exitProgress, [0, 1], [0, -100]);
                    // Fade out slightly at the very end
                    exitOpacity = interpolate(exitProgress, [0.8, 1], [1, 0]);
                }

                // ENTRY ANIMATION (Slide from Right)
                const currentFrameRel = animationTime * fps;
                const spr = spring({
                    frame: currentFrameRel,
                    fps,
                    config: { damping: 20, stiffness: 100, mass: 0.8 } // Slightly heavier for slide
                });

                // Start from 100% (right) and go to 0%
                const entryX = interpolate(spr, [0, 1], [100, 0]);

                // Combine transforms
                const totalX = isExiting ? exitX : entryX;

                // Playful animation for specific keywords
                const isPlayful = lyric.text.includes("神様");
                const isHumor = lyric.text.includes("ユーモア") || lyric.text.includes("悪ノリ");

                let rotate = 0;
                let scaleY = 1;

                if (isHumor) {
                    // More exaggerated for humor/bad prank
                    const wave = Math.sin(frame / 3); // Faster wave
                    rotate = wave * 8; // +/- 8 degrees (stronger rocking)
                    scaleY = 1 + (Math.sin(frame / 2) * 0.15); // Stronger squash/stretch
                } else if (isPlayful) {
                    const wave = Math.sin(frame / 5);
                    rotate = wave * 3; // +/- 3 degrees rocking
                    scaleY = 1 + (Math.sin(frame / 3) * 0.05); // Slight bouncy squash/stretch
                }

                return (
                    <div
                        key={`${index}-${lyric.text}`}
                        style={{
                            ...containerStyle,
                            transform: `translateX(${totalX}%) rotate(${rotate}deg) scaleY(${scaleY})`,
                            opacity: exitOpacity,
                        }}
                    >
                        <div style={{
                            textAlign: "center",
                            fontSize: fontSize,
                            fontWeight: 400,
                            color: "white",
                            textShadow: "2px 2px 0 #000",
                            fontFamily: "'Mochiy Pop One', sans-serif",
                            padding: "0 20px",
                            letterSpacing: "0.05em",
                        }}>
                            {lyric.text}
                        </div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
