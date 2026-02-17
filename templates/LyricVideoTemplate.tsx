/* eslint-disable no-irregular-whitespace */
// Template for __SONG_NAME__
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import {
  FONTS,
  SPRING_CONFIGS,
  TEXT_SHADOWS,
  audioFadeCurve,
  fadeInOut,
  getPremountDuration,
  typewriterText,
} from "./animationUtils";

const lyricLineSchema = z.object({
  timeTag: z.string(),
  text: z.string(),
});

export const __SCHEMA_NAME__ = z.object({
  fontSize: z.number().default(40),
  bottomOffset: z.number().default(100),
  title: z.string(),
  artist: z.string(),
  videoSource: z.string(),
  lyrics: z.array(lyricLineSchema),
});

const parseTimeTag = (tag: string): number => {
  const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
  if (!match) {
    return 0;
  }

  return Number.parseInt(match[1], 10) * 60 + Number.parseFloat(match[2]);
};

const EMPHASIS_KEYWORDS = ["愛", "好き", "心", "想い"];

const OpeningTitle: React.FC<{ title: string; artist: string; duration: number }> = ({
  title,
  artist,
  duration,
}) => {
  const frame = useCurrentFrame();
  const titleText = typewriterText(frame, title, 0.14);
  const artistText = typewriterText(Math.max(0, frame - 36), artist, 0.2);
  const opacity = fadeInOut(frame, duration, 15, 30);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <h1
        style={{
          margin: 0,
          fontFamily: FONTS.yujiSyuku,
          fontSize: 84,
          fontWeight: 600,
          letterSpacing: "0.08em",
          color: "#ffffff",
          textShadow: TEXT_SHADOWS.strongGlow,
        }}
      >
        {titleText}
      </h1>
      <h2
        style={{
          marginTop: 16,
          marginBottom: 0,
          fontFamily: FONTS.zenKurenaido,
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: "0.08em",
          color: "rgba(255,255,255,0.9)",
          textShadow: TEXT_SHADOWS.subtle,
        }}
      >
        {artistText}
      </h2>
    </div>
  );
};

const StandardLyricLine: React.FC<{
  text: string;
  durationInFrames: number;
  fontSize: number;
  bottomOffset: number;
}> = ({ text, durationInFrames, fontSize, bottomOffset }) => {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, durationInFrames, 12, 12);
  const color = interpolateColors(frame, [0, durationInFrames], ["#ffffff", "#f6d7e4"]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        textAlign: "center",
        fontFamily: FONTS.zenKurenaido,
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.05em",
        color,
        textShadow: TEXT_SHADOWS.subtle,
        opacity,
        padding: "0 48px",
      }}
    >
      {text}
    </div>
  );
};

const EmphasisLyricLine: React.FC<{
  text: string;
  durationInFrames: number;
  fontSize: number;
  bottomOffset: number;
}> = ({ text, durationInFrames, fontSize, bottomOffset }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeInOut(frame, durationInFrames, 16, 16);
  const scale = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.lyricEmphasis,
    from: 0.85,
    to: 1,
  });
  const color = interpolateColors(frame, [0, durationInFrames], ["#ffd7ea", "#ff9ccc"]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: bottomOffset,
        textAlign: "center",
        fontFamily: FONTS.zenKurenaido,
        fontSize: fontSize * 1.12,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color,
        textShadow: TEXT_SHADOWS.warmGlow,
        opacity,
        transform: `scale(${scale})`,
        padding: "0 48px",
      }}
    >
      {text}
    </div>
  );
};

const FinalLyricLine: React.FC<{
  text: string;
  durationInFrames: number;
  fontSize: number;
}> = ({ text, durationInFrames, fontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeInOut(frame, durationInFrames, 24, 90);
  const scale = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.heavy,
    from: 0.35,
    to: 1.05,
  });
  const color = interpolateColors(frame, [0, durationInFrames], ["#ffffff", "#ffb3d9"]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        textAlign: "center",
        fontFamily: FONTS.yujiSyuku,
        fontSize: fontSize * 1.5,
        fontWeight: 600,
        letterSpacing: "0.1em",
        color,
        textShadow: TEXT_SHADOWS.strongGlow,
        opacity,
        whiteSpace: "nowrap",
        padding: "0 24px",
      }}
    >
      {text}
    </div>
  );
};

export const __COMPONENT_NAME__: React.FC<z.infer<typeof __SCHEMA_NAME__>> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();

  const parsedLyrics = props.lyrics
    .map((line) => ({
      ...line,
      seconds: parseTimeTag(line.timeTag),
    }))
    .sort((a, b) => a.seconds - b.seconds);

  const firstLyricStartFrame = Math.max(
    0,
    Math.round((parsedLyrics[0]?.seconds ?? 0) * fps) - Math.round(fps * 0.5)
  );
  const introDuration = Math.max(120, firstLyricStartFrame);

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
      <Audio src={props.videoSource} volume={audioFadeCurve(fps, durationInFrames, 1, 2)} />

      <Sequence
        from={0}
        durationInFrames={introDuration}
        premountFor={getPremountDuration(fps)}
      >
        <OpeningTitle title={props.title} artist={props.artist} duration={introDuration} />
      </Sequence>

      {parsedLyrics.map((line, index) => {
        const nextLine = parsedLyrics[index + 1];
        const isLastLine = !nextLine;
        const startFrame = Math.round(line.seconds * fps);
        const duration = isLastLine
          ? Math.round(12 * fps)
          : Math.max(1, Math.round((nextLine.seconds - line.seconds) * fps));
        const isEmphasis =
          !isLastLine && EMPHASIS_KEYWORDS.some((keyword) => line.text.includes(keyword));

        return (
          <Sequence
            key={`${line.timeTag}-${line.text}-${index}`}
            from={startFrame}
            durationInFrames={duration}
            layout="none"
            premountFor={getPremountDuration(fps)}
          >
            {isLastLine ? (
              <FinalLyricLine
                text={line.text}
                durationInFrames={duration}
                fontSize={props.fontSize}
              />
            ) : isEmphasis ? (
              <EmphasisLyricLine
                text={line.text}
                durationInFrames={duration}
                fontSize={props.fontSize}
                bottomOffset={props.bottomOffset}
              />
            ) : (
              <StandardLyricLine
                text={line.text}
                durationInFrames={duration}
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
