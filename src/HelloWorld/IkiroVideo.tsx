import { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  Video,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

const lyricLineSchema = z.object({
  timeTag: z.string(),
  text: z.string(),
});

const sectionSchema = z.object({
  name: z.string(),
  startTimeTag: z.string(),
  overlayOpacity: z.number().min(0).max(0.95),
  fontScale: z.number().min(0.7).max(1.6),
});

export const ikiroSchema = z.object({
  fontSize: z.number().default(52),
  bottomOffset: z.number().default(96),
  rightOffset: z.number().default(10),
  topOffset: z.number().default(8),
  title: z.string(),
  artist: z.string(),
  videoSource: z.string(),
  layoutMode: z.enum(["horizontal", "vertical"]).default("horizontal"),
  lyrics: z.array(lyricLineSchema),
  emphasisLines: z.array(lyricLineSchema),
  sections: z.array(sectionSchema),
});

type ParsedSection = z.infer<typeof sectionSchema> & { seconds: number };

const parseTimeTag = (tag: string): number => {
  const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
  if (!match) return 0;
  return Number.parseInt(match[1], 10) * 60 + Number.parseFloat(match[2]);
};

const getSectionStyle = (
  currentTime: number,
  sections: ParsedSection[],
): { overlayOpacity: number; fontScale: number } => {
  if (sections.length === 0) {
    return { overlayOpacity: 0.24, fontScale: 1 };
  }

  let activeIndex = 0;
  for (let i = 0; i < sections.length; i++) {
    if (currentTime >= sections[i].seconds) {
      activeIndex = i;
    } else {
      break;
    }
  }

  const currentSection = sections[activeIndex];
  const nextSection = sections[activeIndex + 1];
  if (!nextSection) {
    return {
      overlayOpacity: currentSection.overlayOpacity,
      fontScale: currentSection.fontScale,
    };
  }

  const transition = interpolate(
    currentTime,
    [nextSection.seconds - 0.35, nextSection.seconds + 0.35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return {
    overlayOpacity: interpolate(
      transition,
      [0, 1],
      [currentSection.overlayOpacity, nextSection.overlayOpacity],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
    fontScale: interpolate(
      transition,
      [0, 1],
      [currentSection.fontScale, nextSection.fontScale],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    ),
  };
};

const IntroCard: React.FC<{
  title: string;
  artist: string;
  endFrame: number;
}> = ({ title, artist, endFrame }) => {
  const frame = useCurrentFrame();
  const safeEnd = Math.max(40, endFrame);
  const opacity = interpolate(
    frame,
    [0, 16, safeEnd - 20, safeEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "12%",
        transform: "translateY(-50%)",
        textAlign: "center",
        opacity,
        writingMode: "vertical-rl",
        textOrientation: "upright",
      }}
    >
      <div
        style={{
          fontFamily: "'Zen Old Mincho', 'Shippori Mincho', 'Noto Serif JP', serif",
          fontSize: 72,
          fontWeight: 500,
          letterSpacing: "0.18em",
          color: "#ffffff",
          textShadow: "0 0 40px rgba(255,200,150,0.4), 0 0 20px rgba(0,0,0,0.8)",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginRight: 20,
          fontFamily: "'Zen Old Mincho', 'Shippori Mincho', 'Noto Serif JP', serif",
          fontSize: 24,
          fontWeight: 400,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.25em",
          textShadow: "0 0 16px rgba(0,0,0,0.8)",
        }}
      >
        {artist}
      </div>
    </div>
  );
};

const IkiroLyricLine: React.FC<{
  text: string;
  durationInFrames: number;
  fontSize: number;
  bottomOffset: number;
  rightOffset: number;
  topOffset: number;
  isEmphasis: boolean;
  isVertical: boolean;
}> = ({ text, durationInFrames, fontSize, rightOffset, topOffset, isEmphasis, isVertical }) => {
  const frame = useCurrentFrame();

  const fadeInFrames = isEmphasis ? 10 : 8;
  const fadeOutFrames = isEmphasis ? 12 : 8;
  const fadeOutStart = Math.max(fadeInFrames + 1, durationInFrames - fadeOutFrames);

  const opacity = interpolate(
    frame,
    [0, fadeInFrames, fadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale = isEmphasis
    ? interpolate(frame, [0, 12], [0.9, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
    : 1;

  const textShadow = isEmphasis
    ? "0 0 12px rgba(255,255,255,0.9), 0 0 30px rgba(255,180,120,0.7), 0 0 60px rgba(255,120,80,0.5)"
    : "0 0 10px rgba(0,0,0,0.9), 0 0 24px rgba(0,0,0,0.6)";

  // 強調歌詞は中央表示、通常歌詞は右上表示
  const positionStyle = isEmphasis
    ? {
      top: "50%",
      left: "50%",
      transform: `translate(-50%, -50%) scale(${scale})`,
    }
    : {
      top: `${topOffset}%`,
      right: `${rightOffset}%`,
      transform: `scale(${scale})`,
    };

  if (isVertical) {
    return (
      <div
        style={{
          position: "absolute",
          ...positionStyle,
          opacity,
          writingMode: "vertical-rl",
          textOrientation: "upright",
          fontFamily: "'Zen Old Mincho', 'Shippori Mincho', 'Noto Serif JP', serif",
          fontSize,
          fontWeight: 500,
          lineHeight: 1.35,
          letterSpacing: "0.2em",
          color: "#ffffff",
          textShadow,
          whiteSpace: "pre-wrap",
          textAlign: isEmphasis ? "center" : "start",
        }}
      >
        {text}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        opacity,
        writingMode: "vertical-rl",
        textOrientation: "upright",
      }}
    >
      <div
        style={{
          fontFamily: "'Zen Old Mincho', 'Shippori Mincho', 'Noto Serif JP', serif",
          fontSize,
          fontWeight: isEmphasis ? 600 : 400,
          lineHeight: 1.45,
          letterSpacing: "0.18em",
          color: "#ffffff",
          textShadow,
          textAlign: isEmphasis ? "center" : "start",
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const IkiroVideo: React.FC<z.infer<typeof ikiroSchema>> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const parsedLyrics = useMemo(() => {
    return props.lyrics
      .map((line) => ({
        ...line,
        seconds: parseTimeTag(line.timeTag),
      }))
      .sort((a, b) => a.seconds - b.seconds);
  }, [props.lyrics]);

  const parsedSections = useMemo(() => {
    return props.sections
      .map((section) => ({
        ...section,
        seconds: parseTimeTag(section.startTimeTag),
      }))
      .sort((a, b) => a.seconds - b.seconds);
  }, [props.sections]);

  const emphasisSet = useMemo(() => {
    return new Set(
      props.emphasisLines.map((line) => `${line.timeTag}__${line.text}`),
    );
  }, [props.emphasisLines]);

  const sectionStyle = getSectionStyle(currentTime, parsedSections);
  const firstLyricSeconds = parsedLyrics[0]?.seconds ?? 0;
  const introEndFrame = Math.max(40, Math.round((firstLyricSeconds - 0.4) * fps));

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

      {/* 黒オーバーレイを削除 - 元動画と同じ明るさに */}

      <IntroCard title={props.title} artist={props.artist} endFrame={introEndFrame} />

      {parsedLyrics.map((line, index) => {
        const nextLine = parsedLyrics[index + 1];
        const endSeconds = nextLine ? nextLine.seconds : line.seconds + 8;
        const durationInFrames = Math.max(
          1,
          Math.round((endSeconds - line.seconds) * fps),
        );
        const startFrame = Math.round(line.seconds * fps);
        const key = `${line.timeTag}__${line.text}`;
        const isEmphasis = emphasisSet.has(key);
        const isVertical = props.layoutMode === "vertical";
        const lineFontSize =
          props.fontSize * sectionStyle.fontScale * (isEmphasis ? 2.5 : 1);

        return (
          <Sequence
            key={key}
            from={startFrame}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <IkiroLyricLine
              text={line.text}
              durationInFrames={durationInFrames}
              fontSize={lineFontSize}
              bottomOffset={props.bottomOffset}
              rightOffset={props.rightOffset}
              topOffset={props.topOffset}
              isEmphasis={isEmphasis}
              isVertical={isVertical}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
