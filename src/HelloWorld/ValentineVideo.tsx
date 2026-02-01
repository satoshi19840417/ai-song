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
export const valentineSchema = z.object({
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

// Component: Standard Lyric Line
const StandardLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();

    // Fade in/out
    const opacity = interpolate(
        frame,
        [0, 15, duration - 15, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Color transition: Chocolate to Pink/Red
    const color = interpolateColors(
        frame,
        [0, duration],
        ["#ffffff", "#ff99cc"]
    );

    // Subtle scale pulsing (heartbeat-like)
    // const scale = 1 + Math.sin(frame * 0.1) * 0.02; 
    // Simplified scale for readability
    const scale = interpolate(frame, [0, duration], [0.95, 1.05]);

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: fontSize,
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontWeight: 600,
                color,
                textShadow: "2px 2px 4px rgba(101, 67, 33, 0.8), 0 0 10px rgba(255, 182, 193, 0.5)", // Brown shadow for chocolate vibes + pink glow
                opacity,
                transform: `scale(${scale})`,
                letterSpacing: "0.05em",
                padding: "0 40px",
            }}
        >
            {text}
        </div>
    );
};

// Component: Emphasis Lyric Line (e.g. for "Happy Valentine" or key phrases)
// More subtle styling - elegant rather than bold
const EmphasisLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();

    // Gentle fade in/out (same as standard)
    const opacity = interpolate(
        frame,
        [0, 20, duration - 20, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Subtle scale - just slightly larger than standard
    const scale = interpolate(
        frame,
        [0, 15, duration - 15, duration],
        [0.95, 1.05, 1.02, 0.98],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Gentle color transition: soft white to warm pink
    const color = interpolateColors(
        frame,
        [0, duration],
        ["#ffffff", "#ffb3c6"] // Softer pink destination
    );

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: fontSize * 1.1, // Only slightly larger
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontWeight: 600,
                color,
                textShadow: "2px 2px 6px rgba(101, 67, 33, 0.6), 0 0 12px rgba(255, 182, 193, 0.4)", // Softer glow
                opacity,
                transform: `scale(${scale})`,
                letterSpacing: "0.08em",
                padding: "0 40px",
            }}
        >
            {text}
        </div>
    );
};

