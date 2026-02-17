/**
 * Animation Utilities for Lyric Videos
 * Based on remotion-best-practices
 */
import { interpolate, Easing } from "remotion";
import type { SpringConfig } from "remotion";

// ============================================
// Spring Configurations
// ============================================

/**
 * Preset spring configurations for natural motion.
 * Use with: spring({ frame, fps, config: SPRING_CONFIGS.smooth })
 */
export const SPRING_CONFIGS: Record<string, Partial<SpringConfig>> = {
    /** Smooth, no bounce - for subtle reveals */
    smooth: { damping: 200 },
    /** Snappy, minimal bounce - for UI elements */
    snappy: { damping: 20, stiffness: 200 },
    /** Bouncy entrance - for playful animations */
    bouncy: { damping: 8 },
    /** Heavy, slow, small bounce - for dramatic elements */
    heavy: { damping: 15, stiffness: 80, mass: 2 },
    /** Soft bounce - for lyric emphasis (recommended) */
    lyricEmphasis: { damping: 12, stiffness: 100 },
};

// ============================================
// Easing Presets
// ============================================

/**
 * Common easing functions for interpolate()
 * Use with: interpolate(frame, [0, 100], [0, 1], { easing: EASING.smooth })
 */
export const EASING = {
    /** Smooth ease-in-out - most versatile */
    smooth: Easing.inOut(Easing.quad),
    /** Gentle ease out - for fade-ins */
    fadeIn: Easing.out(Easing.quad),
    /** Gentle ease in - for fade-outs */
    fadeOut: Easing.in(Easing.quad),
    /** More dramatic ease - for emphasis */
    dramatic: Easing.inOut(Easing.exp),
    /** Circular motion feel */
    circular: Easing.inOut(Easing.circle),
};

// ============================================
// Animation Helpers
// ============================================

/**
 * Create a fade in/out animation curve.
 * @param frame - Current frame from useCurrentFrame()
 * @param duration - Total duration in frames
 * @param fadeInDuration - Frames to fade in (default: 15)
 * @param fadeOutDuration - Frames to fade out (default: 15)
 */
