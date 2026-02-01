import {
    AbsoluteFill,
    Audio,
    Sequence,
    interpolate,
    interpolateColors,
    spring,
    useCurrentFrame,
    useVideoConfig,
    random,
    Img,
    Easing,
} from "remotion";
import { z } from "zod";
import {
    SPRING_CONFIGS,
    fadeInOut,
    audioFadeCurve,
    typewriterText,
    getPremountDuration,
    FONTS,
    TEXT_SHADOWS,
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

// Audio visualizer simulation based on time/beat
const useBeatPulse = (bpm = 120) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const beatDuration = (60 / bpm) * fps;
    const beatProgress = (frame % beatDuration) / beatDuration;
    return Math.sin(beatProgress * Math.PI); // 0 to 1 to 0
};

// Dynamic Background that changes with sections
const DynamicBackground: React.FC<{ fps: number }> = ({ fps }) => {
    const frame = useCurrentFrame();

    // Key timestamps (in frames)
    const T_CHORUS_1 = 58 * fps;
    const T_BRIDGE = 84 * fps; // Approx end of Chorus 1 / Start of Bridge
    const T_FINAL_CHORUS = 145 * fps; // Approx

    // Interpolate section weight
    // 0: Intro/Verse (Cold, Blue)
    // 1: Chorus (Warm, Gold)
    // 2: Final Chorus (Bright, Starry)

    // Smooth transitions
    const chorus1Weight = interpolate(frame, [T_CHORUS_1 - 30, T_CHORUS_1 + 30], [0, 1], { extrapolateRight: "clamp" });
    const bridgeWeight = interpolate(frame, [T_BRIDGE - 30, T_BRIDGE + 30], [0, 1], { extrapolateRight: "clamp" });
    const finalChorusWeight = interpolate(frame, [T_FINAL_CHORUS - 30, T_FINAL_CHORUS + 30], [0, 1], { extrapolateRight: "clamp" });

    // Determine base colors
    // Verse: Deep Blue (#05070f) -> Ice Blue (#182b4a)
    // Chorus: Warm Gold (#3d2805) -> Pink/Purple (#2e0f1e)

    const verseBase = interpolateColors(frame, [0, 300], ["#05070f", "#0a1221"]);
    const chorusBase = interpolateColors(frame % 100, [0, 50], ["#2b1d36", "#3d241c"]);
    const finalBase = interpolateColors(frame % 60, [0, 30], ["#0d041c", "#1f0a2e"]); // Deep purple/space

    let currentBase = verseBase;
    if (finalChorusWeight > 0.5) currentBase = interpolateColors(finalChorusWeight, [0, 1], [chorusBase, finalBase]);
    else if (chorus1Weight > 0.5) currentBase = interpolateColors(chorus1Weight, [0, 1], [verseBase, chorusBase]);

    // Particles/Stars
    const stars = new Array(40).fill(0).map((_, i) => {
        const seed = i * 123;
        const x = random(seed) * 100;
        const y = random(seed + 1) * 100;
        const size = random(seed + 2) * 2 + 1;
        const speed = random(seed + 3) * 0.5 + 0.1;

        // Final chorus accelerates stars
        const moveY = (frame * speed * (1 + finalChorusWeight * 5)) % 100;

        return (
            <div
                key={i}
                style={{
                    position: "absolute",
                    left: `${x}%`,
                    top: `${(y + moveY) % 100}%`,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: "white",
                    opacity: random(seed + 4) * (0.3 + finalChorusWeight * 0.7),
                    boxShadow: finalChorusWeight > 0.5 ? `0 0 ${size * 2}px white` : "none",
                }}
            />
        );
    });

    // Light Bursts (Chorus)
    const pulse = useBeatPulse(130); // Approx BPM
    const burstOpacity = (chorus1Weight > 0.1 || finalChorusWeight > 0.1) ? pulse * 0.3 : 0;

    return (
        <AbsoluteFill style={{ backgroundColor: currentBase }}>
            {/* Stars/Particles Layer */}
            {stars}

            {/* Gradient Overlay for Mood */}
            <AbsoluteFill
                style={{
                    background: `
                        radial-gradient(circle at 50% 50%, 
                            ${interpolateColors(chorus1Weight, [0, 1], ["rgba(20, 40, 70, 0)", "rgba(255, 200, 100, 0.2)"])}, 
                            transparent 70%)
                    `,
                    mixBlendMode: "screen",
                }}
            />
            {/* Burst Effect */}
            <AbsoluteFill
                style={{
                    backgroundColor: "white",
                    opacity: burstOpacity * 0.15,
                    mixBlendMode: "overlay",
                }}
            />
        </AbsoluteFill>
    );
};

