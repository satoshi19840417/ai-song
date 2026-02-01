import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    Video,
    Audio,
    Sequence,
    useCurrentFrame,
    Easing,
} from "remotion";
import { z } from "zod";

// Schema for props
export const sujigakinonaiTabiSchema = z.object({
    fontSize: z.number().default(40),
    titleFontSize: z.number().default(40),
    videoSource: z.string(),
    title: z.string().default("筋書きのない旅"),
    artist: z.string().default(""),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
        })
    ),
});

// Opening Cover Component - Travel diary cover style
const OpeningCover: React.FC<{
    title: string;
    duration: number;
    fontSize: number;
}> = ({ title, duration, fontSize }) => {
    const frame = useCurrentFrame();

    const flipStartFrame = duration - 45;

    const coverOpacity = interpolate(
        frame,
        [0, 30, flipStartFrame, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const titleOpacity = interpolate(
        frame,
        [20, 60, flipStartFrame, flipStartFrame + 20],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const flipRotation = interpolate(
        frame,
        [flipStartFrame, duration],
        [0, -120],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.in(Easing.cubic)
        }
    );

    const flipScale = interpolate(
        frame,
        [flipStartFrame, duration],
        [1, 0.85],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const floatY = interpolate(
        frame,
        [0, 60, 120, 180, flipStartFrame],
        [0, -3, 0, -2, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            perspective: "1500px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            opacity: coverOpacity,
        }}>
            <div style={{
                width: 700,
                height: 500,
                background: "linear-gradient(135deg, rgba(139, 90, 43, 0.95) 0%, rgba(101, 67, 33, 0.95) 50%, rgba(80, 50, 25, 0.95) 100%)",
                borderRadius: 8,
                boxShadow: "0 15px 40px rgba(0, 0, 0, 0.6), inset 0 2px 3px rgba(255, 255, 255, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transform: `translateY(${floatY}px) rotateY(${flipRotation}deg) scale(${flipScale})`,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                border: "3px solid rgba(60, 40, 20, 0.8)",
            }}>
                <div style={{
                    position: "absolute",
                    top: 20, left: 20, right: 20, bottom: 20,
                    border: "2px solid rgba(200, 170, 130, 0.4)",
                    borderRadius: 4,
                }} />
                <div style={{
                    fontSize: fontSize * 2.2,
                    fontFamily: "'Yuji Syuku', serif",
                    color: "rgba(240, 225, 200, 0.95)",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(200, 170, 130, 0.3)",
                    letterSpacing: "0.15em",
                    opacity: titleOpacity,
                    marginBottom: 30,
                }}>{title}</div>
                <div style={{
                    width: 200,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, rgba(200, 170, 130, 0.6), transparent)",
                    opacity: titleOpacity,
                    marginBottom: 25,
                }} />
                <div style={{
                    fontSize: fontSize * 0.8,
                    fontFamily: "'Zen Kurenaido', sans-serif",
                    color: "rgba(200, 180, 150, 0.8)",
                    letterSpacing: "0.3em",
                    opacity: titleOpacity,
                }}>After the Aftermath</div>
            </div>
        </div>
    );
};

// Check if this is the final impressive section
// Only "No more scripts" triggers the ending - the earlier "まだ見たことない世界が　僕らを待ってる" is NOT the ending
const isFinalSection = (text: string): boolean => {
    return text.includes("No more scripts");
};

// Episode markers based on lyrics content
const getEpisodeForLyric = (text: string): string | null => {
    if (text.includes("同じ色の天井") || text.includes("前へ倣え")) {
        return "プロローグ";
    }
    if (text.includes("着せられた制服") || text.includes("脱ぎ捨てる")) {
        return "エピソード1";
    }
    if (text.includes("予定通りに進む")) {
        return "エピソード3";
    }
    if (text.includes("他人の物差し")) {
        return "エピソード4";
    }
    if (text.includes("チケットの半券")) {
        return "エピローグ";
    }
    // エピソード2と5は両方「吸い込んだことのない風を」なので、位置で判定する必要がある
    if (text.includes("吸い込んだことのない風")) {
        return null; // Will be handled with index-based logic
    }
    return null;
};

// Title Component (Top-Left corner - horizontal writing)
const TitleOverlay: React.FC<{
    title: string;
    chapter: string;
    fontSize: number;
}> = ({ title, chapter, fontSize }) => {
    const frame = useCurrentFrame();

    // Gentle fade in at the start
    const opacity = interpolate(
        frame,
        [0, 60],
        [0, 0.9],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: 50,
                left: 50,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                opacity,
            }}
        >
            {/* Main Title - Horizontal */}
            <div
                style={{
                    fontSize: fontSize * 1.1,
                    fontFamily: "'Yuji Syuku', serif",
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.85)",
                    textShadow: `
                        0 0 10px rgba(0, 0, 0, 0.9),
                        0 0 20px rgba(0, 0, 0, 0.7),
                        2px 2px 4px rgba(0, 0, 0, 0.9)
                    `,
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                }}
            >
                {title}
            </div>
            {/* Chapter indicator - Horizontal */}
            <div
                style={{
                    fontSize: fontSize * 0.7,
                    fontFamily: "'Zen Kurenaido', sans-serif",
                    fontWeight: 400,
                    color: "rgba(255, 255, 255, 0.6)",
                    textShadow: `
                        0 0 8px rgba(0, 0, 0, 0.8),
                        1px 1px 3px rgba(0, 0, 0, 0.9)
                    `,
                    letterSpacing: "0.15em",
                }}
            >
                {chapter}
            </div>
        </div>
    );
};

