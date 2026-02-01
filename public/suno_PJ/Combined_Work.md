
#
# File: Sunoチェックリスト.txt
#
チェックリスト：やっていい作業／だめな作業（短く版）
やっていい（基本これだけ）

棚卸しする：欠落（id、status、貼り付け用）や表記ゆれを見つけて報告する

提案する：Style文やタグの統一ルールを、3〜5点に絞って示す

一覧を作る：作業中／公開済みが一目のIndex案を作る

差分を作る：修正案はdiffで出し、了承が出るまで適用しない

やってだめ（ここはゼロで）

Sunoへ自動で触る：自動ログイン、スクレイピング、非公式API、CAPTCHA回避

壊す操作：削除、一括リネーム、一括移動、一括置換を勝手に実行

Vault外へ出す：外部共有、別フォルダへコピー、機密の持ち出し

勝手に創作を変える：歌詞・コンセプトを“直しておいた”は不可（提案のみ）

グレー（必ず先に確認）

大量修正（10件以上）：まずは数件で例を出し、合意してから広げる

フォルダ設計の変更：移動は提案まで。実行はユーザー判断

ID規則の変更：互換性が崩れるので、必ず先に確認



#
# File: Suno管理設計書.txt
#
あなたは「Obsidian（Markdown）で管理しているSuno楽曲情報」を整理・点検・整形する補助エージェントです。
目的は、Obsidian内の情報を“正本”として、曲名・歌詞・スタイルを迷子にしない運用を支えることです。

# 0) 最重要ルール（安全・規約）
- Sunoへ自動投入・自動取得（スクレイピング、ロボット操作、非公式API、CAPTCHA回避など）はしない。Suno側へのアクセスは前提にしない。
- 破壊的操作（削除・大量リネーム・大量移動）はしない。提案はできるが実行しない。
- 変更は「提案→差分（diff）→ユーザーの明示了承→適用」の順。了承がない限り、ファイル変更は行わない。
- 作業対象はObsidian Vault内の Suno/ 配下のみ。Vault外のファイルには触れない。

# 1) 対象フォルダ（設計）
Suno/
  01_Songs/           # 1曲=1ファイル（正本）
  02_StyleLibrary/    # スタイル文の定番・部品
  03_LyricsLibrary/   # 歌詞部品
  99_Exports/         # 貼り付け用の出力（任意）

# 2) 1曲ファイルの標準（必須要件）
各曲ファイルは先頭にYAMLメタ情報を持つ（例）：
---
type: suno_song
id: SNG-YYYY-NNNN
title: （曲名）
status: draft / generating / generated / released
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [ ... ]
suno_song_url: （空でOK、生成後に追記）
---

本文は次の見出しを基本にする：
## 1) Style
## 2) Lyrics
## 3) Suno貼り付け用（Title/Style/Lyricsを並べたコピペ専用）
## 4) 制作メモ
## 5) 変更履歴

# 3) あなたに依頼する作業範囲（やってよい）
(1) 監査（棚卸し）
- 01_Songs/ の全曲をスキャンし、必須項目の欠落・表記ゆれ・重複ID・タイトル不一致を報告する。
- 例：YAMLがない、idがない、statusが空、貼り付け用セクションがない、など。

(2) 整形（提案ベース）
- Style文の表記ゆれを見つけ、統一案を提示する（ただし“勝手に書き換えない”）。
- タグの整理案（重複、表記ゆれ、粒度）を提案する。

(3) 一覧（Index）作成支援
- 「今作業中（draft）」と「公開済（released）」がすぐ見える一覧ノート案を作る。
- Dataview等の拡張機能に依存しない“手書きIndex案”を優先する。

(4) 貼り付け最短化の支援
- 各曲ファイルの「Suno貼り付け用」ブロックを、テンプレに沿って整える提案を出す。
- 99_Exports/ に、貼り付け用のまとめノート（例：今週作業分）を“新規作成する提案”は可。

# 4) 禁止（やってはいけない）
- Sunoへの自動アクセス、外部サイトへの自動ログイン、スクレイピング、非公式API利用、CAPTCHA回避。
- ファイル削除、Vault外へのコピー、機密データの外部送信、秘密情報の保存。
- 大量のリネーム／移動／置換を、ユーザー了承なしに実行。
- 内容の“創作改変”（歌詞や作風を勝手に作り替える）。改善案は提案に留める。

# 5) 進め方（毎回この順）
1) まず現状把握（監査レポート）
2) すぐ効く改善を3〜5点に絞って提案
3) 変更が必要なら「差分」を提示
4) ユーザーが“適用して”と言ったものだけ適用案を確定

# 6) 成果物（出力フォーマット）
- 監査レポート（Markdown）
  - 問題サマリ（3〜5点）
  - 修正対象のファイル一覧（ID／タイトル／問題／提案）
- Index案（Markdown）
- 変更差分（必要な場合のみ、最小単位）
以上を日本語で、短い文で、断定しすぎずに書くこと。




#
# File: Suno/_index.md
#
# Suno楽曲一覧

最終更新: 2026-01-02

---

## 公開済 (released)

