import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    Video,
    Audio,
    Sequence,
} from "remotion";
import { z } from "zod";
import musicVideo from "./空白の雪 修正版.mp4";

// Schema for props
export const kuhakuNoYukiSchema = z.object({
    fontSize: z.number().default(50),
    bottomOffset: z.number().default(150),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
        })
    ),
});

type LyricLineData = {
    timeTag: string;
    text: string;
    seconds: number;
};

const LyricLine: React.FC<{
    line: LyricLineData;
    index: number;
    duration: number; // duration in frames
    config: z.infer<typeof kuhakuNoYukiSchema>;
}> = ({ line, index, duration, config }) => {
    const frame = useCurrentFrame();
    const { width, height } = useVideoConfig(); // Need config to calculate positions

    // Check if it's the ending sequence (Sayonara, itoshii hito and onwards)
    // Index 53 is "Sayonara, itoshii hito"
    const isEnding = index >= 53;

    // Layout Logic
    let left: number;
    let bottom: number;
    let currentFontSize = config.fontSize;
    let currentTextShadow = "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(173, 216, 230, 0.5)";
    let currentColor = "white";

    if (isEnding) {
        // Ending: Center-ish Screen, Gold, Rising
        // Prevent overlap by staggering
        const endingOffset = index - 53;

        // Vertical: Start mid-screen and go down
        // 53: 55%, 54: 45%, 55: 35%, 56: 25% (of height, from bottom)
        bottom = height * (0.55 - (endingOffset * 0.1));

        // Horizontal: Zig-Zag
        // 53: Left-ish, 54: Right-ish, 55: Left-ish, 56: Center
        if (endingOffset === 3) {
            left = width * 0.5; // Last one centered
        } else {
            left = width * (0.5 + (endingOffset % 2 === 0 ? -0.1 : 0.1)); // +/- 10% from center
        }

        currentFontSize = config.fontSize * 1.3; // 30% larger
        currentTextShadow = "0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 223, 0, 0.6)"; // Gold glow
        currentColor = "#FFD700"; // Gold
    } else {
        // Normal: Bottom Row, Loop Left -> Center -> Right
        // 0: Left (20%), 1: Center (50%), 2: Right (80%)
        const positionIndex = index % 3;
        const positions = [0.25, 0.5, 0.75]; // Left, Center, Right percentages
        left = positions[positionIndex] * width;
        bottom = config.bottomOffset;
    }

    // Split text into characters
    const chars = line.text.split("");

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottom,
                left: left,
                transform: "translateX(-50%)", // Center horizontally on the point
                width: "auto",
                whiteSpace: "nowrap",
                fontSize: currentFontSize,
                fontFamily: "'Hina Mincho', serif", // Gentle Mincho font
                fontWeight: 400,
                color: currentColor,
                textShadow: currentTextShadow,
                display: "flex",
                flexDirection: "row",
                gap: "0.1em", // Slight gap between characters
            }}
        >
            {chars.map((char, i) => {
                // Stagger animation: each char starts 5 frames after previous
                const delay = i * 5;

                // Animation durations for each character
                // Ending moves slower
                const fadeIn = isEnding ? 90 : 45;
                const fadeOutStart = isEnding ? 90 : 60; // Start fading out earlier for ending to be gradual

                // --- Opacity ---
                // Entry: Based on delay
                const opacityIn = interpolate(
                    frame,
                    [delay, delay + fadeIn],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                // Exit: Based on global duration (all chars fade out together relative to end)
                const opacityOut = interpolate(
                    frame,
                    [duration - fadeOutStart, duration],
                    [1, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const opacity = Math.min(opacityIn, opacityOut);

                // --- Scale ---
                // Ending: Slowly scale up while fading out
                let scale = 1;
                if (isEnding) {
                    scale = interpolate(
                        frame,
                        [duration - 90, duration],
                        [1, 1.25], // "Dissolve into light" effect
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                }

                // --- TranslateY ---
                let translateY;
                if (isEnding) {
                    // Rising: Rise from slightly below
                    const riseY = interpolate(
                        frame,
                        [delay, delay + 90],
                        [20, 0], // Start lower, move to 0
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * (2 - t) }
                    );
                    const floatY = interpolate(
                        frame,
                        [delay + 90, duration],
                        [0, -10], // Gently flat up
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    translateY = riseY + floatY;
                } else {
                    // Falling: Fall from slightly above
                    const fallY = interpolate(
                        frame,
                        [delay, delay + 60],
                        [-30, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * (2 - t) }
                    );
                    // Drift: Continues until end
                    const driftY = interpolate(
                        frame,
                        [delay + 60, duration],
                        [0, 15],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    translateY = fallY + driftY;
                }

                // --- Blur ---
                // Ending has no entry blur (clear vision)
                const startBlur = isEnding ? 0 : 4;
                const endBlur = isEnding ? 20 : 10; // Stronger blur for ending dissolve

                // Entry Blur
                const blurIn = interpolate(
                    frame,
                    [delay, delay + fadeIn],
                    [startBlur, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                // Exit Blur
                const blurOut = interpolate(
                    frame,
                    [duration - fadeOutStart, duration],
                    [0, endBlur],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const blur = Math.max(blurIn, blurOut);

                return (
                    <span
                        key={i}
                        style={{
                            opacity,
                            transform: `translateY(${translateY}px) scale(${scale})`,
                            filter: `blur(${blur}px)`,
                            display: "inline-block",
                        }}
                    >
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

const TitleCard: React.FC = () => {
    const frame = useCurrentFrame();

    // Duration: 10 seconds (300 frames)
    // Fade In: 0-90 (3s)
    // Hold: 90-210 (4s)
    // Fade Out: 210-300 (3s)

    const opacity = interpolate(
        frame,
        [0, 90, 210, 300],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const blur = interpolate(
        frame,
        [0, 90, 210, 300],
        [10, 0, 0, 10],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}>
            <h1 style={{
                fontFamily: "'Hina Mincho', serif",
                fontSize: 100,
                color: 'white',
                opacity,
                filter: `blur(${blur}px)`,
                textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
                margin: 0,
                fontWeight: 400
            }}>
                空白の雪
            </h1>
        </div>
    );
};

export const KuhakuNoYukiVideo: React.FC<z.infer<typeof kuhakuNoYukiSchema>> = (props) => {
    const { fps, width, height } = useVideoConfig(); // Ensure we use config here too if needed

    // Parse lyrics using the helper
    const parsedLyrics = props.lyrics.map(l => {
        const timeParts = l.timeTag.replace(/[\[\]]/g, "").split(":");
        const seconds = parseInt(timeParts[0]) * 60 + parseFloat(timeParts[1]);
        return { ...l, seconds };
    });

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Video
                src={musicVideo}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                }}
            />
            <Audio src={musicVideo} />

            <Sequence  durationInFrames={300}>
                <TitleCard />
            </Sequence>

            {parsedLyrics.map((line, index) => {
                // Calculate duration based on next 2 lines (overlap logic)
                const startFrame = line.seconds * fps;

                // Look ahead 2 lines to decide when this one should end?
                // Request: "One tempo earlier" -> "Existing + 1 subsequent phrase"

                let targetEndLineIndex = index + 2;

                // Specific Request: "Merry Christmas" (Index 54) should disappear 
                // when "Happy holidays to you..." (Index 55) appears.
                if (index === 54) {
                    targetEndLineIndex = index + 1;
                }

                const targetEndLine = parsedLyrics[targetEndLineIndex];
                const endSeconds = targetEndLine ? targetEndLine.seconds : (line.seconds + 12.5); // Fallback if near end

                const lineDurationSeconds = endSeconds - line.seconds;
                const durationFrames = lineDurationSeconds * fps;

                // Extra buffer for the character stagger delay
                // Max length of line ~ 20 chars? 20 * 5 = 100 frames delay
                const bufferFrames = 100;
                const fullDurationFrames = durationFrames + bufferFrames;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={fullDurationFrames}
                        layout="none"
                    >
                        <LyricLine
                            line={line}
                            index={index}
                            duration={fullDurationFrames}
                            config={props}
                        />
                    </Sequence>
                );
            })}

        </AbsoluteFill>
    );
};
