/* eslint-disable no-irregular-whitespace */
// 青春、もう一周 - 縦書き/横書き切り替えリリック動画
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import {
  FONTS,
  SPRING_CONFIGS,
  audioFadeCurve,
  fadeInOut,
  getPremountDuration,
} from "./animationUtils";
import type { LyricLineWithSection } from "./SeiShunMouIkkouData";

// ============================================================
// Schema
// ============================================================

const lyricLineSchema = z.object({
  timeTag: z.string(),
  text: z.string(),
  sectionType: z.enum(["normal", "chorus"]),
});

export const seiShunMouIkkouSchema = z.object({
  fontSize: z.number().default(42),
  title: z.string(),
  artist: z.string(),
  videoSource: z.string(),
  lyrics: z.array(lyricLineSchema),
});

// ============================================================
// Helpers
// ============================================================

const parseTimeTag = (tag: string): number => {
  const match = tag.match(/\[(\d{2}):(\d{2}\.\d{2,3})\]/);
  if (!match) return 0;
  return Number.parseInt(match[1], 10) * 60 + Number.parseFloat(match[2]);
};




// ============================================================
// VerticalLyricLine（縦書き・通常行）
// ============================================================
const VerticalLyricLine: React.FC<{
  text: string;
  durationInFrames: number;
  fontSize: number;
}> = ({ text, durationInFrames, fontSize }) => {
  const frame = useCurrentFrame();

  const opacity = fadeInOut(frame, durationInFrames, 10, 10);

  const textShadow = "1px 1px 0 rgba(255,255,255,0.8), -1px -1px 0 rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.5)";

  return (
    <div
      style={{
        position: "absolute",
        right: "3%",
        top: "50%",
        transform: "translateY(-50%)",
        writingMode: "vertical-rl",
        fontFamily: "'Mochiy Pop One', sans-serif",
        fontSize,
        fontWeight: 400,
        letterSpacing: "0.18em",
        color: "#1a1a1a",
        textShadow,
        opacity,
        lineHeight: 1.6,
        textOrientation: "upright" as const,
        whiteSpace: "nowrap" as const,
        transformOrigin: "right center",
      }}
    >
      {text}
    </div>
  );
};