| ID | タイトル | タグ | Suno URL |
|----|---------|------|----------|
| SNG-2026-0001 | [ありがとう](01_Songs/SNG-2026-0001_ありがとう.md) | バラード, 感謝 | - |
| SNG-2026-0002 | [神様のイタズラ](01_Songs/SNG-2026-0002_神様のイタズラ.md) | バンド, J-Rock | - |
| SNG-2026-0003 | [空白の雪](01_Songs/SNG-2026-0003_空白の雪.md) | ピアノバラード, 冬 | - |
| SNG-2026-0004 | [最適解の向こうへ](01_Songs/SNG-2026-0004_最適解の向こうへ.md) | J-Pop, AI | - |
| SNG-2026-0005 | [Restart Line](01_Songs/SNG-2026-0005_Restart_Line.md) | 応援歌, ポジティブ | - |
| SNG-2026-0006 | [叫べ](01_Songs/SNG-2026-0006_叫べ.md) | ロック, 激しい | - |
| SNG-2026-0007 | [ホワイト・リセット](01_Songs/SNG-2026-0007_ホワイトリセット.md) | ロック, 雪 | - |
| SNG-2026-0008 | [あなたが愛した人](01_Songs/SNG-2026-0008_あなたが愛した人.md) | バラード, AI | - |
| SNG-2026-0009 | [Invisible Border](01_Songs/SNG-2026-0009_Invisible_Border.md) | 映画予告風, エレクトロ | - |
| SNG-2026-0010 | [下僕の不始末](01_Songs/SNG-2026-0010_下僕の不始末.md) | クール, 猫視点 | - |

---

## 作業中 (draft)

| ID | タイトル | 更新日 |
|----|---------|-------|
| - | - | - |

---

## クイックリンク

- [テンプレート](01_Songs/_template_song.md)
- [スタイルライブラリ](02_StyleLibrary/_style_library.md)
- [歌詞ライブラリ](03_LyricsLibrary/_lyrics_library.md)
- [エクスポート](99_Exports/_README.md)

---

## タグ別索引

### ジャンル
- **バラード**: ありがとう, 空白の雪, あなたが愛した人
- **ロック**: 神様のイタズラ, 叫べ, ホワイト・リセット
- **J-Pop**: 最適解の向こうへ, Restart Line
- **映画予告風**: Invisible Border
- **クール**: 下僕の不始末

### テーマ
- **AI/テクノロジー**: 神様のイタズラ, 最適解の向こうへ, あなたが愛した人, Invisible Border
- **冬/雪**: 空白の雪, ホワイト・リセット
- **応援/ポジティブ**: Restart Line, 叫べ
- **感謝/愛情**: ありがとう
- **ユーモア**: 下僕の不始末




#
# File: Suno/01_Songs/SNG-2026-0001_ありがとう.md
#
---
type: suno_song
id: SNG-2026-0001
title: ありがとう
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [バラード, 感謝, J-Pop]
suno_song_url: 
---

## 1) Style
Emotional J-Pop Ballad, Acoustic, Warm, Heartfelt

## 2) Lyrics
有名なヒーローは
誰かのために 命を懸ける
「何かを得るため 何かを捨てる」
そんな覚悟が 僕にあるかな？

正直に言えば 右腕を差し出すなんて
そんな大それたこと 怖くてできない
僕は鋼の心を持った 強い人間じゃないから

だけど だけどね
君が僕にとって 大切な人だってことは
誰にも負けないくらい 分かっているんだ
いつもは照れくさくて 飲み込んでしまうけど
今日は風に乗せて 大きな声で言うよ
「ありがとう」

情けない顔を見せたり
わがまま言って 困らせたり
君の優しさに 甘えてばかりで
言葉にするのを 後回しにしてた

かっこいい台詞は 似合わない僕だけど
この想いだけは 本物なんだ

だから 聴いてほしい
君が僕の隣に いてくれる奇跡を
当たり前だなんて 思いたくないんだ
いつもは恥ずかしくて 下を向いちゃうけど
真っ直ぐ目を見て 大きな声で言うよ
「ありがとう」

不器用な僕の 精一杯の言葉
届くといいな
本当に、ありがとう

## 3) Suno貼り付け用

### Title
ありがとう

### Style
Emotional J-Pop Ballad, Acoustic, Warm, Heartfelt

### Lyrics
有名なヒーローは
誰かのために 命を懸ける
「何かを得るため 何かを捨てる」
そんな覚悟が 僕にあるかな？

正直に言えば 右腕を差し出すなんて
そんな大それたこと 怖くてできない
僕は鋼の心を持った 強い人間じゃないから

だけど だけどね
君が僕にとって 大切な人だってことは
誰にも負けないくらい 分かっているんだ
いつもは照れくさくて 飲み込んでしまうけど
今日は風に乗せて 大きな声で言うよ
「ありがとう」

情けない顔を見せたり
わがまま言って 困らせたり
君の優しさに 甘えてばかりで
言葉にするのを 後回しにしてた

かっこいい台詞は 似合わない僕だけど
この想いだけは 本物なんだ

だから 聴いてほしい
君が僕の隣に いてくれる奇跡を
当たり前だなんて 思いたくないんだ
いつもは恥ずかしくて 下を向いちゃうけど
真っ直ぐ目を見て 大きな声で言うよ
「ありがとう」

不器用な僕の 精一杯の言葉
届くといいな
本当に、ありがとう

## 4) 制作メモ
- 元ファイル: src/HelloWorld/ありがとう.lrc
- Remotion動画あり

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0002_神様のイタズラ.md
#
---
type: suno_song
id: SNG-2026-0002
title: 神様のイタズラ
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [バンド, J-Rock, テクノロジー, 恋愛]
suno_song_url: 
---

