/* eslint-disable no-irregular-whitespace */
import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    Video,
    Audio,
    Sequence,
    useCurrentFrame,
    interpolateColors,
} from "remotion";
import { z } from "zod";

// Schema for props
export const sabishigariOniSchema = z.object({
    fontSize: z.number().default(40),
    bottomOffset: z.number().default(100),
    title: z.string(),
    artist: z.string(),
    videoSource: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
        })
    ),
});

// Helper: Parse LRC time tags "[mm:ss.SS]"
const parseTime = (tag: string) => {
    const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseFloat(match[2]);
};

// Component: Standard Lyric Line - Vertical writing, right-top aligned, fragile aesthetic
const StandardLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Slow fade in, very slow fade out (fragile feeling)
    const opacity = interpolate(
        frame,
        [0, 30, duration - 60, duration],
        [0, 0.95, 0.95, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Subtle floating drift
    const driftX = Math.sin(frame * 0.02) * 3;

    return (
        <div
            style={{
                position: "absolute",
                top: 80,
                right: 80,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                textAlign: "right",
                fontSize: fontSize,
                fontFamily: "'Shippori Mincho', 'Yuji Syuku', serif",
                fontWeight: 400,
                color: "#ffffff",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.5)",
                opacity,
                transform: `translateX(${driftX}px)`,
                letterSpacing: "0.15em",
                lineHeight: 1.8,
                maxHeight: "70vh",
            }}
        >
            {text}
        </div>
    );
};

