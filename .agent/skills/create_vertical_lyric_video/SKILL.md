---
name: create_vertical_lyric_video
description: Generate a Remotion lyric video with vertical writing (縦書き) display
---

# Create Vertical Lyric Video Skill

縦書きリリックビデオを作成するスキル。明朝体フォント、オーバーレイなし、強調歌詞の中央表示が特徴。

## When to Use

- 縦書き歌詞表示のリクエスト
- 日本的・情緒的な雰囲気の曲
- 「生きろ」スタイルの演出希望

## Workflow

### 1. Scan for New Files
`public/suno_PJ/new` から `.lrc` と `.mp4` ペアを検出

### 2. Generate Data File

`src/HelloWorld/[SongName]Data.ts` を作成：

```typescript
import { staticFile } from "remotion";

export const [camelCaseName]Data = {
  title: "曲名",
  artist: "アーティスト名",
  videoSource: staticFile("suno_PJ/done/[filename].mp4"),
  layoutMode: "vertical" as const,
  // 位置調整（%単位）
  rightOffset: 10,   // 右からの距離
  topOffset: 8,      // 上からの距離
  lyrics: [
    { timeTag: "[00:00.00]", text: "歌詞テキスト" },
    // ...
  ],
  emphasisLines: [
    // 中央表示する重要歌詞
    { timeTag: "[01:00.00]", text: "サビの歌詞" },
  ],
  sections: [
    // オプション：セクション定義
    { name: "Aメロ", startTimeTag: "[00:00.00]", overlayOpacity: 0, fontScale: 1.0 },
  ],
};
```

### 3. Generate Video Component

**テンプレート**: `IkiroVideo.tsx`

#### スタイル設定

| 要素 | 値 |
|------|-----|
| フォント | `Zen Old Mincho`, `Shippori Mincho`, `Noto Serif JP` |
| ウェイト | 400-500（軽め） |
| 字間 | `0.18em`〜`0.2em` |
| オーバーレイ | **なし**（元動画の明るさ維持） |

#### 歌詞位置

```tsx
// 通常歌詞：右上
{
  position: "absolute",
  top: `${topOffset}%`,
  right: `${rightOffset}%`,
  writingMode: "vertical-rl",
  textOrientation: "upright",
}

// 強調歌詞：中央
{
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
}
```

#### 強調歌詞フォントサイズ

```tsx
const lineFontSize = props.fontSize * sectionStyle.fontScale * (isEmphasis ? 2.5 : 1);
```

#### イントロカード（縦書き）

```tsx
<div style={{
  position: "absolute",
  top: "50%",
  right: "12%",
  writingMode: "vertical-rl",
  textOrientation: "upright",
  fontFamily: "'Zen Old Mincho', serif",
  fontSize: 72,
  fontWeight: 500,
}}>
  {title}
</div>
```

### 4. Register Composition

`src/Root.tsx` に追加：
- Dimensions: 1920x1080, 30fps
- Duration: 最終歌詞タイムスタンプ + 10-15秒

### 5. Move Processed Files

`public/suno_PJ/new` → `public/suno_PJ/done`

### 6. Launch Preview

`npm run dev` で Remotion Studio を起動

## Template Reference

**Golden Master**: `IkiroVideo.tsx`

## 調整可能な値

| パラメータ | デフォルト | 説明 |
|-----------|-----------|------|
| `rightOffset` | 10 | 右からの距離（%） |
| `topOffset` | 8 | 上からの距離（%） |
| `fontSize` | 52 | 基本フォントサイズ |
| 強調倍率 | 2.5 | 強調歌詞のサイズ倍率 |