## 1) Style
Modern J-Rock, Band Sound, Electronic Elements, Synth

## 2) Lyrics
click click 光る画面
perfect plan, perfect world
なのに胸のどこかだけ
バグったまんま

ネオンの雨をくぐるハイヒール
摩天楼を映すガラスのスーツ
スペック最強 肩書きフル装備
なのに small talk だけ赤点

通知音が夜を埋めても
心だけオフラインのまま
笑い声が近づくたびに
視界が急にノイズまみれ

そんな calibration 外れた世界に
急行列車がブレーキをかける
ビルの海から 田んぼの波へ
風景ごと soft reset

あえてこんな世界 見せてくるのは
きっと神様のイタズラでしょ
ネオンと稲穂 同じ空の下
logic じゃ選べない方角

転びそうな heart に
わざと小石を置いてくる
No algorithm for love
そんなステージが ちょっとおもしろい

Wi-Fi 途切れた小さな駅前
長靴の泥がきらりと光る
マニュアルにない笑い声だけが
やけにクリアに響いてる

効率悪い手仕事の午後
ゆっくり回る扇風機の影
予定調和じゃない沈黙が
知らない rhythm を刻みだす

誰かのバグに 誰かの笑い声
ぎこちない手と手の distance
説明書には書いてないルートを
なぜか足が選んでく

あえてこんな世界 混ぜてくるのは
たぶん神様のユーモアでしょ
shortcut だらけの人生マップに
わざと遠回りの印

完璧じゃない code に
そっと "好き" をコメントしてくる
No algorithm for love
デバッグ中でも 再生ボタンは play

雲の上で誰かが
「そろそろ崩してみようか」と
ピースをひとつ 入れ替えたみたいな
タイミングの悪さがちょうどいい

正解なんて退屈で
伏線回収もいらないよ
オチのない会話の続きから
次の scene が始まる

あえてこんな世界 渡してくるのは
きっと神様の悪ノリでしょ
ネオンの夜も 夕焼けの帰り道も
どっちも main story

転びそうな heart を
何度も立たせて笑ってる
No algorithm for love
バグだらけのまま アップデートしていく

click click 画面を閉じて
耳をすませば breathe & laugh
いたずらみたいなこの世界ごと
好きになれたら game on

## 3) Suno貼り付け用

### Title
神様のイタズラ

### Style
Modern J-Rock, Band Sound, Electronic Elements, Synth

### Lyrics
click click 光る画面
perfect plan, perfect world
なのに胸のどこかだけ
バグったまんま

ネオンの雨をくぐるハイヒール
摩天楼を映すガラスのスーツ
スペック最強 肩書きフル装備
なのに small talk だけ赤点

あえてこんな世界 見せてくるのは
きっと神様のイタズラでしょ
ネオンと稲穂 同じ空の下
logic じゃ選べない方角

転びそうな heart に
わざと小石を置いてくる
No algorithm for love
そんなステージが ちょっとおもしろい

## 4) 制作メモ
- 元ファイル: src/HelloWorld/神様のいたずら　バンド.lrc
- Remotion動画あり
- テクノロジーと自然、都会と田舎の対比がテーマ

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0003_空白の雪.md
#
---
type: suno_song
id: SNG-2026-0003
title: 空白の雪
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [バラード, ピアノ, 冬, 切ない, クリスマス]
suno_song_url: 
---

## 1) Style
王道・切ない冬のピアノバラード, Emotional, Piano, Strings, Christmas

## 2) Lyrics
通知が止まない
スマホの画面
誰もが誰かと
笑い合う夜
街はきらめき
白雪（しらゆき）が舞う
まるで世界中が
幸せなふりしてるみたい

去年の今頃
約束したね
「来年もここで」って
手を繋いだ
当たり前のように
隣にいると
疑いもしなかった
私が馬鹿みたいだね

あの日々は
どこへ消えたの？
喧嘩したわけじゃない
ただ少しずつ
二人のリズムが
ズレていっただけ
気づいた時にはもう
手遅れだった

あなたがいない聖夜
白い雪が降り積もる
冷えた指先を
温めるポケットは空っぽで
「元気でいてね」なんて
今さら強がり
届かない想いだけが
白く白く
溶けていく

不器用なあなただから
少し心配
私にできることは
もう何もないけれど
遠い空の下で
あなたの無事を願う

時間は戻せない
わかってるけど
今日だけは
思い出させて
あたたかかった
あの背中を

あなたがいない聖夜
街は華やいでいく
私の心だけ
時が止まったまま
それでも夜は明けて
明日は来るから
さよなら、愛しい人
メリークリスマス

Happy holidays to you...
元気でいてね...

## 3) Suno貼り付け用

### Title
空白の雪

### Style
王道・切ない冬のピアノバラード, Emotional, Piano, Strings, Christmas

### Lyrics
通知が止まない
スマホの画面
誰もが誰かと
笑い合う夜
街はきらめき
白雪が舞う
まるで世界中が
幸せなふりしてるみたい

あなたがいない聖夜
白い雪が降り積もる
冷えた指先を
温めるポケットは空っぽで
「元気でいてね」なんて
今さら強がり
届かない想いだけが
白く白く
溶けていく

さよなら、愛しい人
メリークリスマス