// Component: Final Lyric Line - Impressive ending with hearts and glow
const FinalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Dramatic entrance: scale up from small
    const scale = interpolate(
        frame,
        [0, 40, duration - 60, duration],
        [0.3, 1.15, 1.1, 0.9],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Long fade in, gentle fade out
    const opacity = interpolate(
        frame,
        [0, 30, duration - 90, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Pulsing glow
    const glowIntensity = 20 + Math.sin(frame * 0.1) * 10;

    // Color transition: white to warm pink
    const color = interpolateColors(
        frame,
        [0, duration * 0.5, duration],
        ["#ffffff", "#ff99cc", "#ff6699"]
    );

    // Floating hearts animation
    const hearts = [
        { x: -200, delay: 0, size: 30 },
        { x: 150, delay: 15, size: 25 },
        { x: -100, delay: 30, size: 20 },
        { x: 180, delay: 45, size: 28 },
        { x: -180, delay: 60, size: 22 },
    ];

    return (
        <>
            {/* Floating hearts */}
            {hearts.map((heart, i) => {
                const heartFrame = Math.max(0, frame - heart.delay);
                const heartY = interpolate(heartFrame, [0, 150], [100, -300], { extrapolateRight: "clamp" });
                const heartOpacity = interpolate(
                    heartFrame,
                    [0, 20, 100, 150],
                    [0, 0.6, 0.4, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const heartRotate = Math.sin(heartFrame * 0.05 + i) * 20;

                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            top: "60%",
                            left: `calc(50% + ${heart.x}px)`,
                            transform: `translateY(${heartY}px) rotate(${heartRotate}deg)`,
                            fontSize: heart.size,
                            color: "#ff6699",
                            opacity: heartOpacity,
                            textShadow: "0 0 15px rgba(255, 102, 153, 0.8)",
                        }}
                    >
                        ♥
                    </div>
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
                        0 0 ${glowIntensity}px rgba(255, 102, 153, 0.8),
                        0 0 ${glowIntensity * 2}px rgba(255, 182, 193, 0.4),
                        3px 3px 8px rgba(101, 67, 33, 0.6)
                    `,
                    opacity,
                    letterSpacing: "0.1em",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </div>

            {/* Subtitle decoration line */}
            <div
                style={{
                    position: "absolute",
                    top: "58%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: interpolate(frame, [40, 80], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    height: 2,
                    background: "linear-gradient(90deg, transparent, #ff99cc, transparent)",
                    opacity: interpolate(frame, [40, 60, duration - 60, duration], [0, 0.8, 0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
            />
        </>
    );
};

// Component: Opening Title - Valentine themed with typewriter effect
const OpeningTitle: React.FC<{
    title: string;
    artist: string;
}> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const duration = 330; // 11 seconds

    // Typewriter effect for title
    const charsPerFrame = 0.12; // Speed of typing
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
    const glowIntensity = 15 + Math.sin(frame * 0.15) * 8;

    // Title color gradient animation
    const titleColor = interpolateColors(
        frame,
        [0, duration / 2, duration],
        ["#ff6699", "#ff99cc", "#ff6699"]
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
            {/* Decorative heart shapes */}
            <div style={{
                position: "absolute",
                fontSize: 40,
                opacity: 0.3,
                top: "30%",
                left: "25%",
                transform: `rotate(-15deg) scale(${1 + Math.sin(frame * 0.08) * 0.1})`,
                color: "#ff6699",
                textShadow: "0 0 20px rgba(255, 102, 153, 0.8)",
            }}>♥</div>
            <div style={{
                position: "absolute",
                fontSize: 30,
                opacity: 0.25,
                top: "35%",
                right: "28%",
                transform: `rotate(20deg) scale(${1 + Math.sin(frame * 0.1 + 1) * 0.1})`,
                color: "#ff99cc",
                textShadow: "0 0 15px rgba(255, 153, 204, 0.8)",
            }}>♥</div>

            {/* Main Title */}
            <h1
                style={{
                    fontFamily: "'Yuji Syuku', serif",
                    fontSize: 85,
                    fontWeight: 600,
                    color: titleColor,
                    marginBottom: 25,
                    textShadow: `
                        0 0 ${glowIntensity}px rgba(255, 102, 153, 0.9),
                        0 0 ${glowIntensity * 2}px rgba(255, 182, 193, 0.5),
                        3px 3px 6px rgba(101, 67, 33, 0.7)
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
                        color: "rgba(255, 255, 255, 0.95)",
                        textShadow: `
                            0 0 10px rgba(255, 182, 193, 0.6),
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
                background: "linear-gradient(90deg, transparent, #ff99cc, transparent)",
                marginTop: 15,
                opacity: frame > artistStartFrame ? 0.7 : 0,
            }} />
        </div>
    );
};



export const ValentineVideo: React.FC<z.infer<typeof valentineSchema>> = (props) => {
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
            {/* Audio should be in the video, but adding Audio component to be safe/consistent with pattern if needed. 
                However, usually if video has audio, <Video> plays it. 
                If <Audio> is added too, it might double. 
                Checking previous files, they often have both but maybe one is muted or source is audio-only?
                "sakebe_edited.mp4" implies video.
                I will add Audio but knowing it might double if not careful, but remotion usually handles 1 audio source per track.
                Actually, if I want to visualize audio I need <Audio>.
                Let's stick to just <Video> for now unless user complains, OR if I see volume issues.
                Wait, MijukuNaStrawberry had <Audio src={props.videoSource} /> explicitly added. I will follow that.
            */}
            <Audio src={props.videoSource} />


            {/* Opening Title Sequence */}
            <Sequence from={30} durationInFrames={330}>
                <OpeningTitle title={props.title} artist={props.artist} />
            </Sequence>

            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                // Duration calculation
                let durationFrames;
                if (nextLine) {
                    durationFrames = Math.max(1, Math.round((nextLine.seconds - line.seconds) * fps));
                } else {
                    durationFrames = 300; // 10 seconds for final line with ending effect
                }

                // Check for emphasis
                const isEmphasis = line.text.includes("Happy Valentine") || line.text.includes("好き") || line.text.includes("最後の恋");
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
