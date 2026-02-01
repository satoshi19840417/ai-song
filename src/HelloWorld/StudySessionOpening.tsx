/* eslint-disable no-irregular-whitespace */
import {
    AbsoluteFill,
    interpolate,
    useVideoConfig,
    useCurrentFrame,
    spring,
    Sequence,
    Audio,
} from "remotion";
import { z } from "zod";
import { fadeInOut, SPRING_CONFIGS, audioFadeCurve } from "./animationUtils";
import {
    ParticleBackground,
    GradientBackground,
    Vignette,
    TextAura,
    ParticleBurst,
    GlowingTypewriter,
    KeywordHighlight,
    FadeSlideText
} from "./VisualEffects";

// Schema
export const studySessionSchema = z.object({
    title: z.string(),
    subtitle: z.string(),
    company: z.string(),
    bgmSource: z.string().optional(),
});

// ============================================
// Scene Components
// ============================================

// Scene 1: Hook - タイプライター + グリッチ
const HookScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const line1 = "研究を進めるのは...";
    const line2 = "もう人間だけじゃない";

    // Line 2 appears after line 1 with longer pause
    // Speed up typewriter: 0.15 chars/frame
    const line1CharCount = Math.floor(frame * 0.15);
    const line1Done = line1CharCount >= line1.length;

    // Start line 2 earlier: after line 1 finishes + 20 frames pause
    const line2StartFrame = Math.ceil(line1.length / 0.15) + 20;
    const line2Frame = Math.max(0, frame - line2StartFrame);

    // Fade out at end - longer hold time
    const sceneDuration = 6 * fps;
    const sceneOpacity = interpolate(
        frame,
        [0, 20, sceneDuration - 40, sceneDuration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    return (
        <AbsoluteFill style={{
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: sceneOpacity,
        }}>
            {/* Text aura behind */}
            <TextAura width={800} height={250} color="#58a6ff" intensity={1.5} />

            {/* Particle burst when line 2 starts */}
            <ParticleBurst
                triggerFrame={line2StartFrame}
                x="50%"
                y="55%"
                color="#a371f7"
                particleCount={25}
            />

            {/* Line 1 - Fade Slide */}
            <FadeSlideText
                text={line1}
                frame={frame}
                fontSize={64}
                delay={10}
                glowColor="#88c0d0"
                style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            />

            {/* Line 2 - Fade Slide */}
            <FadeSlideText
                text={line2}
                frame={frame}
                delay={line2StartFrame}
                baseColor="#a371f7"
                glowColor="#a371f7"
                fontSize={72}
                style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    marginTop: 30,
                    justifyContent: "center",
                    textAlign: "center",
                }}
            />
        </AbsoluteFill>
    );
};

// Scene 2: Problem - AIの限界
const ProblemScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const sceneDuration = 6 * fps;

    const fadeOpacity = fadeInOut(frame, sceneDuration, 30, 40);

    // Shake effect for emphasis - delayed for longer buildup
    const keywordTrigger = Math.round(2 * fps);
    const shakeX = frame > keywordTrigger && frame < keywordTrigger + fps
        ? Math.sin(frame * 2) * 3
        : 0;

    const emphasisScale = spring({
        frame: frame - keywordTrigger,
        fps,
        config: SPRING_CONFIGS.bouncy,
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: fadeOpacity,
        }}>
            {/* Text aura behind */}
            <TextAura width={900} height={200} color="#f85149" intensity={1.2} />

            {/* Particle burst on keyword */}
            <ParticleBurst
                triggerFrame={keywordTrigger}
                x="50%"
                y="50%"
                color="#f85149"
                particleCount={30}
            />

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "baseline",
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 60,
                color: "#e6edf3",
                transform: `translateX(${shakeX}px)`,
                textShadow: "0 0 15px rgba(230, 237, 243, 0.3)",
            }}>
                <span>でも、AIは</span>
                <KeywordHighlight color="#f85149" active={frame > keywordTrigger}>
                    <span style={{
                        fontSize: 72,
                        fontWeight: 700,
                        margin: "0 10px",
                        transform: `scale(${Math.max(0, emphasisScale)})`,
                        display: "inline-block",
                    }}>研究の文脈</span>
                </KeywordHighlight>
                <span>を知らない</span>
            </div>
        </AbsoluteFill>
    );
};

