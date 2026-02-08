# suno更新スキル化 計画書

## 1. 目的

`「sunoを更新」` という指示だけで、以下の更新作業を再現可能にする。

- Sunoプロフィールから最新曲情報を取得
- `public/suno_PJ/Suno/_index.md` の一覧・タグ索引を更新
- 既存曲ファイルの `suno_song_url` / `tags` を補完
- 未登録曲の `01_Songs/SNG-....md` を自動追加
- 未確定マッピング（改題/非公開/同名）を同期メモへ明示

## 2. 完了条件（Definition of Done）

- `sunoを更新` 実行後、`_index.md` と `01_Songs` が整合している
- 最新取得分について、次のいずれかが必ず行われる
  - 既存曲へ URL/タグ反映
  - 新規曲として追加
  - 未確定として同期メモへ記録
- 手作業なしで再実行できる（同日2回実行しても破綻しない）

## 3. 対象範囲

### In Scope

- Suno APIからのプロフィール曲取得（ページング対応）
- タイトル正規化による既存曲マッチング
- 新規ID採番（`SNG-YYYY-NNNN`）
- `_index.md` の以下更新
  - 公開済みテーブル
  - 同期メモ
  - タグ別索引（ジャンル/テーマ）

### Out of Scope（初版）

- 歌詞全文の自動転記
- YouTube管理ファイルまでの自動連携
- 複数Sunoアカウント同時同期

## 4. スキル仕様（トリガー設計）

### スキル名（案）

`suno-sync-update`

### `SKILL.md` の description（要件）

- 「Suno楽曲管理の同期更新」を明記
- トリガー語を明示
  - `sunoを更新`
  - `sunoの曲一覧を更新`
  - `Suno同期`
- 対象ファイルを明示
  - `public/suno_PJ/Suno/_index.md`
  - `public/suno_PJ/Suno/01_Songs/*.md`

## 5. 生成物構成（予定）

```
.agent/skills/suno-sync-update/
  SKILL.md
  scripts/
    fetch_suno_profile.py
    sync_suno_index.py
  references/
    mapping-rules.md
    tag-policy.md
```

## 6. 実装方針

### 6.1 取得

- API:
  - `GET https://studio-api.prod.suno.com/api/profiles/{handle}?page={n}&playlists_sort_by=created_at&clips_sort_by=created_at`
- 取得項目:
  - `title`, `id`, `created_at`, `display_tags`, `metadata.tags`, `status`

### 6.2 マッチング

- 優先順位:
  1. `suno_song_url` の song id 一致
  2. タイトル完全一致
  3. 正規化一致（全半角/記号ゆれ/大文字小文字/括弧ゆれ）
- 一致しない場合:
  - 新規曲として追加
- 曖昧な場合:
  - `_index.md` 同期メモへ「候補」または「未確定」を記録

### 6.3 タグ付与

- 優先データソース:
  1. `display_tags`
  2. `metadata.tags`
  3. 既存歌詞・説明から補完（保守的に最小限）
- `tags` は「ジャンル + テーマ」混在で保持
- `_index.md` 表示タグは先頭2件を使用（可読性優先）

### 6.4 ファイル更新

- 既存曲:
  - `suno_song_url` 追記/更新
  - `tags` 補完
- 新規曲:
  - `_template_song.md` 構造準拠で生成
  - `status: released`
  - `created/updated`: 実行日
  - Lyricsセクションはプレースホルダ
- `_index.md`:
  - 公開済みに追記
  - 作業中テーブルは変更しない
  - タグ別索引を再計算
  - 同期メモに取得日時・件数・未確定を記録

## 7. 検証計画

- 技術検証:
  - スクリプト単体（API取得、ID採番、マッチング）
  - 差分検証（壊れたリンク、重複ID、重複URL）
- 受け入れ検証:
  - `sunoを更新` 実行後に次を確認
    - `01_Songs` のID連番
    - `_index.md` 表とファイル実体一致
    - タグ索引に新曲が反映
    - 未確定ケースが同期メモへ出力

## 8. 実施ステップ

1. スキル雛形作成（`SKILL.md` + `scripts/` + `references/`）
2. `fetch_suno_profile.py` 実装（ページング/JSON正規化）
3. `sync_suno_index.py` 実装（差分計算/更新）
4. `SKILL.md` に実行フローと判断基準を記述
5. テスト実行（現行Sunoデータで1回）
6. 出力差分レビュー後に調整

## 9. リスクと対策

- 改題・同名による誤マッチ:
  - URL一致を最優先、曖昧は自動確定しない
- API仕様変更:
  - 取得失敗時はエラー終了＋同期メモへ理由記録
- 文字化け:
  - UTF-8前提で読み書き統一
- 既存手編集の破壊:
  - 更新対象をfrontmatterと索引ブロックに限定

## 10. 次アクション

この計画書を承認後、`suno-sync-update` スキル本体の実装に着手する。
