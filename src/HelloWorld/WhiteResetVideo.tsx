import { AbsoluteFill, useCurrentFrame, useVideoConfig, Video, spring, interpolate } from "remotion";
import { useMemo } from "react";
import { z } from "zod";
import "../index.css";
import { whiteResetData } from "./WhiteResetData";

export const whiteResetSchema = z.object({
    fontSize: z.number().min(10).max(200).step(1),
    rightOffset: z.number().min(0).max(1000).step(10).describe("Distance from right edge"),
    topOffset: z.number().min(0).max(1000).step(10).describe("Distance from top edge"),
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

export const WhiteResetVideo: React.FC<z.infer<typeof whiteResetSchema>> = ({
    fontSize,
    rightOffset,
    topOffset,
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
                src={whiteResetData.videoSource}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            {/* Render all active lyrics */}
            {parsedLyrics.map((lyric, index) => {
                const nextLyric = parsedLyrics[index + 1];
                const startTime = lyric.time;

                const isEnding = lyric.text.includes("真っ白な　明日へ") || lyric.text.includes("僕らの　リセット・ボタン");
                const isTitle = lyric.text === "ホワイト・リセット";

                // Default end time is next lyric start.
                // If it is the last lyric, extend duration significantly (15s) for an impressive ending.
                // Special handling for Title: allow it to overlap and persist for longer (8 seconds)
                let endTime = nextLyric ? nextLyric.time : lyric.time + 15;
                if (isTitle) {
                    endTime = lyric.time + 8;
                }

                const lingerDuration = 0.6;

                if (effectiveTime < startTime || effectiveTime > endTime + lingerDuration) {
                    return null;
                }

                const animationTime = effectiveTime - startTime;
                const timeSinceExitStart = effectiveTime - endTime;
                const isExiting = timeSinceExitStart > 0;

                const containerStyle: React.CSSProperties = isTitle ? {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 20,
                    // writingMode default is horizontal
                } : isEnding ? {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0, // Fill screen to center
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10, // Higher z-index
                    writingMode: "vertical-rl",
                } : {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: rightOffset,
                    width: "15%",
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    paddingTop: topOffset,
                    zIndex: 5,
                    writingMode: "vertical-rl",
                };

                // EXIT ANIMATION
                let exitOpacity = 1;
                if (isExiting) {
                    const duration = (isEnding || isTitle) ? 1.5 : lingerDuration; // Slower fade out for ending/title
                    const exitProgress = interpolate(timeSinceExitStart, [0, duration], [0, 1], { extrapolateRight: "clamp" });
                    exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
                }

                // ENTRY ANIMATION
                const currentFrameRel = animationTime * fps;
                const entryOpacity = interpolate(currentFrameRel, [0, (isEnding || isTitle) ? 60 : 30], [0, 1], { extrapolateRight: "clamp" });

                const totalOpacity = isExiting ? exitOpacity : entryOpacity;

                // Special style overrides
                const currentFontSize = isTitle ? fontSize * 2.5 : (isEnding ? fontSize * 1.8 : fontSize);
                const currentShadow = (isEnding || isTitle)
                    ? "0px 0px 30px rgba(255, 255, 255, 0.8), 0px 0px 60px rgba(255, 255, 255, 0.4)"
                    : "0px 0px 10px rgba(0,0,0,0.5), 2px 2px 4px rgba(0,0,0,0.8)";
                const currentColor = "white";

                return (
                    <div
                        key={`${index}-${lyric.text}`}
                        style={{
                            ...containerStyle,
                            opacity: totalOpacity,
                        }}
                    >
                        <div style={{
                            fontSize: currentFontSize,
                            fontWeight: isEnding ? 600 : 400, // Bolder for ending
                            color: currentColor,
                            textShadow: currentShadow,
                            fontFamily: "'Zen Kurenaido', sans-serif",
                            padding: "20px 0",
                            letterSpacing: "0.1em",
                        }}>
                            {lyric.text}
                        </div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};
