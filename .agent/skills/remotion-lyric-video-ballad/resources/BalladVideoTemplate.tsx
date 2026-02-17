import {
    AbsoluteFill,
    useVideoConfig,
    Video,
    Audio,
    Sequence,
    useCurrentFrame,
    interpolate,
    Easing,
    spring,
} from "remotion";
import { z } from "zod";
import {
    SPRING_CONFIGS,
    fadeInOut,
    audioFadeCurve,
    getPremountDuration,
    FONTS,
    TEXT_SHADOWS,
} from "../../src/HelloWorld/animationUtils"; // Adjust import path as needed

// ============================================
// Schema for props
// ============================================
export const balladVideoSchema = z.object({
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

// ============================================
// Color Constants — Quiet Ballad Style
// ============================================
const COLORS = {
    white: "#ffffff",
    whiteSubtle: "rgba(255, 255, 255, 0.92)",
    whiteDim: "rgba(255, 255, 255, 0.6)",
    pink: "#f48fb1",           // Key Color (e.g. Spring, Love)
    pinkSoft: "#f8bbd0",       // Soft Pink
    pinkGlow: "rgba(244, 143, 177, 0.35)",
};

// Keywords to highlight in pink
const PINK_KEYWORDS = ["春", "ラブレター", "桜", "恋"]; // Add your keywords here

const containsPinkKeyword = (text: string): boolean =>
    PINK_KEYWORDS.some((kw) => text.includes(kw));

// ============================================
// Component: Colored Lyric Text (Partial Pink)
// ============================================
const ColoredLyricText: React.FC<{
    text: string;
    fontSize: number;
    fontFamily: string;
    baseColor: string;
    pinkColor: string;
    textShadow: string;
    additionalStyle?: React.CSSProperties;
}> = ({ text, fontSize, fontFamily, baseColor, pinkColor, textShadow, additionalStyle = {} }) => {
    const segments: { text: string; isPink: boolean }[] = [];
    let remaining = text;

    while (remaining.length > 0) {
        let earliestIdx = remaining.length;
        let matchedKw = "";

        for (const kw of PINK_KEYWORDS) {
            const idx = remaining.indexOf(kw);
            if (idx !== -1 && idx < earliestIdx) {
                earliestIdx = idx;
                matchedKw = kw;
            }
        }

        if (matchedKw && earliestIdx < remaining.length) {
            if (earliestIdx > 0) {
                segments.push({ text: remaining.slice(0, earliestIdx), isPink: false });
            }
            segments.push({ text: matchedKw, isPink: true });
            remaining = remaining.slice(earliestIdx + matchedKw.length);
        } else {
            segments.push({ text: remaining, isPink: false });
            remaining = "";
        }
    }

    return (
        <span
            style={{
                fontSize,
                fontFamily,
                fontWeight: 400,
                letterSpacing: "0.06em",
                ...additionalStyle,
            }}
        >
            {segments.map((seg, i) => (
                <span
                    key={i}
                    style={{
                        color: seg.isPink ? pinkColor : baseColor,
                        textShadow: seg.isPink
                            ? `0 0 10px ${COLORS.pinkGlow}, ${textShadow}`
                            : textShadow,
                    }}
                >
                    {seg.text}
                </span>
            ))}
        </span>
    );
};

// ============================================
// Component: Standard Lyric Line
// ============================================
const StandardLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();

    // Gentle fade in/out
    const opacity = interpolate(
        frame,
        [0, 20, duration - 20, duration],
        [0, 1, 1, 0],
        {
            easing: Easing.inOut(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Subtle scale
    const scale = spring({
        frame,
        fps: 30,
        config: SPRING_CONFIGS.smooth,
        from: 0.97,
        to: 1.0,
    });

    const hasPink = containsPinkKeyword(text);

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                opacity,
                transform: `scale(${scale})`,
                padding: "0 60px",
            }}
        >
            <div style={{
                display: "inline-block",
                borderBottom: "1.5px solid rgba(255, 255, 255, 0.3)",
                paddingBottom: 8,
            }}>
                {hasPink ? (
                    <ColoredLyricText
                        text={text}
                        fontSize={fontSize}
                        fontFamily={FONTS.kleeOne}
                        baseColor={COLORS.white}
                        pinkColor={COLORS.pink}
                        textShadow={TEXT_SHADOWS.subtle}
                    />
                ) : (
                    <span
                        style={{
                            fontSize,
                            fontFamily: FONTS.kleeOne,
                            fontWeight: 400,
                            color: COLORS.white,
                            textShadow: TEXT_SHADOWS.subtle,
                            letterSpacing: "0.06em",
                        }}
                    >
                        {text}
                    </span>
                )}
            </div>
        </div>
    );
};

// ============================================
// Component: Emphasis Lyric Line
// ============================================
const EmphasisLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Gentle fade in/out
    const opacity = interpolate(
        frame,
        [0, 22, duration - 22, duration],
        [0, 1, 1, 0],
        {
            easing: Easing.inOut(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Subtle spring
    const scale = spring({
        frame,
        fps,
        config: SPRING_CONFIGS.lyricEmphasis,
        from: 0.93,
        to: 1.0,
    });

    const hasPink = containsPinkKeyword(text);

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                opacity,
                transform: `scale(${scale})`,
                padding: "0 60px",
            }}
        >
            <div style={{
                display: "inline-block",
                borderBottom: "1.5px solid rgba(255, 255, 255, 0.35)",
                paddingBottom: 8,
            }}>
                {hasPink ? (
                    <ColoredLyricText
                        text={text}
                        fontSize={fontSize * 1.08}
                        fontFamily={FONTS.kleeOne}
                        baseColor={COLORS.whiteSubtle}
                        pinkColor={COLORS.pink}
                        textShadow={TEXT_SHADOWS.subtle}
                    />
                ) : (
                    <span
                        style={{
                            fontSize: fontSize * 1.08,
                            fontFamily: FONTS.kleeOne,
                            fontWeight: 400,
                            color: COLORS.whiteSubtle,
                            textShadow: TEXT_SHADOWS.subtle,
                            letterSpacing: "0.06em",
                        }}
                    >
                        {text}
                    </span>
                )}
            </div>
        </div>
    );
};

