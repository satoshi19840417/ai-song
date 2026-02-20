# Vault Schema — suno_PJ

## Vault パス
`C:\Users\sench\remotion-test-work\my-remotion-01\public\suno_PJ`

## フォルダ構成
```
suno_PJ/
├── Suno/
│   ├── 01_Songs/          ← 曲ノート (SNG-YYYY-XXXX_タイトル.md)
│   ├── 02_StyleLibrary/
│   ├── 03_LyricsLibrary/
│   ├── 99_Exports/
│   └── _index.md          ← Sunoインデックス
└── YouTube/
    ├── 01_Videos/         ← 動画ノート (VID-YYYY-XXXX_タイトル.md)
    ├── 02_Templates/
    ├── 99_Exports/
    └── _index_youtube.md  ← YouTubeインデックス
```

## Sunoノート フロントマター
```yaml
---
type: suno_song
id: SNG-2026-XXXX
title: タイトル
status: released | draft
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [タグ1, タグ2]
suno_song_url: https://suno.com/song/UUID
---
```

## YouTubeノート フロントマター
```yaml
---
type: youtube_video
id: VID-2026-XXXX
title: タイトル
status: uploaded | draft
publish_date: YYYY-MM-DD
youtube_url: https://www.youtube.com/watch?v=VIDEO_ID
tags: [Remotion, Suno, LyricVideo]
related_suno_id: SNG-2026-XXXX
---
```

## 採番ルール
- SNG-ID: `Suno/01_Songs/` 内の最大ID + 1
- VID-ID: `YouTube/01_Videos/` 内の最大ID + 1
- ファイル名: `SNG-2026-XXXX_タイトル.md`（スペース→アンダースコア）

## ソースURL
- Suno: https://suno.com/@hypnotizingtonalities0343
- YouTube: https://www.youtube.com/@AImovieLab2025
