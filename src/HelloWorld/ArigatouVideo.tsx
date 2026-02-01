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

// Schema for props
export const arigatouSchema = z.object({
    fontSize: z.number().default(60),
    bottomOffset: z.number().default(150),
    videoSource: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
        })
    ),
});


// Real component
const ArigatouLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    const isEmphasis = text.includes("ありがとう");

    const opacity = interpolate(
        frame,
        [0, 30, duration - 30, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const scale = isEmphasis ? interpolate(
        frame,
        [0, duration],
        [1, 1.2],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ) : 1;

    const currentFontSize = isEmphasis ? fontSize * 1.8 : fontSize;
    // Use a warm gold/orange glow for emphasis, standard shadow otherwise
    const currentTextShadow = isEmphasis
        ? "0 0 30px rgba(255, 200, 100, 0.6), 0 0 10px rgba(255, 255, 255, 0.8)"
        : "0 0 10px rgba(0,0,0,0.5)";

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                width: "100%",
                textAlign: "center",
                fontSize: currentFontSize,
                fontFamily: "'Zen Kurenaido', sans-serif",
                color: "white",
                textShadow: currentTextShadow,
                opacity,
            }}
        >
            {text}
        </div>
    );
};

const OpeningTitle: React.FC<{ fontSize: number }> = ({ fontSize }) => {
    const frame = useCurrentFrame();
    const opacity = interpolate(
        frame,
        [0, 60, 120, 150], // Fade in 2s, hold 2s, fade out 1s
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                textAlign: "center",
                fontSize: fontSize * 0.8, // Slightly smaller/subtle
                fontFamily: "'Zen Kurenaido', sans-serif",
                color: "rgba(255, 255, 255, 0.9)", // Slightly transparent
                textShadow: "0 0 5px rgba(255, 255, 255, 0.3)", // Subtle glow
                opacity,
            }}
        >
            ありがとう
        </div>
    );
};

export const ArigatouVideo: React.FC<z.infer<typeof arigatouSchema>> = (props) => {

    const { fps } = useVideoConfig(); // Ensure we use config here

    // Parse lyrics helper
    const parsedLyrics = props.lyrics.map(l => {
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

            <Audio
                src={props.videoSource}
            />

            <Sequence  durationInFrames={150}>
                <OpeningTitle fontSize={props.fontSize} />
            </Sequence>

            {parsedLyrics.map((line, index) => {
                const startFrame = line.seconds * fps;

                // Determine end frame. Use next line's start or a default duration.
                const nextLine = parsedLyrics[index + 1];
                const endSeconds = nextLine ? nextLine.seconds : line.seconds + 5; // Default 5s for last line

                // Allow a bit of overlap or gap? The user liked overlapping "thank you" in a previous request?
                // For now, let's just make it end exactly when the next one starts, maybe with a small fade overlap (handled by the component fade out).

                const durationSeconds = endSeconds - line.seconds;
                const durationFrames = durationSeconds * fps;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        <ArigatouLyricLine
                            text={line.text}
                            duration={durationFrames}
                            fontSize={props.fontSize}
                        />
                    </Sequence>
                );
            })}

        </AbsoluteFill>
    );
};
