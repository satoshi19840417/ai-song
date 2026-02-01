import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    Video,
    Audio,
    useCurrentFrame,
} from "remotion";
import { z } from "zod";

export const kamenButokaiSchema = z.object({
    fontSize: z.number().default(28),
    videoSource: z.string(),
    title: z.string(),
    artist: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
            side: z.enum(["left", "right", "center"]),
        })
    ),
});

// Parse time tag to seconds
const parseTime = (tag: string): number => {
    const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseFloat(match[2]);
};

// Check if this is an emphasis line
const isEmphasisLine = (text: string): boolean => {
    return text.includes("Unmasked") ||
        text.includes("これが本当の 私") ||
        text.includes("今ならきっと");
};

// Random username generator for variety
const usernames = [
    "kamen_dancer",
    "midnight_queen",
    "mask_off",
    "real_me_2024",
    "dance_escape",
    "tokyo_dreamer",
    "unmasked_soul",
    "night_butterfly",
];

const getUsername = (index: number): string => {
    return usernames[index % usernames.length];
};

// Gradient colors for profile icons (varied colors)
const iconGradients = [
    "linear-gradient(135deg, #833AB4 0%, #E91E63 50%, #F56040 100%)", // Instagram
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple-blue
    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", // Green
    "linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)", // Pink-blue
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", // Pink
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", // Blue-cyan
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", // Pink-yellow
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Mint-pink
];

// Instagram Live Comment Component
const LiveComment: React.FC<{
    text: string;
    username: string;
    fontSize: number;
    entryProgress: number;
    fadeProgress: number;
    iconColorIndex: number;
}> = ({ text, username, fontSize, entryProgress, fadeProgress, iconColorIndex }) => {
    // Slide up from bottom (push up effect)
    const slideY = interpolate(entryProgress, [0, 1], [60, 0], {
        extrapolateRight: "clamp",
    });

    // Slight scale up as it appears
    const scale = interpolate(entryProgress, [0, 1], [0.9, 1], {
        extrapolateRight: "clamp",
    });

    const opacity = interpolate(entryProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    }) * fadeProgress;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                marginBottom: 8,
                opacity,
                transform: `translateY(${slideY}px) scale(${scale})`,
                transformOrigin: "left bottom",
            }}
        >
            {/* Profile icon circle with varied colors */}
            <div
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: iconGradients[iconColorIndex % iconGradients.length],
                    marginRight: 10,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid rgba(255,255,255,0.3)",
                }}
            >
                <span style={{ fontSize: 14, color: "#fff" }}>
                    {username.charAt(0).toUpperCase()}
                </span>
            </div>

            {/* Comment bubble */}
            <div
                style={{
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: 20,
                    padding: "8px 14px",
                    maxWidth: 500,
                }}
            >
                {/* Username */}
                <span
                    style={{
                        fontSize: fontSize * 0.75,
                        fontWeight: 700,
                        color: "rgba(255, 255, 255, 0.9)",
                        marginRight: 8,
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    {username}
                </span>
                {/* Comment text */}
                <span
                    style={{
                        fontSize,
                        fontWeight: 400,
                        color: "#ffffff",
                        lineHeight: 1.4,
                        fontFamily: "'Noto Sans JP', sans-serif",
                    }}
                >
                    {text}
                </span>
            </div>
        </div>
    );
};

