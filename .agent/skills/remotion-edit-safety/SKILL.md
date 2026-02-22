---
name: remotion-edit-safety
description: Remotionリリックビデオのコンポーネント編集時に適用する安全チェックリスト。インポート削除ミス、動画再生不具合、スキーマ不整合を防止する。コードを編集・リファクタリングする際に必ず参照する。
---
# Remotion 編集セーフティチェック

Remotion コンポーネント（`*Video.tsx`）を編集した後、以下のチェックを**必ず**実行する。

## 1. インポート整合性チェック（最重要）

機能を削除・リファクタ時に、**同一ファイル内の他コンポーネント**がまだ使っているインポートを消さないこと。

### 手順
1. インポートを削除する**前に** `grep_search` で当該シンボルのファイル内全使用箇所を確認
2. 使用箇所が **0件** のときだけ削除する
3. 特に注意すべきシンボル:
   - `spring`, `interpolate`, `Easing` — 複数コンポーネントで共有されやすい
   - `SPRING_CONFIGS`, `TEXT_SHADOWS`, `FONTS` — ユーティリティ定数

### 悪い例
```tsx
// VerticalLyricLine から spring を消したので import も消す → ❌
// HorizontalLyricLine がまだ spring を使っている！
```

### 良い例
```bash
# 削除前に確認
grep_search("spring", file="SeiShunMouIkkouVideo.tsx")
# → HorizontalLyricLine で使用中 → import は残す
```

## 2. 動画コンポーネント選択

| コンポーネント | 用途 |
|---|---|
| `OffthreadVideo` | **常にこちらを使う**（特に 50MB 超のファイル） |
| `Video` | 使用しない（大きなファイルでブラウザが停止する） |

### ルール
- `<OffthreadVideo>` + 別の `<Audio>` の組み合わせを使う
- `<OffthreadVideo>` には必ず `muted` を付ける（音声は `<Audio>` から再生）
- `<Audio>` に `volume` を渡してフェードイン・フェードアウトを実装

```tsx
// ✅ 正しいパターン
<OffthreadVideo
  src={props.videoSource}
  muted
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
<Audio
  src={props.videoSource}
  volume={audioFadeCurve(fps, durationInFrames, 1, 2)}
/>
```

## 3. スキーマと Data の整合性

- `*Data.ts` のフィールドは `*Video.tsx` の Zod スキーマに**すべて定義**すること
- フィールドを追加・削除したら両方を同時に更新する

## 4. 編集後の最終チェックリスト

- [ ] `grep_search` で削除したシンボルがファイル内で使われていないことを確認
- [ ] `Video` ではなく `OffthreadVideo` を使用している
- [ ] `OffthreadVideo` に `muted` が付いている
- [ ] `Audio` の `volume` にフェードカーブが設定されている
- [ ] IDE の lint エラーが 0 件である
- [ ] `durationInFrames`（Root.tsx）が実際の動画長を超えていない