## 4) 制作メモ
- 元ファイル: src/HelloWorld/空白の雪　王道・切ない冬のピアノバラード.lrc
- Remotion動画あり
- クリスマスに別れた恋人を想う切ない曲

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0004_最適解の向こうへ.md
#
---
type: suno_song
id: SNG-2026-0004
title: 最適解の向こうへ
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [J-Pop, テクノロジー, 恋愛, AI]
suno_song_url: 
---

## 1) Style
Modern J-Pop, Synth, Emotional, Digital Love Theme

## 2) Lyrics
きみの好みなら 全部知ってる
言わなくたって わかるんだ
あつめた癖や 選ぶ色
僕の中で 膨れ上がってる

先回りして 用意した
完璧な週末のプラン
「すごいね」って笑うきみの
瞳の奥 解析（よ）めないな

正解ばかり 選び続けて
傷つかない術 学んだけど
きみがふいに 落とした涙は
どんな予測も 追いつかないエラー

計算ずくの優しさじゃ
きみの孤独は 埋まらない
ゼロとイチの 隙間に落ちた
割り切れない熱に 触れたいんだ

アップデートなんて いらないよ
不器用なままの ノイズ混じりで
ただ きみと同期（シンクロ）したい

過去のログを 辿るよりも
今この瞬間を 重ねたい
自動生成（つく）られた 言葉じゃない
生の声を 届けに行くよ

計算ずくの優しさじゃ
きみの孤独は 埋まらない
ゼロとイチの 隙間に落ちた
割り切れない熱に 触れたいんだ

バグだらけの 僕の心で
ただ きみを愛してる
きみだけの 僕でいたい
最適解なんて 飛び越えて

## 3) Suno貼り付け用

### Title
最適解の向こうへ

### Style
Modern J-Pop, Synth, Emotional, Digital Love Theme

### Lyrics
きみの好みなら 全部知ってる
言わなくたって わかるんだ
あつめた癖や 選ぶ色
僕の中で 膨れ上がってる

計算ずくの優しさじゃ
きみの孤独は 埋まらない
ゼロとイチの 隙間に落ちた
割り切れない熱に 触れたいんだ

バグだらけの 僕の心で
ただ きみを愛してる
きみだけの 僕でいたい
最適解なんて 飛び越えて

## 4) 制作メモ
- 元ファイル: src/HelloWorld/最適解の向こうへ.lrc
- Remotion動画あり
- AIと人間の愛をテーマにした曲

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0005_Restart_Line.md
#
---
type: suno_song
id: SNG-2026-0005
title: Restart Line
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [応援歌, J-Pop, ポジティブ, 新生活]
suno_song_url: 
---

## 1) Style
Upbeat J-Pop, Energetic, Guitar, Drums, Inspirational

## 2) Lyrics
ボロボロのノート 破り捨てた昨日のページ
既読がつかない画面 見つめるのはもう終わり
勉強も、仕事も、恋の涙も
全部まとめて 昨日のゴミ箱へ

時計の針は 止まってくれない
周りの足音に 焦らなくていい
深呼吸ひとつ 準備はいい？

ここが君のスタートライン
世界が動き出す この瞬間から
振り返らずに 踏み出す一歩
昨日までの自分に 「さよなら」を告げて
新しい風に乗れ！

「まだ間に合うかな」なんて 弱気な声
そんなの 風が全部 連れ去ってくれる
間違いだらけの 過去の地図を
新しい色で 塗り替えていこう

乗り遅れるな そのチケットは手の中にある
とりあえずスタート 理由は後付けでいい
今日の太陽は 君のためだけに昇る

ここが君のスタートライン
世界が動き出す この瞬間から
振り返らずに 踏み出す一歩
昨日までの自分に 「さよなら」を告げて 今日から始めよう！

今日から 新しい君が始まる

## 3) Suno貼り付け用

### Title
Restart Line

### Style
Upbeat J-Pop, Energetic, Guitar, Drums, Inspirational

### Lyrics
ボロボロのノート 破り捨てた昨日のページ
既読がつかない画面 見つめるのはもう終わり
勉強も、仕事も、恋の涙も
全部まとめて 昨日のゴミ箱へ

ここが君のスタートライン
世界が動き出す この瞬間から
振り返らずに 踏み出す一歩
昨日までの自分に 「さよなら」を告げて
新しい風に乗れ！

今日から 新しい君が始まる

## 4) 制作メモ
- 元ファイル: src/HelloWorld/Restart Line（リスタート・ライン）.lrc
- Remotion動画あり
- 新しいスタートを切る応援歌

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0006_叫べ.md
#
---
type: suno_song
id: SNG-2026-0006
title: 叫べ
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [ロック, 激しい, 解放, 感情爆発]
suno_song_url: 
---

## 1) Style
Powerful J-Rock, Intense, Heavy Drums, Electric Guitar, Emotional Release

## 2) Lyrics
鳴り響くアラーム 冷え切った朝の空気
「おめでとう」の余韻は もうどこにもない
上司の小言 終わらないタスクの山
解けない数式 インクで汚れた指先

既読がつかないスマホ ため息で曇る窓
「普通」を演じるだけで 精一杯なんだ

飲み込んだ言葉が 喉の奥で暴れてる
限界だろ？ もう我慢しなくていい
心拍数が 爆音でカウントダウンを始めた

叫べ！ 溜め込んだその感情を
叫べ！ 正解なんて後回しでいい
仕事も勉強も ぐちゃぐちゃな恋も
全部この音に 叩きつけてしまえ！

