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
    spring,
} from "remotion";
import { z } from "zod";
import { audioFadeCurve } from "./animationUtils";

// Schema for props
export const hayazakiNoHaruSchema = z.object({
    fontSize: z.number().default(42),
    bottomOffset: z.number().default(110),
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

// ============================
// Falling Petal Particle
// ============================
const FallingPetal: React.FC<{
    x: number;
    delay: number;
    size: number;
    duration: number;
    color: string;
}> = ({ x, delay, size, duration, color }) => {
    const frame = useCurrentFrame();
    const f = Math.max(0, frame - delay);

    const y = interpolate(f, [0, duration], [-50, 1200], {
        extrapolateRight: "clamp",
    });
    const opacity = interpolate(
        f,
        [0, 30, duration - 60, duration],
        [0, 0.4, 0.3, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const rotate = Math.sin(f * 0.03 + delay) * 40;
    const sway = Math.sin(f * 0.02 + delay * 0.5) * 30;

    return (
        <div
            style={{
                position: "absolute",
                left: `calc(${x}% + ${sway}px)`,
                top: y,
                width: size,
                height: size * 0.7,
                borderRadius: "50% 0 50% 0",
                background: color,
                opacity,
                transform: `rotate(${rotate}deg)`,
                filter: "blur(1px)",
            }}
        />
    );
};

// ============================
// Standard Lyric Line (切ない雰囲気)
// ============================
const StandardLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Slow, gentle fade in/out
    const opacity = interpolate(
        frame,
        [0, 20, duration - 20, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Subtle upward drift (melancholic floating)
    const translateY = interpolate(
        frame,
        [0, duration],
        [8, -8],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Color: white with gentle lavender tint
    const color = interpolateColors(
        frame,
        [0, duration],
        ["#f0eef5", "#e8e0f0"]
    );

    // Gentle spring scale
    const spr = spring({
        frame,
        fps,
        config: { damping: 200, stiffness: 80 },
    });
    const scale = interpolate(spr, [0, 1], [0.95, 1]);

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize,
                fontFamily: "'Hina Mincho', serif",
                fontWeight: 400,
                color,
                textShadow:
                    "2px 2px 6px rgba(40, 20, 60, 0.7), 0 0 15px rgba(180, 160, 210, 0.3)",
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                letterSpacing: "0.08em",
                padding: "0 60px",
            }}
        >
            {text}
        </div>
    );
};

// ============================
// Emphasis Lyric Line (サビ・感情的なフレーズ)
// ============================
const EmphasisLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Fade with longer hold
    const opacity = interpolate(
        frame,
        [0, 25, duration - 25, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Spring bounce entrance
    const spr = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 100 },
    });
    const scale = interpolate(spr, [0, 1], [0.85, 1.05]);

    // Color: transition from pale white to plum-blossom pink
    const color = interpolateColors(
        frame,
        [0, duration * 0.3, duration],
        ["#ffffff", "#f2c4d0", "#e8b4c8"]
    );

    // Subtle pulsing glow
    const glowIntensity = 12 + Math.sin(frame * 0.08) * 6;

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: fontSize * 1.15,
                fontFamily: "'Hina Mincho', serif",
                fontWeight: 400,
                color,
                textShadow: `
                    2px 2px 8px rgba(40, 20, 60, 0.6),
                    0 0 ${glowIntensity}px rgba(210, 170, 200, 0.5),
                    0 0 ${glowIntensity * 2}px rgba(180, 140, 180, 0.2)
                `,
                opacity,
                transform: `scale(${scale})`,
                letterSpacing: "0.1em",
                padding: "0 40px",
            }}
        >
            {text}
        </div>
    );
};

// ============================
// Turning Point Line (転換点「でもね」)
// ============================
const TurningPointLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const opacity = interpolate(
        frame,
        [0, 30, duration - 30, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const spr = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 80, mass: 2 },
    });
    const scale = interpolate(spr, [0, 1], [0.7, 1.08]);

    // Warmer color for the hopeful turning point
    const color = interpolateColors(
        frame,
        [0, duration * 0.5, duration],
        ["#e8e0f0", "#ffd4e0", "#ffe0c0"]
    );

    const glowIntensity = 15 + Math.sin(frame * 0.1) * 8;

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                textAlign: "center",
                fontSize: fontSize * 1.2,
                fontFamily: "'Yuji Syuku', serif",
                fontWeight: 600,
                color,
                textShadow: `
                    0 0 ${glowIntensity}px rgba(255, 200, 180, 0.6),
                    0 0 ${glowIntensity * 2}px rgba(255, 180, 200, 0.3),
                    3px 3px 8px rgba(40, 20, 60, 0.5)
                `,
                opacity,
                letterSpacing: "0.12em",
                whiteSpace: "nowrap",
            }}
        >
            {text}
        </div>
    );
};

