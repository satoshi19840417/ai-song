# Plan: Sora2 プロンプト提案スキル作成

## Context

Sora2動画生成用のプロンプトを2段階で作成するスキル。
既存の `create_sora_prompt` は概念を入力して1案を直接作成するが、
今回は**汎用コンセプト入力 → 複数方向性案提示 → ユーザー選択 → 詳細化**の2段階フローを実現する。

## 目標

ユーザーが任意のビデオコンセプトを入力すると：
1. 3〜5つの方向性案（短いドラフト）を比較提示
2. ユーザーが選択した案を詳細な `prompt.md` に仕上げる

## 既存スキルとの差分

| 項目 | 既存 `create_sora_prompt` | 新規スキル |
|------|--------------------------|-----------|
| 入力 | ビデオコンセプト | ビデオコンセプト（同じ） |
| フロー | 1段階（直接詳細作成） | 2段階（提案→選択→詳細化） |
| 出力数 | 1案 | 複数案提示 → 1案詳細 |
| 用途 | 明確なビジョンがある時 | アイデアを探索したい時 |

## 実装手順

### 1. スキルディレクトリ作成

```
.agent/skills/propose-sora-prompts/
├── SKILL.md
└── references/
    └── sora2-prompt-guide.md
```

### 2. SKILL.md 作成

**frontmatter:**
```yaml
---
name: propose-sora-prompts
description: Sora2動画生成用のプロンプト案を複数提案し、選択した案を詳細化する。「Sora用プロンプト案を出して」「動画プロンプトを提案して」「Sora2のアイデアが欲しい」など複数案を見たい時に使用。
---
```

**ボディ構成（2段階フロー）:**

#### Stage 1: 方向性案の提案（3〜5案）
- ユーザーのコンセプトを解析
- 異なるアプローチで3〜5案を生成（例：シネマティック、ミニマル、アニメ風など）
- 各案は短くまとめる（タイトル + 1〜2行の方向性説明 + 代表的な映像スタイル）
- `AskUserQuestion` でどの案を詳細化するか確認

#### Stage 2: 選択案の詳細化
- 既存の `create_sora_prompt` と同じ出力形式で `prompt.md` を生成
- 保存先: `sora_projects/<project_name>/prompt.md`

### 3. references/sora2-prompt-guide.md 作成

Sora2プロンプト品質を高めるガイドライン:
- カメラアングル・動きの語彙集
- ライティング表現パターン
- 雰囲気・テクニカルキーワード集（photorealistic, cinematic, 8k等）
- 時間（秒）別の構成テンプレート

## 変更ファイル

| ファイル | 操作 |
|---------|------|
| `.agent/skills/propose-sora-prompts/SKILL.md` | 新規作成 |
| `.agent/skills/propose-sora-prompts/references/sora2-prompt-guide.md` | 新規作成 |

## 出力形式（Stage 1 例）

```
## 🎬 Sora2 プロンプト提案 3案

### 案A: シネマティック・ドラマ
- **方向性**: 映画的な重厚感、ドリーショット、黄金時間帯の光
- **スタイル**: photorealistic, golden hour, dramatic

### 案B: ミニマル・詩的
- **方向性**: 静寂と動きの対比、長回し、余白を活かした構図
- **スタイル**: minimalist, contemplative, soft lighting

### 案C: ダイナミック・アクション
- **方向性**: 手持ちカメラ的な臨場感、速いカット、エネルギッシュ
- **スタイル**: dynamic, handheld, energetic
```

## 検証手順

1. スキル発動トリガー確認:
   - 「Sora用プロンプト案を出して」→ propose-sora-prompts が起動すること
   - 「Soraプロンプトを作って」→ 従来の create_sora_prompt が起動すること（差別化確認）

2. Stage 1 確認:
   - 3〜5案が生成され、各案が適切に差別化されていること

3. Stage 2 確認:
   - 選択後に `sora_projects/<project_name>/prompt.md` が正しい形式で生成されること
   - 既存の create_sora_prompt と同じ出力フォーマット

4. references ファイルが Stage 2 で参照されること（SKILL.md 内で明示）