// Scene 3: Solution - Skills
const SolutionScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const sceneDuration = 8 * fps;

    const fadeOpacity = fadeInOut(frame, sceneDuration, 30, 50);

    // "Skills" title with dramatic spring - slower
    const titleScale = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 60 },
        durationInFrames: 60,
    });

    const titleRotate = interpolate(
        spring({ frame, fps, config: { damping: 20 }, durationInFrames: 45 }),
        [0, 1],
        [-10, 0]
    );

    // Subtitle appears after title - delayed more
    const subtitleOpacity = interpolate(
        frame,
        [2.5 * fps, 3.5 * fps],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Folder animation - delayed more
    const folderAppear = frame > 4 * fps;
    const folderScale = spring({
        frame: frame - Math.round(4 * fps),
        fps,
        config: SPRING_CONFIGS.snappy,
    });

    return (
        <AbsoluteFill style={{
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: fadeOpacity,
        }}>
            {/* Large aura behind Skills title */}
            <TextAura width={1000} height={400} color="#a371f7" intensity={2} />

            {/* Particle burst when title appears */}
            <ParticleBurst
                triggerFrame={15}
                x="50%"
                y="40%"
                color="#58a6ff"
                particleCount={35}
            />
            {/* Skills Title */}
            <div style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 120,
                fontWeight: 700,
                background: "linear-gradient(135deg, #58a6ff 0%, #a371f7 50%, #f778ba 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                transform: `scale(${titleScale}) rotate(${titleRotate}deg)`,
                textShadow: "0 0 60px rgba(163, 113, 247, 0.8)",
                marginBottom: 20,
            }}>
                Skills
            </div>

            {/* Subtitle */}
            <div style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 48,
                color: "#e6edf3",
                opacity: subtitleOpacity,
                display: "flex",
                alignItems: "baseline",
            }}>
                <span>AIに</span>
                <span style={{
                    color: "#7ee787",
                    fontWeight: 600,
                    margin: "0 8px",
                    textShadow: "0 0 15px rgba(126, 231, 135, 0.5)",
                }}>専門知識</span>
                <span>を教える</span>
            </div>

            {/* Folder visualization */}
            {folderAppear && (
                <div style={{
                    marginTop: 60,
                    display: "flex",
                    gap: 20,
                    transform: `scale(${folderScale})`,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 24,
                }}>
                    <div style={{
                        padding: "15px 25px",
                        background: "rgba(88, 166, 255, 0.15)",
                        border: "1px solid #58a6ff",
                        borderRadius: 8,
                        color: "#58a6ff",
                    }}>📄 SKILL.md</div>
                    <div style={{
                        padding: "15px 25px",
                        background: "rgba(163, 113, 247, 0.15)",
                        border: "1px solid #a371f7",
                        borderRadius: 8,
                        color: "#a371f7",
                    }}>📁 scripts/</div>
                    <div style={{
                        padding: "15px 25px",
                        background: "rgba(126, 231, 135, 0.15)",
                        border: "1px solid #7ee787",
                        borderRadius: 8,
                        color: "#7ee787",
                    }}>📁 examples/</div>
                </div>
            )}
        </AbsoluteFill>
    );
};

