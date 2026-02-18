# trend snapshot format

`_trend_snapshot.md` は以下の frontmatter を必須とする:

```yaml
---
schema_version: 1
generated_at_utc: YYYY-MM-DDTHH:MM:SSZ
ttl_days: 3
source_scope: released
source_song_count: <int>
lyrics_analyzed_count: <int>
latest_released_song_id: SNG-YYYY-NNNN
released_index_hash: <sha256_hex>
---
```

## 有効判定

次のいずれかで無効:

- ファイル不存在
- frontmatter 欠落/破損
- `schema_version` 不一致
- `generated_at_utc + ttl_days` 超過（UTC）
- `latest_released_song_id` と現在の released 最新IDが不一致
- `released_index_hash` が現在の `_index.md` 正規化ハッシュと不一致

## released_index_hash 正規化

- 入力: `_index.md` の `## 公開済 (released)` テーブル + `## タグ別索引` 本文
- 改行は LF に統一
- 行末空白を除去
- 連続空行は1行に圧縮
- `released_table + "\n---\n" + tag_index` を UTF-8 で SHA-256
