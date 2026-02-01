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
export const mijukuNaStrawberrySchema = z.object({
    fontSize: z.number().default(40),
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

    // Ripening effect: White to Red
    const color = interpolateColors(
        frame,
        [0, duration],
        ["#ffffff", "#ff3366"]
    );

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset, // Configurable bottom offset
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: fontSize,
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontWeight: 600,
                color,
                textShadow: "0px 0px 8px rgba(255, 105, 180, 0.8), 2px 2px 4px rgba(0, 0, 0, 0.6)", // Pinkish glow
                opacity,
                letterSpacing: "0.05em",
                padding: "0 40px",
            }}
        >
            {text}
        </div>
    );
};

// Component: Emphasis Lyric Line with burst effect for "フレー！ フレー！ ストロベリー"
const EmphasisLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Check if this is a "フレー！ フレー！ ストロベリー" line
    const isFreeLine = text.includes("フレー") && text.includes("ストロベリー");

    if (isFreeLine) {
        // Parse the text: "フレー！ フレー！ ストロベリー"
        const parts = text.split(/\s+/);
        const fure1 = parts[0] || "フレー！"; // First フレー！
        const fure2 = parts[1] || "フレー！"; // Second フレー！
        const strawberry = parts[2] || "ストロベリー"; // ストロベリー

        // Timing: staggered appearance
        const fure1StartFrame = 0;
        const fure2StartFrame = 5;
        const strawberryStartFrame = 15;

        // Fure1 animation (flies diagonally from center to left)
        const fure1Progress = Math.max(0, frame - fure1StartFrame);
        const fure1X = interpolate(fure1Progress, [0, 15], [0, -550], { extrapolateRight: "clamp" });
        const fure1Y = interpolate(fure1Progress, [0, 15], [0, -150], { extrapolateRight: "clamp" });
        const fure1Rotate = interpolate(fure1Progress, [0, 15], [0, -25], { extrapolateRight: "clamp" });
        const fure1Scale = interpolate(fure1Progress, [0, 8, 15], [0, 1.3, 1], { extrapolateRight: "clamp" });
        const fure1Opacity = interpolate(frame, [0, 5, duration - 10, duration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // Fure2 animation (flies diagonally from center to right)
        const fure2Progress = Math.max(0, frame - fure2StartFrame);
        const fure2X = interpolate(fure2Progress, [0, 15], [0, 550], { extrapolateRight: "clamp" });
        const fure2Y = interpolate(fure2Progress, [0, 15], [0, -150], { extrapolateRight: "clamp" });
        const fure2Rotate = interpolate(fure2Progress, [0, 15], [0, 25], { extrapolateRight: "clamp" });
        const fure2Scale = interpolate(fure2Progress, [0, 8, 15], [0, 1.3, 1], { extrapolateRight: "clamp" });
        const fure2Opacity = interpolate(frame, [fure2StartFrame, fure2StartFrame + 5, duration - 10, duration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // Strawberry animation (pops up in center-bottom)
        const strawberryProgress = Math.max(0, frame - strawberryStartFrame);
        const strawberryScale = interpolate(strawberryProgress, [0, 10, 20], [0, 1.4, 1.1], { extrapolateRight: "clamp" });
        const strawberryY = interpolate(strawberryProgress, [0, 10], [50, 0], { extrapolateRight: "clamp" });
        const strawberryOpacity = interpolate(frame, [strawberryStartFrame, strawberryStartFrame + 5, duration - 10, duration], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        return (
            <>
                {/* Fure1 - Left diagonal */}
                <div
                    style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: `translate(-50%, -50%) translate(${fure1X}px, ${fure1Y}px) rotate(${fure1Rotate}deg) scale(${fure1Scale})`,
                        fontSize: fontSize * 2.5,
                        fontFamily: "'Zen Kurenaido', sans-serif",
                        fontWeight: 700,
                        color: "#ff6699",
                        textShadow: "0 0 20px rgba(255, 105, 180, 0.9), 3px 3px 0px rgba(0,0,0,0.4)",
                        opacity: fure1Opacity,
                        whiteSpace: "nowrap",
                    }}
                >
                    {fure1}
                </div>
                {/* Fure2 - Right diagonal */}
                <div
                    style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: `translate(-50%, -50%) translate(${fure2X}px, ${fure2Y}px) rotate(${fure2Rotate}deg) scale(${fure2Scale})`,
                        fontSize: fontSize * 2.5,
                        fontFamily: "'Zen Kurenaido', sans-serif",
                        fontWeight: 700,
                        color: "#ff6699",
                        textShadow: "0 0 20px rgba(255, 105, 180, 0.9), 3px 3px 0px rgba(0,0,0,0.4)",
                        opacity: fure2Opacity,
                        whiteSpace: "nowrap",
                    }}
                >
                    {fure2}
                </div>
                {/* Strawberry - Center bottom */}
                <div
                    style={{
                        position: "absolute",
                        top: "66%",
                        left: "50%",
                        transform: `translate(-50%, -50%) translateY(${strawberryY}px) scale(${strawberryScale})`,
                        fontSize: fontSize * 2.2,
                        fontFamily: "'Zen Kurenaido', sans-serif",
                        fontWeight: 700,
                        color: "#ff3366",
                        textShadow: "0 0 25px rgba(255, 20, 147, 1), 4px 4px 0px rgba(0,0,0,0.5)",
                        opacity: strawberryOpacity,
                        whiteSpace: "nowrap",
                    }}
                >
                    {strawberry}
                </div>
            </>
        );
    }

    // Special animation for final "突き進め" line - 2s scale up + 5s display
    const isFinalLine = text.includes("突き進め") && !text.includes("フレー");

    if (isFinalLine) {
        const scaleUpDuration = 60; // 2 seconds at 30fps

        // 2 second dramatic scale up, then hold (1.5x initial size)
        const scale = interpolate(
            frame,
            [0, scaleUpDuration, duration - 15, duration],
            [0.7, 1.05, 1.05, 0.9],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const opacity = interpolate(
            frame,
            [0, 15, duration - 20, duration],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    textAlign: "center",
                    fontSize: fontSize * 1.75,
                    fontFamily: "'Zen Kurenaido', sans-serif",
                    fontWeight: 700,
                    color: "#ff3366",
                    textShadow: "0 0 30px rgba(255, 20, 147, 1), 4px 4px 0px rgba(0,0,0,0.5)",
                    opacity,
                    width: "100%",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </div>
        );
    }

    // Default behavior for other emphasis lines
    const scale = interpolate(
        frame,
        [0, 10, duration - 10, duration],
        [0.8, 1.1, 1, 0.5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const opacity = interpolate(
        frame,
        [0, 10, duration - 10, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                textAlign: "center",
                fontSize: fontSize * 1.5,
                fontFamily: "'Yuji Syuku', serif",
                fontWeight: 700,
                color: "#ffdaeb",
                textShadow: "0 0 15px rgba(255, 20, 147, 0.9), 3px 3px 0px rgba(0,0,0,0.4)",
                opacity,
                width: "100%",
                whiteSpace: "nowrap",
            }}
        >
            {text}
        </div>
    );
};



// Component: Opening Title with Typewriter Effect
const OpeningTitle: React.FC<{
    title: string;
    artist: string;
}> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const duration = 300; // 10 seconds at 30fps

    // Calculate total characters
    const totalChars = title.length + artist.length;
    const framesPerChar = Math.floor(duration * 0.7 / totalChars); // Use 70% of time for typing
    const holdTime = duration * 0.2; // Hold for 20% at end
    const fadeOutStart = duration - 30; // Fade out in last 1 second

    // Calculate visible characters for title
    const titleVisibleChars = Math.min(
        title.length,
        Math.floor(frame / framesPerChar)
    );

    // Calculate visible characters for artist (starts after title is done)
    const artistStartFrame = title.length * framesPerChar;
    const artistVisibleChars = Math.min(
        artist.length,
        Math.max(0, Math.floor((frame - artistStartFrame) / framesPerChar))
    );

    // Fade out at end
    const opacity = interpolate(
        frame,
        [0, 15, fadeOutStart, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
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
            }}
        >
            <h1
                style={{
                    fontFamily: "'Zen Kurenaido', sans-serif",
                    fontSize: 80,
                    fontWeight: 500,
                    color: "#ff3366",
                    marginBottom: 20,
                    textShadow: "0 0 15px rgba(255, 105, 180, 0.8), 2px 2px 4px rgba(0,0,0,0.6)",
                    minHeight: "1.2em",
                }}
            >
                {title.slice(0, titleVisibleChars)}
                {titleVisibleChars < title.length && (
                    <span style={{ opacity: 0.3 }}>|</span>
                )}
            </h1>
            {artistVisibleChars > 0 && (
                <h2
                    style={{
                        fontFamily: "'Zen Kurenaido', sans-serif",
                        fontSize: 40,
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.9)",
                        textShadow: "0 0 10px rgba(0,0,0,0.5)",
                    }}
                >
                    {artist.slice(0, artistVisibleChars)}
                    {artistVisibleChars < artist.length && (
                        <span style={{ opacity: 0.3 }}>|</span>
                    )}
                </h2>
            )}
        </div>
    );
};

