import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    Video,
    useCurrentFrame,
    spring,
    Easing,
} from "remotion";
import { z } from "zod";

export const mikanseiNoChizuSchema = z.object({
    fontSize: z.number().default(42),
    bottomOffset: z.number().default(120),
    videoSource: z.string(),
    title: z.string(),
    artist: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
            isEmphasis: z.boolean().optional(),
            isFinal: z.boolean().optional(),
        })
    ),
});

// Parse time tag to seconds
const parseTime = (tag: string): number => {
    const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseFloat(match[2]);
};

// Handwritten text component with typewriter animation (no pen cursor)
const HandwrittenText: React.FC<{
    text: string;
    fontSize: number;
    frame: number;
    fps: number;
}> = ({ text, fontSize, frame, fps }) => {
    const chars = text.split("");
    const charDelay = 2.5; // frames between each character

    return (
        <div
            style={{
                display: "inline-block",
                position: "relative",
            }}
        >
            <div
                style={{
                    fontSize,
                    fontWeight: 400,
                    color: "#ffffff",
                    fontFamily: "'Yomogi', 'Zen Kurenaido', 'Klee One', cursive, sans-serif",
                    letterSpacing: "0.02em",
                    lineHeight: 1.6,
                    textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.6)",
                }}
            >
                {chars.map((char, i) => {
                    const charFrame = frame - i * charDelay;

                    // Spring animation for natural movement
                    const spr = spring({
                        frame: charFrame,
                        fps,
                        config: { damping: 25, stiffness: 180, mass: 0.4 },
                    });

                    const opacity = interpolate(charFrame, [0, 4], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                    });

                    const scale = interpolate(spr, [0, 1], [0.7, 1]);

                    const rotation = interpolate(
                        charFrame,
                        [0, 3, 6],
                        [-1, 0.5, 0],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    const inkOpacity = interpolate(
                        Math.sin(i * 0.7),
                        [-1, 1],
                        [0.85, 1]
                    );

                    return (
                        <span
                            key={i}
                            style={{
                                display: "inline-block",
                                opacity: opacity * inkOpacity,
                                transform: `scale(${scale}) rotate(${rotation}deg)`,
                                minWidth: char.trim() === "" ? "0.4em" : "auto",
                                transformOrigin: "center bottom",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// Simple lyric text for previous line (no animation)
const SimpleLyricText: React.FC<{
    text: string;
    fontSize: number;
}> = ({ text, fontSize }) => {
    return (
        <div
            style={{
                fontSize,
                fontWeight: 400,
                color: "#ffffff",
                fontFamily: "'Yomogi', 'Zen Kurenaido', 'Klee One', cursive, sans-serif",
                letterSpacing: "0.02em",
                lineHeight: 1.6,
                textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
        >
            {text}
        </div>
    );
};

// Lyric line with notebook underline
const LyricLineWithUnderline: React.FC<{
    children: React.ReactNode;
    width?: string;
}> = ({ children, width = "80%" }) => {
    return (
        <div
            style={{
                position: "relative",
                display: "inline-block",
                paddingBottom: 8,
            }}
        >
            {children}
            {/* White underline for notebook feel */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width,
                    height: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.35)",
                }}
            />
        </div>
    );
};

// Chapter definitions with timestamps (in seconds)
const chapters = [
    { time: 0, label: "第１章" },
    { time: 41.44, label: "第２章" },    // 「これでいいのか」なんて
    { time: 58.33, label: "第３章" },    // 走り出せ　まだ誰も知らない場所へ
    { time: 88.14, label: "第４章" },    // SNSを閉じて　深呼吸した (1:28.14)
    { time: 119.25, label: "第５章" },   // 一人じゃないなんて (1:59.25)
    { time: 138.15, label: "第６章" },   // 走り出せ (2nd time) (2:18.15)
    { time: 170.62, label: "最終章" },   // さあ、顔を上げて (2:50.62)
];

// Get current chapter index based on time
const getCurrentChapterIndex = (seconds: number): number => {
    for (let i = chapters.length - 1; i >= 0; i--) {
        if (seconds >= chapters[i].time) {
            return i;
        }
    }
    return 0;
};

// Main component
export const MikanseiNoChizuVideo: React.FC<z.infer<typeof mikanseiNoChizuSchema>> = (props) => {
    const { fps, height } = useVideoConfig();
    const frame = useCurrentFrame();

    // Parse lyrics with timing
    const parsedLyrics = props.lyrics.map((l, index) => ({
        ...l,
        seconds: parseTime(l.timeTag),
        index,
    }));

    // Find current lyric index (treat all lyrics the same, ignore isEmphasis/isFinal)
    const currentSeconds = frame / fps;

    // Get current chapter
    const currentChapterIndex = getCurrentChapterIndex(currentSeconds);
    const currentChapter = chapters[currentChapterIndex].label;

    // Check if we're in a page flip transition (diagonal sweep effect)
    const pageFlipDuration = 0.6; // Duration of page flip in seconds
    let pageFlipProgress = -1; // -1 means no flip happening

    for (let i = 1; i < chapters.length; i++) {
        const chapterStartTime = chapters[i].time;
        const timeSinceChapterStart = currentSeconds - chapterStartTime;

        if (timeSinceChapterStart >= -0.1 && timeSinceChapterStart < pageFlipDuration) {
            // We're in a page flip transition
            pageFlipProgress = Math.max(0, (timeSinceChapterStart + 0.1) / (pageFlipDuration + 0.1));
            break;
        }
    }

    // Calculate diagonal sweep animation for lyrics during page flip
    // Text sweeps from right-top to left-bottom (diagonal wipe)
    const getSweepTransform = (progress: number) => {
        if (progress < 0) return { opacity: 1, transform: "translate(0, 0) rotate(0deg)" };

        // Diagonal movement: right to left, with slight upward motion
        const translateX = interpolate(progress, [0, 0.6], [0, -150], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.ease),
        });

        const translateY = interpolate(progress, [0, 0.6], [0, -30], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.ease),
        });

        // Slight rotation for natural page-turn feel
        const rotation = interpolate(progress, [0, 0.6], [0, -8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.ease),
        });

        // Fade out as it sweeps
        const opacity = interpolate(progress, [0, 0.4, 0.6], [1, 0.5, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });

        return {
            opacity,
            transform: `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg)`,
        };
    };

    // After sweep, new lyrics fade in
    const getNewLyricsOpacity = (progress: number) => {
        if (progress < 0) return 1;
        return interpolate(progress, [0.5, 1], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        });
    };

    const sweepStyle = getSweepTransform(pageFlipProgress);
    const newLyricsOpacity = getNewLyricsOpacity(pageFlipProgress);

    let currentLyricIndex = -1;
    for (let i = parsedLyrics.length - 1; i >= 0; i--) {
        if (parsedLyrics[i].seconds <= currentSeconds && parsedLyrics[i].text.trim() !== "") {
            currentLyricIndex = i;
            break;
        }
    }

    // Get previous lyric (skip empty ones) - but only show if in same chapter
    let previousLyricIndex = -1;
    if (currentLyricIndex >= 0) {
        const currentLyricChapter = getCurrentChapterIndex(parsedLyrics[currentLyricIndex].seconds);
        for (let i = currentLyricIndex - 1; i >= 0; i--) {
            if (parsedLyrics[i].text.trim() !== "") {
                const prevLyricChapter = getCurrentChapterIndex(parsedLyrics[i].seconds);
                // Only show previous lyric if it's in the same chapter
                if (prevLyricChapter === currentLyricChapter) {
                    previousLyricIndex = i;
                }
                break;
            }
        }
    }

    const currentLyric = currentLyricIndex >= 0 ? parsedLyrics[currentLyricIndex] : null;
    const previousLyric = previousLyricIndex >= 0 ? parsedLyrics[previousLyricIndex] : null;

    // Calculate lyrics area (bottom 1/3 of screen)
    const lyricsAreaHeight = height / 3;
    const lyricsAreaTop = height - lyricsAreaHeight;
    const lineHeight = 70; // spacing between lines
    const currentLineY = lyricsAreaTop + lyricsAreaHeight / 2 + 20; // current lyric position
    const previousLineY = currentLineY - lineHeight; // previous lyric position (one row above)

    // Animation timing for current lyric
    const getTimeSinceStart = (lyricIndex: number) => {
        if (lyricIndex < 0) return 0;
        return frame - parsedLyrics[lyricIndex].seconds * fps;
    };

    // During page flip first half, show old lyrics sweeping away
    // During second half, show new lyrics fading in
    const isInSweepPhase = pageFlipProgress >= 0 && pageFlipProgress < 0.5;

    // Check if we're in finale mode (last lyric)
    const isFinaleMode = currentLyricIndex === parsedLyrics.length - 1;

    // Calculate fade out for regular lyrics when finale starts
    const finaleStartTime = parsedLyrics.length > 0 ? parsedLyrics[parsedLyrics.length - 1].seconds : 999;
    const regularLyricsOpacity = isFinaleMode
        ? interpolate(
            currentSeconds - finaleStartTime,
            [0, 0.5],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
        : 1;

    return (
        <AbsoluteFill>
            {/* Video background - full opacity */}
            <Video
                src={props.videoSource}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* Chapter indicator - top right corner */}
            <div
                style={{
                    position: "absolute",
                    top: 30,
                    right: 40,
                    textAlign: "right",
                    opacity: interpolate(frame, [0, fps * 0.5], [0, 0.85], {
                        extrapolateRight: "clamp",
                    }),
                }}
            >
                <div
                    style={{
                        fontSize: 22,
                        fontWeight: 400,
                        color: "#ffffff",
                        fontFamily: "'Yomogi', 'Zen Kurenaido', cursive",
                        letterSpacing: "0.05em",
                        textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.7)",
                        lineHeight: 1.4,
                    }}
                >
                    未完成の地図
                </div>
                <div
                    style={{
                        fontSize: 18,
                        fontWeight: 400,
                        color: "#ffffff",
                        fontFamily: "'Yomogi', 'Zen Kurenaido', cursive",
                        letterSpacing: "0.08em",
                        textShadow: "0 2px 8px rgba(0,0,0,0.9), 0 0 15px rgba(0,0,0,0.7)",
                        marginTop: 4,
                    }}
                >
                    {currentChapter}
                </div>
            </div>

            {/* Lyrics container - bottom 1/3 of screen with transparent background */}
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: lyricsAreaTop,
                    height: lyricsAreaHeight,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    // Subtle gradient for readability (transparent to semi-transparent)
                    background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.5) 100%)",
                    overflow: "hidden", // Hide lyrics as they sweep out
                    opacity: regularLyricsOpacity, // Fade out when finale starts
                }}
            >
                {/* During sweep phase, both lyrics sweep away diagonally */}
                {isInSweepPhase && (
                    <>
                        {/* Previous lyric sweeping away */}
                        {previousLyric && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: previousLineY - lyricsAreaTop,
                                    left: 50,
                                    right: 50,
                                    textAlign: "center",
                                    opacity: sweepStyle.opacity * 0.35,
                                    transform: sweepStyle.transform,
                                }}
                            >
                                <LyricLineWithUnderline width="70%">
                                    <SimpleLyricText
                                        text={previousLyric.text}
                                        fontSize={props.fontSize * 0.85}
                                    />
                                </LyricLineWithUnderline>
                            </div>
                        )}

                        {/* Current lyric sweeping away */}
                        {currentLyric && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: currentLineY - lyricsAreaTop,
                                    left: 50,
                                    right: 50,
                                    textAlign: "center",
                                    opacity: sweepStyle.opacity,
                                    transform: sweepStyle.transform,
                                }}
                            >
                                <LyricLineWithUnderline width="85%">
                                    <SimpleLyricText
                                        text={currentLyric.text}
                                        fontSize={props.fontSize}
                                    />
                                </LyricLineWithUnderline>
                            </div>
                        )}
                    </>
                )}

                {/* Normal display (not during sweep) or new lyrics fading in */}
                {!isInSweepPhase && (
                    <>
                        {/* Previous lyric - faded, one row above with underline */}
                        {previousLyric && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: previousLineY - lyricsAreaTop,
                                    left: 50,
                                    right: 50,
                                    textAlign: "center",
                                    opacity: 0.35 * newLyricsOpacity,
                                }}
                            >
                                <LyricLineWithUnderline width="70%">
                                    <SimpleLyricText
                                        text={previousLyric.text}
                                        fontSize={props.fontSize * 0.85}
                                    />
                                </LyricLineWithUnderline>
                            </div>
                        )}

                        {/* Current lyric - main display with underline */}
                        {currentLyric && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: currentLineY - lyricsAreaTop,
                                    left: 50,
                                    right: 50,
                                    textAlign: "center",
                                    opacity: newLyricsOpacity,
                                }}
                            >
                                <LyricLineWithUnderline width="85%">
                                    <HandwrittenText
                                        text={currentLyric.text}
                                        fontSize={props.fontSize}
                                        frame={getTimeSinceStart(currentLyricIndex)}
                                        fps={fps}
                                    />
                                </LyricLineWithUnderline>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Finale ending effect for the last lyric */}
            {currentLyric && currentLyricIndex === parsedLyrics.length - 1 && (
                (() => {
                    const finaleStartTime = parsedLyrics[parsedLyrics.length - 1].seconds;
                    const timeSinceFinale = currentSeconds - finaleStartTime;
                    const finaleDuration = 4; // Duration of finale effect in seconds (shortened)

                    // Scale animation - starts normal, grows slightly
                    const finaleScale = interpolate(
                        timeSinceFinale,
                        [0, 0.5, 2, finaleDuration],
                        [1, 1.05, 1.1, 1.15],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    // Glow intensity builds up then fades
                    const glowIntensity = interpolate(
                        timeSinceFinale,
                        [0, 1, 2.5, finaleDuration],
                        [0, 25, 35, 15],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    // Fade in at start, then fade out naturally
                    const finaleOpacity = interpolate(
                        timeSinceFinale,
                        [0, 0.3, 2.5, finaleDuration],
                        [0, 1, 1, 0],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    // Slight upward movement
                    const translateY = interpolate(
                        timeSinceFinale,
                        [0, finaleDuration],
                        [0, -15],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    // Background glow opacity - also fades out
                    const bgGlowOpacity = interpolate(
                        timeSinceFinale,
                        [0, 1, 2.5, finaleDuration],
                        [0, 0.15, 0.15, 0],
                        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
                    );

                    return (
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 100,
                                background: `radial-gradient(ellipse at center, rgba(255,220,150,${bgGlowOpacity}) 0%, transparent 70%)`,
                            }}
                        >
                            <div
                                style={{
                                    transform: `scale(${finaleScale}) translateY(${translateY}px)`,
                                    opacity: finaleOpacity,
                                    textAlign: "center",
                                    padding: "40px 80px",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: props.fontSize * 2,
                                        fontWeight: 500,
                                        color: "#ffffff",
                                        fontFamily: "'Yomogi', 'Zen Kurenaido', cursive",
                                        letterSpacing: "0.15em",
                                        textShadow: `
                                            0 0 ${glowIntensity}px rgba(255, 200, 100, 0.8),
                                            0 0 ${glowIntensity * 2}px rgba(255, 180, 80, 0.5),
                                            0 4px 15px rgba(0,0,0,0.8)
                                        `,
                                        lineHeight: 1.8,
                                    }}
                                >
                                    <HandwrittenText
                                        text={currentLyric.text}
                                        fontSize={props.fontSize * 2}
                                        frame={getTimeSinceStart(currentLyricIndex)}
                                        fps={fps}
                                    />
                                </div>
                                {/* Decorative line below */}
                                <div
                                    style={{
                                        marginTop: 20,
                                        height: 2,
                                        background: `linear-gradient(90deg, transparent, rgba(255,220,150,${0.6 * finaleOpacity}), transparent)`,
                                        width: interpolate(timeSinceFinale, [0, 2], [0, 300], { extrapolateRight: "clamp" }),
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })()
            )}

            {/* Title overlay at start */}
            {frame < fps * 4 && (
                <div
                    style={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        opacity: interpolate(frame, [fps * 3, fps * 4], [1, 0], {
                            extrapolateLeft: "clamp",
                            extrapolateRight: "clamp",
                        }),
                        zIndex: 50,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        padding: "30px 60px",
                        borderRadius: 12,
                        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                        textAlign: "center",
                    }}
                >
                    <HandwrittenText
                        text={props.title}
                        fontSize={64}
                        frame={frame}
                        fps={fps}
                    />
                </div>
            )}
        </AbsoluteFill>
    );
};