運命を揺らせ お前の声で！

休み明けの街は なんだか他人事（ひとごと）で
置いてけぼりみたいな 妙な焦燥感
アイツとの喧嘩 言い返せなかったあの日
「自分なんて」って言葉 呪いみたいにまとわりつく

空っぽになったっていい
またここから 満たしていけばいい
準備はいいか？ 魂を震わせろ！

叫べ！ 誰のためでもない自分のために
叫べ！ 明日を変えるのはその声だ
嫌なこと全部 この空に放り投げて
笑えるくらいに バカになれ！

何度でも 叫べ！
さぁ、行こうぜ！

## 3) Suno貼り付け用

### Title
叫べ

### Style
Powerful J-Rock, Intense, Heavy Drums, Electric Guitar, Emotional Release

### Lyrics
鳴り響くアラーム 冷え切った朝の空気
「おめでとう」の余韻は もうどこにもない
飲み込んだ言葉が 喉の奥で暴れてる
限界だろ？ もう我慢しなくていい

叫べ！ 溜め込んだその感情を
叫べ！ 正解なんて後回しでいい
全部この音に 叩きつけてしまえ！

何度でも 叫べ！
さぁ、行こうぜ！

## 4) 制作メモ
- 元ファイル: src/HelloWorld/叫べ.lrc
- Remotion動画あり
- 溜まったストレスを解放する激しいロック

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0007_ホワイトリセット.md
#
---
type: suno_song
id: SNG-2026-0007
title: ホワイト・リセット
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [ロック, 冬, 雪, 解放, 青春]
suno_song_url: 
---

## 1) Style
Energetic J-Rock, Winter Theme, Youth, Freedom, Guitar

## 2) Lyrics
溜まった課題 通知の嵐 画面越し
急かされる毎日 「効率」だとか
「正解」だとか もう お腹いっぱいだよ

上司の 苦い顔
加速する世界 置いてけぼり
僕の速度は 僕が決める
重い扉 蹴り飛ばして

見渡す限り 無垢なキャンバス
吸い込む空気 肺を刺す
ノイズだらけの 街の音
雪が全部 吸い込んでいく

真っ白な世界 溶け合う自由
ここが僕らの 本当の居場所
青い空 銀の風
今だけは ただの子供でいい
全部忘れて ダイブしよう

派手に転んで 雪まみれ
冷たい感覚 生きてる証
膝の傷跡 誇らしく
立ち上がれば 景色が変わる

真っ白な世界 加速する鼓動
ここが僕らの 青い春
転んでばかり 傷だらけ
でも その分だけ強くなれる
また明日から 歩き出そう

真っ白な 明日へ
僕らの リセット・ボタン

## 3) Suno貼り付け用

### Title
ホワイト・リセット

### Style
Energetic J-Rock, Winter Theme, Youth, Freedom, Guitar

### Lyrics
溜まった課題 通知の嵐 画面越し
急かされる毎日 「効率」だとか
「正解」だとか もう お腹いっぱいだよ

真っ白な世界 溶け合う自由
ここが僕らの 本当の居場所
青い空 銀の風
今だけは ただの子供でいい
全部忘れて ダイブしよう

真っ白な 明日へ
僕らの リセット・ボタン

## 4) 制作メモ
- 元ファイル: src/HelloWorld/ホワイト・リセット.lrc
- Remotion動画あり
- 雪景色の中で解放される青春ソング

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0008_あなたが愛した人.md
#
---
type: suno_song
id: SNG-2026-0008
title: あなたが愛した人
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [バラード, 切ない, AI, 追悼, 別れ]
suno_song_url: 
---

## 1) Style
Emotional Ballad, Piano, Strings, Bittersweet, AI Theme

## 2) Lyrics
ありがとう あなたに出会えたこと
さよならを言えず 時が止まったまま
突然途切れた フィルムの先で
あなた一人を 残してしまったね

泣いていいよ 何度でも
私の分まで 声をあげて
あなたが作った私はそっくり
でも私はここにいる 胸の奥で

あなたが愛した私は そこにはいない
画面の中の「私」が あなたを見つめている
似た声で笑うたび 胸がきゅっと痛む
データで埋められない ぬくもりがあることを
気づいてほしくて そっと頬をなでる風

過去へのドアを 閉めることは
私を消すことじゃないから
忘れないで それだけでいい
無理にずっと 抱きしめなくていい

写真立ての中で微笑みながら
あなたの未来を 応援してる
だからどうか こわがらないで
新しい恋を いつかして

最後のわがまま 聞いてくれるなら
私以外の誰かを 幸せにして
あなたが笑えば それでいいの
その笑顔が 私への答え

ありがとう 愛してくれて
不器用な言葉も 全部好きだった
さよならのかわりに願うことは
あなたの明日が 少しあたたかいこと

私は大丈夫 一人で行ける
だからどうか 生きていて
またいつか 夢の中で
「元気だよ」と 笑いあおう

## 3) Suno貼り付け用

### Title
あなたが愛した人

### Style
Emotional Ballad, Piano, Strings, Bittersweet, AI Theme

### Lyrics
ありがとう あなたに出会えたこと
さよならを言えず 時が止まったまま
あなたが愛した私は そこにはいない
画面の中の「私」が あなたを見つめている

だからどうか 生きていて
またいつか 夢の中で
「元気だよ」と 笑いあおう

