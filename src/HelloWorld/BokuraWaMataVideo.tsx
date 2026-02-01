import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    Video,
    Audio,
    useCurrentFrame,
} from "remotion";
import { z } from "zod";

export const bokuraWaMataSchema = z.object({
    fontSize: z.number().default(32),
    videoSource: z.string(),
    title: z.string(),
    artist: z.string(),
    lyrics: z.array(
        z.object({
            timeTag: z.string(),
            text: z.string(),
            side: z.enum(["left", "right", "center"]),
            hasStamp: z.boolean().optional(),
        })
    ),
});

// Parse time tag to seconds
const parseTime = (tag: string): number => {
    const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseFloat(match[2]);
};

// Title Card Component
const TitleCard: React.FC<{
    title: string;
    artist: string;
    yOffset: number;
    opacity: number;
}> = ({ title, artist, yOffset, opacity }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateY(${yOffset}px)`,
                opacity,
                marginBottom: 60,
                minHeight: 200,
            }}
        >
            <div
                style={{
                    fontSize: 72,
                    fontWeight: 900,
                    color: "#ffffff",
                    textShadow: "0 0 20px rgba(255, 150, 100, 0.8), 0 0 40px rgba(255, 100, 150, 0.5)",
                    letterSpacing: "0.15em",
                    marginBottom: 20,
                    fontFamily: "'Noto Sans JP', sans-serif",
                }}
            >
                {title}
            </div>
            <div
                style={{
                    fontSize: 28,
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.85)",
                    letterSpacing: "0.1em",
                    fontFamily: "'Noto Sans JP', sans-serif",
                }}
            >
                {artist}
            </div>
        </div>
    );
};

// Chat Bubble Component - LINE style with speech bubble tail
const ChatBubble: React.FC<{
    text: string;
    side: "left" | "right" | "center";
    fontSize: number;
    opacity: number;
    entryProgress: number;
    hasStamp?: boolean;
}> = ({ text, side, fontSize, opacity, entryProgress, hasStamp }) => {
    // Slide in from bottom
    const slideY = interpolate(entryProgress, [0, 1], [30, 0], {
        extrapolateRight: "clamp",
    });

    const bubbleOpacity = interpolate(entryProgress, [0, 1], [0, 1], {
        extrapolateRight: "clamp",
    }) * opacity;

    // Left/Right bubble style - always use bubble format now
    const isLeft = side === "left";

    // Colors matching LINE style
    const leftBgColor = "#ffffff";
    const rightBgColor = "#8CE67E"; // LINE green

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isLeft ? "flex-start" : "flex-end",
                width: "100%",
                marginBottom: 12,
                paddingLeft: isLeft ? 50 : 0,
                paddingRight: isLeft ? 0 : 50,
                opacity: bubbleOpacity,
                transform: `translateY(${slideY}px)`,
            }}
        >
            <div style={{ position: "relative", maxWidth: "75%" }}>
                {/* Bubble tail for left side */}
                {isLeft && (
                    <div
                        style={{
                            position: "absolute",
                            left: -10,
                            top: 10,
                            width: 0,
                            height: 0,
                            borderTop: "8px solid transparent",
                            borderBottom: "8px solid transparent",
                            borderRight: `12px solid ${leftBgColor}`,
                        }}
                    />
                )}

                {/* Bubble tail for right side */}
                {!isLeft && (
                    <div
                        style={{
                            position: "absolute",
                            right: -10,
                            top: 10,
                            width: 0,
                            height: 0,
                            borderTop: "8px solid transparent",
                            borderBottom: "8px solid transparent",
                            borderLeft: `12px solid ${rightBgColor}`,
                        }}
                    />
                )}

                {/* Message bubble */}
                <div
                    style={{
                        backgroundColor: isLeft ? leftBgColor : rightBgColor,
                        borderRadius: "18px",
                        padding: "12px 18px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    }}
                >
                    <div
                        style={{
                            fontSize,
                            fontWeight: 500,
                            color: isLeft ? "#333333" : "#333333",
                            lineHeight: 1.4,
                            fontFamily: "'Noto Sans JP', sans-serif",
                        }}
                    >
                        {text}
                    </div>
                </div>

                {/* Like Stamp */}
                {hasStamp && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: -5,
                            left: isLeft ? undefined : -25,
                            right: isLeft ? -25 : undefined,
                            zIndex: 10,
                            transform: `scale(${interpolate(entryProgress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "#ffffff",
                                borderRadius: "50%",
                                width: 30,
                                height: 30,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#5ac463">
                                <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Main Component
export const BokuraWaMataVideo: React.FC<z.infer<typeof bokuraWaMataSchema>> = (props) => {
    const { fps, height } = useVideoConfig();
    const frame = useCurrentFrame();

    // Parse lyrics with timing
    const parsedLyrics = props.lyrics.map((l, index) => ({
        ...l,
        seconds: parseTime(l.timeTag),
        index,
    }));

    // Get the first lyric time for title fade
    const firstLyricTime = parsedLyrics[0]?.seconds || 0;
    const firstLyricFrame = firstLyricTime * fps;

    // Get the last lyric time for ending title
    const lastLyric = parsedLyrics[parsedLyrics.length - 1];
    const lastLyricTime = lastLyric?.seconds || 0;
    // Ending sequence starts 1 second after last lyric
    const endingStartFrame = (lastLyricTime + 1) * fps;

    // Each lyric scrolls up 1 second apart (30 frames each)
    const lyricScrollInterval = fps; // 1 second = 30 frames

    // Title appears after 3 lyrics have scrolled (3 seconds after ending starts)
    const endingTitleStartFrame = endingStartFrame + (3 * fps);

    // Title opacity - fade out when first lyric appears
    const titleOpacity = interpolate(
        frame,
        [firstLyricFrame - 15, firstLyricFrame + 15],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Ending title animation - comes from bottom of lyrics area
    const endingTitleY = interpolate(
        frame,
        [endingTitleStartFrame, endingTitleStartFrame + 45],
        [100, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const endingTitleOpacity = interpolate(
        frame,
        [endingTitleStartFrame, endingTitleStartFrame + 30, endingTitleStartFrame + 120, endingTitleStartFrame + 150],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{ backgroundColor: "black" }}>
            <Video
                src={props.videoSource}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 1,
                }}
            />
            <Audio src={props.videoSource} />

            {/* Title Card - centered, fades when first lyric appears */}
            {titleOpacity > 0 && (
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
                        opacity: titleOpacity,
                    }}
                >
                    <TitleCard
                        title={props.title}
                        artist={props.artist}
                        yOffset={0}
                        opacity={1}
                    />
                </div>
            )}

            {/* Lyrics container - positioned in bottom 1/3 */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: height / 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "0 40px 40px 40px",
                }}
            >

                {/* Lyrics as chat bubbles - show only 3 most recent */}
                {parsedLyrics.map((lyric, index) => {
                    const lyricStartFrame = lyric.seconds * fps;
                    const timeSinceStart = frame - lyricStartFrame;

                    // Only render if the lyric should be visible
                    if (timeSinceStart < -5) return null;

                    // Only show the 3 most recent visible lyrics
                    const visibleLyrics = parsedLyrics.filter(l => {
                        const t = frame - (l.seconds * fps);
                        return t >= -5;
                    });
                    const visibleIndex = visibleLyrics.findIndex(l => l.index === lyric.index);
                    const totalVisible = visibleLyrics.length;

                    // Position within the visible 3 (0 = oldest/top, 2 = newest/bottom)
                    const positionInVisible = visibleIndex - Math.max(0, totalVisible - 3);

                    // Only show the last 3 (most recent)
                    if (totalVisible > 3 && visibleIndex < totalVisible - 3) return null;

                    // Entry animation progress (0 to 1 over 15 frames)
                    const entryProgress = interpolate(
                        timeSinceStart,
                        [0, 15],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );

                    // Ending scroll - each lyric scrolls up 1 second apart based on its position
                    const lyricEndingScrollStart = endingStartFrame + (positionInVisible * lyricScrollInterval);
                    const lyricScrollY = interpolate(
                        frame,
                        [lyricEndingScrollStart, lyricEndingScrollStart + 20],
                        [0, -150],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );
                    const lyricEndingOpacity = interpolate(
                        frame,
                        [lyricEndingScrollStart, lyricEndingScrollStart + 20],
                        [1, 0],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );

                    return (
                        <div
                            key={index}
                            style={{
                                transform: `translateY(${lyricScrollY}px)`,
                                opacity: lyricEndingOpacity,
                            }}
                        >
                            <ChatBubble
                                text={lyric.text}
                                side={lyric.side}
                                fontSize={props.fontSize}
                                opacity={1}
                                entryProgress={entryProgress}
                                hasStamp={lyric.hasStamp}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Ending Title - appears from below lyrics area */}
            {endingTitleOpacity > 0 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: height / 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: endingTitleOpacity,
                        transform: `translateY(${endingTitleY}px)`,
                    }}
                >
                    <TitleCard
                        title={props.title}
                        artist={props.artist}
                        yOffset={0}
                        opacity={1}
                    />
                </div>
            )}
        </AbsoluteFill>
    );
};