// Kinetic Typography Component
const KineticLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
    isEmphasis: boolean;
}> = ({ text, duration, fontSize, bottomOffset, isEmphasis }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const chars = text.split("");

    // Stagger delay per character
    const stagger = 3;

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                padding: "0 40px",
            }}
        >
            {chars.map((char, i) => {
                const effectiveFrame = frame - i * stagger;
                const springsInfo = spring({
                    frame: effectiveFrame,
                    fps,
                    config: isEmphasis ? SPRING_CONFIGS.lyricEmphasis : SPRING_CONFIGS.default,
                    durationInFrames: 30
                });

                const opacity = interpolate(effectiveFrame, [0, 15, duration - 15, duration], [0, 1, 1, 0], { extrapolateRight: "clamp" });

                // Entry animation: Slide up + Rotate X
                const translateY = interpolate(springsInfo, [0, 1], [40, 0]);
                const rotateX = interpolate(springsInfo, [0, 1], [90, 0]);
                const scale = isEmphasis ? interpolate(springsInfo, [0, 1], [0.5, 1.2]) : 1;

                const color = isEmphasis
                    ? interpolateColors(frame, [0, duration], ["#fff", "#ffd700"]) // Gold for emphasis
                    : "#fff";

                const shadow = isEmphasis
                    ? `0 0 20px rgba(255, 215, 0, ${0.5 + Math.sin(frame * 0.1) * 0.3})`
                    : TEXT_SHADOWS.subtle;

                return (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            opacity,
                            transform: `translateY(${translateY}px) rotateX(${rotateX}deg) scale(${scale})`,
                            transformOrigin: "bottom center",
                            fontFamily: isEmphasis ? FONTS.yujiSyuku : FONTS.zenKurenaido,
                            fontSize: isEmphasis ? fontSize * 1.3 : fontSize,
                            fontWeight: isEmphasis ? 700 : 500,
                            color,
                            textShadow: shadow,
                            marginRight: char === " " ? "0.3em" : "0.02em",
                        }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </div>
    );
};

// Title Sequence (Refined)
const TitleSequence: React.FC<{ title: string; artist: string }> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const opacity = fadeInOut(frame, 300, 20, 30);
    const scale = interpolate(frame, [0, 300], [1, 1.1]);

    const titleChars = title.split("");

    return (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity, transform: `scale(${scale})` }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: "80%" }}>
                {titleChars.map((char, i) => {
                    const delay = i * 5;
                    const f = Math.max(0, frame - delay);
                    const op = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
                    const y = interpolate(f, [0, 20], [20, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
                    const blur = interpolate(f, [0, 20], [10, 0], { extrapolateRight: "clamp" });

                    return (
                        <span
                            key={i}
                            style={{
                                fontFamily: FONTS.yujiSyuku,
                                fontSize: 90,
                                fontWeight: 700,
                                color: "#fff",
                                opacity: op,
                                transform: `translateY(${y}px)`,
                                filter: `blur(${blur}px)`,
                                textShadow: "0 0 20px rgba(100, 200, 255, 0.5)",
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    );
                })}
            </div>
            <div style={{
                marginTop: 20,
                fontFamily: FONTS.zenKurenaido,
                fontSize: 32,
                color: "#ccc",
                opacity: interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" })
            }}>
                {artist}
            </div>
        </AbsoluteFill>
    );
};

// Camera Shake Wrapper
const CameraShake: React.FC<{ children: React.ReactNode; fps: number }> = ({ children, fps }) => {
    const frame = useCurrentFrame();

    // Shake intensity increases during choruses
    const T_CHORUS_1 = 58 * fps;
    const T_FINAL_CHORUS = 145 * fps; // Approx 2:25

    const chorus1Intensity = interpolate(frame, [T_CHORUS_1, T_CHORUS_1 + 600], [1, 0], { extrapolateRight: "clamp" }); // fading out slowly
    const finalIntensity = interpolate(frame, [T_FINAL_CHORUS, T_FINAL_CHORUS + 1000], [1, 1], { extrapolateRight: "clamp" });

    // Base shake
    let shake = 0;
    if (frame > T_CHORUS_1 && frame < T_CHORUS_1 + 20 * fps) shake = 3;
    if (frame > T_FINAL_CHORUS) shake = 5;

    const x = (random(frame) - 0.5) * shake;
    const y = (random(frame + 1) - 0.5) * shake;

    // Subtle zoom in
    const scale = interpolate(frame, [0, 300 * fps], [1, 1.05]);

    return (
        <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) scale(${scale})` }}>
            {children}
        </AbsoluteFill>
    );
};


export const ScarsIntoStarsVideo: React.FC<z.infer<typeof scarsIntoStarsSchema>> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();
    const volumeCurve = audioFadeCurve(fps, durationInFrames, 1, 3);

    const parsedLyrics = props.lyrics.map((line) => ({
        ...line,
        seconds: parseTime(line.timeTag),
    }));

    return (
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
            <CameraShake fps={fps}>
                <DynamicBackground fps={fps} />

                <Sequence durationInFrames={330} premountFor={getPremountDuration(fps)}>
                    <TitleSequence title={props.title} artist={props.artist} />
                </Sequence>

                {parsedLyrics.map((line, index) => {
                    const startFrame = Math.round(line.seconds * fps);
                    const nextLine = parsedLyrics[index + 1];

                    let durationFrames;
                    if (nextLine) {
                        durationFrames = Math.max(1, Math.round((nextLine.seconds - line.seconds) * fps));
                    } else {
                        durationFrames = fps * 15; // Longer tail for final line
                    }

                    // Keyword Detection for Emphasis
                    const keywords = ["Star", "Light", "光", "星", "Scars", "夢", "輝", "舞"];
                    const isEmphasis = keywords.some(k => line.text.includes(k));

                    return (
                        <Sequence
                            key={index}
                            from={startFrame}
                            durationInFrames={durationFrames}
                            premountFor={getPremountDuration(fps)}
                            layout="none"
                        >
                            <KineticLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                                bottomOffset={props.bottomOffset}
                                isEmphasis={isEmphasis}
                            />
                        </Sequence>
                    );
                })}
            </CameraShake>

            <Audio
                src={props.videoSource}
                volume={(f) => volumeCurve(f)}
            />
        </AbsoluteFill>
    );
};