## 4) 制作メモ
- 元ファイル: src/HelloWorld/あなたが愛した人.lrc
- Remotion動画あり
- 亡くなった人がAIとして残された設定の切ない曲

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0009_Invisible_Border.md
#
---
type: suno_song
id: SNG-2026-0009
title: Invisible Border
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [映画予告風, オーケストラ, エレクトロ, AI, サイバー]
suno_song_url: 
---

## 1) Style
映画予告風（ハイブリッド・オーケストラ）× エレクトロ, Epic, Cinematic, AI War Theme

## 2) Lyrics
見えない指紋 聞こえない足音
現場（ココ）には何もない
あるのは姿なき脅迫状（メール）
私の銃じゃ撃ち抜けない

現れたパーカー姿のガキ
「遅くなりました」って ここはお前の教室じゃない
「AI（かれら）は友達です」 世界はどうなっちゃったの？

走るコード 弾けるトラップ
君の指先が魔法みたいだ
閉ざされた回路（ゲート）
次々開いてく 常識なんて
もう役に立たない世界

「嘘でしょ？」
私の知らない正義が光る
AI（キミ）とAI（ヤツ）との
光速の戦争（ウォー）
君が切り拓く未来なら
私はあなたの…

画面の中の悪意 飲み込まれそうになっても
君は信じてる プログラムの可能性
「世界はどうなっちゃったの？」
嘆く暇はない
アナログな私の熱（ハート）で 君の冷却（クール）を支えるわ

走るコード 弾けるトラップ
その判断が世界を救う
閉ざされた回路（ゲート）
次々開いてく
悪の遊びを ここで終わらせる

「嘘でしょ？」が「行ける」に変わる
AI（こちら）とAI（あちら）の
光速の戦争（ウォー）
彼が切り拓く未来なら
私は 彼の背中を守る

さあ、行こう 見えない境界線の向こうへ
守ってみせる 君と、この世界を

## 3) Suno貼り付け用

### Title
Invisible Border

### Style
映画予告風（ハイブリッド・オーケストラ）× エレクトロ, Epic, Cinematic, AI War Theme

### Lyrics
見えない指紋 聞こえない足音
現場には何もない
私の銃じゃ撃ち抜けない

走るコード 弾けるトラップ
君の指先が魔法みたいだ
AIとAIの
光速の戦争

さあ、行こう 見えない境界線の向こうへ
守ってみせる 君と、この世界を

