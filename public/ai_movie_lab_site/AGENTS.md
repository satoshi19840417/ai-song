# AGENTS.md

このファイルは、このリポジトリで作業するエージェント向けのルールです。

## 必須ルール
- ユーザー向けの回答は必ず日本語で行う。
- 変更前に、実施内容を1-2文で短く共有する。
- 変更は依頼範囲に限定し、不要な修正を加えない。
- 既存の未コミット変更は勝手に巻き戻さない。
- 破壊的な操作（例: `rm`, `git reset --hard`）は、明示的な依頼がない限り実行しない。

## 実装時の方針
- まず現状確認（ファイル構成、既存設定）を行ってから編集する。
- 単一ファイルの小さな修正は、差分が分かりやすい方法で行う。
- 作業後は、可能な範囲で確認コマンドを実行し、結果を日本語で報告する。

## 出力スタイル
- 簡潔で実務的に書く。
- 結論を先に示し、必要に応じて変更点と確認結果を続ける。

## 技術スタック

### YouTube Data API v3
- **ON AIR セクション**: YouTube Data API v3 を使用して最新のフル動画（180秒超）を取得・表示
- **APIキー**: Google Cloud Console で管理（HTTPリファラ制限設定済み）
  - 許可ドメイン: `https://ai-movie-lab.netlify.app/*`, `http://localhost:3000/*`
  - API制限: YouTube Data API v3 のみ
- **フロー**: `channels.list` → `playlistItems.list` → `videos.list` でクォータ効率を最適化 (3ユニット/リクエスト)

### Netlify デプロイ
- **本番URL**: https://ai-movie-lab.netlify.app
- **GitHub連携**: `satoshi19840417/ai-song` リポジトリの `main` ブランチに連携
- **公開ディレクトリ**: `public/ai_movie_lab_site`
- **netlify.toml**: リポジトリルートに設定ファイルあり
- **CLI デプロイ**: `netlify deploy --prod --dir .`（ai_movie_lab_siteフォルダ内で実行）