// Bottom-aligned Horizontal Lyric Line
const BottomLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    isActive: boolean;
    slideOffset: number; // 0 = current, 1 = previous, etc.
}> = ({ text, duration, fontSize, isActive, slideOffset }) => {
    const frame = useCurrentFrame();

    // Position from bottom - active line is at bottom, previous lines stack above
    const baseBottomPosition = 50;
    const slideDistance = 60; // Vertical distance between lyric lines

    // No slide animation - lyrics appear in place naturally
    const bottomPosition = baseBottomPosition + (slideOffset * slideDistance);

    // Opacity based on position - current is bright, older ones fade
    const targetOpacity = isActive
        ? 1
        : Math.max(0.1, 0.6 - (slideOffset * 0.25));

    // Ensure inputRange is always monotonically increasing
    const fadeInEnd = Math.min(20, duration * 0.3);
    const fadeOutStart = Math.max(fadeInEnd + 1, duration - 15);

    const opacity = interpolate(
        frame,
        [0, fadeInEnd, fadeOutStart, duration],
        [0, targetOpacity, targetOpacity, isActive ? 0 : targetOpacity * 0.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Scale - current is normal, older ones slightly smaller
    const scale = isActive ? 1 : 0.92 - (slideOffset * 0.04);

    // Color intensity based on position
    const colorIntensity = isActive ? 1 : 0.8 - (slideOffset * 0.15);

    return (
        <div
            style={{
                position: "absolute",
                bottom: bottomPosition,
                left: "50%",
                transform: `translateX(-50%) scale(${scale})`,
                fontSize: fontSize * (isActive ? 1.15 : 0.95),
                fontFamily: "'Yuji Syuku', serif",
                fontWeight: 400,
                color: `rgba(255, 255, 255, ${colorIntensity})`,
                textShadow: isActive
                    ? `
                        0 0 10px rgba(200, 220, 255, 0.5),
                        0 0 20px rgba(100, 150, 200, 0.35),
                        0 4px 8px rgba(0, 0, 0, 0.9)
                    `
                    : `
                        0 2px 4px rgba(0, 0, 0, 0.85)
                    `,
                opacity,
                letterSpacing: "0.08em",
                lineHeight: 1.4,
                whiteSpace: "nowrap",
                textAlign: "center",
                transformOrigin: "center bottom",
            }}
        >
            {text}
        </div>
    );
};

// Final Section Component - Horizontal, centered, dramatic
const FinalSection: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    isLast: boolean;
}> = ({ text, duration, fontSize, isLast }) => {
    const frame = useCurrentFrame();

    // Wind-blown exit animation for the last lyric
    const windStartFrame = isLast ? duration - 90 : duration - 30;

    // Dramatic scale and glow animation
    const scale = interpolate(
        frame,
        isLast
            ? [0, 40, windStartFrame, duration]
            : [0, 40, duration - 30, duration],
        isLast
            ? [0.7, 1.05, 1.05, 0.6]
            : [0.7, 1.05, 1.05, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic)
        }
    );

    const opacity = interpolate(
        frame,
        isLast
            ? [0, 30, windStartFrame, windStartFrame + 60, duration]
            : [0, 30, duration - 40, duration],
        isLast
            ? [0, 1, 1, 0.5, 0]
            : [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Glow pulse effect
    const glowPulse = interpolate(
        frame,
        [0, 30, 60, 90, duration],
        [0.3, 0.7, 1, 1.2, isLast ? 0.3 : 1.5],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Y position - slight float up
    const translateY = interpolate(
        frame,
        isLast
            ? [0, 40, windStartFrame, duration]
            : [0, 40, duration],
        isLast
            ? [30, 0, 0, -80]
            : [30, 0, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Wind-blown X movement (only for last lyric)
    const translateX = isLast
        ? interpolate(
            frame,
            [windStartFrame, duration],
            [0, 300],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.in(Easing.quad)
            }
        )
        : 0;

    // Rotation for wind effect (only for last lyric)
    const rotate = isLast
        ? interpolate(
            frame,
            [windStartFrame, duration],
            [0, 8],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
        : 0;

    // Blur for wind effect (simulated with text shadow changes)
    const windBlur = isLast
        ? interpolate(
            frame,
            [windStartFrame, duration],
            [0, 10],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
        : 0;

    const isEnglish = text.includes("No more scripts");

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                fontSize: isEnglish ? fontSize * 1.8 : fontSize * 2,
                fontFamily: isEnglish ? "'Zen Kurenaido', sans-serif" : "'Yuji Syuku', serif",
                fontWeight: isEnglish ? 300 : 400,
                color: "#fff",
                textShadow: `
                    0 0 ${20 * glowPulse + windBlur}px rgba(180, 220, 255, ${0.7 * glowPulse}),
                    0 0 ${40 * glowPulse + windBlur}px rgba(140, 180, 230, ${0.5 * glowPulse}),
                    0 0 ${70 * glowPulse + windBlur * 2}px rgba(100, 150, 220, ${0.3 * glowPulse}),
                    3px 3px ${6 + windBlur}px rgba(0, 0, 0, 0.9)
                `,
                opacity,
                letterSpacing: isEnglish ? "0.2em" : "0.15em",
                whiteSpace: "nowrap",
                textAlign: "center",
                transformOrigin: "center center",
                filter: isLast && windBlur > 0 ? `blur(${windBlur * 0.3}px)` : "none",
            }}
        >
            {text}
        </div>
    );
};


// Track visible lyrics for the sliding diary effect
interface LyricState {
    text: string;
    startFrame: number;
    endFrame: number;
    index: number;
}

export const SujigakinonaiTabiVideo: React.FC<z.infer<typeof sujigakinonaiTabiSchema>> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();
    const globalFrame = useCurrentFrame();

    const parseTime = (tag: string) => {
        const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
        if (!match) return 0;
        return parseInt(match[1]) * 60 + parseFloat(match[2]);
    };

    const parsedLyrics = props.lyrics.map((l, idx) => {
        const seconds = parseTime(l.timeTag);
        return {
            ...l,
            seconds,
            index: idx,
        };
    });

    // Find final section start
    const finalSectionIndex = parsedLyrics.findIndex(l => isFinalSection(l.text));

    // Separate regular lyrics and final section
    const regularLyrics = finalSectionIndex >= 0
        ? parsedLyrics.slice(0, finalSectionIndex)
        : parsedLyrics;
    const finalLyrics = finalSectionIndex >= 0
        ? parsedLyrics.slice(finalSectionIndex)
        : [];

    // Calculate visible lyrics at current frame (for diary sliding effect)
    const getVisibleLyrics = (): LyricState[] => {
        const visible: LyricState[] = [];
        const maxVisible = 4; // Show up to 4 previous lyrics

        for (let i = regularLyrics.length - 1; i >= 0; i--) {
            const lyric = regularLyrics[i];
            const startFrame = Math.round(lyric.seconds * fps);
            const nextLyric = regularLyrics[i + 1];
            const endSeconds = nextLyric ? nextLyric.seconds + 3 : lyric.seconds + 5;
            const endFrame = Math.round(endSeconds * fps);

            // Check if this lyric should be visible
            if (globalFrame >= startFrame && visible.length < maxVisible) {
                visible.push({
                    text: lyric.text,
                    startFrame,
                    endFrame,
                    index: lyric.index,
                });
            }
        }

        return visible.reverse(); // Oldest first
    };

    const visibleLyrics = getVisibleLyrics();

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

            {/* Opening Cover - Travel Diary style (first 8 seconds) */}
            <Sequence  durationInFrames={240} layout="none">
                <OpeningCover
                    title={props.title}
                    duration={240}
                    fontSize={props.titleFontSize}
                />
            </Sequence>

            {/* Determine current episode based on visible lyrics */}
            {(() => {
                // Find current active lyric
                const currentLyric = parsedLyrics.find((l, idx) => {
                    const startFrame = Math.round(l.seconds * fps);
                    const nextLyric = parsedLyrics[idx + 1];
                    const endFrame = nextLyric ? Math.round(nextLyric.seconds * fps) : durationInFrames;
                    return globalFrame >= startFrame && globalFrame < endFrame;
                });

                let currentEpisode = "プロローグ";

                if (currentLyric) {
                    // Find the episode by checking this lyric and all previous lyrics
                    const currentIdx = parsedLyrics.indexOf(currentLyric);

                    // Count occurrences of "吸い込んだことのない風" to distinguish episode 2 and 5
                    let windCount = 0;

                    for (let i = 0; i <= currentIdx; i++) {
                        const lyric = parsedLyrics[i];
                        const episode = getEpisodeForLyric(lyric.text);

                        if (lyric.text.includes("吸い込んだことのない風")) {
                            windCount++;
                            if (windCount === 1) {
                                currentEpisode = "エピソード2";
                            } else if (windCount === 2) {
                                currentEpisode = "エピソード5";
                            }
                        } else if (episode) {
                            currentEpisode = episode;
                        }
                    }
                }

                // Hide during opening cover (first 240 frames)
                if (globalFrame < 240) {
                    return null;
                }

                return (
                    <TitleOverlay
                        title={props.title}
                        chapter={currentEpisode}
                        fontSize={props.titleFontSize}
                    />
                );
            })()}

            {/* Diary-style lyrics - using Sequences for timing */}
            {regularLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = regularLyrics[index + 1];

                // Keep lyrics visible longer (until 3 lyrics later or end of video)
                const fadeOutIndex = Math.min(index + 4, regularLyrics.length - 1);
                const fadeOutLyric = regularLyrics[fadeOutIndex];
                // Extend duration for the last regular lyric
                const isLastRegular = index === regularLyrics.length - 1;
                const endSeconds = isLastRegular
                    ? line.seconds + 7
                    : (fadeOutLyric ? fadeOutLyric.seconds + 1 : line.seconds + 10);
                const durationFrames = Math.max(1, Math.round((endSeconds - line.seconds) * fps));

                // Calculate slide offset based on current position in visible lyrics
                const currentActiveIndex = regularLyrics.findIndex(l => {
                    const s = Math.round(l.seconds * fps);
                    const n = regularLyrics[regularLyrics.indexOf(l) + 1];
                    const e = n ? Math.round(n.seconds * fps) : durationInFrames;
                    return globalFrame >= s && globalFrame < e;
                });

                const slideOffset = currentActiveIndex >= 0 ? currentActiveIndex - index : 0;
                const isActive = slideOffset === 0 && globalFrame >= startFrame;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        <BottomLyricLine
                            text={line.text}
                            duration={durationFrames}
                            fontSize={props.fontSize}
                            isActive={isActive}
                            slideOffset={Math.max(0, slideOffset)}
                        />
                    </Sequence>
                );
            })}

            {/* Final Section - Horizontal, centered, dramatic */}
            {finalLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = finalLyrics[index + 1];
                // Extend duration for the last final lyric (12 seconds)
                const endSeconds = nextLine ? nextLine.seconds : line.seconds + 12;
                const durationFrames = Math.max(1, Math.round((endSeconds - line.seconds) * fps));

                const isLast = index === finalLyrics.length - 1;

                return (
                    <Sequence
                        key={`final-${index}`}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        <FinalSection
                            text={line.text}
                            duration={durationFrames}
                            fontSize={props.fontSize}
                            isLast={isLast}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
