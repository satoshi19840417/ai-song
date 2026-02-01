import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    Video,
    Audio,
    Sequence,
    useCurrentFrame,
} from "remotion";
import { z } from "zod";

export const saitekikaiSchema = z.object({
    fontSize: z.number().default(40),
    bottomOffset: z.number().default(150),
    videoSource: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
        })
    ),
});

// Check if this is a final impressive line
const isFinalLine = (text: string): boolean => {
    return text.includes("きみを愛してる") ||
        text.includes("僕でいたい") ||
        text.includes("飛び越えて");
};

const LyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Typewriter effect: characters appear one by one
    const typingDuration = Math.min(duration * 0.6, fps * 1.5);
    const framesPerChar = typingDuration / text.length;
    const visibleChars = Math.min(text.length, Math.floor(frame / framesPerChar));

    // Fade out at the end
    const opacity = interpolate(
        frame,
        [0, 5, duration - 15, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Blinking cursor
    const cursorVisible = frame < typingDuration && Math.floor(frame / 8) % 2 === 0;

    // Move down right before fade out (like pressing Enter)
    const moveDownStart = duration - 25;
    const translateY = interpolate(
        frame,
        [moveDownStart, moveDownStart + 10],
        [0, 60],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: fontSize,
                fontFamily: "'Noto Sans JP', monospace",
                fontWeight: 700,
                color: "#ffffff",
                textShadow: "0 0 8px rgba(255, 255, 255, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.8)",
                opacity,
                transform: `translateY(${translateY}px)`,
                letterSpacing: "0.08em",
                padding: "0 60px",
            }}
        >
            {text.slice(0, visibleChars)}
            <span style={{
                opacity: cursorVisible ? 1 : 0,
                color: "#ffffff",
                marginLeft: "2px"
            }}>
                |
            </span>
        </div>
    );
};

// Final Impressive Line Component
const FinalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    isLastLine: boolean;
}> = ({ text, duration, fontSize, isLastLine }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Typewriter effect
    const typingDuration = Math.min(duration * 0.5, fps * 1.2);
    const framesPerChar = typingDuration / text.length;
    const visibleChars = Math.min(text.length, Math.floor(frame / framesPerChar));

    // Scale up animation
    const scale = interpolate(
        frame,
        [0, 20, duration - 30, duration],
        [0.9, 1.1, 1.15, 1.2],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Fade in and linger longer for last line
    const opacity = interpolate(
        frame,
        [0, 10, duration - (isLastLine ? 60 : 20), duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Glow intensity increases over time
    const glowIntensity = interpolate(
        frame,
        [typingDuration, duration],
        [0.5, 1.5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Cursor
    const cursorVisible = frame < typingDuration && Math.floor(frame / 8) % 2 === 0;

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                fontSize: fontSize * (isLastLine ? 1.8 : 1.4),
                fontFamily: "'Noto Sans JP', sans-serif",
                fontWeight: 900,
                color: "#ffffff",
                zIndex: 100, // Ensure it's on top
                textShadow: `
                    0 0 ${15 * glowIntensity}px rgba(255, 220, 150, ${0.8 * glowIntensity}),
                    0 0 ${30 * glowIntensity}px rgba(255, 180, 100, ${0.5 * glowIntensity}),
                    3px 3px 6px rgba(0, 0, 0, 0.9)
                `,
                opacity,
                letterSpacing: "0.1em",
                textAlign: "center",
                whiteSpace: "nowrap",
            }}
        >
            {text.slice(0, visibleChars)}
            <span style={{
                opacity: cursorVisible ? 1 : 0,
                color: "#ffddaa",
                marginLeft: "2px"
            }}>
                |
            </span>
        </div>
    );
};

// Title Sequence Component
const TitleSequence: React.FC<{
    title: string;
    artist: string;
}> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Timings
    const titleStart = 30;
    const artistStart = 80;
    const fadeOutStart = 200;

    // Title Typewriter
    const titleTypingDuration = 40;
    const titleVisibleChars = Math.max(0, Math.min(title.length, Math.floor((frame - titleStart) / (titleTypingDuration / title.length))));

    // Artist Fade In
    const artistOpacity = interpolate(
        frame,
        [artistStart, artistStart + 30],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Global Fade Out
    const opacity = interpolate(
        frame,
        [fadeOutStart, fadeOutStart + 30],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const cursorVisible = frame >= titleStart && frame < titleStart + titleTypingDuration + 30 && Math.floor(frame / 10) % 2 === 0;

    return (
        <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity,
            color: "#ffffff",
            fontFamily: "'Noto Sans JP', sans-serif",
        }}>
            {/* Title */}
            <div style={{
                fontSize: 100,
                fontWeight: 900,
                marginBottom: 40,
                letterSpacing: "0.2em",
                position: "relative",
                // Strong text shadow for readability
                textShadow: "0 0 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 0, 0, 0.7), 3px 3px 6px rgba(0, 0, 0, 1)",
            }}>
                {title.slice(0, titleVisibleChars)}
                <span style={{
                    opacity: cursorVisible ? 1 : 0,
                    color: "#ffffff",
                    marginLeft: "5px"
                }}>|</span>
            </div>

            {/* Artist */}
            <div style={{
                fontSize: 40,
                fontWeight: 500,
                letterSpacing: "0.1em",
                opacity: artistOpacity,
                textShadow: "0 0 15px rgba(0, 0, 0, 0.9), 2px 2px 4px rgba(0, 0, 0, 1)",
            }}>
                {artist}
            </div>
        </div>
    );
};

export const SaitekikaiVideo: React.FC<z.infer<typeof saitekikaiSchema>> = (props) => {
    const { fps } = useVideoConfig();

    const parseTime = (tag: string) => {
        const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
        if (!match) return 0;
        return parseInt(match[1]) * 60 + parseFloat(match[2]);
    };

    const parsedLyrics = props.lyrics.map(l => ({
        ...l,
        seconds: parseTime(l.timeTag)
    }));

    // Get the last lyric text for comparison
    const lastLyricText = parsedLyrics.filter(l => l.text.trim() !== "").pop()?.text || "";

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

            {/* Opening Title Sequence */}
            <Sequence  durationInFrames={230} layout="none">
                <TitleSequence title="最適解" artist="Mio" />
            </Sequence>

            {parsedLyrics.map((line, index) => {
                // Skip empty text (interlude)
                if (!line.text || line.text.trim() === "") {
                    return null;
                }

                // Check if this is an impressive ending line (string matching)
                const isImpressive = isFinalLine(line.text);
                const isLast = line.text === lastLyricText;

                // Restoring deleted variables
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];
                const endSeconds = nextLine ? nextLine.seconds : line.seconds + 5;
                const durationFrames = Math.max(1, Math.round((endSeconds - line.seconds) * fps));

                // Determine extra frames based on line type
                // For last line: linger long (+90 frames)
                // For intermediate impressive lines: NO overlap (+0) to prevent collision in center
                // For normal lines: slight overlap (+10) for smooth transition
                const addedFrames = isLast ? 90 : (isImpressive ? 0 : 10);
                const finalDuration = durationFrames + addedFrames;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={finalDuration}
                        layout="none"
                    >
                        {isImpressive ? (
                            <FinalLyricLine
                                text={line.text}
                                duration={finalDuration}
                                fontSize={props.fontSize}
                                isLastLine={isLast}
                            />
                        ) : (
                            <LyricLine
                                text={line.text}
                                duration={finalDuration}
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
