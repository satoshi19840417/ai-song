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
import {
    fadeInOut,
    audioFadeCurve,
    FONTS,
    TEXT_SHADOWS,
} from "./animationUtils";

// Schema for props
export const jinchougeSchema = z.object({
    fontSize: z.number().default(30),
    bottomOffset: z.number().default(40),
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

// ========================================
// Standard Lyric Line — cream-white → soft green
// ========================================
const StandardLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize, bottomOffset }) => {
    const frame = useCurrentFrame();

    const opacity = fadeInOut(frame, duration, 12, 12);

    const color = interpolateColors(
        frame,
        [0, duration],
        ["#fffef2", "#d4e6b5"]
    );

    const scale = interpolate(frame, [0, duration], [0.97, 1.02], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomOffset,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize,
                fontFamily: FONTS.zenKurenaido,
                fontWeight: 600,
                color,
                textShadow: `${TEXT_SHADOWS.subtle}, 0 0 8px rgba(180, 200, 130, 0.3)`,
                opacity,
                transform: `scale(${scale})`,
                letterSpacing: "0.05em",
                padding: "0 50px",
            }}
        >
            {text}
        </div>
    );
};

// ========================================
// Center Lyric Line — glowing text on dark overlay
// Used for "ああ そうか わかった" ~ "まだ諦めきれない　馬鹿な火だ"
// Special: 火 character appears with delayed ignition effect
// ========================================
const CenterLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    const opacity = fadeInOut(frame, duration, 18, 18);

    // Warm white that brightens
    const baseColor = interpolateColors(
        frame,
        [0, duration * 0.3, duration],
        ["#f0f0e8", "#fffff0", "#f5f5e0"]
    );

    const scale = interpolate(frame, [0, duration], [0.97, 1.01], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Pulsing glow
    const glowIntensity = 14 + Math.sin(frame * 0.1) * 6;

    const baseTextShadow = `
		0 0 ${glowIntensity}px rgba(255, 255, 220, 0.7),
		0 0 ${glowIntensity * 2}px rgba(200, 230, 180, 0.4),
		0 0 ${glowIntensity * 3}px rgba(165, 214, 167, 0.2),
		2px 2px 6px rgba(0, 0, 0, 0.7)
	`;

    // Check if this line contains 火 (for special fire effect)
    const hasFireChar = text.includes("火");

    // Fire ignition timing: 火 appears after a delay
    const fireIgniteDelay = 25; // frames delay before 火 appears
    const fireIgniteDuration = 15; // frames for ignition animation
    const fireAppearProgress = interpolate(
        frame,
        [fireIgniteDelay, fireIgniteDelay + fireIgniteDuration],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Fire character animation values (only active after ignition)
    const fireFrame = Math.max(0, frame - fireIgniteDelay);
    const fireFlicker = Math.sin(fireFrame * 0.25) * 0.15 + Math.sin(fireFrame * 0.4) * 0.1;
    const fireGlow = 18 + Math.sin(fireFrame * 0.15) * 8 + Math.sin(fireFrame * 0.3) * 5;
    const fireColor = interpolateColors(
        fireFrame,
        [0, 10, 30, 60],
        ["#ffaa00", "#ff6600", "#ff4400", "#ff2200"]
    );
    const fireScale = interpolate(
        fireAppearProgress,
        [0, 0.5, 1],
        [0.3, 1.3, 1.1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    ) + fireFlicker * 0.15;

    if (hasFireChar) {
        const chars = text.split("");
        return (
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    opacity,
                    whiteSpace: "nowrap",
                }}
            >
                {chars.map((char, i) => {
                    const isFireChar = char === "火";
                    return (
                        <span
                            key={i}
                            style={{
                                display: "inline-block",
                                fontSize: isFireChar ? fontSize * 1.35 : fontSize * 1.15,
                                fontFamily: FONTS.zenKurenaido,
                                fontWeight: 600,
                                color: isFireChar ? fireColor : baseColor,
                                textShadow: isFireChar
                                    ? `
										0 0 ${fireGlow * fireAppearProgress}px rgba(255, 100, 0, 0.9),
										0 0 ${fireGlow * 2 * fireAppearProgress}px rgba(255, 60, 0, 0.6),
										0 0 ${fireGlow * 3 * fireAppearProgress}px rgba(255, 30, 0, 0.3),
										0 -4px ${fireGlow * fireAppearProgress}px rgba(255, 200, 0, 0.4),
										2px 2px 6px rgba(0, 0, 0, 0.7)
									`
                                    : baseTextShadow,
                                opacity: isFireChar ? fireAppearProgress : 1,
                                transform: isFireChar
                                    ? `scale(${fireScale}) translateY(${-2 + fireFlicker * 3}px)`
                                    : "none",
                                letterSpacing: "0.08em",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
                {/* Fire particles — only appear after ignition */}
                {fireAppearProgress > 0.3 && [0, 1, 2, 3, 4].map((i) => {
                    const particleFrame = (fireFrame + i * 12) % 40;
                    const py = interpolate(particleFrame, [0, 40], [0, -50], {
                        extrapolateRight: "clamp",
                    });
                    const pOpacity = interpolate(
                        particleFrame,
                        [0, 8, 30, 40],
                        [0, 0.8, 0.3, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    const px = Math.sin(particleFrame * 0.3 + i * 1.5) * 8;
                    return (
                        <div
                            key={`fire-${i}`}
                            style={{
                                position: "absolute",
                                top: `calc(50% + ${py - 15}px)`,
                                left: `calc(50% + ${px + 40}px)`,
                                width: 4 - i * 0.5,
                                height: 4 - i * 0.5,
                                borderRadius: "50%",
                                background: i % 2 === 0 ? "#ff6600" : "#ffaa00",
                                opacity: pOpacity,
                                filter: "blur(1px)",
                            }}
                        />
                    );
                })}
            </div>
        );
    }

    // Normal center line (no fire char)
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                textAlign: "center",
                fontSize: fontSize * 1.15,
                fontFamily: FONTS.zenKurenaido,
                fontWeight: 600,
                color: baseColor,
                textShadow: baseTextShadow,
                opacity,
                letterSpacing: "0.08em",
                padding: "0 80px",
            }}
        >
            {text}
        </div>
    );
};

// ========================================
// Final Title Reveal — ALL chars scatter, then 沈丁花 blooms in center
// "あれは沈丁花(じんちょうげ)って言うらしい"
// Phase 1: Full text appears → Phase 2: ALL chars scatter (including 沈丁花)
// Phase 3: After a pause, 沈丁花 blooms from zero like a flower in center
// ========================================
const FinalTitleReveal: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Split all characters
    const allChars = text.split("");

    // Timing
    const scatterStart = 80; // all chars start scattering
    const scatterDuration = 90;
    const scatterEnd = scatterStart + scatterDuration;
    const bloomDelay = 40; // pause after scatter before bloom
    const bloomStart = scatterEnd + bloomDelay;

    // Entrance animation for the full text
    const entranceSpr = spring({
        frame,
        fps,
        config: { damping: 15, stiffness: 80, mass: 2 },
    });
    const entranceScale = interpolate(entranceSpr, [0, 1], [0.3, 1.05]);
    const entranceOpacity = interpolate(
        frame,
        [0, 30],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Scatter direction for a character
    const getScatterDir = (i: number) => {
        const angle = ((i * 137.5 + 30) % 360) * (Math.PI / 180);
        const dist = 180 + (i % 3) * 100;
        return {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist - 100,
            rot: (i % 2 === 0 ? 1 : -1) * (25 + (i % 4) * 15),
        };
    };

    // Bloom animation for 沈丁花 title — soft, gentle like a flower opening
    const bloomSpr = spring({
        frame: Math.max(0, frame - bloomStart),
        fps,
        config: { damping: 30, stiffness: 25, mass: 2.5 },
    });
    const bloomScale = interpolate(bloomSpr, [0, 1], [0, 1.3]);
    const bloomOpacity = interpolate(
        frame,
        [bloomStart, bloomStart + 45, duration - 90, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const glowIntensity = 16 + Math.sin(frame * 0.08) * 8;

    // Floating petals for decoration (appear during bloom)
    const petals = [
        { x: -180, delay: bloomStart, size: 12 },
        { x: 160, delay: bloomStart + 15, size: 10 },
        { x: -90, delay: bloomStart + 30, size: 8 },
        { x: 200, delay: bloomStart + 45, size: 11 },
        { x: -160, delay: bloomStart + 60, size: 9 },
    ];

    return (
        <>
            {/* Falling petal particles (during bloom phase) */}
            {petals.map((petal, i) => {
                const petalFrame = Math.max(0, frame - petal.delay);
                const petalY = interpolate(petalFrame, [0, 150], [80, -250], {
                    extrapolateRight: "clamp",
                });
                const petalOpacity = interpolate(
                    petalFrame,
                    [0, 20, 100, 150],
                    [0, 0.4, 0.3, 0],
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
                            background: "linear-gradient(135deg, #f8bbd0, #f48fb1)",
                            transform: `translateY(${petalY}px) rotate(${petalRotate}deg)`,
                            opacity: petalOpacity,
                            filter: "blur(0.5px)",
                        }}
                    />
                );
            })}

            {/* All characters — scatter away */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${entranceScale})`,
                    display: "flex",
                    alignItems: "baseline",
                    whiteSpace: "nowrap",
                }}
            >
                {allChars.map((char, i) => {
                    const s = getScatterDir(i);
                    const delay = scatterStart + i * 5;
                    const sp = interpolate(
                        frame,
                        [delay, delay + 50],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    const eased = sp * sp;

                    const tx = eased * s.x;
                    const ty = eased * s.y;
                    const rot = eased * s.rot;
                    const charScale = 1 - eased * 0.4;
                    const charOpacity = entranceOpacity * interpolate(
                        sp,
                        [0, 0.3, 1],
                        [1, 0.7, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );

                    return (
                        <span
                            key={`c-${i}`}
                            style={{
                                display: "inline-block",
                                fontSize: fontSize * 1.5,
                                fontFamily: FONTS.zenKurenaido,
                                fontWeight: 600,
                                color: "#fffef2",
                                textShadow: `${TEXT_SHADOWS.subtle}, 0 0 8px rgba(180, 200, 130, 0.3)`,
                                letterSpacing: "0.05em",
                                opacity: charOpacity,
                                transform: `translateX(${tx}px) translateY(${ty}px) scale(${charScale}) rotate(${rot}deg)`,
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>

            {/* Title 沈丁花 — blooms in center after scatter, white→pink gradient */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${bloomScale})`,
                    textAlign: "center",
                    fontSize: fontSize * 2.5,
                    fontFamily: "'Hina Mincho', serif",
                    fontWeight: 400,
                    // White → Pink gradient text
                    background: "linear-gradient(180deg, #ffffff 0%, #fce4ec 40%, #f8bbd0 70%, #f48fb1 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "none",
                    filter: `drop-shadow(0 0 ${glowIntensity}px rgba(248, 187, 208, 0.7)) drop-shadow(0 0 ${glowIntensity * 2}px rgba(244, 143, 177, 0.4)) drop-shadow(3px 3px 8px rgba(0, 0, 0, 0.5))`,
                    letterSpacing: "0.2em",
                    opacity: bloomOpacity,
                }}
            >
                沈丁花
            </div>

            {/* Underline decoration — appears with bloom */}
            <div
                style={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: interpolate(
                        frame,
                        [bloomStart + 20, bloomStart + 80],
                        [0, 300],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    ),
                    height: 1.5,
                    background:
                        "linear-gradient(90deg, transparent, rgba(244, 143, 177, 0.6), transparent)",
                    opacity: interpolate(
                        frame,
                        [bloomStart + 20, bloomStart + 50, duration - 60, duration],
                        [0, 0.7, 0.5, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    ),
                }}
            />
        </>
    );
};

// ========================================
// Persistent dark overlay for center section
// Managed as a separate Sequence to stay across multiple lyrics
// ========================================
const DarkOverlay: React.FC<{
    duration: number;
}> = ({ duration }) => {
    const frame = useCurrentFrame();

    const opacity = interpolate(
        frame,
        [0, 30, duration - 30, duration],
        [0, 0.45, 0.45, 0],
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
                backgroundColor: `rgba(0, 0, 0, ${opacity})`,
            }}
        />
    );
};

// ========================================
// Main Video Component
// ========================================
export const JinchougeVideo: React.FC<
    z.infer<typeof jinchougeSchema>
> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();

    const parsedLyrics = props.lyrics.map((l) => ({
        ...l,
        seconds: parseTime(l.timeTag),
    }));

    // Lines to shorten for interlude (display ~2s instead of full gap)
    const shortenTexts = ["まず土を掘る", "前に進んでる"];

    // Center display section: "ああ　そうか　わかった" ~ "まだ諦めきれない　馬鹿な火だ"
    const centerTexts = [
        "ああ　そうか　わかった",
        "押してたのは　春じゃなくて",
        "ずっと　この胸の奥の",
        "まだ諦めきれない　馬鹿な火だ",
    ];

    // Calculate overlay timing for center section
    const centerStartTime = parseTime("[01:54.00]"); // "ああ　そうか　わかった"
    const centerEndTime = parseTime("[02:09.06]"); // next line after "馬鹿な火だ" = "春より　先に咲く"
    const overlayFrom = Math.round(centerStartTime * fps);
    const overlayDuration = Math.round((centerEndTime - centerStartTime) * fps);

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

            {/* No opening title — lyrics start directly */}

            {/* Persistent dark overlay for center section */}
            <Sequence
                from={overlayFrom}
                durationInFrames={overlayDuration}
                layout="none"
            >
                <DarkOverlay duration={overlayDuration} />
            </Sequence>

            {/* Lyrics */}
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
                    durationFrames = 450; // 15 seconds for final line — longer title display
                }

                // Shorten display for interlude lines
                if (shortenTexts.includes(line.text)) {
                    durationFrames = Math.min(durationFrames, Math.round(2 * fps));
                }

                const isCenter = centerTexts.includes(line.text);
                const isLastLine = !nextLine;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        {isLastLine ? (
                            <FinalTitleReveal
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        ) : isCenter ? (
                            <CenterLyricLine
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
