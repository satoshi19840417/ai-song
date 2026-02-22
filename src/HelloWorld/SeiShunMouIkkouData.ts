/* eslint-disable no-irregular-whitespace */
import { staticFile } from "remotion";

export type SectionType = "normal" | "chorus";

export type LyricLineWithSection = {
  timeTag: string;
  text: string;
  sectionType: SectionType;
};

export const seiShunMouIkkouData = {
  title: "青春、もう一周",
  artist: "Suno AI",
  videoSource: staticFile("suno_PJ/new/青春、もう一周.mp4"),
  fontSize: 42,
  bottomOffset: 100,
  lyrics: [
    // イントロ
    { timeTag: "[00:00.61]", text: "ある日の帰り道 空から声がした", sectionType: "normal" },
    { timeTag: "[00:05.28]", text: "「なあ、お前 青春もう一周やらねえ？」", sectionType: "normal" },
    { timeTag: "[00:10.92]", text: "振り向いたら 雲の上にあぐらかいた", sectionType: "normal" },
    { timeTag: "[00:15.90]", text: "ジャージ姿の神様がニヤニヤしてる", sectionType: "normal" },
    { timeTag: "[00:21.05]", text: "パッチン、と鳴った——景色が巻き戻る", sectionType: "normal" },
    // Aメロ1
    { timeTag: "[00:23.96]", text: "満開の桜 教室の窓が開く", sectionType: "normal" },
    { timeTag: "[00:27.07]", text: "入学式 名前噛んで 声が裏返った", sectionType: "normal" },
    { timeTag: "[00:31.46]", text: "あの沈黙3秒が 今でも夢に出る", sectionType: "normal" },
    { timeTag: "[00:36.57]", text: "またパッチン、と——空気が湿る", sectionType: "normal" },
    // Bメロ1
    { timeTag: "[00:39.25]", text: "ゴーグル跡のまま 好きな子の前 立った夏", sectionType: "normal" },
    { timeTag: "[00:43.08]", text: "目が合って 逸らして そのまま終わった8月", sectionType: "normal" },
    // サビ1
    { timeTag: "[00:47.75]", text: "ああ 全部やりたい 全部ほしい", sectionType: "chorus" },
    { timeTag: "[00:51.04]", text: "取りこぼした青春が 目の前にぶら下がってる", sectionType: "chorus" },
    { timeTag: "[00:56.65]", text: "でも——ごめん 神様", sectionType: "chorus" },
    { timeTag: "[00:58.67]", text: "もう一周なんていらないよ", sectionType: "chorus" },
    { timeTag: "[01:01.50]", text: "あの日の僕はあの日にしかいない", sectionType: "chorus" },
    { timeTag: "[01:04.59]", text: "やり直したら 色あせるだろ ぜんぶ", sectionType: "chorus" },
    { timeTag: "[01:09.10]", text: "ヘタクソだった春も 空振りの夏も", sectionType: "chorus" },
    { timeTag: "[01:12.00]", text: "ぜんぶ僕の青春だ、ほら", sectionType: "chorus" },
    // Aメロ2
    { timeTag: "[01:19.85]", text: "パッチン——風が黄金色に変わった", sectionType: "normal" },
    { timeTag: "[01:22.71]", text: "学園祭 夜中まで作ったハリボテの龍", sectionType: "normal" },
    { timeTag: "[01:26.04]", text: "ガムテだらけ 首もげかけ それでも最高傑作だった", sectionType: "normal" },
    { timeTag: "[01:31.08]", text: "最後のパッチン、が鳴る——吐く息が白い", sectionType: "normal" },
    // Bメロ2
    { timeTag: "[01:34.16]", text: "受験前のコンビニ 指のインクで レシート汚した", sectionType: "normal" },
    { timeTag: "[01:38.65]", text: "マフラー借りパクした あいつ 元気かな", sectionType: "normal" },
    { timeTag: "[01:41.70]", text: "だめだ あの日の僕が呼んでる", sectionType: "normal" },
    { timeTag: "[01:45.39]", text: "もう一回 あの教室に座れるなら——", sectionType: "normal" },
    // サビ2
    { timeTag: "[01:50.08]", text: "……ごめんな 神様", sectionType: "chorus" },
    { timeTag: "[01:51.90]", text: "やっぱり いらないよ", sectionType: "chorus" },
    { timeTag: "[01:54.67]", text: "涙も後悔も ぜんぶ抱えて来たんだ", sectionType: "chorus" },
    { timeTag: "[01:58.03]", text: "ここでやり直したら 僕が僕じゃなくなる", sectionType: "chorus" },
    { timeTag: "[02:02.60]", text: "不器用だった秋も 震えてた冬も", sectionType: "chorus" },
    { timeTag: "[02:05.93]", text: "もう二度とない 僕だけの季節だ", sectionType: "chorus" },
    // ブリッジ
    { timeTag: "[02:13.98]", text: "ふと 空を見たら", sectionType: "normal" },
    { timeTag: "[02:15.86]", text: "雲の上はもう 空っぽだった", sectionType: "normal" },
    { timeTag: "[02:19.03]", text: "ジャージの背中も パッチンの音も", sectionType: "normal" },
    { timeTag: "[02:21.32]", text: "風の向こうへ消えていた", sectionType: "normal" },
    { timeTag: "[02:26.54]", text: "ジャージのジッパーだけ残ってた", sectionType: "normal" },
    // ラストサビ
    { timeTag: "[02:37.52]", text: "……ああ そうか", sectionType: "chorus" },
    { timeTag: "[02:38.00]", text: "僕は——前に行く", sectionType: "chorus" },
    { timeTag: "[02:39.96]", text: "もう一周なんていらない まだ知らない僕に会いたいから", sectionType: "chorus" },
    { timeTag: "[02:45.37]", text: "まだ会ってない誰かが 待ってる気がするんだ", sectionType: "chorus" },
    { timeTag: "[02:48.76]", text: "まだ見たことない景色が 僕を呼んでる", sectionType: "chorus" },
    { timeTag: "[02:51.87]", text: "僕は——走り出すよ", sectionType: "chorus" },
    { timeTag: "[02:54.08]", text: "カレンダー破り捨てて 春の向こうへダイブ", sectionType: "chorus" },
    { timeTag: "[02:58.62]", text: "マフラーは　明日 返しに行く", sectionType: "chorus" },
    { timeTag: "[03:03.87]", text: "やり残し？ 上等だ これからの僕が回収するよ", sectionType: "chorus" },
    { timeTag: "[03:09.12]", text: "空が少しだけ明るくなった", sectionType: "chorus" },
    // エンディング
    { timeTag: "[03:15.54]", text: "——どこかで パッチン、が聞こえた", sectionType: "normal" },
  ] as LyricLineWithSection[],
};