// ============================================
// Component: Final Lyric Line
// ============================================
const FinalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Gentle bloom
    const scale = spring({
        frame,
        fps,
        config: { damping: 30, stiffness: 40, mass: 2 },
        from: 0.6,
        to: 1.0,
    });

    // Long fade in, long gentle fade out
    const opacity = fadeInOut(frame, duration, 35, 90);

    const hasPink = containsPinkKeyword(text);

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: "100%",
                textAlign: "center",
                transform: `translateY(-50%) scale(${scale})`,
                opacity,
            }}
        >
            {hasPink ? (
                <ColoredLyricText
                    text={text}
                    fontSize={fontSize * 1.3}
                    fontFamily={FONTS.kleeOne}
                    baseColor={COLORS.white}
                    pinkColor={COLORS.pink}
                    textShadow={TEXT_SHADOWS.strongGlow}
                    additionalStyle={{ letterSpacing: "0.1em" }}
                />
            ) : (
                <span
                    style={{
                        fontSize: fontSize * 1.3,
                        fontFamily: FONTS.kleeOne,
                        fontWeight: 400,
                        color: COLORS.white,
                        textShadow: TEXT_SHADOWS.strongGlow,
                        letterSpacing: "0.1em",
                    }}
                >
                    {text}
                </span>
            )}
        </div>
    );
};