// ============================
// Final Lyric Line (ラスト「これが私の 早咲きの春」)
// ============================
const FinalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Dramatic entrance with heavy spring
    const spr = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 80, mass: 2 },
    });
    const scale = interpolate(spr, [0, 1], [0.3, 1.1]);

    const opacity = interpolate(
        frame,
        [0, 35, duration - 90, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Pulsing glow
    const glowIntensity = 18 + Math.sin(frame * 0.1) * 10;

    // Color: white → warm plum blossom
    const color = interpolateColors(
        frame,
        [0, duration * 0.4, duration],
        ["#ffffff", "#f2c4d0", "#e8a0b8"]
    );

    // Scattered plum petals
    const petals = [
        { x: -180, delay: 0, size: 14 },
        { x: 160, delay: 20, size: 11 },
        { x: -90, delay: 35, size: 9 },
        { x: 200, delay: 50, size: 12 },
        { x: -160, delay: 65, size: 10 },
    ];

    return (
        <>
            {/* Falling petals around the final text */}
            {petals.map((petal, i) => {
                const petalFrame = Math.max(0, frame - petal.delay);
                const petalY = interpolate(petalFrame, [0, 150], [80, -250], {
                    extrapolateRight: "clamp",
                });
                const petalOpacity = interpolate(
                    petalFrame,
                    [0, 20, 100, 150],
                    [0, 0.5, 0.3, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const petalRotate = Math.sin(petalFrame * 0.04 + i) * 30;
                const petalSway = Math.sin(petalFrame * 0.025 + i * 1.5) * 15;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: "55%",
                            left: `calc(50% + ${petal.x + petalSway}px)`,
                            width: petal.size,
                            height: petal.size * 0.7,
                            borderRadius: "50% 0 50% 0",
                            background:
                                "linear-gradient(135deg, #f2c4d0, #e8a0b8)",
                            transform: `translateY(${petalY}px) rotate(${petalRotate}deg)`,
                            opacity: petalOpacity,
                            filter: "blur(0.5px)",
                        }}
                    />
                );
            })}

            {/* Main final text */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    textAlign: "center",
                    fontSize: fontSize * 1.6,
                    fontFamily: "'Yuji Syuku', serif",
                    fontWeight: 600,
                    color,
                    textShadow: `
                        0 0 ${glowIntensity}px rgba(210, 160, 190, 0.7),
                        0 0 ${glowIntensity * 2}px rgba(180, 140, 180, 0.4),
                        3px 3px 10px rgba(40, 20, 60, 0.5)
                    `,
                    opacity,
                    letterSpacing: "0.12em",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </div>

            {/* Subtle underline decoration */}
            <div
                style={{
                    position: "absolute",
                    top: "58%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: interpolate(frame, [40, 90], [0, 350], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    }),
                    height: 1.5,
                    background:
                        "linear-gradient(90deg, transparent, rgba(210, 170, 200, 0.6), transparent)",
                    opacity: interpolate(
                        frame,
                        [40, 70, duration - 60, duration],
                        [0, 0.7, 0.5, 0],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }
                    ),
                }}
            />
        </>
    );
};

