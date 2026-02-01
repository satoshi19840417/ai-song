import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    Video,
    Audio,
    Sequence,
    useCurrentFrame,
    spring,
} from "remotion";
import { z } from "zod";

// Schema for props
export const restartLineSchema = z.object({
    fontSize: z.number().default(55),
    bottomOffset: z.number().default(150), // Adjusted for lower position
    videoSource: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
        })
    ),
});

// Helper function to check if text contains emphasis keywords
const isEmphasisLine = (text: string): boolean => {
    return text.includes("スタートライン") || text.includes("新しい") || text.includes("風に乗れ");
};

// Lyric Line Component with pop/energetic animations
const RestartLineLyric: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const isEmphasis = isEmphasisLine(text);

    // Entry Animation: Slide in from bottom with bounce (spring)
    const entryProgress = spring({
        frame,
        fps,
        config: {
            damping: 10,
            stiffness: 100,
            mass: 0.8,
        },
    });

    const isLastLine = text.includes("新しい君が始まる");

    const exitDuration = 30; // 1 second exit

    // Special ending timing for the last line
    // It appears at 2:14.59 (134.6s). We want it to fade out around 2:33 (153s).
    // Seconds from start to fade start: 153 - 134.6 - 2 = 16.4s.
    const endingFadeOutStart = isLastLine ? fps * 16.5 : duration - exitDuration; // Starts fade around 2:31.1
    const endingFadeOutDuration = isLastLine ? fps * 2 : exitDuration; // 2 second fade (ends at 2:33.1)

    // Combined translateY: Entry (80 -> 0)
    const entryY = interpolate(entryProgress, [0, 1], [80, 0]);
    const exitY = isLastLine
        ? interpolate(frame, [endingFadeOutStart, endingFadeOutStart + endingFadeOutDuration], [0, -40], { extrapolateLeft: 'clamp' })
        : 0;
    const translateY = entryY + exitY;

    // Scale effect (bounce on entry + dramatic swell for last line)
    const lastLineSwell = isLastLine
        ? interpolate(frame, [endingFadeOutStart, endingFadeOutStart + endingFadeOutDuration], [1, 1.2], { extrapolateLeft: 'clamp' })
        : 1;

    const scale = isEmphasis
        ? interpolate(entryProgress, [0, 1], [0.5, 1.15])
        : interpolate(entryProgress, [0, 1], [0.7, 1]);

    const finalScale = scale * lastLineSwell;

    // Opacity: Fade in and Dramatic Fade out for last line
    const opacity = interpolate(
        frame,
        [0, 10, endingFadeOutStart, endingFadeOutStart + endingFadeOutDuration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Subtle Blur on exit
    const blur = interpolate(
        frame,
        [endingFadeOutStart, endingFadeOutStart + endingFadeOutDuration],
        [0, 8], // More blur for the last line
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Dynamic font size for emphasis
    const currentFontSize = isEmphasis ? fontSize * 1.2 : fontSize;

    // Neon glow colors
    const emphasisColor = "rgba(255, 50, 150, 0.8)";
    const emphasisSecondary = "rgba(255, 100, 50, 0.6)";
    const normalColor = "rgba(100, 200, 255, 0.6)";
    const normalSecondary = "rgba(0, 100, 255, 0.4)";

    // Last line special color (white/pink/blue)
    const lastLineGlow = "0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 100, 200, 0.7), 0 0 60px rgba(100, 200, 255, 0.5)";

    const glowShadow = isLastLine
        ? lastLineGlow
        : isEmphasis
            ? `0 0 15px ${emphasisColor}, 0 0 30px ${emphasisSecondary}`
            : `0 0 10px ${normalColor}, 0 0 20px ${normalSecondary}`;

    const isRepaintLine = text.includes("塗り替えていこう");

    // Repaint Progress: Starts after 20 frames, takes 40 frames
    const repaintProgress = spring({
        frame: frame - 20,
        fps,
        config: { stiffness: 40, damping: 20 },
    });

    const repaintGlow = isRepaintLine
        ? `0 0 15px rgba(0, 255, 200, ${repaintProgress}), 0 0 30px rgba(0, 200, 255, ${repaintProgress})`
        : "";

    return (
        <div
            style={{
                position: "absolute",
                bottom: isLastLine ? "50%" : `${bottomOffset}px`,
                left: "50%",
                transform: isLastLine
                    ? `translate(-50%, 50%) translateY(${translateY}px) scale(${finalScale})`
                    : `translate(-50%, 0) translateY(${translateY}px) scale(${finalScale})`,
                width: "90%",
                textAlign: "center",
                fontSize: isLastLine ? currentFontSize * 1.4 : currentFontSize,
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontWeight: (isEmphasis || isLastLine) ? 700 : 400,
                color: "white",
                textShadow: isRepaintLine ? `${glowShadow}, ${repaintGlow}` : glowShadow,
                opacity,
                filter: `blur(${blur}px)`,
                letterSpacing: isLastLine ? "0.1em" : "normal",
            }}
        >
            <div style={{ position: "relative", display: "inline-block" }}>
                {/* Repaint overlay effect */}
                {isRepaintLine && (
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        color: "#00ffcc",
                        clipPath: `inset(0 ${100 - repaintProgress * 100}% 0 0)`,
                        zIndex: 1,
                        textShadow: "0 0 15px rgba(0, 255, 200, 0.8), 0 0 30px rgba(0, 200, 255, 0.6)",
                        pointerEvents: "none",
                    }}>
                        {text}
                    </div>
                )}
                <span style={{ position: "relative", zIndex: 0 }}>
                    {text}
                </span>
                {/* Animated underline for "スタートライン" */}
                {text.includes("スタートライン") && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-12px",
                            left: 0,
                            height: "4px",
                            backgroundColor: "white",
                            boxShadow: `0 0 10px rgba(255, 255, 255, 0.8), 0 0 15px ${emphasisColor}, 0 0 25px ${emphasisSecondary}`,
                            borderRadius: "2px",
                            width: `${interpolate(
                                spring({
                                    frame: frame - 10, // Slight delay after text appears
                                    fps,
                                    config: { stiffness: 60, damping: 15 },
                                }),
                                [0, 1],
                                [0, 100]
                            )}%`,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

// Opening Title Component
const OpeningTitle: React.FC<{ fontSize: number }> = ({ fontSize }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Duration of the writing animation
    const writingDuration = 90;

    // Reveal progress from 0 (nothing) to 1 (full text)
    const revealProgress = Math.min(1, frame / writingDuration);

    // Smooth reveal using interpolate
    const clipWidth = interpolate(revealProgress, [0, 1], [0, 100]);

    const opacity = interpolate(
        frame,
        [0, 10, 120, 150],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Shine animation for the text
    const shineProgress = (frame % 60) / 60;
    const shinePos = interpolate(shineProgress, [0, 1], [-100, 200]);

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%)`,
                width: "100%",
                textAlign: "center",
                fontSize: fontSize * 2.4, // Slightly larger
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 700,
                color: "white",
                opacity,
                letterSpacing: "0.05em",
            }}
        >
            <div style={{
                display: "inline-block",
                position: "relative",
            }}>
                {/* Underline (Start Line) */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: 0,
                        width: `${clipWidth}%`,
                        height: "4px",
                        background: "linear-gradient(90deg, #ff00cc, #33ccff, #ff00cc)",
                        backgroundSize: "200% 100%",
                        boxShadow: "0 0 15px rgba(255, 0, 204, 0.8), 0 0 30px rgba(51, 204, 255, 0.6)",
                        borderRadius: "2px",
                        zIndex: 1,
                    }}
                />

                {/* Main Text with Shimmer */}
                <div style={{
                    position: "relative",
                    clipPath: `inset(0 ${100 - clipWidth}% 0 0)`,
                    padding: "0 20px",
                    background: `linear-gradient(110deg, #fff 40%, #ff80ff 50%, #fff 60%)`,
                    backgroundSize: "200% 100%",
                    backgroundPosition: `${shinePos}% 0`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
                }}>
                    Restart Line
                </div>

                {/* Sparkling particles */}
                {[...Array(6)].map((_, i) => {
                    const seed = i * 13.5;
                    const particleFrame = (frame + seed) % 45;
                    const pOpacity = interpolate(particleFrame, [0, 22.5, 45], [0, 1, 0]);
                    const pScale = interpolate(particleFrame, [0, 22.5, 45], [0.1, 1.2, 0.1]);
                    const pLeft = ((seed * 7) % 80) + 10;
                    const pTop = ((seed * 3) % 40) - 20;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: `${pLeft}%`,
                                top: `${pTop}%`,
                                width: "8px",
                                height: "8px",
                                backgroundColor: "white",
                                borderRadius: "50%",
                                opacity: pOpacity * revealProgress,
                                transform: `scale(${pScale})`,
                                boxShadow: "0 0 10px white, 0 0 20px #ffccff",
                                pointerEvents: "none",
                                zIndex: 2,
                            }}
                        />
                    );
                })}
            </div>

            {/* Simulated pen point/glimmer at the writing edge */}
            {revealProgress > 0 && revealProgress < 1 && (
                <div style={{
                    position: "absolute",
                    left: `calc(50% + ${(clipWidth - 50) * 8.5}px)`, // Adjusted multiplier for scale
                    top: "50%",
                    width: "12px",
                    height: "12px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    boxShadow: "0 0 20px white, 0 0 40px #ffccff",
                    transform: "translate(-50%, -50%)",
                    zIndex: 3,
                }} />
            )}
        </div>
    );
};

