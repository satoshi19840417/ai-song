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
export const sakebeSchema = z.object({
    fontSize: z.number().default(45),
    videoSource: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
        })
    ),
});

// Determine if a line should be displayed vertically (for emphasis lines)
const isVerticalLine = (text: string): boolean => {
    return text.includes("叫べ！") || text.includes("運命を揺らせ") || text.includes("魂を震わせろ");
};

// Check if this is the final impressive line
const isFinalLine = (text: string): boolean => {
    return text.includes("さぁ、行こうぜ");
};

// Final Impressive Line Component (Centered, Large, with dramatic animation)
const FinalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Dramatic entrance: scale up from small
    const scale = interpolate(
        frame,
        [0, 30, duration - 30, duration],
        [0.5, 1.1, 1.1, 1.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Fade in and linger at the end
    const opacity = interpolate(
        frame,
        [0, 25, duration - 20, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Glow intensity increases
    const glowIntensity = interpolate(
        frame,
        [0, 40, duration],
        [0.5, 1, 1.5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                fontSize: fontSize * 3.5,
                fontFamily: "'Yuji Syuku', serif",
                fontWeight: 400,
                color: "#fff",
                textShadow: `
                    0 0 ${20 * glowIntensity}px rgba(255, 200, 100, ${0.9 * glowIntensity}),
                    0 0 ${40 * glowIntensity}px rgba(255, 150, 50, ${0.7 * glowIntensity}),
                    0 0 ${60 * glowIntensity}px rgba(255, 100, 0, ${0.5 * glowIntensity}),
                    3px 3px 6px rgba(0, 0, 0, 0.8)
                `,
                opacity,
                letterSpacing: "0.15em",
                whiteSpace: "nowrap",
                transformOrigin: "center center",
                textAlign: "center",
            }}
        >
            {text}
        </div>
    );
};

// Ending Title Component - Song title with dramatic fade in
const EndingTitle: React.FC<{
    duration: number;
    fontSize: number;
}> = ({ duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Slow fade in
    const opacity = interpolate(
        frame,
        [0, 60, duration - 30, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Gentle scale up
    const scale = interpolate(
        frame,
        [0, 60, duration],
        [0.9, 1, 1.05],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Glow pulse
    const glowPulse = interpolate(
        frame,
        [0, 30, 60, 90, duration],
        [0.3, 0.8, 1, 1.2, 1.5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                writingMode: "vertical-rl",
                textOrientation: "upright",
                fontSize: fontSize * 6,
                fontFamily: "'Yuji Syuku', serif",
                fontWeight: 400,
                color: "#fff",
                textShadow: `
                    0 0 ${10 * glowPulse}px rgba(0, 0, 0, 0.9),
                    0 0 ${25 * glowPulse}px rgba(0, 0, 0, 0.8),
                    0 0 ${50 * glowPulse}px rgba(0, 0, 0, 0.6),
                    3px 3px 6px rgba(0, 0, 0, 1)
                `,
                opacity,
                letterSpacing: "0.3em",
                whiteSpace: "nowrap",
                transformOrigin: "center center",
            }}
        >
            叫べ
        </div>
    );
};


// Horizontal Lyric Line (Main style - bottom center)
const HorizontalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    const opacity = interpolate(
        frame,
        [0, 20, duration - 20, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                bottom: 100,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: fontSize * 1.1, // Slightly larger for handwriting to be readable
                fontFamily: "'Zen Kurenaido', sans-serif",
                fontWeight: 600, // Make it a bit bolder if possible
                color: "rgba(255, 255, 255, 0.95)",
                // Stronger shadow for bright backgrounds: thin outline + soft drop shadow
                textShadow: "0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.9), 0 2px 15px rgba(0,0,0,0.8)",
                opacity,
                letterSpacing: "0.05em",
                padding: "0 60px",
            }}
        >
            {text}
        </div>
    );
};

// Vertical Lyric Line (Emphasis style - Conditional Layout)
const VerticalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Animation: Scale + Opacity
    const scale = interpolate(
        frame,
        [0, 25, duration],
        [0.85, 1, 1.1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const opacity = interpolate(
        frame,
        [0, 20, duration - 15, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const baseShadow = "0 0 5px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8), 2px 2px 2px rgba(0,0,0,0.8)";

    // === Conditional Layout Logic ===
    // ONLY apply special 3-way Center-Right-Left layout to "叫べ！" lines with "/"
    const isSakebeEmphasisLine = text.includes("叫べ！") && text.includes("/");

    if (isSakebeEmphasisLine) {
        // --- Special 3-way split for "叫べ！" lines ---
        const parts = text.split(/[\s　/]+/).filter(p => p.length > 0);

        return (
            <>
                {parts.map((part, index) => {
                    const isSakebePart = part.includes("叫べ");
                    // Smaller font for 2nd/3rd parts to prevent overflow
                    const currentFontSize = isSakebePart ? fontSize * 3.8 : fontSize * 1.2;
                    const fontFamily = isSakebePart ? "'Yuji Syuku', serif" : "'Zen Kurenaido', sans-serif";
                    const color = isSakebePart ? "#0d0d0d" : "rgba(255, 255, 255, 0.95)";
                    const textShadow = isSakebePart
                        ? "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)"
                        : baseShadow;

                    // Layout: Center -> Right -> Left
                    let layoutStyle: React.CSSProperties = {};
                    let topPosition = "50%";

                    if (index === 0) {
                        // Center (叫べ！)
                        layoutStyle = { right: "50%", transform: `translate(50%, -50%) scale(${scale})` };
                        topPosition = "50%";
                    } else if (index === 1) {
                        // Right (Higher)
                        layoutStyle = { right: "20%", transform: `translateY(-50%) scale(${scale})` };
                        topPosition = "25%";
                    } else {
                        // Left (Lower)
                        layoutStyle = { left: "20%", transform: `translateY(-50%) scale(${scale})` };
                        topPosition = "75%";
                    }

                    return (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                top: topPosition,
                                ...layoutStyle,
                                writingMode: "vertical-rl",
                                textOrientation: "upright",
                                fontSize: currentFontSize,
                                fontFamily,
                                fontWeight: isSakebePart ? 400 : 900,
                                color,
                                textShadow,
                                opacity,
                                letterSpacing: "0.2em",
                                lineHeight: 1.5,
                                whiteSpace: "nowrap",
                                transformOrigin: "center center",
                            }}
                        >
                            {part}
                        </div>
                    );
                })}
            </>
        );
    }

    // --- Standard 2-way split for all other lines ---
    const parts = text.split(/[\s　]+/);
    const mainText = parts[0];
    const subText = parts.slice(1).join("　");
    const isSakebe = mainText.includes("叫べ") || mainText.includes("！");
    const rightFontSize = isSakebe ? fontSize * 3.8 : fontSize * 2.0;
    const leftFontSize = fontSize * 1.6;

    return (
        <>
            {/* Right Side (First Half) - Higher */}
            <div
                style={{
                    position: "absolute",
                    top: "35%",
                    right: isSakebe ? "15%" : "20%",
                    transform: `translateY(-50%) scale(${scale})`,
                    writingMode: "vertical-rl",
                    textOrientation: "upright",
                    fontSize: rightFontSize,
                    fontFamily: isSakebe ? "'Yuji Syuku', serif" : "'Zen Kurenaido', sans-serif",
                    fontWeight: isSakebe ? 400 : 900,
                    color: isSakebe ? "#0d0d0d" : "rgba(255, 255, 255, 0.95)",
                    textShadow: isSakebe
                        ? "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)"
                        : baseShadow,
                    opacity,
                    letterSpacing: "0.2em",
                    lineHeight: 1.5,
                    whiteSpace: "nowrap",
                    transformOrigin: "center center",
                }}
            >
                {mainText}
            </div>

            {/* Left Side (Second Half) - Centered to prevent overflow */}
            {subText && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "20%",
                        transform: `translateY(-50%) scale(${scale})`,
                        writingMode: "vertical-rl",
                        textOrientation: "upright",
                        fontSize: leftFontSize * 0.85,
                        fontFamily: "'Zen Kurenaido', sans-serif",
                        fontWeight: 600,
                        color: "rgba(255, 255, 255, 0.85)",
                        textShadow: baseShadow,
                        opacity,
                        letterSpacing: "0.12em",
                        lineHeight: 1.4,
                        whiteSpace: "nowrap",
                        transformOrigin: "center center",
                        maxHeight: "80%",
                    }}
                >
                    {subText}
                </div>
            )}
        </>
    );
};

export const SakebeVideo: React.FC<z.infer<typeof sakebeSchema>> = (props) => {
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

            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];
                const endSeconds = nextLine ? nextLine.seconds : line.seconds + 3;

                const durationFrames = Math.max(1, Math.round((endSeconds - line.seconds) * fps));

                const isVertical = isVerticalLine(line.text);

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        {isFinalLine(line.text) ? (
                            <FinalLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        ) : isVertical ? (
                            <VerticalLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        ) : (
                            <HorizontalLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        )}
                    </Sequence>
                );
            })}

            {/* Ending Title - Song name at 2:03 */}
            {(() => {
                const endingStartFrame = Math.round(125 * fps); // 2分5秒
                const endingDuration = fps * 5; // 5 seconds
                return (
                    <Sequence
                        from={endingStartFrame}
                        durationInFrames={endingDuration}
                        layout="none"
                    >
                        <EndingTitle
                            duration={endingDuration}
                            fontSize={props.fontSize}
                        />
                    </Sequence>
                );
            })()}
        </AbsoluteFill>
    );
};