// Main Composition Component
export const MijukuNaStrawberryVideo: React.FC<z.infer<typeof mijukuNaStrawberrySchema>> = (props) => {
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
            {/* Audio is embedded in MP4 usually, but if separate: */}
            {/* <Audio src={props.videoSource} /> */}
            {/* Assuming audio is in the video file for this case, based on previous patterns. 
                If not, we might need a separate audio file. Checking SakebeVideo, it uses <Video> and <Audio> with same source?? 
                Ah, SakebeVideo uses <Video> and <Audio src={props.videoSource} />. 
                This implies the source might be audio-only? 
                Wait, SakebeData.ts has `import videoSource from "./sakebe_edited.mp4";`.
                If I use Video component with an mp4, it plays audio. 
                Adding Audio component with same source might double audio or be for waveform?
                Let's follow SakebeVideo pattern just in case.
            */}
            <Audio src={props.videoSource} />

            {/* Opening Title Sequence (5-15 seconds, 10 second duration) */}
            <Sequence from={150} durationInFrames={300}>
                <OpeningTitle title={props.title} artist={props.artist} />
            </Sequence>

            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];
                const isLastLine = !nextLine;
                // Default duration to next line or 8.5 seconds if last (2s scale + 6.5s display)
                const endSeconds = nextLine ? nextLine.seconds : line.seconds + 8.5;

                // Slight overlap or gap adjustment can be done here. 
                // Let's make it last until the next line starts.
                const durationFrames = Math.max(1, Math.round((endSeconds - line.seconds) * fps));

                // Determine style based on text content
                const isEmphasis = line.text.includes("フレー！") || line.text.includes("突き進め");

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        {isEmphasis ? (
                            <EmphasisLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
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