// Main Component
export const RestartLineVideo: React.FC<z.infer<typeof restartLineSchema>> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();

    // Parse lyrics helper
    const parsedLyrics = props.lyrics.map((l) => {
        const timeParts = l.timeTag.replace(/[\[\]]/g, "").split(":");
        const seconds = parseInt(timeParts[0]) * 60 + parseFloat(timeParts[1]);
        return { ...l, seconds };
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Video
                src={props.videoSource}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            <Audio src={props.videoSource} />

            {/* Opening title */}
            <Sequence  durationInFrames={180}>
                <OpeningTitle fontSize={props.fontSize} />
            </Sequence>

            {/* Lyrics */}
            {parsedLyrics.map((line, index) => {
                const startFrame = Math.floor(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                // If text is empty, it's a marker for interlude/silence
                if (!line.text.trim()) return null;

                const endSeconds = nextLine ? nextLine.seconds : line.seconds + 5;
                const durationFrames = Math.max(
                    30, // Minimum 1 second display
                    Math.floor((endSeconds - line.seconds) * fps)
                );

                // Handle last line extension handled inside component if necessary, 
                // but here we just ensure it lasts until the end or next marker.
                const finalDuration = (index === parsedLyrics.length - 1)
                    ? Math.max(0, durationInFrames - startFrame)
                    : durationFrames;

                return (
                    <Sequence
                        key={`${index}-${line.text}`}
                        from={startFrame}
                        durationInFrames={finalDuration}
                        layout="none"
                    >
                        <RestartLineLyric
                            text={line.text}
                            duration={finalDuration}
                            fontSize={props.fontSize}
                            bottomOffset={props.bottomOffset}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
