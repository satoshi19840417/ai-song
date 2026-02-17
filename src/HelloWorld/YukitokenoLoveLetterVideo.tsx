/* eslint-disable no-irregular-whitespace */
import {
    AbsoluteFill,
    useVideoConfig,
    Video,
    Audio,
    Sequence,
    useCurrentFrame,
    interpolateColors,
    spring,
    interpolate,
    Easing,
} from "remotion";
import { z } from "zod";
import {
    SPRING_CONFIGS,
    fadeInOut,
    audioFadeCurve,
    getPremountDuration,
    FONTS,
    TEXT_SHADOWS,
} from "./animationUtils";

// Schema for props
export const yukitokenoLoveLetterSchema = z.object({
    fontSize: z.number().default(42),
    bottomOffset: z.number().default(110),
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

// ============================================
// Love Letter Color Palette
// ============================================
const INK = {
    dark: "#3e2723",       // 濃い万年筆インク
    medium: "#4e342e",     // 通常のインク
    light: "#6d4c41",      // 薄いインク
    faded: "#8d6e63",      // 乾いたインク
    red: "#c62828",        // 赤インク（強調）
    redLight: "#d32f2f",   // 明るい赤
    redGlow: "rgba(198, 40, 40, 0.3)",
    bleed: "rgba(62, 39, 35, 0.15)", // インクの滲み
};

const PAPER = {
    cream: "rgba(255, 248, 235, 0.92)",      // 便箋のクリーム色
    lineColor: "rgba(180, 160, 140, 0.25)",   // 罫線
    shadow: "rgba(139, 109, 82, 0.15)",       // 便箋の影
    edge: "rgba(210, 190, 170, 0.4)",         // 便箋の縁
};

// ============================================
// Component: Letter Paper Overlay
// ============================================
const LetterPaperOverlay: React.FC<{
    opacity?: number;
}> = ({ opacity = 1 }) => {
    const frame = useCurrentFrame();

    // Gentle paper sway
    const swayPhase = (frame % 300) / 300;
    const sway = interpolate(
        swayPhase,
        [0, 0.5, 1],
        [-0.15, 0.15, -0.15],
        { easing: Easing.inOut(Easing.sin) }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "8%",
                left: "10%",
                right: "10%",
                bottom: "5%",
                background: PAPER.cream,
                borderRadius: 8,
                boxShadow: `
                    0 4px 20px ${PAPER.shadow},
                    0 1px 4px ${PAPER.shadow},
                    inset 0 0 60px rgba(255, 248, 235, 0.3)
                `,
                opacity,
                transform: `rotate(${sway}deg)`,
                // 罫線 (横線)
                backgroundImage: `
                    repeating-linear-gradient(
                        180deg,
                        transparent,
                        transparent 39px,
                        ${PAPER.lineColor} 39px,
                        ${PAPER.lineColor} 40px
                    )
                `,
                backgroundPosition: "0 30px",
                // 便箋の縁 (左のマージン線)
                borderLeft: `3px solid ${PAPER.edge}`,
                overflow: "hidden",
            }}
        >
            {/* 便箋の左上の花柄装飾 */}
            <div
                style={{
                    position: "absolute",
                    top: 12,
                    right: 16,
                    fontSize: 28,
                    opacity: 0.2,
                    transform: "rotate(15deg)",
                    filter: "blur(0.3px)",
                }}
            >
                ✿
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    fontSize: 22,
                    opacity: 0.15,
                    transform: "rotate(-10deg)",
                    filter: "blur(0.3px)",
                }}
            >
                ❀
            </div>
        </div>
    );
};

