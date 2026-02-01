import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";

// ============================================
// Floating Particles Background
// ============================================

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    speed: number;
    opacity: number;
    delay: number;
}

interface ParticleBackgroundProps {
    particleCount?: number;
    color?: string;
    convergenceFrames?: number[]; // Frames when particles converge to center
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
    particleCount = 50,
    color = "#58a6ff",
    convergenceFrames = [],
}) => {
    const frame = useCurrentFrame();

    // Generate particles with stable positions
    const particles = useMemo<Particle[]>(() => {
        const result: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            result.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 2 + Math.random() * 4,
                speed: 0.3 + Math.random() * 0.7,
                opacity: 0.3 + Math.random() * 0.7,
                delay: Math.random() * 60,
            });
        }
        return result;
    }, [particleCount]);

    return (
        <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
            {particles.map((p) => {
                // Floating animation
                const floatY = Math.sin((frame + p.delay) * 0.02 * p.speed) * 20;
                const floatX = Math.cos((frame + p.delay) * 0.015 * p.speed) * 15;

                // Convergence animation
                let posX = p.x + floatX * 0.5;
                let posY = p.y + floatY * 0.5;

                // Check if we are near any convergence frame
                for (const cFrame of convergenceFrames) {
                    if (frame > cFrame && frame < cFrame + 40) {
                        const progress = interpolate(
                            frame - cFrame,
                            [0, 30],
                            [0, 1],
                            { extrapolateRight: "clamp" }
                        );
                        // Converge towards center (50, 50) then explode out slightly
                        const convergeX = interpolate(progress, [0, 1], [posX, 50]);
                        const convergeY = interpolate(progress, [0, 1], [posY, 50]);

                        // Overwrite position during convergence
                        posX = convergeX;
                        posY = convergeY;
                        break; // Handle one convergence at a time
                    }
                    // Explode out after convergence (optional, or just reset)
                    if (frame >= cFrame + 40 && frame < cFrame + 60) {
                        // Resetting naturally happens as the condition fails, 
                        // but to make it smooth we might need more complex logic.
                        // For now, let's keep it simple: just converge.
                        // Or actually, let's make it pass through center.
                    }
                }

                // Twinkling effect
                const twinkle = 0.5 + Math.sin((frame + p.delay) * 0.1) * 0.5;

                return (
                    <div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: `${posX}%`,
                            top: `${posY}%`,
                            width: p.size,
                            height: p.size,
                            borderRadius: "50%",
                            backgroundColor: color,
                            opacity: p.opacity * twinkle,
                            boxShadow: `0 0 ${p.size * 2}px ${color}`,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

// ============================================
// Animated Gradient Background
// ============================================

interface GradientBackgroundProps {
    colors?: string[];
    speed?: number;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    colors = ["#0d1117", "#1a1b4b", "#0d1117"],
    speed = 0.5,
}) => {
    const frame = useCurrentFrame();

    // Animate gradient angle
    const angle = (frame * speed) % 360;

    // Subtle color shift
    const colorShift = Math.sin(frame * 0.02) * 20;

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
                filter: `hue-rotate(${colorShift}deg)`,
            }}
        />
    );
};

// ============================================
// Pulsing Glow Text
// ============================================

interface PulsingGlowTextProps {
    children: React.ReactNode;
    color?: string;
    intensity?: number;
    style?: React.CSSProperties;
}

export const PulsingGlowText: React.FC<PulsingGlowTextProps> = ({
    children,
    color = "#58a6ff",
    intensity = 1,
    style,
}) => {
    const frame = useCurrentFrame();

    // Pulsing glow effect
    const pulse = 0.5 + Math.sin(frame * 0.08) * 0.5;
    const glowSize = 20 + pulse * 30 * intensity;

    return (
        <span
            style={{
                textShadow: `
                    0 0 ${glowSize * 0.3}px ${color},
                    0 0 ${glowSize * 0.6}px ${color},
                    0 0 ${glowSize}px ${color}
                `,
                ...style,
            }}
        >
            {children}
        </span>
    );
};

// ============================================
// Scan Line Effect (Retro/Sci-Fi)
// ============================================

export const ScanLines: React.FC<{ opacity?: number }> = ({ opacity = 0.1 }) => {
    return (
        <AbsoluteFill
            style={{
                background: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 0, 0, ${opacity}) 2px,
                    rgba(0, 0, 0, ${opacity}) 4px
                )`,
                pointerEvents: "none",
            }}
        />
    );
};

// ============================================
// Vignette Effect
// ============================================

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.6 }) => {
    return (
        <AbsoluteFill
            style={{
                background: `radial-gradient(
                    ellipse at center,
                    transparent 40%,
                    rgba(0, 0, 0, ${intensity}) 100%
                )`,
                pointerEvents: "none",
            }}
        />
    );
};

// ============================================
// Text Aura Effect (Breathing glow behind text)
// ============================================

interface TextAuraProps {
    width?: number;
    height?: number;
    color?: string;
    intensity?: number;
}

export const TextAura: React.FC<TextAuraProps> = ({
    width = 600,
    height = 200,
    color = "#58a6ff",
    intensity = 1,
}) => {
    const frame = useCurrentFrame();

    // Breathing animation
    const breathe = 0.5 + Math.sin(frame * 0.04) * 0.5;
    const size = 100 + breathe * 50 * intensity;

    return (
        <div
            style={{
                position: "absolute",
                width,
                height,
                background: `radial-gradient(
                    ellipse at center,
                    ${color}${Math.round(breathe * 40).toString(16).padStart(2, '0')},
                    transparent 70%
                )`,
                filter: `blur(${size * 0.3}px)`,
                pointerEvents: "none",
            }}
        />
    );
};

// ============================================
// Particle Burst Effect (on text appearance)
// ============================================

interface ParticleBurstProps {
    triggerFrame: number;
    x?: string;
    y?: string;
    color?: string;
    particleCount?: number;
}

export const ParticleBurst: React.FC<ParticleBurstProps> = ({
    triggerFrame,
    x = "50%",
    y = "50%",
    color = "#58a6ff",
    particleCount = 20,
}) => {
    const frame = useCurrentFrame();

    const particles = useMemo(() => {
        const result = [];
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            result.push({
                id: i,
                angle,
                speed: 3 + Math.random() * 5,
                size: 2 + Math.random() * 4,
                delay: Math.random() * 5,
            });
        }
        return result;
    }, [particleCount]);

    if (frame < triggerFrame) return null;

    const localFrame = frame - triggerFrame;

    return (
        <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
            {particles.map((p) => {
                const progress = Math.min(1, (localFrame - p.delay) / 30);
                if (progress <= 0) return null;

                const distance = progress * 150 * p.speed / 5;
                const opacity = 1 - progress;
                const px = Math.cos(p.angle) * distance;
                const py = Math.sin(p.angle) * distance;

                return (
                    <div
                        key={p.id}
                        style={{
                            position: "absolute",
                            left: px,
                            top: py,
                            width: p.size * (1 - progress * 0.5),
                            height: p.size * (1 - progress * 0.5),
                            borderRadius: "50%",
                            backgroundColor: color,
                            opacity,
                            boxShadow: `0 0 ${p.size * 3}px ${color}`,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                );
            })}
        </div>
    );
};

// ============================================
// Glowing Typewriter Text
// ============================================

interface GlowingTypewriterProps {
    text: string;
    frame: number;
    charPerFrame?: number;
    baseColor?: string;
    glowColor?: string;
    fontSize?: number;
    style?: React.CSSProperties;
}

export const GlowingTypewriter: React.FC<GlowingTypewriterProps> = ({
    text,
    frame,
    charPerFrame = 0.1,
    baseColor = "#e6edf3",
    glowColor = "#58a6ff",
    fontSize = 64,
    style,
}) => {
    const currentFrame = useCurrentFrame();
    const charIndex = Math.floor(frame * charPerFrame);
    const displayText = text.slice(0, charIndex);

    return (
        <div style={{ display: "flex", ...style }}>
            {displayText.split("").map((char, i) => {
                // Last few characters glow brighter
                const distFromEnd = charIndex - i - 1;
                const glowIntensity = distFromEnd < 3 ? (3 - distFromEnd) / 3 : 0;
                const pulse = 0.5 + Math.sin(currentFrame * 0.15) * 0.5;

                return (
                    <span
                        key={i}
                        style={{
                            color: baseColor,
                            fontSize,
                            textShadow: glowIntensity > 0
                                ? `0 0 ${10 + glowIntensity * 30 * pulse}px ${glowColor},
                                   0 0 ${20 + glowIntensity * 40 * pulse}px ${glowColor}`
                                : `0 0 10px ${glowColor}40`,
                        }}
                    >
                        {char}
                    </span>
                );
            })}
            {/* Blinking cursor */}
            {charIndex < text.length && (
                <span style={{
                    color: glowColor,
                    fontSize,
                    opacity: Math.sin(currentFrame * 0.3) > 0 ? 1 : 0.2,
                    textShadow: `0 0 20px ${glowColor}`,
                }}>│</span>
            )}
        </div>
    );
};

// ============================================
// Keyword Highlight
// ============================================

interface KeywordHighlightProps {
    children: React.ReactNode;
    color?: string;
    active?: boolean;
}

export const KeywordHighlight: React.FC<KeywordHighlightProps> = ({
    children,
    color = "#7ee787",
    active = true,
}) => {
    const frame = useCurrentFrame();

    if (!active) return <>{children}</>;

    const pulse = 0.6 + Math.sin(frame * 0.1) * 0.4;

    return (
        <span style={{
            color,
            fontWeight: 700,
            textShadow: `
                0 0 ${10 + pulse * 20}px ${color},
                0 0 ${20 + pulse * 30}px ${color}80
            `,
            background: `linear-gradient(90deg, ${color}20, ${color}40, ${color}20)`,
            padding: "0 8px",
            borderRadius: 4,
        }}>
            {children}
        </span>
    );
};

// ============================================
// Fade Slide Text (Replacement for Typewriter)
// ============================================

interface FadeSlideTextProps {
    text: string;
    frame: number;
    delay?: number;
    baseColor?: string;
    glowColor?: string;
    fontSize?: number;
    style?: React.CSSProperties;
}

export const FadeSlideText: React.FC<FadeSlideTextProps> = ({
    text,
    frame,
    delay = 0,
    baseColor = "#e6edf3",
    glowColor = "#58a6ff",
    fontSize = 64,
    style,
}) => {
    const localFrame = Math.max(0, frame - delay);

    // Fade in + Slide up animation (faster)
    const opacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
    const translateY = interpolate(localFrame, [0, 15], [20, 0], { extrapolateRight: "clamp" });

    // Pulse effect
    const pulse = 0.5 + Math.sin(frame * 0.1) * 0.5;

    return (
        <div style={{
            ...style,
            opacity,
            transform: `translateY(${translateY}px)`,
            color: baseColor,
            fontSize,
            textShadow: `0 0 ${10 + pulse * 20}px ${glowColor}80`,
        }}>
            {text}
        </div>
    );
};
