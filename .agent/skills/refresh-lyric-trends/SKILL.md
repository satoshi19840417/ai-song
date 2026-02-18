---
name: refresh-lyric-trends
description: released楽曲から歌詞傾向スナップショットを再生成する。`_trend_snapshot.md` を更新し、`propose-lyric-directions` / `compose-lyrics` の高速参照を支える。ユーザーが「傾向更新して」「歌詞傾向を再生成」「過去曲の傾向サマリを更新」と依頼した時に使用。
---

# refresh-lyric-trends

## 概要

`public/suno_PJ/Suno/01_Songs/SNG-*.md` と `public/suno_PJ/Suno/_index.md` から、`public/suno_PJ/Suno/_trend_snapshot.md` を再生成する。

- 対象は `status: released` のみ
- TTL は3日（UTC基準）
- 無効/欠損時は消費側がフォールバック可能な前提で、生成は冪等に行う

## 実行コマンド

```powershell
cd my-remotion-01/.agent/skills/refresh-lyric-trends/scripts
python refresh_lyric_trends.py
```

オプション:

- `--songs-dir <path>`: 解析対象の `01_Songs` ディレクトリ
- `--index <path>`: `_index.md` パス
- `--out <path>`: 出力先 snapshot
- `--scope released`: 現在は `released` 固定
- `--recent-window 12`: 直近加重の曲数
- `--lock-timeout-sec 10`: ロック待機秒
- `--dry-run`: 出力ファイルを書き換えずに集計結果だけ確認

## 期待結果

- 成功時:
  - `_trend_snapshot.md` が更新される
  - ログに `released_index_hash` / `latest_released_song_id` が出る
- 失敗時:
  - 例外要因（パース不可、lock timeoutなど）が表示される
  - 既存 snapshot は破壊しない

## 運用ルール

- `suno-sync-update` からの自動呼び出しが主経路
- 手動再生成要求が来た場合は本スキルを直接実行
- 消費側で snapshot 無効が判明した時は、処理継続を優先しつつ再生成をベストエフォートで試行
