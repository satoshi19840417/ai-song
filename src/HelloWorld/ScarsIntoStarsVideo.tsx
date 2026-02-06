import {
    AbsoluteFill,
    Sequence,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Easing,
    Video,
} from "remotion";
import { z } from "zod";
import {
    audioFadeCurve,
} from "./animationUtils";

export const scarsIntoStarsSchema = z.object({
    fontSize: z.number().default(42),
    bottomOffset: z.number().default(120),
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

const parseTime = (tag: string): number => {
    const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseFloat(match[2]);
};

// --- Helper Components & Hooks ---

// --- Broadcast Components ---

// 1. Top-Left Title Card (Scoreboard Style)
// 1. Top-Left Title Card (Scoreboard Style - Reverted)
const BroadcastTitleCard: React.FC<{ title: string; artist: string }> = ({ title, artist }) => {
    const frame = useCurrentFrame();

    // Slide in from left
    const slideIn = interpolate(frame, [0, 30], [-300, 30], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: "clamp"
    });

    // Sticky
    const opacity = interpolate(frame, [0, 30, 5400, 5460], [0, 1, 1, 0]);

    return (
        <div style={{
            position: "absolute",
            top: 50,
            left: slideIn,
            backgroundColor: "rgba(0, 30, 60, 0.8)", // Dark blue/slate broadcast slate
            borderLeft: "5px solid #00bfff", // Accent strip
            padding: "15px 30px 15px 20px",
            borderRadius: "0 8px 8px 0",
            display: "flex",
            flexDirection: "column",
            opacity,
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
        }}>
            <div style={{
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: 16,
                color: "#00bfff",
                fontWeight: 700,
                letterSpacing: "0.1em",
                marginBottom: 4,
                textTransform: "uppercase"
            }}>
                Song
            </div>
            <div style={{
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: 32,
                color: "#fff",
                fontWeight: 700,
                lineHeight: 1.1,
                whiteSpace: "nowrap"
            }}>
                {title}
            </div>
            <div style={{
                fontFamily: "Roboto, Helvetica, Arial, sans-serif",
                fontSize: 20,
                color: "#ddd",
                marginTop: 4,
                fontWeight: 400
            }}>
                {artist}
            </div>
        </div>
    );
};

// 2. Blue Strip Lyric (Bottom-Right Broadcast Style)
const BlueStripLyric: React.FC<{
    text: string;
    isEmphasis: boolean;
}> = ({ text, isEmphasis }) => {
    const frame = useCurrentFrame();

    // Wipe/Slide from Right
    const slideIn = interpolate(frame, [0, 20], [-50, 0], {
        easing: Easing.out(Easing.cubic),
        extrapolateRight: "clamp",
    });

    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

    return (
        <div style={{
            position: "absolute",
            bottom: 50, // Bottom
            right: 50 + slideIn, // Slide from right
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            height: 44,
            opacity,
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            fontFamily: `"Zen Kurenaido", sans-serif`, // Lyric font
        }}>
            {/* Left End Cap (flipped for right alignment aesthetics? Or stick to strip order?) 
                Let's keep the Icon left of text, but the whole block is on the right.
            */}

            {/* Left Icon Box */}
            <div style={{
                width: 44,
                backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent white
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#002244",
                fontWeight: 900,
                fontSize: 20,
                borderRight: "1px solid #ccc"
            }}>
                ♪
            </div>

            {/* Main Lyric Strip */}
            <div style={{
                // Semi-transparent Blue Gradient
                background: "linear-gradient(90deg, rgba(0, 34, 68, 0.5) 0%, rgba(0, 68, 136, 0.5) 100%)",
                padding: "0 30px 0 20px",
                display: "flex",
                alignItems: "center",
                minWidth: 100,
                color: "white",
                backdropFilter: "blur(4px)", // Added blur for readability over video
            }}>
                <span style={{
                    fontSize: isEmphasis ? 28 : 24,
                    fontWeight: isEmphasis ? 700 : 500,
                    whiteSpace: "nowrap",
                    color: isEmphasis ? "#ffeebb" : "#ffffff",
                    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                }}>
                    {text}
                </span>
            </div>

            {/* Right End Cap */}
            <div style={{
                width: 10,
                background: "rgba(0, 68, 136, 0.5)",
                clipPath: "polygon(0 0, 0 100%, 100% 0)",
            }} />
        </div>
    );
};

// Kept for atmosphere (Subtle)
const CinematicOverlay: React.FC<{ fps: number }> = ({ fps }) => {
    // Dark vignette
    return (
        <>
            <AbsoluteFill
                style={{
                    background: "radial-gradient(circle at center, transparent 70%, rgba(0,0,0,0.4) 100%)",
                    pointerEvents: "none",
                }}
            />
        </>
    );
}


export const ScarsIntoStarsVideo: React.FC<z.infer<typeof scarsIntoStarsSchema>> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();
    const volumeCurve = audioFadeCurve(fps, durationInFrames, 1, 3);

    const parsedLyrics = props.lyrics.map((line) => ({
        ...line,
        seconds: parseTime(line.timeTag),
    }));

    return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>

            {/* Stable Video Feed */}
            <Video
                src={props.videoSource}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
                volume={(f) => volumeCurve(f)}
            />

            {/* Broadcast Title - Persist throughout or specific duration? 
                Usually stays for intro, then fades, or stays small. 
                Implementation Plan says "Fixed at Top-Left". We'll keep it whole video or long intro.
                Let's keep it visible.
            */}
            <BroadcastTitleCard title={props.title} artist={props.artist} />

            {/* Lyrics Subtitles */}
            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                let durationFrames;
                if (nextLine) {
                    durationFrames = Math.max(1, Math.round((nextLine.seconds - line.seconds) * fps));
                } else {
                    durationFrames = fps * 15;
                }

                // Keyword Detection
                const keywords = ["Star", "Light", "光", "星", "Scars", "夢", "輝", "舞"];
                const isEmphasis = keywords.some(k => line.text.includes(k));

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        <BlueStripLyric
                            text={line.text}
                            isEmphasis={isEmphasis}
                        />
                    </Sequence>
                );
            })}

            {/* Cinematic Finish */}
            <CinematicOverlay fps={fps} />

        </AbsoluteFill>
    );
};
