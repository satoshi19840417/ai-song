import { useMemo } from "react";
// Template for __SONG_NAME__
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

export const __SCHEMA_NAME__ = z.object({
  fontSize: z.number().default(52),
  rightOffset: z.number().default(10),
  topOffset: z.number().default(8),
  title: z.string(),
  artist: z.string(),
  videoSource: z.string(),
  layoutMode: z.enum(["vertical", "horizontal"]).default("vertical"),
  lyrics: z.array(lyricLineSchema),
  emphasisLines: z.array(lyricLineSchema).default([]),
});

const parseTimeTag = (tag: string): number => {
  const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
  if (!match) {
    return 0;
  }

  return Number.parseInt(match[1], 10) * 60 + Number.parseFloat(match[2]);
};

const IntroCard: React.FC<{ title: string; artist: string; duration: number }> = ({
  title,
  artist,
  duration,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 16, duration - 24, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        right: "12%",
        transform: "translateY(-50%)",
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
          textShadow: "0 0 30px rgba(255,255,255,0.35), 0 0 20px rgba(0,0,0,0.7)",
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginRight: 18,
          fontFamily: "'Zen Old Mincho', 'Shippori Mincho', 'Noto Serif JP', serif",
          fontSize: 24,
          fontWeight: 400,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.22em",
          textShadow: "0 0 16px rgba(0,0,0,0.8)",
        }}
      >
        {artist}
      </div>
    </div>
  );
};

const VerticalLyricLine: React.FC<{
  text: string;
  durationInFrames: number;
  fontSize: number;
  rightOffset: number;
  topOffset: number;
  isEmphasis: boolean;
}> = ({ text, durationInFrames, fontSize, rightOffset, topOffset, isEmphasis }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const positionStyle = isEmphasis
    ? {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center" as const,
      }
    : {
        top: `${topOffset}%`,
        right: `${rightOffset}%`,
        textAlign: "start" as const,
      };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        opacity,
        writingMode: "vertical-rl",
        textOrientation: "upright",
        fontFamily: "'Zen Old Mincho', 'Shippori Mincho', 'Noto Serif JP', serif",
        fontSize: isEmphasis ? fontSize * 2.3 : fontSize,
        fontWeight: isEmphasis ? 600 : 500,
        lineHeight: 1.35,
        letterSpacing: "0.2em",
        color: "#ffffff",
        textShadow: isEmphasis
          ? "0 0 24px rgba(255,255,255,0.75), 0 0 35px rgba(255,190,130,0.45)"
          : "0 0 12px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.55)",
      }}
    >
      {text}
    </div>
  );
};

export const __COMPONENT_NAME__: React.FC<z.infer<typeof __SCHEMA_NAME__>> = (props) => {
  const { fps } = useVideoConfig();

  const parsedLyrics = useMemo(
    () =>
      props.lyrics
        .map((line) => ({
          ...line,
          seconds: parseTimeTag(line.timeTag),
        }))
        .sort((a, b) => a.seconds - b.seconds),
    [props.lyrics]
  );

  const emphasisSet = useMemo(
    () => new Set(props.emphasisLines.map((line) => `${line.timeTag}__${line.text}`)),
    [props.emphasisLines]
  );

  const introDuration = Math.max(120, Math.round(((parsedLyrics[0]?.seconds ?? 0) - 0.4) * fps));

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

      <IntroCard title={props.title} artist={props.artist} duration={introDuration} />

      {parsedLyrics.map((line, index) => {
        const nextLine = parsedLyrics[index + 1];
        const startFrame = Math.round(line.seconds * fps);
        const durationInFrames = Math.max(
          1,
          Math.round(((nextLine?.seconds ?? line.seconds + 8) - line.seconds) * fps)
        );
        const isEmphasis = emphasisSet.has(`${line.timeTag}__${line.text}`);

        return (
          <Sequence
            key={`${line.timeTag}-${line.text}-${index}`}
            from={startFrame}
            durationInFrames={durationInFrames}
            layout="none"
          >
            <VerticalLyricLine
              text={line.text}
              durationInFrames={durationInFrames}
              fontSize={props.fontSize}
              rightOffset={props.rightOffset}
              topOffset={props.topOffset}
              isEmphasis={isEmphasis}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
