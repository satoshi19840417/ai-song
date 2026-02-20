---
name: obsidian-update
description: SunoとYouTubeから最新情報を取得し、ObsidianのVault（suno_PJ）のノートとインデックスを更新する。「sunoから最新情報を更新」「YouTubeノートを同期」「obsidianを更新して」「新曲をノートに追加」など、Suno楽曲またはYouTube動画のObsidianノート作成・更新を求められたときに使用。更新対象: Suno/01_Songs/ の曲ノート、YouTube/01_Videos/ の動画ノート、各インデックスファイル。
---

# obsidian-update

SunoページとYouTubeページを確認し、既存のObsidianノートと差分を取って新規ノートの作成・既存ノートの更新・インデックス更新を行う。

スキーマ詳細 → `references/vault_schema.md`

## ワークフロー

### Step 1: 現状把握

既存ノートの最大IDを確認:
```bash
ls "c:/Users/sench/remotion-test-work/my-remotion-01/public/suno_PJ/Suno/01_Songs/" | sort | tail -3
ls "c:/Users/sench/remotion-test-work/my-remotion-01/public/suno_PJ/YouTube/01_Videos/" | sort | tail -3
```

`Suno/_index.md` の `released` 一覧と `YouTube/_index_youtube.md` の `uploaded` 一覧を読んで既存タイトルを把握する。

### Step 2: Sunoから最新情報を取得

**方法A（Chrome DevTools MCP）**:
1. `wait_for` または `take_snapshot` でSunoページを確認
2. 表示されていなければ `navigate_page` で `https://suno.com/@hypnotizingtonalities0343` を開く
3. スナップショットのリンクから曲タイトル・URL・スタイルを抽出

**方法B（URLが手動提供された場合）**:
ユーザーが曲URLを貼った場合はそのURLとタイトルを使用。

差分判定: Step 1の既存タイトルにないもの → **新規追加対象**

### Step 3: YouTubeから最新情報を取得

**方法A（Chrome DevTools MCP）**:
1. `navigate_page` で `https://www.youtube.com/@AImovieLab2025/videos` を開く
2. `wait_for` で動画リストの表示を待ってから `take_snapshot`
3. スナップショットから動画タイトル・URL・投稿日を抽出

**方法B（yt-dlp が使える場合）**:
```bash
yt-dlp --flat-playlist --dump-json "https://www.youtube.com/@AImovieLab2025/videos" | head -5
```

差分判定: Step 1の既存タイトルにないもの → **新規追加対象**

### Step 4: ノートを作成・更新

**新規Sunoノート** (`Suno/01_Songs/SNG-2026-XXXX_タイトル.md`):
- フロントマター: `references/vault_schema.md` 参照
- `status: released`, `suno_song_url` を設定
- styleはSunoスナップショットから転記

**既存Sunoノートの更新**:
- `suno_song_url` が空 → URLを補完
- `status: draft` → 公開確認できたら `released` に変更
- `updated` 日付を今日に更新し、変更履歴に追記

**新規YouTubeノート** (`YouTube/01_Videos/VID-2026-XXXX_タイトル.md`):
- `youtube_url`, `publish_date`, `related_suno_id` を設定
- `related_suno_id` は同名のSNG IDを検索して紐付け

### Step 5: インデックスを更新

**`Suno/_index.md`**:
- `最終更新:` を今日に更新
- 新規曲を `## 公開済 (released)` テーブルに追加
- draft→released に昇格した曲を `## 作業中` から移動
- `## Suno同期メモ` に変更サマリを追記

**`YouTube/_index_youtube.md`**:
- `最終更新:` を今日に更新
- 新規動画を `## 公開・アップロード済み` テーブルに追加
- `## YouTube同期メモ` に変更サマリを追記

### Step 6: 完了報告

- 追加したSunoノート（件数・タイトル・URL）
- 更新したSunoノート（件数・変更内容）
- 追加したYouTubeノート（件数・タイトル）
- URL未確認で保留にした項目

## 注意事項

- ファイル名のスペース・特殊文字はアンダースコアに変換
- `suno_song_url` / `youtube_url` が不明な場合は空欄で作成し、制作メモに「要確認」を記載
- `public/` に `.txt` 歌詞ファイルがある新曲は歌詞セクションにも転記する
- Chromeのナビゲートが失敗する場合はユーザーにURLを確認してもらい、方法Bで対応
