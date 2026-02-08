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

[Verse 2]
（歌詞）

[Pre-Chorus]
（歌詞）

[Chorus]
（歌詞）

[Bridge]
（歌詞）

[Outro]
（歌詞）
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

`public/suno_PJ/Suno/01_Songs/_template_song.md` のフォーマットで以下のファイルを作成する：
- パス: `public/suno_PJ/Suno/01_Songs/SNG-YYYY-NNNN_[タイトル].md`
- `status` は `draft`
- `## 4) 制作メモ` に compose-lyrics スキルで作成した旨とLRCパスを記載
- `## 5) 変更履歴` に作成日と初稿作成を記載

### 8. インデックス更新

`public/suno_PJ/Suno/_index.md` の「作業中 (draft)」テーブルに新曲エントリを追加する：

```markdown
| SNG-YYYY-NNNN | [タイトル](01_Songs/SNG-YYYY-NNNN_タイトル.md) | YYYY-MM-DD |
```

### 9. 次のスキルへの引き渡し

保存が完了したら、ユーザーに以下を案内する：

- **Sunoで音源生成**: 楽曲MDの「3) Suno貼り付け用」セクションの内容をSunoにコピー
- **リリックビデオ作成**: 音源ファイル（.mp4/.mp3）を `public/suno_PJ/new/` に配置後、`create_lyric_video`（横書き）または `create_vertical_lyric_video`（縦書き）スキルを実行
- **YouTubeメタデータ生成**: `create_youtube_metadata` または `create_youtube_full_metadata` スキルを実行