// ============================================
// Component: Ink Writing Animation (per-character)
// ============================================
const InkWritingText: React.FC<{
    text: string;
    frame: number;
    fontSize: number;
    color: string;
    charsPerFrame?: number;
    fontFamily?: string;
    fontWeight?: number;
    additionalStyle?: React.CSSProperties;
}> = ({
    text,
    frame,
    fontSize,
    color,
    charsPerFrame = 0.15,
    fontFamily = FONTS.kleeOne,
    fontWeight = 400,
    additionalStyle = {},
}) => {
        const chars = text.split("");

        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    ...additionalStyle,
                }}
            >
                {chars.map((char, i) => {
                    const charAppearFrame = i / charsPerFrame;
                    const charAge = frame - charAppearFrame;

                    // Character not yet written
                    if (charAge < 0) return null;

                    // Ink appears: blur → sharp, scale up
                    const inkProgress = interpolate(
                        charAge,
                        [0, 8],
                        [0, 1],
                        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                    );

                    const charOpacity = interpolate(
                        inkProgress,
                        [0, 0.5, 1],
                        [0, 0.7, 1]
                    );

                    const charBlur = interpolate(
                        inkProgress,
                        [0, 1],
                        [3, 0]
                    );

                    const charScale = interpolate(
                        inkProgress,
                        [0, 0.5, 1],
                        [0.8, 1.05, 1]
                    );

                    return (
                        <span
                            key={i}
                            style={{
                                fontSize,
                                fontFamily,
                                fontWeight,
                                color,
                                opacity: charOpacity,
                                filter: `blur(${charBlur}px)`,
                                transform: `scale(${charScale})`,
                                display: "inline-block",
                                textShadow: TEXT_SHADOWS.inkBleed,
                                transition: "none",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>
        );
    };

// ============================================
// Component: Opening Title — 封筒オープン → ラブレター
// ============================================
const OpeningTitle: React.FC<{
    title: string;
    artist: string;
}> = ({ title, artist }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const duration = 330; // 11 seconds

    // === Phase 1: 封筒 (0-60 frames) ===
    const envelopePhase = interpolate(
        frame,
        [0, 30, 60, 90],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // 封筒のフタが開くアニメーション
    const flapAngle = interpolate(
        frame,
        [30, 70],
        [0, 180],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
    );

    // === Phase 2: タイトル出現 (60+ frames) ===
    const titleStartFrame = 70;
    const titleFrame = Math.max(0, frame - titleStartFrame);

    // タイトルの上昇（封筒から出てくる）
    const titleRise = spring({
        frame: titleFrame,
        fps,
        config: { damping: 30, stiffness: 40, mass: 1.5 },
        from: 80,
        to: 0,
    });

    const titleOpacity = interpolate(
        titleFrame,
        [0, 20],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // === Phase 3: アーティスト署名 ===
    const artistStartFrame = titleStartFrame + Math.ceil(title.length / 0.12) + 30;
    const artistFrame = Math.max(0, frame - artistStartFrame);
    const artistOpacity = interpolate(
        artistFrame,
        [0, 25],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
    );

    // Signature line grows
    const signatureLineWidth = spring({
        frame: Math.max(0, artistFrame - 15),
        fps,
        config: SPRING_CONFIGS.snappy,
        from: 0,
        to: 160,
    });

    // Fade out at end
    const fadeOut = interpolate(
        frame,
        [duration - 50, duration],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Gentle floating
    const floatPhase = (frame % 150) / 150;
    const floatY = interpolate(
        floatPhase,
        [0, 0.5, 1],
        [0, 3, 0],
        { easing: Easing.inOut(Easing.sin) }
    );

    // Title color: deep ink, slightly warming over time
    const titleColor = interpolateColors(
        frame,
        [titleStartFrame, duration * 0.5, duration],
        [INK.dark, INK.medium, INK.light]
    );

    return (
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
                opacity: fadeOut,
                transform: `translateY(${floatY}px)`,
            }}
        >
            {/* 便箋背景 */}
            <LetterPaperOverlay opacity={interpolate(frame, [20, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

            {/* 封筒アニメーション */}
            {envelopePhase > 0 && (
                <div
                    style={{
                        position: "absolute",
                        zIndex: 5,
                        opacity: envelopePhase,
                    }}
                >
                    {/* 封筒本体 */}
                    <div
                        style={{
                            width: 320,
                            height: 220,
                            background: "linear-gradient(180deg, #f5e6d0 0%, #eddcc6 100%)",
                            borderRadius: 6,
                            boxShadow: "0 4px 16px rgba(139, 109, 82, 0.3)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* 封筒の三角フラップ */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: "50%",
                                transform: `translateX(-50%) rotateX(${flapAngle}deg)`,
                                transformOrigin: "top center",
                                width: 0,
                                height: 0,
                                borderLeft: "160px solid transparent",
                                borderRight: "160px solid transparent",
                                borderTop: "110px solid #e8d5bd",
                                zIndex: 10,
                                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.1))`,
                            }}
                        />
                        {/* ハートシール */}
                        <div
                            style={{
                                position: "absolute",
                                top: 75,
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: 28,
                                color: "#c62828",
                                opacity: flapAngle < 90 ? 0.8 : 0,
                                zIndex: 15,
                                textShadow: "0 0 8px rgba(198, 40, 40, 0.4)",
                            }}
                        >
                            ♥
                        </div>
                        {/* 封筒の内側のV線 */}
                        <div
                            style={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                width: 0,
                                height: 0,
                                borderLeft: "160px solid transparent",
                                borderRight: "160px solid transparent",
                                borderBottom: "100px solid #f0ddc5",
                            }}
                        />
                    </div>
                </div>
            )}

            {/* タイトル & アーティスト */}
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    transform: `translateY(${titleRise}px)`,
                    opacity: titleOpacity,
                }}
            >
                {/* Main Title — 手書きインク風 */}
                <InkWritingText
                    text={title}
                    frame={titleFrame}
                    fontSize={78}
                    color={titleColor}
                    charsPerFrame={0.12}
                    fontFamily={FONTS.kleeOne}
                    fontWeight={400}
                    additionalStyle={{
                        letterSpacing: "0.06em",
                        marginBottom: 20,
                    }}
                />

                {/* Artist Name — 署名風 */}
                <div
                    style={{
                        opacity: artistOpacity,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{
                            fontFamily: FONTS.yomogi,
                            fontSize: 34,
                            fontWeight: 400,
                            color: `rgba(62, 39, 35, 0.65)`,
                            textShadow: TEXT_SHADOWS.inkBleed,
                            letterSpacing: "0.12em",
                            margin: 0,
                        }}
                    >
                        — {artist}
                    </p>
                    {/* Signature line */}
                    <div
                        style={{
                            width: signatureLineWidth,
                            height: 1.5,
                            background: `linear-gradient(90deg, transparent, ${INK.faded}, transparent)`,
                            marginTop: 10,
                            opacity: 0.5,
                        }}
                    />
                </div>
            </div>

            {/* インクの飛沫（万年筆） */}
            {[
                { x: -200, y: -80, size: 5, delay: 80, opacity: 0.12 },
                { x: 180, y: -120, size: 3, delay: 95, opacity: 0.08 },
                { x: -150, y: 60, size: 4, delay: 110, opacity: 0.1 },
                { x: 220, y: 40, size: 3, delay: 100, opacity: 0.07 },
                { x: -100, y: -140, size: 2, delay: 120, opacity: 0.06 },
            ].map((dot, i) => {
                const dotAge = Math.max(0, frame - dot.delay);
                const dotOpacity = interpolate(
                    dotAge,
                    [0, 5, 200, 250],
                    [0, dot.opacity, dot.opacity, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                    <div
                        key={`inkdot-${i}`}
                        style={{
                            position: "absolute",
                            top: `calc(50% + ${dot.y}px)`,
                            left: `calc(50% + ${dot.x}px)`,
                            width: dot.size,
                            height: dot.size,
                            borderRadius: "50%",
                            background: INK.dark,
                            opacity: dotOpacity,
                            filter: "blur(0.5px)",
                        }}
                    />
                );
            })}
        </div>
    );
};

// ============================================
// Component: Standard Lyric Line (手書きインク風)
// ============================================
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
        [0, 18, duration - 18, duration],
        [0, 1, 1, 0],
        {
            easing: Easing.inOut(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Slide in from left (手書きで書き進める感覚)
    const slideX = interpolate(
        frame,
        [0, 25],
        [-15, 0],
        {
            easing: Easing.out(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Subtle scale
    const scale = spring({
        frame,
        fps: 30,
        config: SPRING_CONFIGS.smooth,
        from: 0.97,
        to: 1.0,
    });

    // Ink color — dark brown with subtle aging
    const color = interpolateColors(
        frame,
        [0, duration * 0.3, duration],
        [INK.dark, INK.medium, INK.light]
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                transform: `translateY(-50%) translateX(${slideX}px) scale(${scale})`,
                textAlign: "center",
                fontSize: fontSize,
                fontFamily: FONTS.kleeOne,
                fontWeight: 400,
                color,
                textShadow: TEXT_SHADOWS.inkBleed,
                opacity,
                letterSpacing: "0.06em",
                padding: "0 80px",
            }}
        >
            {text}
        </div>
    );
};

// ============================================
// Component: Emphasis Lyric Line (赤インク強調)
// ============================================
const EmphasisLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
    bottomOffset: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Gentle fade in/out
    const opacity = interpolate(
        frame,
        [0, 22, duration - 22, duration],
        [0, 1, 1, 0],
        {
            easing: Easing.inOut(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    // Spring entrance
    const scale = spring({
        frame,
        fps,
        config: SPRING_CONFIGS.lyricEmphasis,
        from: 0.88,
        to: 1.02,
    });

    // Red ink color transition
    const color = interpolateColors(
        frame,
        [0, duration * 0.4, duration],
        [INK.red, INK.redLight, INK.red]
    );

    // Red ink glow pulsing
    const pulsePhase = (frame % 60) / 60;
    const glowIntensity = interpolate(
        pulsePhase,
        [0, 0.5, 1],
        [8, 14, 8],
        { easing: Easing.inOut(Easing.sin) }
    );

    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                transform: `translateY(-50%) scale(${scale})`,
                textAlign: "center",
                fontSize: fontSize * 1.12,
                fontFamily: FONTS.kleeOne,
                fontWeight: 400,
                color,
                textShadow: `
                    ${TEXT_SHADOWS.inkBleed},
                    0 0 ${glowIntensity}px ${INK.redGlow}
                `,
                opacity,
                letterSpacing: "0.06em",
                padding: "0 80px",
            }}
        >
            {text}
        </div>
    );
};

// ============================================
// Component: Final Lyric Line — 私の春が 今…はじまる
// ============================================
const FinalLyricLine: React.FC<{
    text: string;
    duration: number;
    fontSize: number;
}> = ({ text, duration, fontSize }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Bloom entrance
    const scale = spring({
        frame,
        fps,
        config: { damping: 25, stiffness: 35, mass: 2 },
        from: 0.4,
        to: 1.05,
    });

    // Long fade in, gentle fade out
    const opacity = fadeInOut(frame, duration, 35, 90);

    // Color: dark ink → red ink → warm ink (手紙の最後の言葉)
    const color = interpolateColors(
        frame,
        [0, duration * 0.3, duration * 0.6, duration],
        [INK.dark, INK.red, INK.redLight, INK.medium]
    );

    // Glow pulse
    const pulsePhase = (frame % 60) / 60;
    const glowIntensity = interpolate(
        pulsePhase,
        [0, 0.5, 1],
        [12, 20, 12],
        { easing: Easing.inOut(Easing.sin) }
    );

    // Ink drops (インクの雫)
    const inkDrops = [
        { x: -180, delay: 15, size: 6, fallDist: 120 },
        { x: 160, delay: 35, size: 4, fallDist: 100 },
        { x: -100, delay: 55, size: 5, fallDist: 140 },
        { x: 200, delay: 70, size: 3, fallDist: 90 },
        { x: -220, delay: 90, size: 4, fallDist: 110 },
    ];

    return (
        <>
            {/* Ink drops falling */}
            {inkDrops.map((drop, i) => {
                const dropFrame = Math.max(0, frame - drop.delay);
                const dropY = interpolate(
                    dropFrame,
                    [0, 60, 120],
                    [0, drop.fallDist * 0.7, drop.fallDist],
                    { extrapolateRight: "clamp", easing: Easing.in(Easing.quad) }
                );
                const dropOpacity = interpolate(
                    dropFrame,
                    [0, 10, 80, 120],
                    [0, 0.3, 0.2, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                // Ink splatter at bottom
                const splatScale = interpolate(
                    dropFrame,
                    [50, 65],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );

                return (
                    <React.Fragment key={`drop-${i}`}>
                        {/* Falling drop */}
                        <div
                            style={{
                                position: "absolute",
                                top: `calc(45% + ${dropY}px)`,
                                left: `calc(50% + ${drop.x}px)`,
                                width: drop.size,
                                height: drop.size * 1.5,
                                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                                background: INK.medium,
                                opacity: dropOpacity,
                                filter: "blur(0.5px)",
                            }}
                        />
                        {/* Splatter */}
                        <div
                            style={{
                                position: "absolute",
                                top: `calc(45% + ${drop.fallDist}px)`,
                                left: `calc(50% + ${drop.x - 3}px)`,
                                width: drop.size * 3,
                                height: drop.size * 1.5,
                                borderRadius: "50%",
                                background: `radial-gradient(ellipse, ${INK.medium} 30%, transparent 70%)`,
                                opacity: dropOpacity * splatScale * 0.5,
                                transform: `scale(${splatScale})`,
                                filter: "blur(1px)",
                            }}
                        />
                    </React.Fragment>
                );
            })}

            {/* Main final text */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    textAlign: "center",
                    fontSize: fontSize * 1.5,
                    fontFamily: FONTS.kleeOne,
                    fontWeight: 400,
                    color,
                    textShadow: `
                        ${TEXT_SHADOWS.inkBleed},
                        0 0 ${glowIntensity}px ${INK.redGlow},
                        0 0 ${glowIntensity * 1.5}px rgba(198, 40, 40, 0.15)
                    `,
                    opacity,
                    letterSpacing: "0.08em",
                    whiteSpace: "nowrap",
                }}
            >
                {text}
            </div>

            {/* Underline decoration */}
            <div
                style={{
                    position: "absolute",
                    top: "58%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: spring({
                        frame: Math.max(0, frame - 50),
                        fps,
                        config: SPRING_CONFIGS.snappy,
                        from: 0,
                        to: 260,
                    }),
                    height: 1.5,
                    background: `linear-gradient(90deg, transparent, ${INK.faded}, transparent)`,
                    opacity: fadeInOut(frame, duration, 70, 60) * 0.5,
                }}
            />
        </>
    );
};

// ============================================
// Main Composition
// ============================================
export const YukitokenoLoveLetterVideo: React.FC<
    z.infer<typeof yukitokenoLoveLetterSchema>
> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();
    const frame = useCurrentFrame();

    const parsedLyrics = props.lyrics.map((l) => ({
        ...l,
        seconds: parseTime(l.timeTag),
    }));

    // 便箋オーバーレイの表示タイミング（歌詞開始時から）
    const firstLyricFrame = Math.round(parsedLyrics[0].seconds * fps);
    const paperOpacity = interpolate(
        frame,
        [firstLyricFrame - 30, firstLyricFrame + 10, durationInFrames - 120, durationInFrames - 30],
        [0, 0.92, 0.92, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

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

            {/* Letter Paper Overlay */}
            {paperOpacity > 0 && (
                <LetterPaperOverlay opacity={paperOpacity} />
            )}

            {/* Opening Title Sequence */}
            <Sequence
                from={30}
                durationInFrames={330}
                premountFor={getPremountDuration(fps)}
            >
                <OpeningTitle title={props.title} artist={props.artist} />
            </Sequence>

            {parsedLyrics.map((line, index) => {
                const startFrame = Math.round(line.seconds * fps);
                const nextLine = parsedLyrics[index + 1];

                // Duration calculation
                let durationFrames;
                if (nextLine) {
                    durationFrames = Math.max(
                        1,
                        Math.round((nextLine.seconds - line.seconds) * fps)
                    );
                } else {
                    durationFrames = 300; // 10 seconds for final line
                }

                // Check for emphasis phrases (赤インク強調)
                const isEmphasis =
                    line.text.includes("雪解けのラブレター") ||
                    line.text.includes("知ってほしいだけ") ||
                    line.text.includes("ラブレター") ||
                    line.text.includes("春が来たら") ||
                    line.text.includes("私の春が");

                const isLastLine = !nextLine;

                return (
                    <Sequence
                        key={index}
                        from={startFrame}
                        durationInFrames={durationFrames}
                        layout="none"
                        premountFor={getPremountDuration(fps)}
                    >
                        {isLastLine ? (
                            <FinalLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                            />
                        ) : isEmphasis ? (
                            <EmphasisLyricLine
                                text={line.text}
                                duration={durationFrames}
                                fontSize={props.fontSize}
                                bottomOffset={props.bottomOffset}
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
