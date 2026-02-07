# Remotion確認起動プロセス スキル化計画書（改訂版）

## 1. 目的
- リリック動画作成後に、Remotion Studio を確実に起動してプレビュー確認できるようにする。
- 起動確認・URL案内・停止方法・失敗時対処を標準化し、毎回同じ品質で実行できるようにする。

## 2. 方針（確定）
- 新規スキルを作成する。
- スキル名: `remotion-preview-launch`
- 配置先: `.agent/skills/remotion-preview-launch/`
- 既存スキル（`create_lyric_video` / `create_vertical_lyric_video`）の最終ステップから本スキルを呼ぶ構成にする。

## 3. 前提確認
- `init_skill.py` は存在確認済み。
  - パス: `.agent/skills/skill-creator/scripts/init_skill.py`
- したがって、Phase 2 は `skill-creator` の標準手順として `init_skill.py` を使用する。

## 4. 対象ユースケース
- 「開発環境を起動してRemotionを確認したい」
- 「リリック動画作成後に Studio で確認したい」
- Remotion が既に起動済みか不明
- 3000番ポートが埋まっており、別ポートで起動される
- `spawn EPERM` など環境依存エラーが発生する

## 5. スキル責務（スコープ）
- Remotion Studio の起動状態を確認する。
- 未起動なら `npm run dev` を起動する。
- 実際のアクセスURLを返す（例: `http://localhost:3001`）。
- 結果を固定フォーマットで返す（URL、PID、ログ、停止コマンド）。
- 必要に応じてブラウザ確認フローを実行する。

## 6. 成果物
- `SKILL.md`
  - 日本語・英語の両方を含む trigger description を記載
  - 実行手順（確認→起動→疎通→報告）
  - 失敗時フロー（EPERM / ポート競合 / タイムアウト）
- `scripts/start_remotion_dev.ps1`
  - バックグラウンド起動、ログ保存、URL抽出、PID返却
- `scripts/check_remotion_dev.ps1`
  - 稼働中URL、PID、HTTP疎通確認
- `scripts/stop_remotion_dev.ps1`
  - PID指定停止
- `references/troubleshooting.md`
  - EPERM原因別の分岐対応を明文化
- `examples/`（任意だが推奨）
  - `success-output.md`: 正常起動時の期待出力サンプル
  - `already-running-output.md`: 起動済み判定時の期待出力サンプル
  - `failure-output.md`: EPERM/タイムアウト時の要約出力サンプル
  - `sample-log-tail.txt`: ログ末尾の解析例

## 7. 実行仕様（ワークフロー）
1. 起動済み判定
   - `localhost:3000-3020` を走査
   - Remotion応答（HTTP 200 + Remotion特有文字列）を確認
2. 未起動時の起動
   - `npm run dev` をバックグラウンド起動
   - `remotion-dev.out.log` / `remotion-dev.err.log` を記録
3. URL確定
   - ログ `Server ready - Local:` から抽出
   - 抽出失敗時はポート走査 + HTTPチェックで確定
4. ブラウザ確認（オプション）
   - `browser_subagent` が利用可能なら:
     - URLオープン
     - 必要に応じてスクリーンショット取得で視覚確認
   - 利用不可なら:
     - URLを返して手動確認へフォールバック
5. 結果返却
   - URL / PID / ログパス / 停止コマンドを返す

## 8. EPERM・失敗時対処（詳細化）
- EPERM発生時は、以下を順に確認する。
  - 権限不足（管理者権限/UAC）: 権限付き再実行
  - セキュリティ製品ブロック（AV/EDR）: ログに基づく例外設定案内
  - プロセス/ファイルロック: 競合プロセス特定と停止
  - npm/node破損: 依存再インストール案内
- タイムアウト時:
  - 標準出力・標準エラー末尾を要約して返す
  - 次アクション（再実行、ポート固定、手動起動）を提示

## 9. SKILL.mdトリガー設計（日本語+英語）
- `description` 例（方針）:
  - 日本語: 「Remotion Studio を起動・確認し、プレビューURLとPIDを返す」
  - 英語: 「Start/check Remotion Studio and return preview URL, PID, and logs after lyric video creation or when preview is requested」
- 日本語/英語どちらの依頼でも発火しやすくする。

## 10. 既存スキル連携（具体化）
- `create_lyric_video/SKILL.md` の最終ステップを更新:
  - 「完了後 `remotion-preview-launch` を使用してプレビュー確認」を明記
- `create_vertical_lyric_video/SKILL.md` も同様に更新
- 連携方式:
  - A案: 最終ステップでスキル名を明示して委譲（推奨）
  - B案: 手順を直接複製（非推奨、重複管理になるため）

## 11. 受け入れ基準
- 起動済みなら重複起動せず既存URLを返す。
- 未起動なら 60 秒以内にURLを返す。
- 3000-3020 の範囲でポート変動に対応できる。
- EPERM原因別の対処が `references/troubleshooting.md` に記載されている。
- 出力形式が毎回同じ（URL / PID / ログ / 停止方法）。
- 既存2スキルからの連携記述が追加されている。

## 12. 実装フェーズ
- Phase 1: スキル仕様確定（トリガー、返却フォーマット、連携方式）
- Phase 2: 雛形作成（`python .agent/skills/skill-creator/scripts/init_skill.py remotion-preview-launch --path .agent/skills --resources scripts,references`）
- Phase 3: スクリプト実装（start/check/stop）
- Phase 4: `SKILL.md` 記述（日本語+英語トリガー、短い手順）
- Phase 5: `quick_validate.py` 実行と起動確認テスト
- Phase 6: `create_lyric_video` / `create_vertical_lyric_video` 連携追記

## 13. 次アクション（承認後）
1. `skill-creator` の `init_skill.py` で `remotion-preview-launch` 雛形を生成する。
2. `scripts/start_remotion_dev.ps1` を先に実装し、URL/PID返却を動作確認する。
3. `SKILL.md` を作成し、最後に既存2スキルへ連携追記する。