// ============================================
// Component: Opening Title (Left-Bottom)
// ============================================
const OpeningTitle: React.FC<{
    title: string;
    artist: string;
}> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const duration = 330;

    // Title: Gentle fade in
    const titleOpacity = interpolate(
        frame,
        [0, 45, duration - 60, duration],
        [0, 1, 1, 0],
        {
            easing: Easing.inOut(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Title: Gentle rise
    const titleY = interpolate(
        frame,
        [0, 50],
        [15, 0],
        {
            easing: Easing.out(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Artist: Delayed fade in
    const artistDelay = 60;
    const artistOpacity = interpolate(
        frame,
        [artistDelay, artistDelay + 40, duration - 50, duration],
        [0, 1, 1, 0],
        {
            easing: Easing.inOut(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Line width animation
    const lineWidth = spring({
        frame: Math.max(0, frame - artistDelay - 20),
        fps,
        config: SPRING_CONFIGS.smooth,
        from: 0,
        to: 140,
    });

    // Gentle float
    const floatPhase = (frame % 180) / 180;
    const floatY = interpolate(
        floatPhase,
        [0, 0.5, 1],
        [0, 3, 0],
        { easing: Easing.inOut(Easing.sin) }
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
                alignItems: "flex-start",
                justifyContent: "flex-end",
                paddingLeft: 80,
                paddingBottom: 350, // Positioned below center
                transform: `translateY(${floatY}px)`,
            }}
        >
            {/* Main Title */}
            <h1
                style={{
                    fontFamily: FONTS.kleeOne,
                    fontSize: 76,
                    fontWeight: 400,
                    marginBottom: 18,
                    letterSpacing: "0.06em",
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                    textAlign: "left",
                }}
            >
                <ColoredLyricText
                    text={title}
                    fontSize={76}
                    fontFamily={FONTS.kleeOne}
                    baseColor={COLORS.white}
                    pinkColor={COLORS.pink}
                    textShadow={TEXT_SHADOWS.subtle}
                />
            </h1>

            {/* Artist Name */}
            <h2
                style={{
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: 44,
                    fontWeight: 700,
                    color: COLORS.whiteDim,
                    textShadow: TEXT_SHADOWS.subtle,
                    letterSpacing: "0.04em",
                    opacity: artistOpacity,
                    textAlign: "left",
                    margin: 0,
                }}
            >
                {artist}
            </h2>

            {/* Subtle line */}
            <div
                style={{
                    width: lineWidth,
                    height: 1,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                    marginTop: 10,
                    opacity: artistOpacity * 0.5,
                }}
            />
        </div>
    );
};

// ============================================
// Component: Ending Title Card
// ============================================
const EndingTitle: React.FC<{
    title: string;
}> = ({ title }) => {
    const frame = useCurrentFrame();
    // Show from 4.5s before end
    const duration = 135;

    // Gentle fade in, slow fade out
    const opacity = interpolate(
        frame,
        [0, 15, duration - 30, duration],
        [0, 1, 1, 0],
        {
            easing: Easing.inOut(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Slight rise
    const y = interpolate(
        frame,
        [0, 20],
        [8, 0],
        {
            easing: Easing.out(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
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
                alignItems: "center",
                justifyContent: "center",
                opacity,
                transform: `translateY(${y}px)`,
            }}
        >
            <ColoredLyricText
                text={title}
                fontSize={52}
                fontFamily={FONTS.kleeOne}
                baseColor={COLORS.white}
                pinkColor={COLORS.pinkSoft}
                textShadow={TEXT_SHADOWS.subtle}
                additionalStyle={{ letterSpacing: "0.08em" }}
            />
        </div>
    );
};

// ============================================
// Main Composition Template
// ============================================
export const BalladVideoTemplate: React.FC<
    z.infer<typeof balladVideoSchema>
> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();

    const parsedLyrics = props.lyrics.map((l) => ({
        ...l,
        seconds: parseTime(l.timeTag),
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
            <Audio
                src={props.videoSource}
                volume={audioFadeCurve(fps, durationInFrames, 1, 2)}
            />

            {/* Opening Title Sequence */}
            <Sequence
                from={30}
                durationInFrames={330}
                premountFor={getPremountDuration(fps)}
            >
                <OpeningTitle title={props.title} artist={props.artist} />
            </Sequence>

            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                let durationFrames;
                if (nextLine) {
                    durationFrames = Math.max(
                        1,
                        Math.round((nextLine.seconds - line.seconds) * fps)
                    );
                } else {
                    durationFrames = 300;
                }

                // Example: Shorten duration for specific lines (Interdules)
                // const isInterludeLine = line.text === "Specific Line Text";
                // if (isInterludeLine) {
                //     durationFrames = Math.min(durationFrames, 150);
                // }

                // Check for emphasis keywords
                const isEmphasis = containsPinkKeyword(line.text);
                const isLastLine = !nextLine;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                        premountFor={getPremountDuration(fps)}
                    >
                        {isLastLine ? (
                            <FinalLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        ) : isEmphasis ? (
                            // Use Emphasis line if contains keywords
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

            {/* Ending Title Card — Shows song title before end */}
            <Sequence
                from={durationInFrames - 150} // 5s before end
                durationInFrames={135}        // 4.5s duration
                premountFor={getPremountDuration(fps)}
            >
                <EndingTitle title={props.title} />
            </Sequence>
        </AbsoluteFill>
    );
};