export const fadeInOut = (
    frame: number,
    duration: number,
    fadeInDuration = 15,
    fadeOutDuration = 15
): number => {
    return interpolate(
        frame,
        [0, fadeInDuration, duration - fadeOutDuration, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
};

/**
 * Create a fade curve with easing.
 * @param frame - Current frame
 * @param duration - Total duration
 * @param type - "in", "out", or "inOut"
 */
export const fadeWithEasing = (
    frame: number,
    duration: number,
    type: "in" | "out" | "inOut" = "inOut"
): number => {
    const easing = type === "in" ? EASING.fadeIn :
        type === "out" ? EASING.fadeOut :
            EASING.smooth;
    return interpolate(frame, [0, duration], [0, 1], {
        easing,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
};

// ============================================
// Typewriter Effect
// ============================================

/**
 * Advanced typewriter effect with pause support.
 * @param frame - Current frame
 * @param text - Full text to display
 * @param charsPerFrame - Speed of typing (default: 0.12)
 * @param pauseAfter - Text after which to pause (optional)
 * @param pauseFrames - Frames to pause (default: 30)
 */
export const typewriterText = (
    frame: number,
    text: string,
    charsPerFrame = 0.12,
    pauseAfter?: string,
    pauseFrames = 30
): string => {
    if (!pauseAfter) {
        const visibleChars = Math.min(text.length, Math.floor(frame * charsPerFrame));
        return text.slice(0, visibleChars);
    }

    const pauseIndex = text.indexOf(pauseAfter);
    if (pauseIndex < 0) {
        const visibleChars = Math.min(text.length, Math.floor(frame * charsPerFrame));
        return text.slice(0, visibleChars);
    }

    const preLen = pauseIndex + pauseAfter.length;
    const prePhaseFrames = preLen / charsPerFrame;

    if (frame < prePhaseFrames) {
        return text.slice(0, Math.floor(frame * charsPerFrame));
    } else if (frame < prePhaseFrames + pauseFrames) {
        return text.slice(0, preLen);
    } else {
        const postPhase = frame - prePhaseFrames - pauseFrames;
        const totalChars = Math.min(text.length, preLen + Math.floor(postPhase * charsPerFrame));
        return text.slice(0, totalChars);
    }
};

/**
 * Check if typewriter is still typing
 */
export const isTyping = (
    frame: number,
    textLength: number,
    charsPerFrame = 0.12
): boolean => {
    return frame < textLength / charsPerFrame;
};

// ============================================
// Audio Volume Curves
// ============================================

/**
 * Generate a volume curve for audio fade-in/out.
 * Use with: <Audio volume={audioFadeCurve(fps, totalDuration)} />
 * @param fps - Frames per second from useVideoConfig()
 * @param durationInFrames - Total duration of composition
 * @param fadeInSeconds - Seconds to fade in (default: 1)
 * @param fadeOutSeconds - Seconds to fade out (default: 2)
 */
export const audioFadeCurve = (
    fps: number,
    durationInFrames: number,
    fadeInSeconds = 1,
    fadeOutSeconds = 2
): ((f: number) => number) => {
    const fadeInFrames = fadeInSeconds * fps;
    const fadeOutStart = durationInFrames - fadeOutSeconds * fps;

    return (f: number) => {
        if (f < fadeInFrames) {
            return interpolate(f, [0, fadeInFrames], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
        } else if (f >= fadeOutStart) {
            return interpolate(f, [fadeOutStart, durationInFrames], [1, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            });
        }
        return 1;
    };
};

/**
 * Simple volume fade-in only
 */
export const audioFadeIn = (
    fps: number,
    fadeInSeconds = 1
): ((f: number) => number) => {
    const fadeInFrames = fadeInSeconds * fps;
    return (f: number) => interpolate(f, [0, fadeInFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });
};

// ============================================
// Recommended Premount Duration
// ============================================

/**
 * Recommended premount duration for sequences (1 second at given fps)
 */
export const getPremountDuration = (fps: number): number => Math.round(fps);

// ============================================
// Style Constants
// ============================================

/**
 * Common text shadow styles
 */
export const TEXT_SHADOWS = {
    /** Subtle readable shadow */
    subtle: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    /** Warm glow for emphasis */
    warmGlow: "0 0 12px rgba(255, 182, 193, 0.6)",
    /** Strong glow for final lines */
    strongGlow: "0 0 20px rgba(255, 102, 153, 0.8)",
    /** Ink bleed effect for love letter (インクの滲み) */
    inkBleed: "1px 1px 3px rgba(62, 39, 35, 0.4), 0 0 6px rgba(78, 52, 46, 0.15)",
    /** Chocolate brown shadow */
    chocolate: "2px 2px 4px rgba(101, 67, 33, 0.8)",
};

/**
 * Common font families for Japanese text
 */
export const FONTS = {
    /** Clean, readable sans-serif */
    zenKurenaido: "'Zen Kurenaido', sans-serif",
    /** Elegant serif for titles */
    yujiSyuku: "'Yuji Syuku', serif",
    /** Modern sans-serif */
    notoSansJP: "'Noto Sans JP', sans-serif",
    /** Handwritten style - gentle and feminine (手書き風・女性的) */
    yomogi: "'Yomogi', cursive",
    /** Handwritten style - warm and letter-like (手書き風・ラブレター感) */
    kleeOne: "'Klee One', cursive",
    /** Delicate mincho - elegant (繊細な明朝体) */
    hinaMincho: "'Hina Mincho', serif",
    /** Soft rounded handwriting (柔らかい丸文字) */
    kiwiMaru: "'Kiwi Maru', serif",
};
