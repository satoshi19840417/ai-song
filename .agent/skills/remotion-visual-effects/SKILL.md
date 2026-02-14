---
name: remotion-visual-effects
description: Remotionリリックビデオで使える高度なビジュアルエフェクトパターン集。文字単位アニメーション、着火演出、散り→花咲きブルーム、CSSグラデーションテキストなど。
---

# Remotion Visual Effects Patterns

リリックビデオ制作で再利用可能なビジュアルエフェクトパターン集。
`JinchougeVideo.tsx` で実装・検証済み。

---

## 1. 遅延着火エフェクト（Delayed Character Ignition）

**用途**: 特定の文字を最初非表示にし、時間差で「火がつく」ように出現させる

### 仕組み
- 対象文字のみ `opacity: 0` から開始
- `fireIgniteDelay` フレーム後にフェードイン + スケールバウンド
- 色は金色スパーク → 深紅へ遷移
- 着火後に火の粉パーティクルを出現

### コードパターン

```tsx
// 着火タイミング
const fireIgniteDelay = 25; // フレーム遅延
const fireIgniteDuration = 15;
const fireAppearProgress = interpolate(
    frame,
    [fireIgniteDelay, fireIgniteDelay + fireIgniteDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

// 着火後のフレーム基準（フリッカー等に使用）
const fireFrame = Math.max(0, frame - fireIgniteDelay);

// スケール: 小さく→大きくバウンド→落ち着く
const fireScale = interpolate(
    fireAppearProgress,
    [0, 0.5, 1],
    [0.3, 1.3, 1.1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);

// 色: 金色スパーク → オレンジ → 赤
const fireColor = interpolateColors(
    fireFrame,
    [0, 10, 30, 60],
    ["#ffaa00", "#ff6600", "#ff4400", "#ff2200"]
);

// 文字の opacity を fireAppearProgress で制御
// opacity: isFireChar ? fireAppearProgress : 1

// グロー強度も fireAppearProgress で乗算
// 0 0 ${fireGlow * fireAppearProgress}px rgba(255, 100, 0, 0.9)
```

### 火の粉パーティクル

```tsx
// 着火後のみ表示
{fireAppearProgress > 0.3 && [0, 1, 2, 3, 4].map((i) => {
    const particleFrame = (fireFrame + i * 12) % 40; // ループ
    const py = interpolate(particleFrame, [0, 40], [0, -50]); // 上昇
    const pOpacity = interpolate(particleFrame, [0, 8, 30, 40], [0, 0.8, 0.3, 0]);
    const px = Math.sin(particleFrame * 0.3 + i * 1.5) * 8; // 横揺れ
    // 小さな丸をレンダリング (borderRadius: 50%, blur: 1px)
})}
```

---

## 2. 全文字散り → ブルーム出現（Scatter-Then-Bloom Reveal）

**用途**: 歌詞の全文字が散ったあと、タイトルが花が咲くように中央に出現

### 3フェーズ構成

| Phase | フレーム | 内容 |
|-------|---------|------|
| Phase 1 | 0 ~ scatterStart | 全文字がフェードイン表示 |
| Phase 2 | scatterStart ~ scatterEnd | 全文字（タイトル含む）が四方に散る |
| Phase 3 | bloomStart (scatterEnd + delay) ~ | タイトルが中央で花咲きブルーム |

### タイミング設定

```tsx
const scatterStart = 80;
const scatterDuration = 90;
const scatterEnd = scatterStart + scatterDuration;
const bloomDelay = 40; // 散ったあとの「間」が大事
const bloomStart = scatterEnd + bloomDelay;
```

### Scatter（散り）パターン

```tsx
// 黄金角で均等に散らす
const getScatterDir = (i: number) => {
    const angle = ((i * 137.5 + 30) % 360) * (Math.PI / 180);
    const dist = 180 + (i % 3) * 100;
    return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 100,
        rot: (i % 2 === 0 ? 1 : -1) * (25 + (i % 4) * 15),
    };
};

// 各文字に時間差をつけて散らす
const delay = scatterStart + i * 5;
const sp = interpolate(frame, [delay, delay + 50], [0, 1], ...);
const eased = sp * sp; // ease-in で加速感
```

### Bloom（花咲き）パターン

```tsx
// ふわっと柔らかいspring（バウンドなし）
const bloomSpr = spring({
    frame: Math.max(0, frame - bloomStart),
    fps,
    config: { damping: 30, stiffness: 25, mass: 2.5 },
});
const bloomScale = interpolate(bloomSpr, [0, 1], [0, 1.3]);

// ゆっくりフェードイン（45フレーム）
const bloomOpacity = interpolate(
    frame,
    [bloomStart, bloomStart + 45, duration - 90, duration],
    [0, 1, 1, 0],
    ...
);
```

