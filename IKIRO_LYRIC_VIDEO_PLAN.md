# 「生きろ」リリック動画 制作計画書

## 1. 目的
- `public/生きろ.mp4` を背景映像兼音源として使用し、`public/生きろ.lrc` のタイムタグに同期したリリック動画を Remotion で制作する。
- 歌手情報は `Rin` としてクレジット表示する。
- 既存プロジェクト構成（`src/HelloWorld/*Video.tsx` + `*Data.ts` + `src/Root.tsx`）に沿って実装し、保守しやすい形で納品する。

## 2. 入力素材と現状確認
- 歌詞ファイル: `public/生きろ.lrc`（UTF-8で読取確認済み）
- 動画素材: `public/生きろ.mp4`（存在確認済み）
- 動画長: `00:03:52`（232秒、Windowsメタデータ取得）
- 最終歌詞: `[03:43.51]`（223.51秒）
- 既存実装:
  - 楽曲ごとに `*Data.ts` と `*Video.tsx` を分離
  - `src/Root.tsx` に `<Composition>` を追加して Studio / render 対応
  - `npx remotion render` 実行可能

## 3. 実装方針
- ベースは `src/HelloWorld/SakebeVideo.tsx` 系の「映像 + Audio + 歌詞Sequence」方式を採用する。
- 新規ファイルを作成して独立管理する。
  - `src/HelloWorld/IkiroData.ts`
  - `src/HelloWorld/IkiroVideo.tsx`
- `IkiroData.ts` に以下を明示的に持たせる。
  - `title`, `artist: "Rin"`, `videoSource`, `lyrics`
  - `emphasisLines`: 強調対象の時刻/文言
  - `sections`: A/B/サビごとの表示パラメータ
- 初期デザインは横書きをデフォルトとし、必要な箇所だけ縦書きを使えるよう拡張可能な設計にする。

## 4. データ設計（改善反映）

### 4.1 セクション定義（楽曲構成）
- 構成を以下のように区切り、セクションごとに見た目を変える。
  - `A1`: 00:11.42-
  - `B1`: 00:44.97-
  - `サビ1`: 01:02.50-
  - `A2`: 01:36.05-
  - `B2`: 02:03.02-
  - `サビ2`: 02:04.21-
  - `ブリッジ`: 02:43.34-
  - `ラスサビ`: 03:13.60-
- セクションパラメータ例:
  - Aメロ: overlay 0.20 / fontScale 0.95
  - Bメロ: overlay 0.28 / fontScale 1.00
  - サビ: overlay 0.40 / fontScale 1.20

### 4.2 強調行リスト
- `emphasisLines` に複数回の「生きろ！」を登録して管理する。
- 登録候補（`.lrc`準拠）:
  - `[01:02.50] 生きろ！`
  - `[01:13.68] 生きろ！`
  - `[02:04.21] 生きろ！`
  - `[02:15.53] 生きろ！`
  - `[03:13.60] 生きろ！`

### 4.3 縦書きオプション
- 既定は横書き。
- オプションで `layoutMode: "horizontal" | "vertical"` を追加可能にする。
- 縦書き適用は全編ではなく、以下の限定適用を第一候補とする。
  - サビの「生きろ！」
  - 終盤の要所（例: ラスサビ）

## 5. 作業フェーズ

### Phase 1: データ整形
- `生きろ.lrc` を行単位で検証し、`lyrics` 配列へ変換
- `emphasisLines` と `sections` を `IkiroData.ts` に定義
- 成果物: `src/HelloWorld/IkiroData.ts`

### Phase 2: 表示コンポーネント作成
- `IkiroVideo` スキーマを定義（`fontSize`, `videoSource`, `title`, `artist`, `lyrics`, `emphasisLines`, `sections`, `layoutMode`）
- 現在フレームの時刻から所属セクションを判定し、overlay と文字サイズ補正を切り替える
- 基本アニメーション:
  - 入り: 0.3-0.6秒フェードイン
  - 出: 次行切替時フェードアウト
- `emphasisLines` 一致時に拡大・発光を適用
- 成果物: `src/HelloWorld/IkiroVideo.tsx`

### Phase 3: Composition 登録と尺確定
- `src/Root.tsx` に `Ikiro` Composition を追加
- `defaultProps` は `IkiroData.ts` を参照
- 尺設定ルール:
  - `videoFrames = 232 * 30 = 6960`
  - `lastLyricFrames = 223.51 * 30 ≒ 6705`
  - `durationInFrames = max(videoFrames, lastLyricFrames + 余韻)` を採用
- 今回の推奨: `durationInFrames = 6960`（動画尺優先）

### Phase 4: プレビュー調整
- `remotion studio` で以下を確認
  - A/B/サビ切替時に演出差が視覚的に分かるか
  - サビ「生きろ！」が十分に目立つか
  - ラスト歌詞が切れずに表示されるか
  - 横書き版が成立するか（必要時のみ縦書き切替確認）

### Phase 5: 本番レンダリング
- 出力例: `out/生きろ_lyric.mp4`
- 生成コマンド（想定）:
  - `npx remotion render src/index.ts Ikiro out/生きろ_lyric.mp4 --codec=h264`

## 6. 品質チェック基準
- 同期精度: 主要歌詞で体感ズレが 0.2 秒以内
- 可読性: 明暗の強い背景でも文字が埋もれない
- 構成演出: A/B/サビの差分が過剰でなく明確
- 書き出し品質: 1920x1080 / 30fps で破綻なく再生できる

## 7. リスクと対策
- 日本語ファイル名参照:
  - `staticFile("生きろ.mp4")` を優先し、必要時は英数字別名へ退避
- フォント差異:
  - `'Noto Sans JP', sans-serif` などフォールバックを指定
- 長尺末尾切れ:
  - `durationInFrames` を動画尺ベースで固定して回避
- 縦書き可読性低下:
  - 全編適用せず、強調行限定で段階導入

## 8. 完了条件
- `Ikiro` Composition が Studio で再生可能
- `生きろ.lrc` の全行が表示される
- `artist: Rin` がデータに反映される
- `out/生きろ_lyric.mp4` が正常出力され、冒頭〜末尾まで同期確認済み
