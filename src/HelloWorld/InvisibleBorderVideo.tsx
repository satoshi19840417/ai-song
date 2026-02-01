import { AbsoluteFill, useCurrentFrame, useVideoConfig, Video, interpolate } from "remotion";
import { useMemo } from "react";
import { z } from "zod";
import "../index.css";
// @ts-ignore
import videoSource from "./AI戦争完成版.mp4";

export const invisibleBorderSchema = z.object({
    fontSize: z.number().min(20).max(200).step(1),
    topOffset: z.number().min(0).max(1000).step(10).describe("Vertical position from top (px)"),
    lyrics: z.array(z.object({
        timeTag: z.string(),
        text: z.string(),
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

export const InvisibleBorderVideo: React.FC<z.infer<typeof invisibleBorderSchema>> = ({
    fontSize,
    topOffset,
    lyrics,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTime = frame / fps;

    const parsedLyrics = useMemo(() => {
        return lyrics.map(l => ({
            time: parseTimeTag(l.timeTag),
            text: l.text
        })).sort((a, b) => a.time - b.time);
    }, [lyrics]);

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Video
                src={videoSource}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            {/* OPENING TITLE SEQUENCE */}
            {(() => {
                const titleStart = 1;
                const titleEnd = 12;
                if (currentTime >= titleStart && currentTime < titleEnd) {
                    const relativeTime = currentTime - titleStart;
                    const text = "Invisible Border";

                    // Exit phase
                    const isExiting = currentTime > (titleEnd - 2);
                    const exitTime = isExiting ? currentTime - (titleEnd - 2) : 0;

                    const exitOpacity = interpolate(exitTime, [0, 1], [1, 0], { extrapolateRight: "clamp" });
                    const exitBlur = interpolate(exitTime, [0, 1], [0, 20], { extrapolateRight: "clamp" });
                    const exitScale = interpolate(exitTime, [0, 2], [1, 1.5], { extrapolateRight: "clamp" });

                    return (
                        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                            <div style={{
                                fontFamily: "'Noto Sans JP', sans-serif",
                                fontWeight: 900,
                                // Title is massive
                                fontSize: fontSize * 2,
                                color: "#fff",
                                textShadow: "0 0 20px rgba(0, 255, 255, 0.8), 4px 4px 0px rgba(0,0,0,1)",
                                letterSpacing: "0.1em",
                                display: "flex",
                                opacity: exitOpacity,
                                filter: `blur(${exitBlur}px)`,
                                transform: `scale(${exitScale})`,
                            }}>
                                {text.split("").map((char, i) => {
                                    const charDelay = i * 0.1; // Slower decode for title
                                    const charTime = relativeTime - charDelay;

                                    const flicker = Math.sin(charTime * 30) > 0.5 ? 1 : 0.2;
                                    const baseOpacity = interpolate(charTime, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
                                    const opacity = baseOpacity * (charTime < 1 ? flicker : 1);

                                    const y = interpolate(charTime, [0, 0.5], [50, 0], { extrapolateRight: "clamp" });

                                    return (
                                        <span key={i} style={{
                                            display: "inline-block",
                                            opacity,
                                            transform: `translateY(${y}px)`,
                                            minWidth: char === " " ? "0.5em" : "auto",
                                        }}>
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>
                        </AbsoluteFill>
                    );
                }
                return null;
            })()}

            {parsedLyrics.map((lyric, index) => {
                const nextLyric = parsedLyrics[index + 1];
                const startTime = lyric.time;

                if (currentTime < startTime) return null;

                const relativeTime = currentTime - startTime;

                const isLastLine = index === parsedLyrics.length - 1;

                // DECODE / GLITCH ENTER
                // EXIT ANIMATION

                let endTime = nextLyric ? nextLyric.time : lyric.time + 5;
                if (isLastLine) {
                    endTime = lyric.time + 10; // Extend last line duration significantly (10s)
                }

                if (currentTime > endTime) return null;

                // Normal lines: quick signal loss. Last line: slow cinematic fade.
                const isExiting = currentTime > (endTime - (isLastLine ? 3 : 0.3));
                const exitTime = isExiting ? currentTime - (endTime - (isLastLine ? 3 : 0.3)) : 0;
                const exitDuration = isLastLine ? 3 : 0.3; // 3s fade for last line

                // EXIT ANIMATION
                const exitOpacity = interpolate(exitTime, [0, exitDuration], [1, 0], { extrapolateRight: "clamp" });

                // Normal: Stretch. Last line: No stretch, just blur and fade.
                const exitScaleX = isLastLine
                    ? 1
                    : interpolate(exitTime, [0, exitDuration], [1, 3], { extrapolateRight: "clamp" });

                const exitBlur = interpolate(exitTime, [0, exitDuration], [0, isLastLine ? 20 : 10], { extrapolateRight: "clamp" });
                const exitScale = isLastLine
                    ? interpolate(exitTime, [0, exitDuration], [1, 1.1], { extrapolateRight: "clamp" }) // Slow drift forward
                    : 1;

                return (
                    <AbsoluteFill
                        key={index}
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            // Last line: Center vertically (using top 50% + translateY, or flex center of full screen)
                            // Let's use full screen flex for last line to guarantee center
                            top: isLastLine ? 0 : topOffset,
                            bottom: isLastLine ? 0 : undefined,
                            height: isLastLine ? "100%" : 200,
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            width: '80%',
                            opacity: exitOpacity,
                            transform: `scaleX(${exitScaleX}) scale(${exitScale})`,
                            filter: `blur(${exitBlur}px)`,
                        }}>
                            {lyric.text.split("").map((char, i) => {
                                // Per-character decode effect
                                // They arrive rapidly
                                const charDelay = i * 0.03; // Fast typing
                                const charTime = relativeTime - charDelay;

                                // Glitch flicker during entry
                                const flicker = Math.sin(charTime * 50) > 0.5 ? 1 : 0.4;
                                const baseOpacity = interpolate(charTime, [0, 0.1], [0, 1], { extrapolateRight: "clamp" });
                                const opacity = baseOpacity * (charTime < 0.5 ? flicker : 1); // Flicker only at start

                                const y = interpolate(charTime, [0, 0.2], [10, 0], { extrapolateRight: "clamp" });
                                const s = interpolate(charTime, [0, 0.2], [1.5, 1], { extrapolateRight: "clamp" }); // Slam in

                                return (
                                    <span key={i} style={{
                                        fontFamily: "'Noto Sans JP', sans-serif",
                                        fontWeight: 900,
                                        fontSize: isLastLine ? fontSize * 1.5 : fontSize, // Increase size for last line
                                        color: "#fff",
                                        // Cyan glow + black hard shadow
                                        textShadow: "0 0 15px rgba(0, 255, 255, 0.9), 2px 2px 0px rgba(0,0,0,1)",
                                        display: 'inline-block',
                                        opacity,
                                        transform: `translateY(${y}px) scale(${s})`,
                                        minWidth: char === " " ? "0.5em" : "auto",
                                    }}>
                                        {char}
                                    </span>
                                );
                            })}
                        </div>
                    </AbsoluteFill>
                );
            })}
        </AbsoluteFill>
    );
};
