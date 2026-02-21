---
name: paraparamanga-image-prompter
description: 鉄拳スタイルのパラパラ漫画（手描き鉛筆スケッチ）をNano Banana Proで生成するための画像プロンプトを作成する。「パラパラ漫画のプロンプトを作って」「手書き風画像を作りたい」「鉄拳スタイルで画像生成」「Nano Banana Proで生成したい」などの発話に対応。シーン情報を収集しスタイル統一キーワードを適用したプロンプトを出力する。複数シーンの場合はKlingトランジション用ヒントも提供する。
---

# Paraparamanga Image Prompter

## 使用場面

以下のような発話に対して使用する：

- 「パラパラ漫画のプロンプトを作って」
- 「手書き風の画像プロンプトが欲しい」
- 「鉄拔スタイルで〇〇のシーンを描きたい」
- 「Nano Banana Proで鉛筆スケッチ風の画像を作りたい」
- 「Klingでつなぐために複数シーンの画像プロンプトを作りたい」

## Workflow

### Stage 1: シーン情報の収集

AskUserQuestion を使って以下を確認する（未指定の場合）：

| 確認項目 | 選択肢の例 |
|----------|-----------|
| シーン内容 | 卒業式、入学式、日常の一コマ、旅行、スポーツなど |
| キャラクター構成 | 1人（主人公のみ）/ 複数人（集合写真風）/ シルエット |
| 背景スタイル | 白紙のみ（最もパラパラ漫画らしい）/ シンプルな背景あり（桜・校舎など簡略描写） |
| 参照画像の有無 | あり（i2i / style referenceで渡す）/ なし |
| シーン数 | 1枚 / 複数枚（Klingでつなぐ場合） |

### Stage 2: プロンプト生成

以下の**スタイル定型句**を必ず冒頭に含める。その後にシーン固有の要素を追加する。

#### スタイル定型句（必須・変更不可）

```
pencil sketch illustration, hand-drawn on white paper, monochrome,
fine line art, anime style, Tekken flipbook aesthetic,
white paper texture, no color, sketch marks visible,
wide shot, centered composition
```

#### シーン固有要素の組み立て方

**キャラクター記述の例：**
- 1人: `a high school boy in gakuran (Japanese school uniform, black stand-up collar), standing, looking forward`
- 複数人: `four high school boys in gakuran, group photo pose, arms around each other's shoulders, smiling, front-facing, standing in a horizontal row`
- シルエット: `silhouettes of three figures standing side by side, no facial details`

**背景記述の例：**
- 白紙のみ: 背景の記述は省略（デフォルトで白くなる）
- 校舎: `background: simple pencil sketch of school building facade, a few windows and entrance gate lightly drawn`
- 桜: `background: simple pencil sketch of cherry blossom tree in full bloom, falling petals lightly drawn around them`

**服装・小道具の例：**
- 卒業式（学ラン）: `gakuran (Japanese school uniform, black stand-up collar), diplomas held in one hand, graduation ceremony atmosphere`
- 入学式（ブレザー）: `new school uniform (blazer style), peace signs and smiling, entrance ceremony atmosphere, fresh and hopeful mood`

#### 複数シーンの場合の注意

2枚目以降のプロンプトには必ず以下を追加する：

```
same framing as image 1
```

これによりKlingでのページフリップ補間が自然になる。

### Stage 3: Klingトランジションヒント（複数シーンの場合のみ）

複数シーンを生成した場合、以下のKling用情報も提供する：

| 項目 | 内容 |
|------|------|
| エフェクト | Page flip / notebook page turn |
| 方向 | 右から左にめくる（1枚目→2枚目） |
| 速度 | 素早くめくる（0.5秒程度） |
| Klingプロンプト案 | `notebook page flipping from right to left, hand-drawn animation, pencil sketch transition, flipbook style` |
| 構図統一のコツ | 両枚のキャラクターの位置・サイズを合わせるとKlingの補間がきれいになる |

## 出力形式

各シーンについて以下の形式で出力する：

```markdown
## 画像[N]：[シーン名]

**概念**：[シーンの意図・雰囲気を1行で説明]

### Nano Banana Pro プロンプト

```
[スタイル定型句]

[シーン固有の要素]
```

### 補足
- [参照画像の使い方など実用的なヒント]
```

## 注意事項

- `gakuran` など日本語固有の服装名は英語説明を括弧内に併記する（Nano Banana Proが理解しやすいように）
- Nano Banana Proのstyle reference（i2i）機能がある場合は参照画像を渡すとスタイルが安定する
- 複数シーンを生成する際は、ネガティブプロンプトとして `color, realistic photo, 3D render, background clutter` を追加することを推奨