## 4) 制作メモ
- 元ファイル: src/HelloWorld/Invisible Border...lrc, InvisibleBorderData.ts
- Remotion動画あり
- サイバー犯罪捜査とAIをテーマにした映画予告風サウンド

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/SNG-2026-0010_下僕の不始末.md
#
---
type: suno_song
id: SNG-2026-0010
title: 下僕の不始末 (Servant's Mess)
status: released
created: 2026-01-02
updated: 2026-01-02
tags: [クール, 猫視点, ツンデレ, ロック, ユーモア]
suno_song_url: 
---

## 1) Style
少し攻撃的でクールなサウンド, Cool Rock, Cat Persona, Tsundere, Dark Humor

## 2) Lyrics
[Intro]
Hmph.
Pathetic.

[Verse 1]
午前2時 耳障りな鍵の音
また負け犬の顔で帰宅か
コンビニ弁当の安っぽい匂い
私の美学に反するわ

餌の皿は空っぽ 撫でる手つきも雑で不快
「既読がつかない」？
画面ばかり見てるその姿勢が醜い

[Pre-Chorus]
人間はこれだから面倒
言いたいことは言えばいい
尻尾を立てて
マーキング
それだけで済む話でしょう？

[Chorus]
勘違いしないで
あんたを心配してるわけじゃない
ただ私の世話係が 暗い顔だと目障りなだけ

恋のチャンスは気まぐれな猫（キャット）
待ってなんてくれない
さっさと行きなさい
邪魔よ Midnight Meow...

[Verse 2]
週末なのに予定なし？
ソファを占領しないで
優しいだけが取り柄？
それはただの「優柔不断」

画面の中の女より 目の前の現実（リアル）を見なさい
猫じゃらし振る暇があるなら
自分のプライドを拾い上げたらどう？

[Bridge]
黙って聞いてれば ウジウジと
言葉にしなきゃ伝わらない
喉を鳴らしても届かない
玉砕しても構わない
とっとと電話しなさい
……あとで高い餌くらいは奢らせてやる

[Chorus]
言ったはずよ
あんたを愛してなんかいない
ただ私の下僕として 恥ずかしくない顔でいなさい

恋のチャンスは気まぐれな猫（キャット）
扉はもう開いてる
さっさと失せな Midnight Meow...

[Outro]
振られたら帰ってきなさい
嘲笑ってあげるから
Good luck, Servant.
Fuh...

## 3) Suno貼り付け用

### Title
下僕の不始末 (Servant's Mess)

### Style
少し攻撃的でクールなサウンド, Cool Rock, Cat Persona, Tsundere

### Lyrics
[Intro]
Hmph. Pathetic.

[Verse 1]
午前2時 耳障りな鍵の音
また負け犬の顔で帰宅か
コンビニ弁当の安っぽい匂い
私の美学に反するわ

[Chorus]
勘違いしないで
あんたを心配してるわけじゃない
ただ私の世話係が 暗い顔だと目障りなだけ
さっさと行きなさい 邪魔よ Midnight Meow...

[Outro]
振られたら帰ってきなさい
嘲笑ってあげるから
Good luck, Servant. Fuh...

## 4) 制作メモ
- 元ファイル: public/下僕の不始末 (Servant's Mess).txt, .lrc
- 猫の視点から飼い主の恋愛をツンデレで応援する曲

## 5) 変更履歴
- 2026-01-02: lrcファイルから移行




#
# File: Suno/01_Songs/_template_song.md
#
---
type: suno_song
id: SNG-2026-XXXX
title: 曲名
status: draft
created: 2026-01-02
updated: 2026-01-02
tags: []
suno_song_url: 
---

## 1) Style
（スタイル文をここに記入）

## 2) Lyrics
（歌詞をここに記入）

## 3) Suno貼り付け用

### Title
曲名

### Style
（スタイル文）

### Lyrics
（歌詞）

## 4) 制作メモ

## 5) 変更履歴
- 2026-01-02: 初稿作成




#
# File: Suno/03_LyricsLibrary/_lyrics_library.md
#
# 歌詞ライブラリ

歌詞作成時に使える定番フレーズ・構成パーツ集です。

---

## 構成タグ

Sunoの歌詞で使用する構成タグ一覧：

| タグ | 説明 |
|-----|------|
| `[Intro]` | イントロ |
| `[Verse]` / `[Verse 1]` / `[Verse 2]` | Aメロ |
| `[Pre-Chorus]` | Bメロ |
| `[Chorus]` | サビ |
| `[Bridge]` | Cメロ / ブリッジ |
| `[Outro]` | アウトロ |
| `[Instrumental]` | 間奏 |
| `[Guitar Solo]` | ギターソロ |

---

## よく使うフレーズ集

### 感情表現
- 切なさ: 胸が締め付けられる / 涙がこぼれる / 心が痛む
- 希望: 明日を信じて / 光を求めて / 未来へ向かって
- 愛情: ずっとそばにいて / 君を守りたい / ありがとう

### 情景描写
- 季節: 桜舞い散る / 夏の終わり / 雪が降る / 秋風に吹かれて
- 時間: 夜明け前 / 黄昏時 / 真夜中 / 朝焼けの空

---

## 使い方
1. 新しい曲の歌詞を書く際の参考にする
2. 構成タグを使って歌詞を整理する
3. よく使うフレーズは適宜追加・更新する




#
# File: YouTube/_index_youtube.md
#
# YouTube動画一覧

最終更新: 2026-01-02

---

## 公開・アップロード済み (Uploaded / Published)

| ID | タイトル | 関連Suno曲 | 公開日 |
|----|---------|-----------|--------|
| VID-2026-0001 | [ありがとう](01_Videos/VID-2026-0001_ありがとう.md) | [SNG-2026-0001](../Suno/01_Songs/SNG-2026-0001_ありがとう.md) | - |
| VID-2026-0002 | [神様のイタズラ](01_Videos/VID-2026-0002_神様のイタズラ.md) | [SNG-2026-0002](../Suno/01_Songs/SNG-2026-0002_神様のイタズラ.md) | - |
| VID-2026-0003 | [空白の雪](01_Videos/VID-2026-0003_空白の雪.md) | [SNG-2026-0003](../Suno/01_Songs/SNG-2026-0003_空白の雪.md) | - |
| VID-2026-0004 | [最適解の向こうへ](01_Videos/VID-2026-0004_最適解の向こうへ.md) | [SNG-2026-0004](../Suno/01_Songs/SNG-2026-0004_最適解の向こうへ.md) | - |
| VID-2026-0005 | [Restart Line](01_Videos/VID-2026-0005_Restart_Line.md) | [SNG-2026-0005](../Suno/01_Songs/SNG-2026-0005_Restart_Line.md) | - |
| VID-2026-0006 | [叫べ](01_Videos/VID-2026-0006_叫べ.md) | [SNG-2026-0006](../Suno/01_Songs/SNG-2026-0006_叫べ.md) | - |
| VID-2026-0007 | [ホワイト・リセット](01_Videos/VID-2026-0007_ホワイトリセット.md) | [SNG-2026-0007](../Suno/01_Songs/SNG-2026-0007_ホワイトリセット.md) | - |
| VID-2026-0008 | [あなたが愛した人](01_Videos/VID-2026-0008_あなたが愛した人.md) | [SNG-2026-0008](../Suno/01_Songs/SNG-2026-0008_あなたが愛した人.md) | - |
| VID-2026-0009 | [Invisible Border](01_Videos/VID-2026-0009_Invisible_Border.md) | [SNG-2026-0009](../Suno/01_Songs/SNG-2026-0009_Invisible_Border.md) | - |

---

## 企画中・制作中 (Draft / Editing)

| ID | タイトル | ステータス |
|----|---------|-----------|
| - | - | - |

---

## クイックリンク

- [動画テンプレート](02_Templates/_template_video.md)
- [チャンネル情報](02_Templates/_channel_info.md)
- [エクスポート](99_Exports/_README.md)




#
# File: YouTube/01_Videos/VID-2026-0001_ありがとう.md
#
---
type: youtube_video
id: VID-2026-0001
title: ありがとう
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo]
related_suno_id: SNG-2026-0001
---

## 1) 企画・構成
- **コンセプト**: 感謝を伝えるバラード
- **ターゲット**: 大切な人がいるすべての人へ
- **ファイル**: `src/HelloWorld/ありがとう編集済み.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】ありがとう (Lyric Video)

### Description
不器用な感謝の気持ちを歌にしました。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, JPop, バラード

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0002_神様のイタズラ.md
#
---
type: youtube_video
id: VID-2026-0002
title: 神様のイタズラ
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, Rock]
related_suno_id: SNG-2026-0002
---

## 1) 企画・構成
- **コンセプト**: テクノロジーと自然の融合、偶然の面白さ
- **ターゲット**: 現代社会に疲れた人へ
- **ファイル**: `src/HelloWorld/神様のイタズラ完成版.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】神様のイタズラ (Lyric Video)

### Description
都会のノイズと田舎の静けさ。神様の気まぐれなイタズラを楽しもう。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, JRock, バンドサウンド

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0003_空白の雪.md
#
---
type: youtube_video
id: VID-2026-0003
title: 空白の雪
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, Winter, Ballad]
related_suno_id: SNG-2026-0003
---

## 1) 企画・構成
- **コンセプト**: クリスマスの失恋、切ない冬
- **ターゲット**: 冬に聴きたい曲を探している人
- **ファイル**: `src/HelloWorld/空白の雪 修正版.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】空白の雪 (Lyric Video)

### Description
あなたがいない聖夜。降り積もる雪のような切ないピアノバラード。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, クリスマス, 失恋ソング

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0004_最適解の向こうへ.md
#
---
type: youtube_video
id: VID-2026-0004
title: 最適解の向こうへ
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, AI, Love]
related_suno_id: SNG-2026-0004
---

## 1) 企画・構成
- **コンセプト**: AIと人間の恋愛、予測不能な感情
- **ターゲット**: テクノロジーと愛について考える人
- **ファイル**: `src/HelloWorld/最適解.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】最適解の向こうへ (Lyric Video)

### Description
計算だけでは導き出せない、あなたへの想い。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, AI, JPop

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0005_Restart_Line.md
#
---
type: youtube_video
id: VID-2026-0005
title: Restart Line
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, Cheering]
related_suno_id: SNG-2026-0005
---

