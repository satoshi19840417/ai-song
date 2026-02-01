
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Video, staticFile, spring, interpolate, Easing, Sequence } from "remotion";
import { lrcContent, parseLrc } from "./lrc";
import { useMemo } from "react";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import "./index.css";

const defaultLyrics = parseLrc(lrcContent);

// Keywords to emphasize
const EMPHASIS_KEYWORDS = ["Midnight", "Meow", "下僕", "猫", "Cat", "Pathetic", "Hmph"];
const IMPACT_LINES = ["それだけで済む話でしょう？"];
const LAUGH_LINES = ["嘲笑ってあげるから"];

export const kineticTypographySchema = z.object({
    primaryColor: zColor(),
    secondaryColor: zColor(),
    glowIntensity: z.number().min(0).max(10).step(0.1),
    videoOpacity: z.number().min(0).max(1).step(0.05),
    mainFontSize: z.number().min(10).max(200).step(1),
    emphasisFontSize: z.number().min(10).max(400).step(1),
    animationSpeed: z.number().min(0.1).max(5).step(0.1),
    scaleIntensity: z.number().min(0.1).max(3).step(0.1),
    lyricsData: z.array(z.object({
        timeString: z.string(),
        text: z.string(),
    })),
});

const ImpactfulLyricEvent: React.FC<{
    text: string;
    primaryColor: string;
    secondaryColor: string;
    glowIntensity: number;
    mainFontSize: number;
    animationSpeed: number;
}> = ({
    text,
    primaryColor,
    secondaryColor,
    glowIntensity,
    mainFontSize,
    animationSpeed,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();

        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 40px",
                    flexDirection: "row", // Ensure characters are side-by-side
                }}
            >
                {text.split("").map((char, index) => {
                    const delay = index * 3;
                    const charFrame = frame - delay;

                    // If before start time, don't show
                    if (charFrame < 0) return null;

                    const opacity = interpolate(charFrame, [0, 5], [0, 1]);

                    // Huge scale impact
                    const scale = spring({
                        frame: charFrame,
                        fps,
                        config: { damping: 10, stiffness: 200, mass: 0.5 },
                        from: 5,
                        to: 1
                    });

                    // Periodic shake
                    const shakeX = Math.sin(frame * 0.5) * (charFrame < 20 ? 10 : 2);
                    const shakeY = Math.cos(frame * 0.7) * (charFrame < 20 ? 10 : 2);

                    const currentGlow = interpolate(charFrame, [0, 10], [glowIntensity * 5, glowIntensity]);

                    return (
                        <span
                            key={index}
                            style={{
                                display: "inline-block",
                                fontSize: mainFontSize * 1.5,
                                fontWeight: 900,
                                color: secondaryColor,
                                fontFamily: "'Segoe UI', Impact, sans-serif",
                                opacity,
                                transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
                                textShadow: `
                                0 0 ${10 * currentGlow}px ${primaryColor},
                                0 0 ${30 * currentGlow}px ${primaryColor},
                                0 0 ${60 * currentGlow}px ${primaryColor},
                                0 0 ${100 * currentGlow}px ${primaryColor}
                            `,
                                margin: "0 2px",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
        );
    };


const LaughingLyricEvent: React.FC<{
    text: string;
    primaryColor: string;
    secondaryColor: string;
    mainFontSize: number;
    glowIntensity: number;
}> = ({
    text,
    primaryColor,
    secondaryColor,
    mainFontSize,
    glowIntensity,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();

        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 40px",
                    flexDirection: "row",
                }}
            >
                {text.split("").map((char, index) => {
                    const delay = index * 2;
                    const charFrame = frame - delay;

                    if (charFrame < 0) return null;

                    const opacity = interpolate(charFrame, [0, 5], [0, 1]);

                    // Scale up one by one (laughing start)
                    const scaleSpring = spring({
                        frame: charFrame,
                        fps,
                        config: { damping: 12, stiffness: 200 },
                        from: 0,
                        to: 1
                    });

                    // Laughing shake: fast, jittery rotation and translation
                    const shakeX = Math.sin(frame * 1.5 + index) * 5;
                    const shakeY = Math.cos(frame * 1.2 + index) * 5;
                    const rotate = Math.sin(frame * 0.8 + index) * 10; // More rotation

                    // Pulsing scale for "laughing" effect
                    const pulse = 1 + Math.sin(frame * 0.8) * 0.1;

                    return (
                        <span
                            key={index}
                            style={{
                                display: "inline-block",
                                fontSize: mainFontSize * 1.2,
                                fontWeight: 900,
                                color: secondaryColor,
                                fontFamily: "'Segoe UI', Impact, sans-serif",
                                opacity,
                                transform: `translate(${shakeX}px, ${shakeY}px) rotate(${rotate}deg) scale(${scaleSpring * pulse})`,
                                textShadow: `
                                0 0 ${10 * glowIntensity}px ${primaryColor},
                                0 0 ${20 * glowIntensity}px ${primaryColor}
                            `,
                                margin: "0 2px",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
        );
    };

const LyricEvent: React.FC<{
    text: string;
    primaryColor: string;
    secondaryColor: string;
    glowIntensity: number;
    mainFontSize: number;
    emphasisFontSize: number;
    animationSpeed: number;
    scaleIntensity: number;
}> = ({
    text,
    primaryColor,
    secondaryColor,
    glowIntensity,
    mainFontSize,
    emphasisFontSize,
    animationSpeed,
    scaleIntensity,
}) => {
        const frame = useCurrentFrame();
        const { fps } = useVideoConfig();

        // frame is already relative to the start of this sequence!
        const frameSinceStart = frame;

        const animation = useMemo(() => {
            // Entry spring
            const spr = spring({
                frame: frameSinceStart,
                fps,
                config: { damping: 12, stiffness: 200 }
            });

            // Beat bounce
            // Use frameSinceStart instead of absolute frame to make it deterministic relative to start of lyric
            const beat = Math.sin(frameSinceStart / 5 * animationSpeed) * (5 * scaleIntensity);

            // Slide effect
            const slide = interpolate(frameSinceStart, [0, 50], [20 * scaleIntensity, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.ease) });

            // Glow pulse
            const glow = interpolate(Math.sin(frameSinceStart / 10 * animationSpeed), [-1, 1], [0.5, 1]);

            return {
                opacity: Math.min(1, frameSinceStart / 5),
                scale: spr,
                y: beat + slide,
                rotate: interpolate(frameSinceStart, [0, 100], [-2 * scaleIntensity, 2 * scaleIntensity], { extrapolateRight: "clamp" }),
                glowIntensity: glow
            };
        }, [frameSinceStart, fps, animationSpeed, scaleIntensity]);

        const isEmphasis = useMemo(() => {
            return EMPHASIS_KEYWORDS.some(k => text.includes(k));
        }, [text]);

        return (
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column"
                }}
            >
                <div style={{
                    textAlign: "center",
                    fontSize: isEmphasis ? emphasisFontSize : mainFontSize,
                    fontWeight: 900,
                    color: secondaryColor,
                    fontFamily: "'Segoe UI', Impact, sans-serif",
                    padding: "0 40px",

                    textShadow: `
                    0 0 ${10 * animation.glowIntensity * glowIntensity}px ${primaryColor},
                    0 0 ${20 * animation.glowIntensity * glowIntensity}px ${primaryColor},
                    0 0 ${40 * animation.glowIntensity * glowIntensity}px ${primaryColor},
                    0 0 ${80 * animation.glowIntensity * glowIntensity}px ${primaryColor}
                `,

                    opacity: animation.opacity,
                    transform: `
                    scale(${animation.scale * (isEmphasis ? 1.2 : 1)}) 
                    translateY(${animation.y}px)
                    rotate(${animation.rotate}deg)
                `,
                    transition: "font-size 0.2s ease-out"
                }}>
                    {text.split("|").map((line, index) => (
                        <div key={index}>{line.trim()}</div>
                    ))}
                </div>
            </div>
        );
    };

export const KineticTypography: React.FC<z.infer<typeof kineticTypographySchema>> = ({
    primaryColor,
    secondaryColor,
    glowIntensity,
    videoOpacity,
    mainFontSize,
    emphasisFontSize,
    animationSpeed,
    scaleIntensity,
    lyricsData,
}) => {
    const { fps } = useVideoConfig();

    const lyrics = useMemo(() => {
        return lyricsData.map(item => {
            // Parse time string back to seconds. Support both dot and colon separators.
            const timeRegex = /\[?(\d{2}):(\d{2})[.:](\d{2,3})\]?/;
            const match = item.timeString.match(timeRegex);
            let time = 0;
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseFloat(match[2]);
                time = minutes * 60 + seconds;
            }
            return { time, text: item.text };
        }).sort((a, b) => a.time - b.time);
    }, [lyricsData]);

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Video
                src={staticFile("video.mp4")}
                style={{ width: "100%", height: "100%", objectFit: "contain", opacity: videoOpacity }}
            />

            {lyrics.map((lyric, index) => {
                const nextLyric = lyrics[index + 1];
                const durationInFrames = nextLyric
                    ? (nextLyric.time - lyric.time) * fps
                    : 150; // Default 5 seconds for last lyric

                const isImpactLine = IMPACT_LINES.some(line => lyric.text.includes(line));
                const isLaughLine = LAUGH_LINES.some(line => lyric.text.includes(line));

                return (
                    <Sequence
                        key={`${index}-${lyric.text}`}
                        from={Math.round(lyric.time * fps)}
                        durationInFrames={Math.round(durationInFrames)}
                        name={lyric.text.replace(/\s+/g, ' ').substring(0, 30)} // Shorten for timeline readability
                    >
                        {isImpactLine ? (
                            <ImpactfulLyricEvent
                                text={lyric.text}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                                glowIntensity={glowIntensity}
                                mainFontSize={mainFontSize}
                                animationSpeed={animationSpeed}
                            />
                        ) : isLaughLine ? (
                            <LaughingLyricEvent
                                text={lyric.text}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                                glowIntensity={glowIntensity}
                                mainFontSize={mainFontSize}
                            />
                        ) : (
                            <LyricEvent
                                text={lyric.text}
                                primaryColor={primaryColor}
                                secondaryColor={secondaryColor}
                                glowIntensity={glowIntensity}
                                mainFontSize={mainFontSize}
                                emphasisFontSize={emphasisFontSize}
                                animationSpeed={animationSpeed}
                                scaleIntensity={scaleIntensity}
                            />
                        )}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
