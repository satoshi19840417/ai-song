---
name: suno-sync-update
description: Suno楽曲管理の同期更新を行うスキル。「sunoを更新」「sunoの曲一覧を更新」「Suno同期」と指示された場合に使用する。Sunoプロフィールから最新曲を取得し、_index.md と 01_Songs/*.md を自動更新する。
---

# Suno同期更新スキル

## 概要

Sunoプロフィールの最新曲情報を取得し、以下を自動更新する：

- `public/suno_PJ/Suno/_index.md` の公開済みテーブル・タグ索引・同期メモ
- `public/suno_PJ/Suno/01_Songs/*.md` の `suno_song_url` / `tags` 補完
- 未登録曲の新規ファイル追加（`SNG-YYYY-NNNN` 連番）
- 未確定マッピングの同期メモ記録

## 前提条件

- Python 3.10+
- `requests` ライブラリ (`pip install requests`)
- 環境変数 `SUNO_COOKIE` にブラウザから取得したCookieを設定済み

### SUNO_COOKIE の取得方法

1. ブラウザで https://suno.com にログイン
2. DevTools → Network → 任意のAPIリクエスト → Request Headers の `cookie` 値をコピー
3. 環境変数に設定: `$env:SUNO_COOKIE = "..."` (PowerShell) または `export SUNO_COOKIE="..."` (bash)

## 実行フロー

### 1. 曲情報取得

```powershell
cd .agent/skills/suno-sync-update/scripts
python fetch_suno_profile.py hypnotizingtonalities0343 --output fetched.json
```

- 全ページを自動ページング取得
- `fetched.json` に保存

### 2. 同期・差分反映

```powershell
python sync_suno_index.py --fetched fetched.json --handle hypnotizingtonalities0343
```

オプション:
- `--dry-run`: ファイル書き込みなしで差分だけ確認
- `--refresh-trends` / `--no-refresh-trends`: 傾向snapshot更新の有効/無効
- `--trend-script <path>`: refreshスクリプトのパス
- `--trend-output <path>`: `_trend_snapshot.md` 出力先
- `--trend-lock-timeout-sec <sec>`: lock待機秒

### 3. 結果確認

スクリプト終了後に表示されるサマリーを確認：

```
=== 同期サマリー ===
  新規追加: N 件
  更新:     N 件
  未確定:   N 件
  傾向サマリ更新: 成功/失敗/スキップ
```

未確定があれば `_index.md` の同期メモを確認して手動対応。

## 判断基準

| 状況 | 処理 |
|------|------|
| URL中のsong idが既存曲と一致 | 既存曲を更新 |
| タイトルが完全一致 | 既存曲を更新 |
| 正規化タイトルが一致（全半角/記号ゆれ等） | 既存曲を更新 |
| 同名タイトルが複数存在 | 未確定として同期メモへ記録 |
| 非公開クリップ | 未確定として同期メモへ記録 |
| 一致なし | 新規曲として追加 |

詳細: `references/mapping-rules.md`

## タグ付与ルール

詳細: `references/tag-policy.md`

## 注意事項

- スクリプトは `_content` (歌詞・スタイル・制作メモ) を変更しない
- 更新対象は frontmatter の `suno_song_url` と `tags`、および `_index.md` の索引ブロック
- 同日2回実行しても安全（冪等）
- 傾向snapshot更新に失敗しても同期本体は失敗扱いにしない（消費側はsnapshot無効時にfallback）
- API仕様変更でエラーが出た場合は `fetched.json` の内容と `_index.md` 同期メモを確認
