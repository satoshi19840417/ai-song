# 作詞用スキル `compose-lyrics` 実装計画

## Context

現在のワークフローでは「テーマ決める → 歌詞書く → Sunoで生成 → LRC作成 → Remotion動画化」という流れがあるが、**作詞ステップに対応するスキルが存在しない**。`create_lyric_video` はLRCが既にある前提であり、歌詞ゼロから作る部分はカバーされていない。

今回、テーマ・ジャンル・ムードから日本語歌詞を生成し、Suno用タグ付きフォーマット・LRCファイル・Obsidian楽曲MDファイルをすべて自動生成する `compose-lyrics` スキルを追加する。

---

## 実装ファイル構成

```
.agent/skills/compose-lyrics/       ← 新規作成
├── SKILL.md                        ← スキル定義本体
└── references/
    ├── song-structure-patterns.md  ← J-pop等の曲構成パターン集
    ├── suno-tags-guide.md          ← Sunoタグリファレンス
    └── lrc-format-spec.md          ← LRCフォーマット仕様
```

**既存参照ファイル（変更なし）:**
- `.agent/skills/create_lyric_video/SKILL.md` — frontmatter形式と引き渡し規約を参照
- `public/suno_PJ/Suno/01_Songs/_template_song.md` — 楽曲MDの出力フォーマット
- `public/suno_PJ/Suno/_index.md` — インデックス更新対象

---

## `SKILL.md` 内容

```markdown
---
name: compose-lyrics
description: 日本語歌詞を作成し、Suno AIタグ付き歌詞・LRCファイル・Obsidian楽曲ファイルを生成して保存する。「作詞して」「歌詞を書いて」「新しい曲を作りたい」などのリクエスト時に使用。
---

# Compose Lyrics Skill

テーマ・ジャンル・ムードから日本語歌詞を作成し、Suno AI用タグ付きフォーマット・LRCファイル・Obsidian楽曲MDファイルを生成・保存するスキル。

## Workflow

### 1. ヒアリング

ユーザーから以下の情報を収集する（未指定の項目は提案を提示して確認）：

- **テーマ**: 何について歌う曲か（例: 失恋、応援、季節、AI）
- **ジャンル**: J-Pop / バラード / ロック / エレクトロ など
- **ムード**: 切ない / 力強い / 明るい / クール など
- **曲の長さ**: 短め（2番構成）/ 標準（2番+ブリッジ）/ 長め（3番構成）
- **その他希望**: 英語混じり / 縦書き向け / ショート動画向け など

参照: `references/song-structure-patterns.md` で構成パターンを選択。

### 2. 歌詞作成

ヒアリング内容に基づき日本語歌詞を作成する：

- 構成は `[Verse 1]` → `[Pre-Chorus]` → `[Chorus]` → `[Verse 2]` → `[Pre-Chorus]` → `[Chorus]` → `[Bridge]` → `[Outro]` を基本とする
- サビ（Chorus）は繰り返し構造にして印象を強くする
- 各セクションの行数目安: Verse=4〜6行、Chorus=4〜6行、Bridge=2〜4行
- 参照: `references/suno-tags-guide.md` でタグ使用法を確認

### 3. スタイル文作成

`public/suno_PJ/Suno/02_StyleLibrary/_style_library.md` を参照してSuno用スタイル文を英語で作成する（カンマ区切り）。

例: `Emotional J-Pop Ballad, Piano, Strings, Female Vocal, Melancholic`

### 4. Sunoタグ付き歌詞フォーマット出力

セクションタグ付きで歌詞を整形する。参照: `references/suno-tags-guide.md`

```
[Verse 1]
（歌詞）

[Pre-Chorus]
（歌詞）

[Chorus]
（歌詞）
...
```

### 5. LRCファイル生成

仮タイムコード付きの `.lrc` ファイル内容を生成する。参照: `references/lrc-format-spec.md`

- BPM情報がある場合は計算する。ない場合は平均的な曲速（120BPM）で概算
- タイムコード間隔の目安: Verse行=約3〜4秒、Chorus行=約3〜4秒
- ファイル名: `[曲タイトル].lrc`
- 保存先: `public/suno_PJ/new/[曲タイトル].lrc`

### 6. 次のIDを確定

`public/suno_PJ/Suno/_index.md` を読み込み、最後の SNG-2026-NNNN の番号を確認して次のIDを決定する。

### 7. 楽曲MDファイル保存

`public/suno_PJ/Suno/01_Songs/_template_song.md` のフォーマットで `public/suno_PJ/Suno/01_Songs/SNG-YYYY-NNNN_[タイトル].md` を作成する。

### 8. インデックス更新

`public/suno_PJ/Suno/_index.md` の「作業中 (draft)」テーブルに新曲エントリを追加する。

### 9. 次のスキルへの引き渡し

保存が完了したら、ユーザーに以下を案内する：

- **リリックビデオ作成**: `create_lyric_video`（横書き）または `create_vertical_lyric_video`（縦書き）
  - `public/suno_PJ/new/[曲タイトル].lrc` を配置済み
  - 音源ファイル（.mp4/.mp3）を同ディレクトリに配置するよう案内
- **YouTubeメタデータ生成**: `create_youtube_metadata` または `create_youtube_full_metadata`
```

---

## 各 `references/` ファイル内容

### `song-structure-patterns.md`
- 標準J-Pop構成（2番構成）
- 短め構成（ショート動画向け）
- バラード構成
- ロック構成
- 各セクションの役割と文字数目安表

### `suno-tags-guide.md`
- 使用可能なセクションタグ一覧（[Intro][Verse][Pre-Chorus][Chorus][Bridge][Outro]等）
- 書き方ルール（単独行、セクション間空行）
- サンプル歌詞

### `lrc-format-spec.md`
- `[mm:ss.xx]歌詞テキスト` 形式の説明
- ヘッダータグ（ti/ar/al/offset）
- 仮タイムコード生成ルール（セクション別秒数目安）
- `create_lyric_video` スキルとの互換性説明

---

## 実装ステップ

1. `.agent/skills/compose-lyrics/SKILL.md` を作成
2. `.agent/skills/compose-lyrics/references/song-structure-patterns.md` を作成
3. `.agent/skills/compose-lyrics/references/suno-tags-guide.md` を作成
4. `.agent/skills/compose-lyrics/references/lrc-format-spec.md` を作成

---

## 検証方法

1. スキルを起動し「応援をテーマにした曲の歌詞を作って」とリクエスト
2. ヒアリングが適切に行われるか確認
3. 以下の出力が生成されるか確認：
   - Sunoタグ付き歌詞
   - `.lrc` ファイル（`public/suno_PJ/new/` に保存）
   - 楽曲MDファイル（`public/suno_PJ/Suno/01_Songs/` に保存）
   - `_index.md` の「作業中」テーブルが更新されているか
4. 生成されたLRCファイルを使い `create_lyric_video` スキルが正常動作するか確認