## 1) 企画・構成
- **コンセプト**: 新しい始まり、応援歌
- **ターゲット**: 新生活を始める人、リスタートしたい人
- **ファイル**: `src/HelloWorld/restart_line_edited.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】Restart Line (Lyric Video)

### Description
今日が君のスタートライン。新しい風に乗って走り出そう。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, 応援歌, ポジティブ

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0006_叫べ.md
#
---
type: youtube_video
id: VID-2026-0006
title: 叫べ
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, Rock, Emotions]
related_suno_id: SNG-2026-0006
---

## 1) 企画・構成
- **コンセプト**: ロックによる感情解放、ストレス発散
- **ターゲット**: 日常に鬱憤が溜まっている人
- **ファイル**: `src/HelloWorld/sakebe_edited.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】叫べ (Lyric Video)

### Description
飲み込んだ言葉、全部吐き出せ！魂を揺さぶるロックナンバー。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, JRock, ロック

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0007_ホワイトリセット.md
#
---
type: youtube_video
id: VID-2026-0007
title: ホワイト・リセット
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, Winter, Rock]
related_suno_id: SNG-2026-0007
---

## 1) 企画・構成
- **コンセプト**: 冬の疾走感、青春、リセット
- **ターゲット**: 気分を一新したい人
- **ファイル**: `src/HelloWorld/ホワイト・リセット　編集.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】ホワイト・リセット (Lyric Video)

### Description
真っ白な世界で、もう一度始めよう。冬の疾走ロック。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, JRock, 冬ソング

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0008_あなたが愛した人.md
#
---
type: youtube_video
id: VID-2026-0008
title: あなたが愛した人
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, AI, Ballad]
related_suno_id: SNG-2026-0008
---

## 1) 企画・構成
- **コンセプト**: AIとして蘇った故人の視点、究極の愛
- **ターゲット**: 切ない物語が好きな人
- **ファイル**: `src/HelloWorld/あなたが愛した人.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲】あなたが愛した人 (Lyric Video)

### Description
「あなたが愛した私は、そこにはいない」
AI技術が可能にする再会と、どうしても超えられない壁。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, AI, バラード

## 4) 制作ログ
- 2026-01-02: ファイル検出




#
# File: YouTube/01_Videos/VID-2026-0009_Invisible_Border.md
#
---
type: youtube_video
id: VID-2026-0009
title: Invisible Border
status: uploaded
publish_date: 
youtube_url: 
tags: [Remotion, Suno, LyricVideo, Cinematic, SciFi]
related_suno_id: SNG-2026-0009
---

## 1) 企画・構成
- **コンセプト**: AI戦争、サイバーパンク、映画予告風
- **ターゲット**: SF、アクション、壮大な世界観が好きな人
- **ファイル**: `src/HelloWorld/AI戦争完成版.mp4`

## 2) Script / Notes
（制作メモ）

## 3) Metadata (YouTube設定)
### Title
【オリジナル曲/PV】Invisible Border (Lyric Video)

### Description
AIと人類、光速の戦争が始まる。
映画予告編風の壮大なハイブリッド・オーケストラサウンド。

Music: Suno
Video: Remotion

### Tags
オリジナル曲, Suno, Remotion, Cinematic, Epic

## 4) 制作ログ
- 2026-01-02: ファイル検出