// Scene 4: Closing
const ClosingScene: React.FC<{ title: string; subtitle: string; company: string }> = ({
    title,
    subtitle,
    company
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const sceneDuration = 10 * fps;

    // Fade in - very slow and cinematic
    const fadeOpacity = interpolate(
        frame,
        [0, 60, sceneDuration - 90, sceneDuration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // Staggered text appearance - faster reveals for company
    const line1Opacity = interpolate(frame, [30, 75], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const titleOpacity = interpolate(frame, [90, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const titleScale = spring({ frame: frame - 90, fps, config: SPRING_CONFIGS.smooth, durationInFrames: 60 });
    const companyOpacity = interpolate(frame, [160, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // Decorative elements
    const starPulse = 0.5 + Math.sin(frame * 0.1) * 0.5;
    const lineWidth = interpolate(frame, [120, 180], [0, 400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{
            backgroundColor: "#0d1117",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: fadeOpacity,
        }}>
            {/* Decorative horizontal lines */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: lineWidth,
                height: 1,
                background: `linear-gradient(90deg, transparent, rgba(88, 166, 255, ${starPulse * 0.5}), transparent)`,
            }} />
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, calc(-50% + 200px))",
                width: lineWidth * 0.7,
                height: 1,
                background: `linear-gradient(90deg, transparent, rgba(163, 113, 247, ${starPulse * 0.5}), transparent)`,
            }} />

            {/* "Let's learn together" */}
            <div style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 48,
                color: "#8b949e",
                marginBottom: 40,
                opacity: line1Opacity,
            }}>
                今日、一緒に学びましょう
            </div>

            {/* Main title with glow */}
            <div style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 52,
                fontWeight: 700,
                color: "#e6edf3",
                textAlign: "center",
                opacity: titleOpacity,
                transform: `scale(${Math.max(0, titleScale)})`,
                maxWidth: "80%",
                lineHeight: 1.4,
                textShadow: `0 0 ${20 + starPulse * 20}px rgba(88, 166, 255, 0.4)`,
            }}>
                {title}
            </div>
            <div style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 36,
                color: "#a371f7",
                marginTop: 15,
                opacity: titleOpacity,
                textShadow: `0 0 ${15 + starPulse * 15}px rgba(163, 113, 247, 0.5)`,
            }}>
                {subtitle}
            </div>

            {/* Company name with enhanced styling */}
            <div style={{
                fontFamily: "'Noto Sans JP', sans-serif",
                fontSize: 32,
                color: "#58a6ff",
                marginTop: 50,
                opacity: companyOpacity,
                letterSpacing: "0.15em",
                textShadow: `0 0 20px rgba(88, 166, 255, ${0.3 + starPulse * 0.4})`,
                padding: "15px 40px",
                border: `1px solid rgba(88, 166, 255, ${0.2 + starPulse * 0.3})`,
                borderRadius: 8,
            }}>
                {company}
            </div>
        </AbsoluteFill>
    );
};

// ============================================
// Main Component
// ============================================

export const StudySessionOpening: React.FC<z.infer<typeof studySessionSchema>> = (props) => {
    const { fps, durationInFrames } = useVideoConfig();

    return (
        <AbsoluteFill style={{ backgroundColor: "#0d1117" }}>
            {/* Animated gradient background */}
            <GradientBackground
                colors={["#0d1117", "#1a1b4b", "#0d1117"]}
                speed={0.3}
            />

            {/* Floating particles throughout with convergence at scene changes */}
            <ParticleBackground
                particleCount={40}
                color="#58a6ff"
                convergenceFrames={[
                    6 * fps,  // Hook -> Problem
                    12 * fps, // Problem -> Solution
                    20 * fps  // Solution -> Closing
                ]}
            />

            {/* Vignette for cinematic depth */}
            <Vignette intensity={0.5} />

            {/* BGM */}
            {props.bgmSource && (
                <Audio
                    src={props.bgmSource}
                    volume={audioFadeCurve(fps, durationInFrames, 1, 3)}
                />
            )}

            {/* Scene 1: Hook (0-6s) - Extended for full typewriter */}
            <Sequence from={0} durationInFrames={6 * fps} premountFor={fps}>
                <HookScene />
            </Sequence>

            {/* Scene 2: Problem (6-12s) - Extended for impact */}
            <Sequence from={6 * fps} durationInFrames={6 * fps} premountFor={fps}>
                <ProblemScene />
            </Sequence>

            {/* Scene 3: Solution - Skills (12-20s) - Extended for folder reveal */}
            <Sequence from={12 * fps} durationInFrames={8 * fps} premountFor={fps}>
                <SolutionScene />
            </Sequence>

            {/* Scene 4: Closing (20-30s) - Extended for cinematic ending */}
            <Sequence from={20 * fps} durationInFrames={10 * fps} premountFor={fps}>
                <ClosingScene
                    title={props.title}
                    subtitle={props.subtitle}
                    company={props.company}
                />
            </Sequence>
        </AbsoluteFill>
    );
};