// ============================
// Opening Title (タイプライター + 梅の花)
// ============================
const OpeningTitle: React.FC<{
    title: string;
    artist: string;
}> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const duration = 330; // 11 seconds

    // Typewriter effect for title
    const charsPerFrame = 0.1; // Slightly slower for melancholic feel
    const visibleTitleChars = Math.min(
        title.length,
        Math.floor(frame * charsPerFrame)
    );
    const displayTitle = title.slice(0, visibleTitleChars);
    const showCursor = frame < title.length / charsPerFrame + 30;

    // Artist appears after title
    const artistStartFrame = Math.ceil(title.length / charsPerFrame) + 20;
    const visibleArtistChars = Math.min(
        artist.length,
        Math.max(0, Math.floor((frame - artistStartFrame) * charsPerFrame * 1.5))
    );
    const displayArtist = artist.slice(0, visibleArtistChars);

    // Fade out at end
    const opacity = interpolate(
        frame,
        [0, 20, duration - 50, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Gentle floating
    const floatY = Math.sin(frame * 0.025) * 4;

    // Sparkling glow
    const glowIntensity = 12 + Math.sin(frame * 0.12) * 6;

    // Cool lavender title color
    const titleColor = interpolateColors(
        frame,
        [0, duration / 2, duration],
        ["#e8d8f0", "#d4c0e0", "#e8d8f0"]
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
            {/* Decorative plum blossoms */}
            <div
                style={{
                    position: "absolute",
                    fontSize: 28,
                    opacity: 0.25,
                    top: "32%",
                    left: "27%",
                    transform: `rotate(-10deg) scale(${1 + Math.sin(frame * 0.06) * 0.08})`,
                    color: "#d4a0b8",
                    textShadow: "0 0 15px rgba(210, 160, 180, 0.6)",
                }}
            >
                ✿
            </div>
            <div
                style={{
                    position: "absolute",
                    fontSize: 22,
                    opacity: 0.2,
                    top: "36%",
                    right: "30%",
                    transform: `rotate(15deg) scale(${1 + Math.sin(frame * 0.08 + 1) * 0.08})`,
                    color: "#c8a0c0",
                    textShadow: "0 0 12px rgba(200, 160, 190, 0.6)",
                }}
            >
                ✿
            </div>

            {/* Main Title */}
            <h1
                style={{
                    fontFamily: "'Yuji Syuku', serif",
                    fontSize: 80,
                    fontWeight: 600,
                    color: titleColor,
                    marginBottom: 25,
                    textShadow: `
                        0 0 ${glowIntensity}px rgba(200, 170, 210, 0.8),
                        0 0 ${glowIntensity * 2}px rgba(180, 150, 200, 0.4),
                        3px 3px 8px rgba(20, 10, 40, 0.6)
                    `,
                    letterSpacing: "0.12em",
                    minHeight: "1.2em",
                }}
            >
                {displayTitle}
                {showCursor && visibleTitleChars < title.length && (
                    <span
                        style={{
                            opacity: Math.sin(frame * 0.3) > 0 ? 0.6 : 0.15,
                            color: "#d4c0e0",
                        }}
                    >
                        │
                    </span>
                )}
            </h1>

            {/* Artist Name */}
            {visibleArtistChars > 0 && (
                <h2
                    style={{
                        fontFamily: "'Zen Kurenaido', sans-serif",
                        fontSize: 34,
                        fontWeight: 500,
                        color: "rgba(220, 210, 230, 0.9)",
                        textShadow:
                            "0 0 10px rgba(180, 160, 200, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.4)",
                        letterSpacing: "0.1em",
                    }}
                >
                    {displayArtist}
                </h2>
            )}

            {/* Decoration line */}
            <div
                style={{
                    width: interpolate(
                        frame,
                        [artistStartFrame, artistStartFrame + 45],
                        [0, 180],
                        {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }
                    ),
                    height: 1.5,
                    background:
                        "linear-gradient(90deg, transparent, rgba(200, 170, 210, 0.6), transparent)",
                    marginTop: 15,
                    opacity: frame > artistStartFrame ? 0.6 : 0,
                }}
            />
        </div>
    );
};

// ============================
// Main Composition
// ============================
export const HayazakiNoHaruVideo: React.FC<
    z.infer<typeof hayazakiNoHaruSchema>
> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();

    const parsedLyrics = props.lyrics.map((l) => ({
        ...l,
        seconds: parseTime(l.timeTag),
    }));

    // Emphasis keywords for this song
    const isEmphasis = (text: string) =>
        text.includes("梅の花みたい") ||
        text.includes("私が散る頃に") ||
        text.includes("みんなは振り向く") ||
        text.includes("私はもう");

    // Turning point lines (hope / defiance)
    const isTurningPoint = (text: string) =>
        text.includes("でもね") ||
        text.includes("桜より深い") ||
        text.includes("誰かがきっと") ||
        text.includes("私の春を") ||
        text.includes("また来年も");

    // Ambient petal data
    const ambientPetals = Array.from({ length: 12 }, (_, i) => ({
        x: (i * 8.5 + 3) % 100,
        delay: i * 45,
        size: 8 + (i % 4) * 3,
        duration: 300 + (i % 3) * 60,
        color:
            i % 3 === 0
                ? "rgba(210, 170, 200, 0.4)"
                : i % 3 === 1
                  ? "rgba(240, 200, 210, 0.3)"
                  : "rgba(180, 160, 210, 0.35)",
    }));

    return (
        <AbsoluteFill style={{ backgroundColor: "#0a0510" }}>
            {/* Background video with slight darkening overlay */}
            <Video
                src={props.videoSource}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* Dark overlay for readability + mood */}
            <AbsoluteFill
                style={{
                    background:
                        "linear-gradient(180deg, rgba(10, 5, 20, 0.15) 0%, rgba(10, 5, 20, 0.05) 40%, rgba(10, 5, 20, 0.35) 100%)",
                }}
            />

            {/* Audio with fade-in/out */}
            <Audio
                src={props.videoSource}
                volume={audioFadeCurve(fps, durationInFrames, 1, 3)}
            />

            {/* Ambient falling petals */}
            {ambientPetals.map((petal, i) => (
                <FallingPetal key={i} {...petal} />
            ))}

            {/* Opening Title Sequence */}
            <Sequence
                from={15}
                durationInFrames={330}
            >
                <OpeningTitle title={props.title} artist={props.artist} />
            </Sequence>

            {/* Lyric Lines */}
            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                let durationFrames: number;
                if (nextLine) {
                    durationFrames = Math.max(
                        1,
                        Math.round((nextLine.seconds - line.seconds) * fps)
                    );
                } else {
                    durationFrames = 300; // 10 seconds for final line
                }

                const isLastLine = !nextLine;
                const isTurn = isTurningPoint(line.text);
                const isEmph = isEmphasis(line.text);

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
                        ) : isTurn ? (
                            <TurningPointLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        ) : isEmph ? (
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