// ============================================================
// HorizontalLyricLine（横書き・サビ行）
// ============================================================
const HorizontalLyricLine: React.FC<{
  text: string;
  durationInFrames: number;
  fontSize: number;
  isKeyLine: boolean;
  isWhite?: boolean;
}> = ({ text, durationInFrames, fontSize, isKeyLine, isWhite = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = fadeInOut(frame, durationInFrames, 14, 14);

  // スケールスプリング：キーラインは大きく登場
  const scale = spring({
    frame,
    fps,
    config: isKeyLine ? SPRING_CONFIGS.heavy : SPRING_CONFIGS.smooth,
    from: isKeyLine ? 0.8 : 0.92,
    to: 1,
  });

  const actualFontSize = isKeyLine ? fontSize * 1.2 : fontSize;

  const color = isWhite ? "#ffffff" : "#1a1a1a";
  const textShadow = isWhite
    ? "0 0 24px rgba(255, 255, 255, 0.6), 2px 2px 6px rgba(0,0,0,0.7)"
    : isKeyLine
      ? "1px 1px 0 rgba(255,255,255,0.9), -1px -1px 0 rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.6)"
      : "1px 1px 0 rgba(255,255,255,0.8), -1px -1px 0 rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.5)";

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scale})`,
        writingMode: "horizontal-tb",
        fontFamily: "'Mochiy Pop One', sans-serif",
        fontSize: actualFontSize,
        fontWeight: 400,
        letterSpacing: "0.08em",
        color,
        textShadow,
        opacity,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// ============================================================
// EndingTitle（エンディングタイトルカード — 曲名のみ）
// ============================================================
const EndingTitle: React.FC<{
  title: string;
  duration: number;
}> = ({ title, duration }) => {
  const frame = useCurrentFrame();
  const opacity = fadeInOut(frame, duration, 30, 30);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div
        style={{
          writingMode: "vertical-rl",
          fontFamily: FONTS.yujiSyuku,
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "#ffffff",
          textShadow: "0 0 24px rgba(255, 255, 255, 0.6), 2px 2px 6px rgba(0,0,0,0.7)",
        }}
      >
        {title}
      </div>
    </div>
  );
};

// ============================================================
// Main Component
// ============================================================

// キーライン（特に重要なサビのフレーズ）
const KEY_LINES = [
  "もう一周なんていらないよ",
  "あの日の僕はあの日にしかいない",
  "やっぱり いらないよ",
  "ここでやり直したら 僕が僕じゃなくなる",
  "僕は——前に行く",
  "もう一周なんていらない まだ知らない僕に会いたいから",
  "僕は——走り出すよ",
];

// 白文字にする特殊行
const WHITE_TEXT_LINES = [
  "……ごめんな 神様",
  "——どこかで パッチン、が聞こえた",
];

// 横書き中央表示にする特殊行（normalセクションでも横書き）
const FORCE_HORIZONTAL_LINES = [
  "——どこかで パッチン、が聞こえた",
];

// 表示時間を短縮する行（秒数で上限を指定）
const SHORTENED_LINES: Record<string, number> = {
  "ジャージのジッパーだけ残ってた": 4,
};

export const SeiShunMouIkkouVideo: React.FC<
  z.infer<typeof seiShunMouIkkouSchema>
> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();

  const parsedLyrics = (props.lyrics as unknown as LyricLineWithSection[])
    .map((line) => ({
      ...line,
      seconds: parseTimeTag(line.timeTag),
    }))
    .sort((a, b) => a.seconds - b.seconds);

  // エンディングタイトル：最後の歌詞の5秒後から表示
  const lastLyric = parsedLyrics[parsedLyrics.length - 1];
  const lastLyricEnd = lastLyric
    ? Math.round(lastLyric.seconds * fps) + Math.round(4 * fps)
    : durationInFrames - Math.round(5 * fps);
  const endingTitleFrom = lastLyricEnd;
  const endingTitleDuration = Math.max(1, durationInFrames - endingTitleFrom);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 背景動画 */}
      <OffthreadVideo
        src={props.videoSource}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {/* 音声（フェードイン・フェードアウト付き） */}
      <Audio
        src={props.videoSource}
        volume={audioFadeCurve(fps, durationInFrames, 1, 2)}
      />

      {/* 歌詞ライン */}
      {parsedLyrics.map((line, index) => {
        const nextLine = parsedLyrics[index + 1];
        const isLastLine = !nextLine;
        const startFrame = Math.round(line.seconds * fps);
        let duration = isLastLine
          ? Math.round(4 * fps)
          : Math.max(1, Math.round((nextLine.seconds - line.seconds) * fps));

        // 表示時間の短縮
        if (SHORTENED_LINES[line.text]) {
          duration = Math.min(duration, Math.round(SHORTENED_LINES[line.text] * fps));
        }

        const isKeyLine = KEY_LINES.includes(line.text);
        const isChorus = line.sectionType === "chorus";
        const isWhite = WHITE_TEXT_LINES.includes(line.text);
        const forceHorizontal = FORCE_HORIZONTAL_LINES.includes(line.text);

        // 横書き表示：サビ or 強制横書き行
        const useHorizontal = isChorus || forceHorizontal;

        return (
          <Sequence
            key={`${line.timeTag}-${index}`}
            from={startFrame}
            durationInFrames={duration}
            layout="none"
            premountFor={getPremountDuration(fps)}
          >
            {useHorizontal ? (
              <HorizontalLyricLine
                text={line.text}
                durationInFrames={duration}
                fontSize={props.fontSize}
                isKeyLine={isKeyLine}
                isWhite={isWhite}
              />
            ) : (
              <VerticalLyricLine
                text={line.text}
                durationInFrames={duration}
                fontSize={props.fontSize - 4}
              />
            )}
          </Sequence>
        );
      })}

      {/* エンディングタイトル（曲名のみ） */}
      <Sequence
        from={endingTitleFrom}
        durationInFrames={endingTitleDuration}
        premountFor={getPremountDuration(fps)}
      >
        <EndingTitle title={props.title} duration={endingTitleDuration} />
      </Sequence>
    </AbsoluteFill>
  );
};

