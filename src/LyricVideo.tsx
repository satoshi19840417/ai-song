import { AbsoluteFill, useCurrentFrame, useVideoConfig, Video, spring, interpolate } from "remotion";
import { useMemo } from "react";
import { z } from "zod";
import "./index.css";
// @ts-ignore
import videoSource from "./HelloWorld/あなたが愛した人.mp4";

export const lyricVideoSchema = z.object({
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

export const LyricVideo: React.FC<z.infer<typeof lyricVideoSchema>> = ({
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
                src={videoSource}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            {/* Render all active lyrics */}
            {parsedLyrics.map((lyric, index) => {
                const nextLyric = parsedLyrics[index + 1];
                const startTime = lyric.time;
                // Default end time is next lyric start, or +5s for last lyric
                const endTime = nextLyric ? nextLyric.time : lyric.time + 5;

                const isSpecialLine = lyric.text.includes("ありがとう　愛してくれて");
                const lingerDuration = isSpecialLine ? 4 : 0.2; // Small fade for others

                // If handling special line, extend its "active" window
                // But also, we need to handle the overlap.
                // The loop should render this lyric if:
                // effectiveTime >= startTime && effectiveTime < endTime + lingerDuration

                if (effectiveTime < startTime || effectiveTime > endTime + lingerDuration) {
                    return null;
                }

                const animationTime = effectiveTime - startTime;
                // For special line, exit starts at 'endTime' (next lyric start) and lasts lingerDuration
                // For normal lines, exit starts a bit before 'endTime' usually? 
                // Actually, let's keep it simple: normal lines disappear when next starts (or very quick fade).
                // Special line stays for lingerDuration AFTER next starts.

                const timeSinceExitStart = effectiveTime - endTime;
                const isExiting = timeSinceExitStart > 0;

                // Special styling for the target line
                const isCentered = isSpecialLine;
                const containerStyle: React.CSSProperties = isCentered ? {
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: "100%",
                    transform: "translateY(-50%)", // Perfect center
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10, // Ensure on top
                } : {
                    position: "absolute",
                    bottom: bottomOffset,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 5,
                };

                // EXIT ANIMATION
                let exitOpacity = 1;
                let exitBlur = 0;
                let exitScale = 1;

                if (isExiting) {
                    const exitProgress = interpolate(timeSinceExitStart, [0, lingerDuration], [0, 1], { extrapolateRight: "clamp" });

                    if (isSpecialLine) {
                        // Lingering Fade Out: Blur + Scale + Opacity
                        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
                        exitBlur = interpolate(exitProgress, [0, 1], [0, 10]);
                        exitScale = interpolate(exitProgress, [0, 1], [1, 1.2]);
                    } else {
                        // Quick fade for normal lines
                        exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
                    }
                }

                // ENTRY ANIMATION (Char by Char)
                const currentFrameRel = animationTime * fps;

                return (
                    <div
                        key={`${index}-${lyric.text}`}
                        style={{
                            ...containerStyle,
                            opacity: exitOpacity,
                            filter: `blur(${exitBlur}px)`,
                            transform: `${containerStyle.transform || ''} scale(${exitScale})`,
                        }}
                    >
                        <div style={{
                            textAlign: "center",
                            fontSize: fontSize * (isSpecialLine ? 2 : 1), // Double size for special line
                            fontWeight: 400,
                            color: "white",
                            textShadow: "2px 2px 0 #000",
                            fontFamily: "'Yomogi', cursive, sans-serif",
                            padding: "0 20px",
                            letterSpacing: "0.05em",
                        }}>
                            <div style={{ display: "inline-block" }}>
                                {lyric.text.split("").map((char, i) => {
                                    const delay = i * 2;
                                    const charFrame = currentFrameRel - delay;

                                    const spr = spring({
                                        frame: charFrame,
                                        fps,
                                        config: { damping: 20, stiffness: 100, mass: 0.5 }
                                    });

                                    const opacity = interpolate(charFrame, [0, 5], [0, 1], { extrapolateRight: "clamp" });
                                    const scale = interpolate(spr, [0, 1], [0.8, 1]);
                                    const translateY = interpolate(spr, [0, 1], [5, 0]);

                                    return (
                                        <span
                                            key={i}
                                            style={{
                                                display: "inline-block",
                                                opacity,
                                                transform: `scale(${scale}) translateY(${translateY}px)`,
                                                minWidth: char.trim() === "" ? "0.5em" : "auto",
                                            }}
                                        >
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </AbsoluteFill>
    );
};

