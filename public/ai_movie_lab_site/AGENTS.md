# AGENTS.md

このファイルは、このリポジトリで作業するエージェント向けのルールです。

## 適用範囲
- このファイルのルールは `public/ai_movie_lab_site` 配下の作業に適用する。

## 必須ルール
- ユーザー向けの回答は必ず日本語で行う。
- 変更前に、実施内容を1-2文で短く共有する。
- 変更は依頼範囲に限定し、不要な修正を加えない。
- 既存の未コミット変更は勝手に巻き戻さない。
- 破壊的な操作（例: `rm`, `git reset --hard`）は、明示的な依頼がない限り実行しない。
- APIキー・トークンなどの機密情報を新規保存・ログ出力・コミットしない。
- `main` への push や本番デプロイは、ユーザーの明示的な依頼がある場合のみ実行する。

## 実装時の方針
- まず現状確認（ファイル構成、既存設定）を行ってから編集する。
- 単一ファイルの小さな修正は、差分が分かりやすい方法で行う。
- 作業後は、可能な範囲で確認コマンドを実行し、結果を日本語で報告する。
- Markdown/設定ファイルは UTF-8 で編集する（文字化け防止）。

## 出力スタイル
- 簡潔で実務的に書く。
- 結論を先に示し、必要に応じて変更点と確認結果を続ける。

## スキル運用（Remotion）
- リリック動画作成後のプレビュー確認は、`.agent/skills/remotion-preview-launch` を優先して使う。
- `create_lyric_video` / `create_vertical_lyric_video` 実行後は、開発サーバーを直接固定ポートで案内せず、検出されたURLを返す。
- ポートは `3000` 固定前提にしない（`3000-3020` の範囲で確認する）。
- 返却時は `URL / PID / 停止コマンド` を含める。

## 技術スタック

### YouTube Data API v3
- **ON AIR セクション**: YouTube Data API v3 を使用して最新のフル動画（180秒超）を取得・表示
- **APIキー**: Google Cloud Console で管理（HTTPリファラ制限設定済み）
  - 許可ドメイン（例）: `https://ai-movie-lab.netlify.app/*`, `http://localhost:3000/*`
  - ローカル確認で `3001-3020` を使う場合は、使用ポートのリファラも許可設定に追加する。
  - API制限: YouTube Data API v3 のみ
- **フロー**: `channels.list` → `playlistItems.list` → `videos.list` でクォータ効率を最適化 (3ユニット/リクエスト)

### Netlify デプロイ
- **本番URL**: https://ai-movie-lab.netlify.app
- **GitHub連携**: `satoshi19840417/ai-song` リポジトリの `main` ブランチに連携
- **公開ディレクトリ**: `public/ai_movie_lab_site`
- **netlify.toml**: リポジトリルートに設定ファイルあり
- **CLI デプロイ**: `netlify deploy --prod --dir .`（ai_movie_lab_siteフォルダ内で実行）