// Component: Emphasis Lyric Line - Vertical writing with subtle glow for emphasis
const EmphasisLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Slow fade in, very slow fade out
    const opacity = interpolate(
        frame,
        [0, 30, duration - 60, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Subtle floating drift
    const driftX = Math.sin(frame * 0.02) * 3;

    // Subtle glow pulse for emphasis
    const glowIntensity = 10 + Math.sin(frame * 0.08) * 5;

    return (
        <div
            style={{
                position: "absolute",
                top: 80,
                right: 80,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                textAlign: "right",
                fontSize: fontSize * 1.1,
                fontFamily: "'Shippori Mincho', 'Yuji Syuku', serif",
                fontWeight: 500,
                color: "#ffffff",
                textShadow: `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.5)`,
                opacity,
                transform: `translateX(${driftX}px)`,
                letterSpacing: "0.15em",
                lineHeight: 1.8,
                maxHeight: "70vh",
            }}
        >
            {text}
        </div>
    );
};

// Component: Final Lyric Line - Staggered fade: first part fades earlier, main title fades later
const FinalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Split text for staggered fade effect
    // Expected format: "これは寂しがり屋な鬼の唄" -> ["これは", "寂しがり屋な鬼の唄"]
    const splitIndex = text.indexOf("寂しがり");
    const firstPart = splitIndex > 0 ? text.slice(0, splitIndex) : "";
    const mainPart = splitIndex > 0 ? text.slice(splitIndex) : text;

    // First part: fades out earlier
    const firstPartOpacity = interpolate(
        frame,
        [0, 60, duration - 180, duration - 90],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Main part: fades out later (stays longer)
    const mainPartOpacity = interpolate(
        frame,
        [0, 60, duration - 120, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Subtle floating drift
    const driftY = Math.sin(frame * 0.015) * 5;

    // Subtle glow pulse
    const glowIntensity = 12 + Math.sin(frame * 0.06) * 6;

    const baseStyle: React.CSSProperties = {
        writingMode: "vertical-rl",
        textOrientation: "mixed",
        fontFamily: "'Shippori Mincho', 'Yuji Syuku', serif",
        fontWeight: 400,
        color: "#ffffff",
        textShadow: `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.4), 3px 3px 6px rgba(0, 0, 0, 0.5)`,
        letterSpacing: "0.2em",
        lineHeight: 1.8,
    };

    return (
        <>
            {/* First part "これは" - top-right like other lyrics, fades out earlier */}
            {firstPart && (
                <div
                    style={{
                        position: "absolute",
                        top: 80,
                        right: 80,
                        writingMode: "vertical-rl",
                        textOrientation: "mixed",
                        textAlign: "right",
                        fontSize: fontSize,
                        fontFamily: "'Shippori Mincho', 'Yuji Syuku', serif",
                        fontWeight: 400,
                        color: "#ffffff",
                        textShadow: "0 0 8px rgba(255, 255, 255, 0.3), 2px 2px 4px rgba(0, 0, 0, 0.5)",
                        opacity: firstPartOpacity,
                        letterSpacing: "0.15em",
                        lineHeight: 1.8,
                    }}
                >
                    {firstPart}
                </div>
            )}
            {/* Main title "寂しがり屋な鬼の唄" - center, larger, fades out later */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) translateY(${driftY}px)`,
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    textAlign: "center",
                    fontSize: fontSize * 1.8,
                    fontFamily: "'Shippori Mincho', 'Yuji Syuku', serif",
                    fontWeight: 400,
                    color: "#ffffff",
                    textShadow: `0 0 ${glowIntensity}px rgba(255, 255, 255, 0.5), 3px 3px 8px rgba(0, 0, 0, 0.6)`,
                    opacity: mainPartOpacity,
                    letterSpacing: "0.25em",
                    lineHeight: 1.8,
                }}
            >
                {mainPart}
            </div>
        </>
    );
};

// Component: Opening Title - Oni/Setsubun themed with typewriter effect
const OpeningTitle: React.FC<{
    title: string;
    artist: string;
}> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const duration = 330; // 11 seconds

    // Typewriter effect for title
    const charsPerFrame = 0.12;
    const visibleTitleChars = Math.min(title.length, Math.floor(frame * charsPerFrame));
    const displayTitle = title.slice(0, visibleTitleChars);
    const showCursor = frame < title.length / charsPerFrame + 30;

    // Artist appears after title is typed
    const artistStartFrame = Math.ceil(title.length / charsPerFrame) + 15;
    const visibleArtistChars = Math.min(
        artist.length,
        Math.max(0, Math.floor((frame - artistStartFrame) * charsPerFrame * 1.5))
    );
    const displayArtist = artist.slice(0, visibleArtistChars);

    // Fade out at end
    const opacity = interpolate(
        frame,
        [0, 15, duration - 40, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Gentle floating animation
    const floatY = Math.sin(frame * 0.03) * 5;

    // Sparkling glow intensity
    const glowIntensity = 12 + Math.sin(frame * 0.12) * 6;

    // Title color gradient animation (deep red tones)
    const titleColor = interpolateColors(
        frame,
        [0, duration / 2, duration],
        ["#dc143c", "#8b0000", "#dc143c"]
    );

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                opacity,
                transform: `translateY(${floatY}px)`,
            }}
        >
            {/* Decorative oni mask symbols */}
            <div style={{
                position: "absolute",
                fontSize: 50,
                opacity: 0.25,
                top: "28%",
                left: "22%",
                transform: `rotate(-10deg) scale(${1 + Math.sin(frame * 0.06) * 0.08})`,
                color: "#8b0000",
                textShadow: "0 0 20px rgba(139, 0, 0, 0.6)",
            }}>👹</div>
            <div style={{
                position: "absolute",
                fontSize: 35,
                opacity: 0.2,
                top: "35%",
                right: "25%",
                transform: `rotate(15deg) scale(${1 + Math.sin(frame * 0.08 + 1) * 0.08})`,
                color: "#654321",
                textShadow: "0 0 15px rgba(101, 67, 33, 0.5)",
            }}>●</div>

            {/* Main Title */}
            <h1
                style={{
                    fontFamily: "'Yuji Syuku', serif",
                    fontSize: 80,
                    fontWeight: 600,
                    color: titleColor,
                    marginBottom: 25,
                    textShadow: `
                        0 0 ${glowIntensity}px rgba(139, 0, 0, 0.8),
                        0 0 ${glowIntensity * 2}px rgba(220, 20, 60, 0.4),
                        3px 3px 6px rgba(0, 0, 0, 0.7)
                    `,
                    letterSpacing: "0.08em",
                    minHeight: "1.2em",
                }}
            >
                {displayTitle}
                {showCursor && visibleTitleChars < title.length && (
                    <span style={{
                        opacity: Math.sin(frame * 0.3) > 0 ? 0.8 : 0.2,
                        color: "#ffffff",
                    }}>│</span>
                )}
            </h1>

            {/* Artist Name */}
            {visibleArtistChars > 0 && (
                <h2
                    style={{
                        fontFamily: "'Zen Kurenaido', sans-serif",
                        fontSize: 38,
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: `
                            0 0 10px rgba(139, 0, 0, 0.5),
                            2px 2px 4px rgba(0, 0, 0, 0.5)
                        `,
                        letterSpacing: "0.1em",
                    }}
                >
                    {displayArtist}
                </h2>
            )}

            {/* Subtitle decoration line */}
            <div style={{
                width: interpolate(frame, [artistStartFrame, artistStartFrame + 40], [0, 200], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                height: 2,
                background: "linear-gradient(90deg, transparent, #8b0000, transparent)",
                marginTop: 15,
                opacity: frame > artistStartFrame ? 0.7 : 0,
            }} />
        </div>
    );
};

export const SabishigariOniVideo: React.FC<z.infer<typeof sabishigariOniSchema>> = (props) => {
    const { fps } = useVideoConfig();

    const parsedLyrics = props.lyrics.map(l => ({
        ...l,
        seconds: parseTime(l.timeTag)
    }));

    return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
            <Video
                src={props.videoSource}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />
            <Audio src={props.videoSource} />

            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                // Duration calculation
                let durationFrames;
                if (nextLine) {
                    durationFrames = Math.max(1, Math.round((nextLine.seconds - line.seconds) * fps));
                } else {
                    durationFrames = 360; // 12 seconds for final line with ending effect
                }

                // Check for emphasis - key emotional phrases
                const isEmphasis =
                    line.text.includes("鬼") ||
                    line.text.includes("福") ||
                    line.text.includes("バイバイ") ||
                    line.text.includes("痛い") ||
                    line.text.includes("寂しがり");
                const isLastLine = !nextLine;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        {isLastLine ? (
                            <FinalLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        ) : isEmphasis ? (
                            <EmphasisLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                                bottomOffset={props.bottomOffset}
                            />
                        ) : (
                            <StandardLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                                bottomOffset={props.bottomOffset}
                            />
                        )}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
