---
name: create_lyric_video
description: Generate a Remotion lyric video from files in public/suno_PJ/new
---

# Create Lyric Video Skill

`public/suno_PJ/new` の `.lrc + media(.mp4/.mp3/.wav)` から、Remotion用の歌詞動画コンポーネントを自動生成するスキル。

## Quick Start (推奨)

実行ディレクトリ: `my-remotion-01`

```powershell
# 1) 新規ペア検出（確認）
powershell -ExecutionPolicy Bypass -File .agent/skills/create_lyric_video/scripts/detect_new_media_pair.ps1

# 2) 本実行（自動検出 + 生成 + Root登録 + build）
powershell -ExecutionPolicy Bypass -File .agent/skills/create_lyric_video/scripts/run_create_lyric_video.ps1 -SongName YukitokenoLoveLetter

# 3) 完了ファイル移動（必要時）
powershell -ExecutionPolicy Bypass -File .agent/skills/create_lyric_video/scripts/run_create_lyric_video.ps1 -SongName YukitokenoLoveLetter -MoveCompleted
```

`SongName` は TypeScript 識別子に使うため **PascalCase**（英数字）で指定する。

## Workflow

1. **入力ペアの検出**
   - `detect_new_media_pair.ps1` で `public/suno_PJ/new` を走査。
   - `.lrc` と同名（または prefix 一致）の media を選ぶ。

2. **生成パイプライン実行**
   - `run_create_lyric_video.ps1` を使用。
   - 内部で以下を実行:
     - `scripts/New-LyricVideo.ps1`
     - `scripts/parse_lrc_to_data.js`
     - `scripts/Add-Composition.ps1`
     - （必要時）`scripts/Move-CompletedFiles.ps1`
   - テンプレートは `templates/LyricVideoTemplate.tsx` を使う。

3. **出力確認**
   - 生成先:
     - `src/HelloWorld/[SongName]Data.ts`
     - `src/HelloWorld/[SongName]Video.tsx`
   - `src/Root.tsx` に Composition が追記される。
   - 既存同名ファイルがある場合は停止（`-Force` が必要）。

4. **プレビュー起動（必須）**
   - `remotion-preview-launch` スキルを必ず使う。
   - 固定ポートを前提にせず、検出された URL/PID を返す。

## Command Reference

```powershell
# 自動検出結果だけ確認
powershell -ExecutionPolicy Bypass -File .agent/skills/create_lyric_video/scripts/run_create_lyric_video.ps1 -DryRun

# buildを省略して生成
powershell -ExecutionPolicy Bypass -File .agent/skills/create_lyric_video/scripts/run_create_lyric_video.ps1 -SongName SampleSong -SkipBuild

# 明示入力で生成
powershell -ExecutionPolicy Bypass -File .agent/skills/create_lyric_video/scripts/run_create_lyric_video.ps1 `
  -SongName SampleSong `
  -LrcFile "public/suno_PJ/new/sample.lrc" `
  -MediaFile "public/suno_PJ/new/sample.mp4"
```

## Failure Notes

- 日本語ファイル名から `SongName` を自動推定できない場合があるため、その場合は `-SongName` を明示する。
- `public/suno_PJ/new` に `.lrc` だけ存在し media が無い場合はエラー終了する。
- 失敗時は `scripts/*.backup` を確認し、必要に応じて復元する。

## Animation Best Practices Reference

For advanced patterns, refer to `remotion-best-practices` skill:
- **Spring Animations**: Use `spring()` instead of linear `interpolate()` for natural motion.
- **Easing Curves**: Use `Easing.inOut(Easing.quad)` for smooth transitions.
- **No CSS Animations**: CSS transitions/animations are FORBIDDEN in Remotion.
- **Frame-based**: All animations must be driven by `useCurrentFrame()`.

See: `.agent/skills/remotion-best-practices/rules/` for detailed patterns.

## Usage

When the user asks to "create a lyric video" or "process new songs", invoke this skill.
Always verify build status and launch preview using `remotion-preview-launch`.