**重要**: `damping` を高く（30）、`stiffness` を低く（25）、`mass` を重く（2.5）すると、バウンドせずふわっと開く動きになる。

---

## 3. CSSグラデーションテキスト（Gradient Text）

**用途**: 文字に美しいグラデーションをかける

### コードパターン

```tsx
// 白 → ピンク の縦グラデーション
background: "linear-gradient(180deg, #ffffff 0%, #fce4ec 40%, #f8bbd0 70%, #f48fb1 100%)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
backgroundClip: "text",
textShadow: "none", // ← 必須: textShadow と background-clip:text は併用不可

// 代わりに filter の drop-shadow を使う
filter: `drop-shadow(0 0 ${glow}px rgba(248, 187, 208, 0.7)) 
         drop-shadow(0 0 ${glow * 2}px rgba(244, 143, 177, 0.4)) 
         drop-shadow(3px 3px 8px rgba(0, 0, 0, 0.5))`,
```

### 注意点
- `textShadow` と `background-clip: text` は同時に使えない（影がグラデーションを上書きする）
- 光彩は `filter: drop-shadow()` で代替する
- 複数の `drop-shadow` を連結して多層グローを実現

### カラーパレット例

| テーマ | グラデーション |
|--------|---------------|
| 桜・花 | `#ffffff → #fce4ec → #f8bbd0 → #f48fb1` |
| 春草 | `#ffffff → #e8f5e9 → #c8e6c9 → #a5d6a7` |
| 夕焼け | `#ffffff → #fff3e0 → #ffcc80 → #ff9800` |
| 冬雪 | `#ffffff → #e3f2fd → #bbdefb → #90caf9` |

---

## 4. 文字単位アニメーション（Per-Character Animation）

**用途**: 特定の文字だけに異なるスタイルを適用する

### パターン

```tsx
const chars = text.split("");
return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
        {chars.map((char, i) => {
            const isSpecial = char === "特定文字";
            return (
                <span
                    key={i}
                    style={{
                        fontSize: isSpecial ? fontSize * 1.35 : fontSize * 1.15,
                        color: isSpecial ? specialColor : baseColor,
                        opacity: isSpecial ? specialOpacity : 1,
                        transform: isSpecial ? specialTransform : "none",
                    }}
                >
                    {char}
                </span>
            );
        })}
    </div>
);
```

### 応用例
- 特定文字だけ大きく表示
- 特定文字だけ遅延表示（着火演出）
- 特定文字だけ色・グロー変更
- 特定文字だけ揺れ・回転

---

## 5. 花びらパーティクル（Petal Particles）

**用途**: 花が咲くシーンや春のテーマに装飾を追加

```tsx
const petals = [
    { x: -180, delay: bloomStart, size: 12 },
    { x: 160, delay: bloomStart + 15, size: 10 },
    // ...
];

{petals.map((petal, i) => {
    const petalFrame = Math.max(0, frame - petal.delay);
    const petalY = interpolate(petalFrame, [0, 150], [80, -250]); // 上昇
    const petalOpacity = interpolate(petalFrame, [0, 20, 100, 150], [0, 0.4, 0.3, 0]);
    const petalRotate = Math.sin(petalFrame * 0.04 + i) * 30; // 回転
    const petalSway = Math.sin(petalFrame * 0.025 + i * 1.5) * 15; // 横揺れ
    
    return (
        <div style={{
            position: "absolute",
            borderRadius: "50% 0 50% 0", // 花びら型
            background: "linear-gradient(135deg, #f8bbd0, #f48fb1)", // ピンク
            // または緑: "linear-gradient(135deg, #c8e6c9, #a5d6a7)"
            filter: "blur(0.5px)",
        }} />
    );
})}
```

---

## 推奨フォント（可憐・優しい系）

| フォント | 特徴 | 用途 |
|----------|------|------|
| Hina Mincho | 繊細で華奢な明朝体 | 花の名前、可憐なタイトル |
| Klee One | 手書き風教科書体 | 優しい語りかけ |
| Yuji Syuku | 書道風セリフ | 和風タイトル、力強い言葉 |
| Zen Kurenaido | カジュアルなサンセリフ | 歌詞本文 |

※すべて `index.css` で Google Fonts として読み込み済み

---

## 実装リファレンス

- `JinchougeVideo.tsx` — 全パターンの実装例
  - `CenterLyricLine` — 着火エフェクト + 文字単位アニメーション
  - `FinalTitleReveal` — 散り→ブルーム + グラデーション + 花びら
