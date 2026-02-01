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
export const curtainCallSchema = z.object({
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

// Component: Standard Lyric Line (Vertical Writing - 縦書き)
const StandardLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Fade in/out
    const opacity = interpolate(
        frame,
        [0, 15, duration - 15, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Subtle drift left animation
    const translateX = interpolate(frame, [0, duration], [0, -10]);

    return (
        <div
            style={{
                position: "absolute",
                top: 100,
                right: 80,
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                fontSize: fontSize,
                fontFamily: "'Noto Serif JP', serif",
                fontWeight: 500,
                color: "#f5f5f5",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(139, 0, 0, 0.6)",
                opacity,
                transform: `translateX(${translateX}px)`,
                letterSpacing: "0.15em",
                lineHeight: 1.8,
                maxHeight: "70vh",
            }}
        >
            {text}
        </div>
    );
};

// Component: Emphasis Lyric Line
const EmphasisLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();

    // Pulse scale effect
    const scale = interpolate(
        frame,
        [0, 15, duration - 15, duration],
        [0.8, 1.1, 1.1, 0.9],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const opacity = interpolate(
        frame,
        [0, 15, duration - 15, duration],
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
                fontSize: fontSize * 1.8,
                fontFamily: "'Yuji Syuku', serif",
                fontWeight: 700,
                color: "#ffd700", // Gold
                textShadow: "0 0 20px rgba(255, 69, 0, 0.8), 4px 4px 0px rgba(0,0,0,0.6)",
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
}> = ({ title }) => {
    const frame = useCurrentFrame();
    const durationCount = 210; // Match the Sequence duration

    // Typewriter timing
    const framesPerChar = Math.floor(durationCount * 0.5 / title.length);
    const fadeOutStart = durationCount - 30;

    const titleVisibleChars = Math.min(
        title.length,
        Math.floor(frame / framesPerChar)
    );

    const opacity = interpolate(
        frame,
        [0, 15, fadeOutStart, durationCount],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill>
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
                        fontFamily: "'Zen Kaku Gothic New', sans-serif",
                        fontSize: 70,
                        fontWeight: 300,
                        color: "rgba(220, 200, 170, 0.85)",
                        textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
                        minHeight: "1.2em",
                        letterSpacing: "0.25em",
                    }}
                >
                    {title.slice(0, titleVisibleChars)}
                    {titleVisibleChars < title.length && (
                        <span style={{ opacity: 0.4 }}>|</span>
                    )}
                </h1>
            </div>
        </AbsoluteFill>
    );
};

// Chapter definitions mapped to lyric timing
const chapters = [
    { startTimeTag: "[00:00.86]", name: "第1幕" },
    { startTimeTag: "[00:21.71]", name: "第2幕" },
    { startTimeTag: "[00:32.42]", name: "第3幕" },
    { startTimeTag: "[00:53.57]", name: "第4幕" },
    { startTimeTag: "[01:04.40]", name: "第5幕" },
    { startTimeTag: "[01:15.54]", name: "第6幕" },
    { startTimeTag: "[02:02.99]", name: "最終幕" },
    { startTimeTag: "[02:38.30]", name: "エンドロール" },
];

// Component: Persistent Title + Chapter Indicator
const TitleAndChapter: React.FC<{
    title: string;
    currentSeconds: number;
}> = ({ title, currentSeconds }) => {
    const frame = useCurrentFrame();

    // Find current chapter
    let currentChapter = "";
    for (let i = chapters.length - 1; i >= 0; i--) {
        const chapterStartSeconds = parseTime(chapters[i].startTimeTag);
        if (currentSeconds >= chapterStartSeconds) {
            currentChapter = chapters[i].name;
            break;
        }
    }

    // Fade in at start
    const opacity = interpolate(frame, [0, 30], [0, 1], {
        extrapolateRight: "clamp",
    });

    return (
        <div
            style={{
                position: "absolute",
                top: 40,
                left: 50,
                opacity,
                zIndex: 10,
            }}
        >
            <div
                style={{
                    fontFamily: "'Zen Kaku Gothic New', sans-serif",
                    fontSize: 30,
                    fontWeight: 400,
                    color: "rgba(240, 220, 190, 0.9)",
                    textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
                    marginBottom: 8,
                    letterSpacing: "0.15em",
                }}
            >
                {title}
            </div>
            {currentChapter && (
                <div
                    style={{
                        fontFamily: "'Noto Serif JP', serif",
                        fontSize: 22,
                        fontWeight: 400,
                        color: "rgba(240, 220, 190, 0.8)",
                        textShadow: "2px 2px 6px rgba(0,0,0,0.8)",
                        textAlign: "center",
                    }}
                >
                    {currentChapter}
                </div>
            )}
        </div>
    );
};

// Wrapper to get current time for chapter indicator
const ChapterOverlay: React.FC<{ title: string; fps: number }> = ({ title, fps }) => {
    const frame = useCurrentFrame();
    const currentSeconds = frame / fps;
    return <TitleAndChapter title={title} currentSeconds={currentSeconds} />;
};

export const CurtainCallVideo: React.FC<z.infer<typeof curtainCallSchema>> = (props) => {
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
            <Audio src={props.videoSource} />

            {/* Persistent Title + Chapter Indicator */}
            <ChapterOverlay title={props.title} fps={fps} />

            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                // Special case: limit "それが全て" to 2 seconds
                let endSeconds: number;
                if (line.text === "それが全て") {
                    endSeconds = line.seconds + 2;
                } else {
                    endSeconds = nextLine ? nextLine.seconds : line.seconds + 8;
                }
                const durationFrames = Math.max(1, Math.round((endSeconds - line.seconds) * fps));

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                    >
                        <StandardLyricLine
                            text={line.text}
                            duration={durationFrames}
                            fontSize={props.fontSize}
                            bottomOffset={props.bottomOffset}
                        />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};