// Emphasis Line Component (for climax moments)
const EmphasisLine: React.FC<{
    text: string;
    fontSize: number;
    progress: number; // 0 to 1 over entire duration
    isFinal?: boolean;
}> = ({ text, fontSize, progress, isFinal }) => {
    const isEnglish = /^[A-Za-z\s.,!']+$/.test(text.trim());

    // Entry animation (first 20% of duration)
    const entryProgress = interpolate(progress, [0, 0.2], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Hold and then fade out (last 30% of duration)
    const fadeOut = interpolate(progress, [0.7, 1], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Scale animation - grows slightly for final line
    const baseScale = interpolate(entryProgress, [0, 1], [0.8, 1], {
        extrapolateRight: "clamp",
    });

    // Final line gets extra scale at the end
    const finalScale = isFinal
        ? interpolate(progress, [0.2, 0.5, 0.7], [1, 1.15, 1.1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
        : 1;

    const scale = baseScale * finalScale;

    const opacity = entryProgress * fadeOut;

    // Glow intensity peaks in the middle
    const glowIntensity = interpolate(
        progress,
        [0, 0.3, 0.7, 1],
        [0.5, 1.5, 1.3, 0.5],
        { extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity,
                zIndex: 100,
            }}
        >
            <div
                style={{
                    fontSize: fontSize * (isFinal ? 2.5 : 2),
                    fontWeight: 800,
                    color: "#ffffff",
                    fontFamily: isEnglish
                        ? "'Playfair Display', 'Georgia', serif"
                        : "'Noto Serif JP', 'Hiragino Mincho ProN', serif",
                    fontStyle: isEnglish ? "italic" : "normal",
                    textShadow: `
                        0 0 ${25 * glowIntensity}px rgba(220, 180, 255, 0.9),
                        0 0 ${50 * glowIntensity}px rgba(180, 120, 220, 0.6),
                        0 0 ${80 * glowIntensity}px rgba(140, 80, 180, 0.3),
                        3px 3px 8px rgba(0, 0, 0, 0.9)
                    `,
                    letterSpacing: isEnglish ? "0.15em" : "0.1em",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </div>
        </div>
    );
};

// Instagram Live Header Component
const LiveHeader: React.FC<{
    title: string;
    artist: string;
    opacity: number;
}> = ({ title, artist, opacity }) => {
    const frame = useCurrentFrame();
    const pulse = Math.sin(frame * 0.15) * 0.3 + 0.7;

    return (
        <div
            style={{
                position: "absolute",
                top: 30,
                left: 30,
                display: "flex",
                alignItems: "center",
                opacity,
            }}
        >
            {/* Profile picture */}
            <div
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, #833AB4 0%, #E91E63 50%, #F56040 100%)`,
                    padding: 3,
                    marginRight: 12,
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#1a1a1a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 24,
                        color: "#fff",
                    }}
                >
                    仮
                </div>
            </div>

            {/* Name and Live badge */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#ffffff",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        {title}
                    </span>
                    {/* LIVE badge */}
                    <div
                        style={{
                            backgroundColor: `rgba(255, 0, 80, ${pulse})`,
                            borderRadius: 4,
                            padding: "2px 8px",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#fff",
                        }}
                    >
                        LIVE
                    </div>
                </div>
                {artist && (
                    <div
                        style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.7)",
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        {artist}
                    </div>
                )}
            </div>
        </div>
    );
};

// Heart colors for variety
const heartColors = [
    "#FF3B5C", // Red
    "#FF69B4", // Pink
    "#FF1493", // Deep Pink
    "#FF6B6B", // Coral
    "#E91E63", // Material Pink
    "#F50057", // Accent Pink
];

// Single floating heart component
const FloatingHeart: React.FC<{
    startFrame: number;
    xOffset: number;
    size: number;
    color: string;
    duration: number;
    swayAmount: number;
}> = ({ startFrame, xOffset, size, color, duration, swayAmount }) => {
    const frame = useCurrentFrame();
    const localFrame = frame - startFrame;

    if (localFrame < 0 || localFrame > duration) return null;

    const progress = localFrame / duration;

    // Float upward
    const y = interpolate(progress, [0, 1], [0, -450], {
        extrapolateRight: "clamp",
    });

    // Sway left and right
    const x = Math.sin(localFrame * 0.15) * swayAmount;

    // Scale: start small, grow, then shrink
    const scale = interpolate(
        progress,
        [0, 0.1, 0.7, 1],
        [0.3, 1.2, 1, 0.5],
        { extrapolateRight: "clamp" }
    );

    // Fade in quickly, stay visible, fade out
    const opacity = interpolate(
        progress,
        [0, 0.1, 0.8, 1],
        [0, 1, 1, 0],
        { extrapolateRight: "clamp" }
    );

    return (
        <div
            style={{
                position: "absolute",
                bottom: 100,
                right: 40 + xOffset,
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                opacity,
                fontSize: size,
                color,
                textShadow: `0 0 10px ${color}80, 0 0 20px ${color}40`,
            }}
        >
            ❤️
        </div>
    );
};

// Container for all floating hearts
const FloatingHearts: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Generate hearts at regular intervals
    const hearts = [];
    const heartInterval = 8; // New heart every 8 frames
    const maxHearts = 100; // Maximum number of hearts to generate

    for (let i = 0; i < maxHearts; i++) {
        const startFrame = i * heartInterval + fps * 2; // Start after 2 seconds

        // Only render hearts that are relevant to current frame
        if (frame < startFrame - 10) continue;
        if (frame > startFrame + 120) continue;

        // Randomized properties based on index
        const seed = i * 7919; // Prime number for pseudo-random
        const xOffset = (seed % 80) - 40; // -40 to 40
        const size = 20 + (seed % 20); // 20 to 40
        const color = heartColors[i % heartColors.length];
        const duration = 80 + (seed % 40); // 80 to 120 frames
        const swayAmount = 15 + (seed % 25); // 15 to 40

        hearts.push(
            <FloatingHeart
                key={i}
                startFrame={startFrame}
                xOffset={xOffset}
                size={size}
                color={color}
                duration={duration}
                swayAmount={swayAmount}
            />
        );
    }

    return <>{hearts}</>;
};

// Main Component
export const KamenButokaiVideo: React.FC<z.infer<typeof kamenButokaiSchema>> = (props) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    // Parse lyrics with timing
    const parsedLyrics = props.lyrics.map((l, index) => ({
        ...l,
        seconds: parseTime(l.timeTag),
        index,
        username: getUsername(index),
    }));

    // Find the final "これが本当の 私" line timing
    const finalLine = parsedLyrics.find(l => l.text.includes("これが本当の 私"));
    const finalLineStartFrame = finalLine ? finalLine.seconds * fps : 0;
    const finalLineDuration = fps * 5; // 5 seconds for final line
    const finalLineEndFrame = finalLineStartFrame + finalLineDuration;

    // Global fade out that syncs with the final line
    // Start fading at 70% of final line duration, complete at 100%
    const finaleFadeStartFrame = finalLineStartFrame + finalLineDuration * 0.7;
    const globalFadeOut = interpolate(
        frame,
        [finaleFadeStartFrame, finalLineEndFrame],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Header fades after 10 seconds, and also at the end
    const headerOpacity = interpolate(
        frame,
        [0, 30, fps * 8, fps * 10],
        [0, 1, 1, 0.7],
        { extrapolateRight: "clamp" }
    ) * (frame > finaleFadeStartFrame ? globalFadeOut : 1);

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
            <Audio src={props.videoSource} />

            {/* Instagram Live Header */}
            <LiveHeader
                title={props.title}
                artist={props.artist}
                opacity={headerOpacity}
            />

            {/* Comments container - bottom left, scrolling up */}
            <div
                style={{
                    position: "absolute",
                    bottom: 80,
                    left: 30,
                    width: 550,
                    maxHeight: 350,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    overflow: "hidden",
                    opacity: frame > finaleFadeStartFrame ? globalFadeOut : 1,
                }}
            >
                {parsedLyrics.map((lyric, index) => {
                    const lyricStartFrame = lyric.seconds * fps;
                    const timeSinceStart = frame - lyricStartFrame;

                    // Only render if the lyric should be visible
                    if (timeSinceStart < -5) return null;

                    // Check if emphasis line
                    const isEmphasis = isEmphasisLine(lyric.text);

                    // Emphasis lines are rendered separately (center screen)
                    if (isEmphasis) return null;

                    // Only show the last 5 visible comments
                    const visibleComments = parsedLyrics.filter(l => {
                        const t = frame - (l.seconds * fps);
                        return t >= -5 && !isEmphasisLine(l.text);
                    });
                    const visibleIndex = visibleComments.findIndex(l => l.index === lyric.index);
                    const totalVisible = visibleComments.length;

                    // Only show the last 5
                    if (totalVisible > 5 && visibleIndex < totalVisible - 5) return null;

                    // Fade out older comments
                    const positionFromBottom = totalVisible - 1 - visibleIndex;
                    const fadeProgress = interpolate(
                        positionFromBottom,
                        [0, 1, 2, 3, 4],
                        [1, 0.9, 0.7, 0.5, 0.3],
                        { extrapolateRight: "clamp" }
                    );

                    // Entry animation (0 to 1 over 12 frames)
                    const entryProgress = interpolate(
                        timeSinceStart,
                        [0, 12],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );

                    return (
                        <LiveComment
                            key={index}
                            text={lyric.text}
                            username={lyric.username}
                            fontSize={props.fontSize}
                            entryProgress={entryProgress}
                            fadeProgress={fadeProgress}
                            iconColorIndex={index}
                        />
                    );
                })}
            </div>

            {/* Emphasis lines rendered in center */}
            {parsedLyrics.map((lyric, index) => {
                const lyricStartFrame = lyric.seconds * fps;
                const timeSinceStart = frame - lyricStartFrame;

                // Only emphasis lines
                if (!isEmphasisLine(lyric.text)) return null;

                // Check if this is the final "これが本当の 私" line
                const isFinalLine = lyric.text.includes("これが本当の 私");

                // Duration: 3 seconds for normal, 5 seconds for final
                const durationFrames = isFinalLine ? fps * 5 : fps * 3;

                // Only render when active
                if (timeSinceStart < 0 || timeSinceStart > durationFrames) return null;

                // Progress from 0 to 1 over the entire duration
                const progress = timeSinceStart / durationFrames;

                return (
                    <EmphasisLine
                        key={`emphasis-${index}`}
                        text={lyric.text}
                        fontSize={props.fontSize}
                        progress={progress}
                        isFinal={isFinalLine}
                    />
                );
            })}
        </AbsoluteFill>
    );
};
