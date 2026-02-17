import "./index.css";
import { Composition, staticFile } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { kamisamaData } from "./HelloWorld/KamisamaData";
import { KamisamaVideo, kamisamaVideoSchema } from "./HelloWorld/KamisamaVideo";
import { LyricVideo, lyricVideoSchema } from "./LyricVideo";
import {
  KineticTypography,
  kineticTypographySchema,
} from "./KineticTypography";
import {
  InvisibleBorderVideo,
  invisibleBorderSchema,
} from "./HelloWorld/InvisibleBorderVideo";
import { invisibleBorderData } from "./HelloWorld/InvisibleBorderData";
import {
  KuhakuNoYukiVideo,
  kuhakuNoYukiSchema,
} from "./HelloWorld/KuhakuNoYukiVideo";
import { kuhakuNoYukiData } from "./HelloWorld/KuhakuNoYukiData";
import {
  WhiteResetVideo,
  whiteResetSchema,
} from "./HelloWorld/WhiteResetVideo";
import { whiteResetData } from "./HelloWorld/WhiteResetData";
import { ArigatouVideo, arigatouSchema } from "./HelloWorld/ArigatouVideo";
import { arigatouData } from "./HelloWorld/ArigatouData";
import {
  RestartLineVideo,
  restartLineSchema,
} from "./HelloWorld/RestartLineVideo";
import { restartLineData } from "./HelloWorld/RestartLineData";
import { SakebeVideo, sakebeSchema } from "./HelloWorld/SakebeVideo";
import { sakebeData } from "./HelloWorld/SakebeData";
import { IkiroVideo, ikiroSchema } from "./HelloWorld/IkiroVideo";
import { ikiroData } from "./HelloWorld/IkiroData";
import {
  SaitekikaiVideo,
  saitekikaiSchema,
} from "./HelloWorld/SaitekikaiVideo";
import { saitekikaiData } from "./HelloWorld/SaitekikaiData";
import {
  BokuraWaMataVideo,
  bokuraWaMataSchema,
} from "./HelloWorld/BokuraWaMataVideo";
import { bokuraWaMataData } from "./HelloWorld/BokuraWaMataData";
import {
  KamenButokaiVideo,
  kamenButokaiSchema,
} from "./HelloWorld/KamenButokaiVideo";
import { kamenButokaiData } from "./HelloWorld/KamenButokaiData";
import {
  MikanseiNoChizuVideo,
  mikanseiNoChizuSchema,
} from "./HelloWorld/MikanseiNoChizuVideo";
import { mikanseiNoChizuData } from "./HelloWorld/MikanseiNoChizuData";
import {
  SujigakinonaiTabiVideo,
  sujigakinonaiTabiSchema,
} from "./HelloWorld/SujigakinonaiTabiVideo";
import { sujigakinonaiTabiData } from "./HelloWorld/SujigakinonaiTabiData";
import {
  MijukuNaStrawberryVideo,
  mijukuNaStrawberrySchema,
} from "./HelloWorld/MijukuNaStrawberryVideo";
import { mijukuNaStrawberryData } from "./HelloWorld/MijukuNaStrawberryData";
import {
  CurtainCallVideo,
  curtainCallSchema,
} from "./HelloWorld/CurtainCallVideo";
import { curtainCallData } from "./HelloWorld/CurtainCallData";
import { ValentineVideo, valentineSchema } from "./HelloWorld/ValentineVideo";
import { valentineData } from "./HelloWorld/ValentineData";
import {
  ScarsIntoStarsVideo,
  scarsIntoStarsSchema,
} from "./HelloWorld/ScarsIntoStarsVideo";
import { scarsIntoStarsData } from "./HelloWorld/ScarsIntoStarsData";
import {
  SabishigariOniVideo,
  sabishigariOniSchema,
} from "./HelloWorld/SabishigariOniVideo";
import { sabishigariOniData } from "./HelloWorld/SabishigariOniData";
import {
  StudySessionOpening,
  studySessionSchema,
} from "./HelloWorld/StudySessionOpening";
import { studySessionData } from "./HelloWorld/StudySessionData";
import {
  HayazakiNoHaruVideo,
  hayazakiNoHaruSchema,
} from "./HelloWorld/HayazakiNoHaruVideo";
import { hayazakiNoHaruData } from "./HelloWorld/HayazakiNoHaruData";
import { JinchougeVideo, jinchougeSchema } from "./HelloWorld/JinchougeVideo";
import { jinchougeData } from "./HelloWorld/JinchougeData";
import { YukitokenoLoveLetterVideo, yukitokenoLoveLetterSchema } from "./HelloWorld/YukitokenoLoveLetterVideo";
import { yukitokenoLoveLetterData } from "./HelloWorld/YukitokenoLoveLetterData";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 勉強会オープニング動画 */}
      <Composition
        id="StudySessionOpening"
        component={StudySessionOpening}
        durationInFrames={30 * 30} // 30 seconds - cinematic opening
        fps={30}
        width={1920}
        height={1080}
        schema={studySessionSchema}
        defaultProps={{
          title: "AIを「便利なチャット」から「仕事の補助役」へ",
          subtitle: "話題の活用法を学ぶ",
          company: "セルジェンテック",
          bgmSource: staticFile("bgm/mixkit-tech-house-vibes-130.mp3"),
        }}
      />
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
      <Composition
        id="LyricVideo"
        component={LyricVideo}
        durationInFrames={6000} // 200 seconds
        fps={30}
        width={1920}
        height={1080}
        schema={lyricVideoSchema}
        defaultProps={{
          fontSize: 35,
          bottomOffset: 100,
          timeShift: 0,
          lyrics: [
            { timeTag: "[00:01.07]", text: "ありがとう　あなたに出会えたこと" },
            {
              timeTag: "[00:06.66]",
              text: "さよならを言えず　時が止まったまま",
            },
            { timeTag: "[00:12.79]", text: "突然途切れた　フィルムの先で" },
            { timeTag: "[00:18.57]", text: "あなた一人を　残してしまったね" },
            { timeTag: "[00:23.36]", text: "泣いていいよ　何度でも" },
            { timeTag: "[00:26.18]", text: "私の分まで　声をあげて" },
            { timeTag: "[00:31.19]", text: "あなたが作った私はそっくり" },
            { timeTag: "[00:35.86]", text: "でも私はここにいる　胸の奥で" },
            {
              timeTag: "[00:41.13]",
              text: "あなたが愛した私は　そこにはいない",
            },
            {
              timeTag: "[00:48.06]",
              text: "画面の中の「私」が　あなたを見つめている",
            },
            {
              timeTag: "[00:53.94]",
              text: "似た声で笑うたび　胸がきゅっと痛む",
            },
            {
              timeTag: "[00:59.61]",
              text: "データで埋められない　ぬくもりがあることを",
            },
            {
              timeTag: "[01:05.59]",
              text: "気づいてほしくて　そっと頬をなでる風",
            },
            { timeTag: "[01:12.27]", text: "過去へのドアを　閉めることは" },
            { timeTag: "[01:16.80]", text: "私を消すことじゃないから" },
            { timeTag: "[01:21.42]", text: "忘れないで　それだけでいい" },
            { timeTag: "[01:26.33]", text: "無理にずっと　抱きしめなくていい" },
            { timeTag: "[01:33.20]", text: "写真立ての中で微笑みながら" },
            { timeTag: "[01:38.25]", text: "あなたの未来を　応援してる" },
            { timeTag: "[01:45.39]", text: "だからどうか　こわがらないで" },
            { timeTag: "[01:50.05]", text: "新しい恋を　いつかして" },
            { timeTag: "[01:59.64]", text: "最後のわがまま　聞いてくれるなら" },
            { timeTag: "[02:05.15]", text: "私以外の誰かを　幸せにして" },
            { timeTag: "[02:11.45]", text: "あなたが笑えば　それでいいの" },
            { timeTag: "[02:17.38]", text: "その笑顔が　私への答え" },
            { timeTag: "[02:24.47]", text: "ありがとう　愛してくれて" },
            { timeTag: "[02:28.09]", text: "不器用な言葉も　全部好きだった" },
            { timeTag: "[02:31.40]", text: "さよならのかわりに願うことは" },
            {
              timeTag: "[02:35.19]",
              text: "あなたの明日が　少しあたたかいこと",
            },
            { timeTag: "[02:39.06]", text: "私は大丈夫　一人で行ける" },
            { timeTag: "[02:46.07]", text: "だからどうか　生きていて" },
            { timeTag: "[02:51.79]", text: "またいつか　夢の中で" },
            { timeTag: "[03:03.57]", text: "「元気だよ」と　笑いあおう" },
          ],
        }}
      />
      <Composition
        id="Valentine"
        component={ValentineVideo}
        durationInFrames={6000} // ~3m20s = 200s * 30fps = 6000
        fps={30}
        width={1920}
        height={1080}
        schema={valentineSchema}
        defaultProps={{
          fontSize: 40,
          bottomOffset: 50,
          title: "今さらのHappy Valentine",
          artist: "AIミュージックビデオ",
          videoSource: staticFile("suno_PJ/done/今さらのHappy Valentine.mp4"),
          lyrics: [
            {
              timeTag: "[00:11.45]",
              text: "「バレンタイン？　いつの話？」なんて",
            },
            { timeTag: "[00:14.54]", text: "笑い飛ばして　ビールで乾杯した夜" },
            { timeTag: "[00:19.30]", text: "色気がない" },
            {
              timeTag: "[00:22.10]",
              text: "そんな居心地の良さ　甘えてたのかな",
            },
            { timeTag: "[00:28.46]", text: "街中あふれる　ハートの模様" },
            { timeTag: "[00:33.89]", text: "隣で歩く　見慣れた横顔" },
            { timeTag: "[00:39.52]", text: "不意に鼓動が　リズムを変えた" },
            {
              timeTag: "[00:44.96]",
              text: "今さら踊らされる　いつも遅い私たち",
            },
            { timeTag: "[00:50.41]", text: "ずっと知ってた　はずなのに" },
            { timeTag: "[00:53.46]", text: "でも胸が騒ぐ" },
            { timeTag: "[00:55.64]", text: "今さら、恋なんて　笑っちゃうよね" },
            { timeTag: "[01:00.03]", text: "親友から　恋人へ" },
            {
              timeTag: "[01:03.07]",
              text: "書き換えてみようか　二人のシナリオ",
            },
            { timeTag: "[01:07.75]", text: "照れくさいけど　悪くない" },
            { timeTag: "[01:12.96]", text: "いつかこの日を　笑い話にしよう" },
            { timeTag: "[01:18.98]", text: "遅れてきた　春の予感" },
            { timeTag: "[01:23.65]", text: "お互いの過去も　隠したい傷も" },
            { timeTag: "[01:27.05]", text: "全部知ってる　共犯者みたい" },
            { timeTag: "[01:32.65]", text: "だからこそ今　素直になるのが" },
            { timeTag: "[01:37.75]", text: "どんなことより　難しい" },
            { timeTag: "[01:40.45]", text: "いつもの冗談が　今日は出てこない" },
            {
              timeTag: "[01:46.30]",
              text: "私のチョコは時間経ちすぎて　形崩れてる　まるで不器用な私",
            },
            {
              timeTag: "[01:54.91]",
              text: "あなたはどんな顔するかな？　バカにされてもいい　あなたに届くなら",
            },
            {
              timeTag: "[02:04.59]",
              text: "今さら、恋なんて　でもこれが最後の恋",
            },
            { timeTag: "[02:10.28]", text: "ここから始まる" },
            { timeTag: "[02:12.21]", text: "華やかな街に　背中押されて" },
            { timeTag: "[02:15.76]", text: "繋いだ手のひら　熱くなる" },
            {
              timeTag: "[02:20.35]",
              text: "神様も予想しない展開　これが遅れてきた私たちの春",
            },
            { timeTag: "[02:30.93]", text: "甘すぎるショコラ　苦いブランデー" },
            { timeTag: "[02:36.56]", text: "二人のバランス　ちょうどいいかな" },
            {
              timeTag: "[02:41.83]",
              text: "子供のころ思い描いてた王子様じゃないけど　歩き出そう",
            },
            { timeTag: "[02:52.65]", text: "今日から始まる　新しいストーリー" },
            { timeTag: "[02:59.04]", text: "今さらのHappy Valentine..." },
          ],
        }}
      />
      <Composition
        id="ScarsIntoStars"
        component={ScarsIntoStarsVideo}
        durationInFrames={5700} // 3:10 (190s) to cover final lyric tail
        fps={30}
        width={1920}
        height={1080}
        schema={scarsIntoStarsSchema}
        defaultProps={{
          fontSize: 42,
          bottomOffset: 50,
          title: "Scars into Stars",
          artist: "Akane",
          videoSource: staticFile("suno_PJ/done/ScarsIntoStars.mp4"),
          lyrics: [
            { timeTag: "[00:00.67]", text: "おとぎ話で見た ガラスの城" },
            { timeTag: "[00:04.85]", text: "ここは息が止まるほど冷たい" },
            { timeTag: "[00:09.97]", text: "魔法の杖なんて 最初からない" },
            { timeTag: "[00:14.33]", text: "あるのは 擦り切れた踵（かかと）" },
            { timeTag: "[00:16.29]", text: "隠しきれない 青いあざの地図だけ" },
            { timeTag: "[00:21.05]", text: "何度も氷を叩いて 重力が私を縛る" },
            { timeTag: "[00:25.62]", text: "「もうやめたい」とこぼして" },
            { timeTag: "[00:27.78]", text: "白い息さえ 凍りついて" },
            { timeTag: "[00:30.32]", text: "あの頃の私が まだ私を睨んでる" },
            {
              timeTag: "[00:35.32]",
              text: "「ここで終わるために 泣いたわけじゃない」",
            },
            { timeTag: "[00:39.78]", text: "いま 夢にまで見た舞台に立つ" },
            {
              timeTag: "[00:44.20]",
              text: "スポットライトが 過去の影を焼き尽くしていく",
            },
            {
              timeTag: "[00:48.97]",
              text: "震える指先 解けないように結んだのは",
            },
            {
              timeTag: "[00:53.48]",
              text: "ただのひもじゃない みんなの願いだ",
            },
            {
              timeTag: "[00:58.11]",
              text: "傷だらけの足で 私は今日、光になる",
            },
            {
              timeTag: "[01:07.41]",
              text: "派手な衣装（ドレス）に隠した 無数の傷",
            },
            { timeTag: "[01:11.75]", text: "それは誰も知らない 私だけの勲章" },
            {
              timeTag: "[01:16.48]",
              text: "華やかに見える この数分間（とき）のために",
            },
            { timeTag: "[01:20.49]", text: "何度も 暗闇をさまよってきた" },
            {
              timeTag: "[01:24.85]",
              text: "一人きりの戦場だと ずっと思っていた",
            },
            { timeTag: "[01:29.00]", text: "耳を塞いで 孤独を愛そうとした" },
            { timeTag: "[01:33.72]", text: "だけど聞こえる 息をのむ音" },
            { timeTag: "[01:36.03]", text: "背中に感じる 声援が" },
            { timeTag: "[01:38.64]", text: "一人じゃきっと ここにはいない" },
            { timeTag: "[01:43.43]", text: "跳ぶよ 銀色のリンクを駆ける" },
            { timeTag: "[01:47.45]", text: "重力から解放されて 舞い上がる" },
            { timeTag: "[01:52.27]", text: "転んだ数が ここまで連れてきた" },
            { timeTag: "[01:57.14]", text: "冷たい痛みも 全部連れて行く" },
            {
              timeTag: "[02:01.37]",
              text: "この一瞬が 永遠に変わる場所へ Scars into Stars...",
            },
            { timeTag: "[02:11.53]", text: "一瞬の迷いが 運命を分けるなら" },
            {
              timeTag: "[02:15.18]",
              text: "私は迷わない エッジが描く軌跡を信じて",
            },
            { timeTag: "[02:19.95]", text: "積み上げた日々が 私の刃" },
            {
              timeTag: "[02:25.04]",
              text: "さあ、行こう 誰も見たことのない景色へ",
            },
            {
              timeTag: "[02:31.86]",
              text: "いま　夢の舞台で　あなたに返していく　もらった熱を",
            },
            {
              timeTag: "[02:36.52]",
              text: "スポットライトより 眩しい景色がここにあった",
            },
            { timeTag: "[02:40.78]", text: "震える心で 確かに掴んだものは" },
            { timeTag: "[02:45.39]", text: "私だけのじゃない みんなの願いだ" },
            {
              timeTag: "[02:49.97]",
              text: "傷跡はいま 星座になって輝く Scars into Stars...",
            },
          ],
        }}
      />
      <Composition
        id="SabishigariOni"
        component={SabishigariOniVideo}
        durationInFrames={5766} // 3:00.22 + 12s buffer = 192.22s * 30fps
        fps={30}
        width={1920}
        height={1080}
        schema={sabishigariOniSchema}
        defaultProps={{
          fontSize: 25,
          bottomOffset: 80,
          title: "寂しがり屋な鬼の唄",
          artist: "Suno AI",
          videoSource: staticFile("suno_PJ/done/寂しがり屋な鬼の唄.mp4"),
          lyrics: [
            { timeTag: "[00:01.16]", text: "街中から聞こえる「鬼は外」の声" },
            {
              timeTag: "[00:08.20]",
              text: "賑やかな笑い声　冬の空に溶けていく",
            },
            {
              timeTag: "[00:14.77]",
              text: "この部屋には静寂だけが　冷たく響いて",
            },
            { timeTag: "[00:21.57]", text: "二人で買った鬼のお面" },
            { timeTag: "[00:24.75]", text: "去年の君の笑顔　ふと思い出す" },
            { timeTag: "[00:29.62]", text: "ずっと一緒だってさ" },
            { timeTag: "[00:34.39]", text: "当たり前の幸せ" },
            { timeTag: "[00:37.49]", text: "なんの根拠もなく　信じてた" },
            { timeTag: "[00:43.15]", text: "目の前の泣いてる君に気づかない" },
            { timeTag: "[00:51.62]", text: "そんな鬼の僕" },
            { timeTag: "[00:54.93]", text: "福が逃げた「鬼」だけの部屋" },
            { timeTag: "[01:01.46]", text: "いつまでも帰りを待ってる" },
            {
              timeTag: "[01:08.51]",
              text: "福に見捨てられた　寂しがり屋の鬼の唄",
            },
            {
              timeTag: "[01:22.58]",
              text: "恵方巻の向く方角は　毎年変わるのに",
            },
            { timeTag: "[01:28.57]", text: "僕はいつまでも　変われないまま" },
            {
              timeTag: "[01:32.32]",
              text: "少しずつズレてた二人に　気づかないまま",
            },
            {
              timeTag: "[01:38.74]",
              text: "置いて行かれたマグカップがこっちを見てる",
            },
            {
              timeTag: "[01:46.47]",
              text: "豆を投げつけられて　痛いほうがマシだった",
            },
            {
              timeTag: "[01:53.07]",
              text: "何も言わずに消えた　その静けさが痛い",
            },
            { timeTag: "[01:57.83]", text: "悪いのは鬼だよ　僕が鬼だったんだ" },
            {
              timeTag: "[02:02.19]",
              text: "君の笑顔を食いつぶした　わがままな鬼",
            },
            { timeTag: "[02:12.71]", text: "「福」が幸せを持ってきたのに" },
            {
              timeTag: "[02:19.49]",
              text: "追い出した「鬼」が　春をまだ探してる",
            },
            { timeTag: "[02:26.15]", text: "バイバイ　愛しい福の神" },
            { timeTag: "[02:39.45]", text: "鬼は内　福は外..." },
            {
              timeTag: "[02:46.40]",
              text: "この部屋に　春は来ない　まだこない",
            },
            { timeTag: "[02:53.30]", text: "来年の恵方は　君のいる街" },
            { timeTag: "[03:00.22]", text: "これは寂しがり屋な鬼の唄" },
          ],
        }}
      />
      <Composition
        id="MijukuNaStrawberry"
        component={MijukuNaStrawberryVideo}
        durationInFrames={7500} // ~4m10s
        fps={30}
        width={1920}
        height={1080}
        schema={mijukuNaStrawberrySchema}
        defaultProps={{
          fontSize: 40,
          bottomOffset: 50,
          title: "未熟なストロベリー",
          artist: "紗季（Saki）",
          videoSource: staticFile("未熟なストロベリー.mp4"),
          lyrics: [
            {
              timeTag: "[00:15.73]",
              text: "傷だらけのコンバース　うつむいて歩く",
            },
            { timeTag: "[00:21.92]", text: "あの子のインスタ　キラキラが痛い" },
            { timeTag: "[00:28.14]", text: "「私なんて」って言葉　口癖にして" },
            { timeTag: "[00:34.09]", text: "自分の価値を　今日も値引き" },
            { timeTag: "[00:40.45]", text: "あの有名店で　綺麗に並んだ" },
            { timeTag: "[00:46.40]", text: "優等生のイチゴに　ならなくていい" },
            { timeTag: "[00:52.82]", text: "土にまみれて　風に吹かれて" },
            {
              timeTag: "[00:59.35]",
              text: "ゆっくり赤くなる　その時間を信じて",
            },
            { timeTag: "[01:06.01]", text: "フレー！ フレー！ ストロベリー" },
            { timeTag: "[01:08.68]", text: "酸っぱさは　一生懸命生きてる証拠" },
            { timeTag: "[01:14.39]", text: "誰かと比べて　凹んだ分だけ" },
            { timeTag: "[01:18.91]", text: "深みのある　味になっていく" },
            { timeTag: "[01:21.95]", text: "世界にひとつの　その不格好さを" },
            {
              timeTag: "[01:27.00]",
              text: "「最高」って笑える日が　必ず来るから",
            },
            { timeTag: "[01:34.05]", text: "既読がつかない　スマホの画面" },
            { timeTag: "[01:39.96]", text: "恋の悩みは　答え合わせができない" },
            {
              timeTag: "[01:45.69]",
              text: "全部うまくいく　脚本（シナリオ）なんてない",
            },
            { timeTag: "[01:49.64]", text: "だからこそ　明日が愛おしい" },
            { timeTag: "[01:53.07]", text: "雨が降らなきゃ　果実は育たない" },
            { timeTag: "[01:58.25]", text: "涙を流した分だけ　甘みが増すの" },
            { timeTag: "[02:04.20]", text: "今はまだ　白い未熟なストロベリー" },
            {
              timeTag: "[02:10.74]",
              text: "でもあなたの中には　太陽が眠ってる",
            },
            { timeTag: "[02:18.06]", text: "フレー！ フレー！ ストロベリー" },
            {
              timeTag: "[02:20.73]",
              text: "もどかしさは　まだまだ甘くなる証拠",
            },
            { timeTag: "[02:26.39]", text: "「大好き」が言えずに　震えた夜も" },
            { timeTag: "[02:30.64]", text: "無駄なことなんて　ひとつもない" },
            { timeTag: "[02:36.21]", text: "グラデーション　途中の景色" },
            { timeTag: "[02:41.93]", text: "思い切り抱きしめて　歩いていこう" },
            { timeTag: "[02:48.99]", text: "今はまだ　誰も気づいていなくても" },
            { timeTag: "[02:55.10]", text: "あなたの光を　私は知っている" },
            { timeTag: "[03:01.11]", text: "傷つくことを　恐れないで" },
            { timeTag: "[03:07.11]", text: "その痛みが　甘味を増すの" },
            { timeTag: "[03:17.02]", text: "フレー！ フレー！ ストロベリー" },
            {
              timeTag: "[03:19.90]",
              text: "未熟なままで　あなたはもうパーフェクト",
            },
            { timeTag: "[03:25.68]", text: "真っ赤に染まる　その日を待たずに" },
            { timeTag: "[03:32.15]", text: "今、この瞬間を　誇っていいんだよ" },
            { timeTag: "[03:37.99]", text: "甘酸っぱい　今のあなたに" },
            { timeTag: "[03:44.30]", text: "世界中が　恋をする準備をしてる" },
            { timeTag: "[03:50.84]", text: "そのままの君で　突き進め！" },
          ],
        }}
      />
      <Composition
        id="KamisamaNoItazura"
        component={KamisamaVideo}
        durationInFrames={5100} // ~2m50s = 170s. 170 * 30 = 5100 frames. Added buffer.
        fps={30}
        width={1920}
        height={1080}
        schema={kamisamaVideoSchema}
        defaultProps={{
          fontSize: 45,
          bottomOffset: 100,
          timeShift: 0,
          lyrics: [
            { timeTag: "[00:00.67]", text: "click　click　光る画面" },
            { timeTag: "[00:02.13]", text: "perfect plan, perfect world" },
            { timeTag: "[00:04.47]", text: "なのに胸のどこかだけ" },
            { timeTag: "[00:08.01]", text: "バグったまんま" },
            { timeTag: "[00:11.21]", text: "ネオンの雨をくぐるハイヒール" },
            { timeTag: "[00:14.54]", text: "摩天楼を映すガラスのスーツ" },
            { timeTag: "[00:18.42]", text: "スペック最強　肩書きフル装備" },
            { timeTag: "[00:22.39]", text: "なのに small talk だけ赤点" },
            { timeTag: "[00:26.15]", text: "通知音が夜を埋めても" },
            { timeTag: "[00:28.49]", text: "心だけオフラインのまま" },
            { timeTag: "[00:30.98]", text: "笑い声が近づくたびに" },
            { timeTag: "[00:34.61]", text: "視界が急にノイズまみれ" },
            { timeTag: "[00:38.61]", text: "そんな calibration 外れた世界に" },
            { timeTag: "[00:41.01]", text: "急行列車がブレーキをかける" },
            { timeTag: "[00:43.20]", text: "ビルの海から　田んぼの波へ" },
            { timeTag: "[00:45.45]", text: "風景ごと soft reset" },
            { timeTag: "[00:48.31]", text: "あえてこんな世界　見せてくるのは" },
            { timeTag: "[00:50.81]", text: "きっと神様のイタズラでしょ" },
            { timeTag: "[00:52.88]", text: "ネオンと稲穂　同じ空の下" },
            { timeTag: "[00:55.30]", text: "logic じゃ選べない方角" },
            { timeTag: "[00:57.17]", text: "転びそうな heart に" },
            { timeTag: "[00:59.27]", text: "わざと小石を置いてくる" },
            { timeTag: "[01:00.81]", text: "No algorithm for love" },
            {
              timeTag: "[01:02.79]",
              text: "そんなステージが　ちょっとおもしろい",
            },
            { timeTag: "[01:06.90]", text: "Wi-Fi 途切れた小さな駅前" },
            { timeTag: "[01:09.56]", text: "長靴の泥がきらりと光る" },
            { timeTag: "[01:11.59]", text: "マニュアルにない笑い声だけが" },
            { timeTag: "[01:12.92]", text: "やけにクリアに響いてる" },
            { timeTag: "[01:14.22]", text: "効率悪い手仕事の午後" },
            { timeTag: "[01:16.39]", text: "ゆっくり回る扇風機の影" },
            { timeTag: "[01:18.98]", text: "予定調和じゃない沈黙が" },
            { timeTag: "[01:21.16]", text: "知らない rhythm を刻みだす" },
            { timeTag: "[01:22.84]", text: "誰かのバグに　誰かの笑い声" },
            { timeTag: "[01:25.17]", text: "ぎこちない手と手の distance" },
            { timeTag: "[01:26.85]", text: "説明書には書いてないルートを" },
            { timeTag: "[01:29.27]", text: "なぜか足が選んでく" },
            { timeTag: "[01:32.48]", text: "あえてこんな世界　混ぜてくるのは" },
            { timeTag: "[01:34.90]", text: "たぶん神様のユーモアでしょ" },
            { timeTag: "[01:36.78]", text: "shortcut だらけの人生マップに" },
            { timeTag: "[01:39.19]", text: "わざと遠回りの印" },
            { timeTag: "[01:41.11]", text: "完璧じゃない code に" },
            { timeTag: "[01:43.15]", text: "そっと “好き” をコメントしてくる" },
            { timeTag: "[01:44.54]", text: "No algorithm for love" },
            {
              timeTag: "[01:47.53]",
              text: "デバッグ中でも　再生ボタンは play",
            },
            { timeTag: "[01:57.25]", text: "雲の上で誰かが" },
            { timeTag: "[01:59.22]", text: "「そろそろ崩してみようか」と" },
            {
              timeTag: "[02:00.37]",
              text: "ピースをひとつ　入れ替えたみたいな",
            },
            { timeTag: "[02:02.95]", text: "タイミングの悪さがちょうどいい" },
            { timeTag: "[02:05.17]", text: "正解なんて退屈で" },
            { timeTag: "[02:07.13]", text: "伏線回収もいらないよ" },
            { timeTag: "[02:08.82]", text: "オチのない会話の続きから" },
            { timeTag: "[02:11.13]", text: "次の scene が始まる" },
            { timeTag: "[02:16.48]", text: "あえてこんな世界　渡してくるのは" },
            { timeTag: "[02:18.73]", text: "きっと神様の悪ノリでしょ" },
            { timeTag: "[02:20.67]", text: "ネオンの夜も　夕焼けの帰り道も" },
            { timeTag: "[02:23.06]", text: "どっちも main story" },
            { timeTag: "[02:25.04]", text: "転びそうな heart を" },
            { timeTag: "[02:27.13]", text: "何度も立たせて笑ってる" },
            { timeTag: "[02:29.35]", text: "No algorithm for love" },
            {
              timeTag: "[02:31.00]",
              text: "バグだらけのまま　アップデートしていく",
            },
            { timeTag: "[02:35.00]", text: "click　click　画面を閉じて" },
            { timeTag: "[02:36.30]", text: "耳をすませば breathe & laugh" },
            { timeTag: "[02:38.46]", text: "いたずらみたいなこの世界ごと" },
            { timeTag: "[02:40.87]", text: "好きになれたら　game on" },
          ],
        }}
      />
      <Composition
        id="KineticTypography"
        component={KineticTypography}
        durationInFrames={4500}
        fps={30}
        width={1920}
        height={1080}
        schema={kineticTypographySchema}
        defaultProps={{
          primaryColor: "#ff00bb",
          secondaryColor: "#ffffff",
          glowIntensity: 1,
          videoOpacity: 1,
          mainFontSize: 50,
          emphasisFontSize: 75,
          animationSpeed: 1.2,
          scaleIntensity: 1.2,
          lyricsData: [
            { timeString: "[00:01.07]", text: "Pathetic." },
            { timeString: "[00:02.30]", text: "" },
            { timeString: "[00:14.62]", text: "午前2時 耳障りな鍵の音" },
            { timeString: "[00:17.85]", text: "また負け犬の顔で帰宅か" },
            { timeString: "[00:18.42]", text: "コンビニ弁当の安っぽい匂い" },
            { timeString: "[00:20.96]", text: "私の美学に反するわ" },
            {
              timeString: "[00:24.49]",
              text: "餌の皿は空っぽ 撫でる手つきも雑で不快",
            },
            { timeString: "[00:28.45]", text: "「既読がつかない」？" },
            {
              timeString: "[00:29.83]",
              text: "画面ばかり見てるその姿勢が醜い",
            },
            { timeString: "[00:35.63]", text: "人間はこれだから面倒" },
            { timeString: "[00:37.74]", text: "言いたいことは言えばいい" },
            { timeString: "[00:39.12]", text: "尻尾を立てて" },
            { timeString: "[00:40.24]", text: "マーキング" },
            { timeString: "[00:41.09]", text: "それだけで済む話でしょう？" },
            { timeString: "[00:45.45]", text: "勘違いしないで" },
            {
              timeString: "[00:46.04]",
              text: "あんたを心配してるわけじゃない",
            },
            {
              timeString: "[00:48.56]",
              text: "ただ私の世話係が 暗い顔だと目障りなだけ",
            },
            {
              timeString: "[00:54.48]",
              text: "恋のチャンスは気まぐれな猫（キャット）",
            },
            { timeString: "[00:56.76]", text: "待ってなんてくれない" },
            { timeString: "[00:58.10]", text: "さっさと行きなさい" },
            { timeString: "[00:59.18]", text: "邪魔よ Midnight Meow..." },
            { timeString: "[01:03.22]", text: "週末なのに予定なし？" },
            { timeString: "[01:05.18]", text: "ソファを占領しないで" },
            { timeString: "[01:06.63]", text: "優しいだけが取り柄？" },
            { timeString: "[01:08.57]", text: "それはただの「優柔不断」" },
            {
              timeString: "[01:10.59]",
              text: "画面の中の女より 目の前の現実（リアル）を見なさい",
            },
            {
              timeString: "[01:14.39]",
              text: "猫じゃらし振る暇があるなら |自分のプライドを拾い上げたらどう？",
            },
            { timeString: "[01:18.16]", text: "黙って聞いてれば" },
            {
              timeString: "[01:22.02]",
              text: "ウジウジと 言葉にしなきゃ伝わらない",
            },
            { timeString: "[01:26.79]", text: "喉を鳴らしても届かない" },
            { timeString: "[01:27.97]", text: "玉砕しても構わない" },
            { timeString: "[01:29.27]", text: "とっとと電話しなさい" },
            {
              timeString: "[01:33.36]",
              text: "……あとで高い餌くらいは奢らせてやる",
            },
            { timeString: "[01:54.83]", text: "" },
            {
              timeString: "[01:55.05]",
              text: "言ったはずよ あんたを愛してなんかいない",
            },
            {
              timeString: "[01:58.20]",
              text: "ただ私の下僕として |恥ずかしくない顔でいなさい",
            },
            {
              timeString: "[02:04.09]",
              text: "恋のチャンスは気まぐれな猫（キャット）",
            },
            { timeString: "[02:06.07]", text: "扉はもう開いてる" },
            {
              timeString: "[02:07.95]",
              text: "さっさと失せな Midnight Meow...",
            },
            { timeString: "[02:17.95]", text: "振られたら帰ってきなさい" },
            { timeString: "[02:19.06]", text: "嘲笑ってあげるから" },
            { timeString: "[02:21.93]", text: "Good luck, Servant." },
            { timeString: "[02:25.95]", text: "Fuh..." },
            { timeString: "[01:37:10]", text: "" },
            { timeString: "[02:10:00]", text: "" },
            { timeString: "[02:39:00]", text: "" },
          ],
        }}
      />
      <Composition
        id="InvisibleBorder"
        component={InvisibleBorderVideo}
        durationInFrames={5400} // ~3 minutes = 180s * 30fps
        fps={30}
        width={1920}
        height={1080}
        schema={invisibleBorderSchema}
        defaultProps={{
          fontSize: 45,
          topOffset: 850,
          lyrics: [
            { timeTag: "[00:15.53]", text: "見えない指紋　聞こえない足音" },
            { timeTag: "[00:22.25]", text: "現場（ココ）には何もない" },
            { timeTag: "[00:25.46]", text: "あるのは姿なき脅迫状（メール）" },
            { timeTag: "[00:29.62]", text: "私の銃じゃ撃ち抜けない" },
            { timeTag: "[00:37.36]", text: "現れたパーカー姿のガキ" },
            {
              timeTag: "[00:39.11]",
              text: "「遅くなりました」って　ここはお前の教室じゃない",
            },
            {
              timeTag: "[00:43.71]",
              text: "「AI（かれら）は友達です」　世界はどうなっちゃったの？",
            },
            { timeTag: "[00:53.40]", text: "走るコード　弾けるトラップ" },
            { timeTag: "[00:56.84]", text: "君の指先が魔法みたいだ" },
            { timeTag: "[01:00.67]", text: "閉ざされた回路（ゲート）" },
            { timeTag: "[01:02.37]", text: "次々開いてく 常識なんて" },
            { timeTag: "[01:04.41]", text: "もう役に立たない世界" },
            { timeTag: "[01:07.45]", text: "「嘘でしょ？」" },
            { timeTag: "[01:08.30]", text: "私の知らない正義が光る" },
            { timeTag: "[01:11.58]", text: "AI（キミ）とAI（ヤツ）との" },
            { timeTag: "[01:14.39]", text: "光速の戦争（ウォー）" },
            { timeTag: "[01:15.80]", text: "君が切り拓く未来なら" },
            { timeTag: "[01:19.46]", text: "私はあなたの" },
            {
              timeTag: "[01:37.47]",
              text: "画面の中の悪意　飲み込まれそうになっても",
            },
            { timeTag: "[01:41.02]", text: "君は信じてる　プログラムの可能性" },
            { timeTag: "[01:44.49]", text: "「世界はどうなっちゃったの？」" },
            { timeTag: "[01:46.61]", text: "嘆く暇はない" },
            {
              timeTag: "[01:48.06]",
              text: "アナログな私の熱（ハート）で　君の冷却（クール）を支えるわ",
            },
            { timeTag: "[02:00.72]", text: "走るコード　弾けるトラップ" },
            { timeTag: "[02:04.22]", text: "その判断が世界を救う" },
            { timeTag: "[02:07.72]", text: "閉ざされた回路（ゲート）" },
            { timeTag: "[02:09.12]", text: "次々開いてく" },
            { timeTag: "[02:10.12]", text: "悪の遊びを　ここで終わらせる" },
            {
              timeTag: "[02:14.50]",
              text: "「嘘でしょ？」が「行ける」に変わる",
            },
            { timeTag: "[02:16.09]", text: "AI（こちら）とAI（あちら）の" },
            { timeTag: "[02:18.06]", text: "光速の戦争（ウォー）" },
            { timeTag: "[02:19.08]", text: "彼が切り拓く未来なら" },
            { timeTag: "[02:23.00]", text: "私は　あなたの背中を守る" },
            {
              timeTag: "[02:29.34]",
              text: "さあ、行こう　見えない境界線の向こうへ",
            },
            { timeTag: "[02:34.00]", text: "守ってみせる　君と、この世界を" },
            { timeTag: "[01:52.50]", text: "" },
            { timeTag: "[01:26.00]", text: "" },
          ],
        }}
      />
      <Composition
        id="KuhakuNoYuki"
        component={KuhakuNoYukiVideo}
        durationInFrames={6500} // ~3m36s * 30fps
        fps={30}
        width={1920}
        height={1080}
        schema={kuhakuNoYukiSchema}
        defaultProps={{
          fontSize: 38,
          bottomOffset: 100,
          lyrics: [
            { timeTag: "[00:13.78]", text: "通知が止まない" },
            { timeTag: "[00:16.37]", text: "スマホの画面" },
            { timeTag: "[00:20.25]", text: "誰もが誰かと" },
            { timeTag: "[00:21.51]", text: "笑い合う夜" },
            { timeTag: "[00:23.49]", text: "街はきらめき" },
            { timeTag: "[00:27.24]", text: "白雪（しらゆき）が舞う" },
            { timeTag: "[00:29.87]", text: "まるで世界中が" },
            { timeTag: "[00:33.45]", text: "幸せなふりしてるみたい" },
            { timeTag: "[00:40.06]", text: "去年の今頃" },
            { timeTag: "[00:41.50]", text: "約束したね" },
            { timeTag: "[00:43.20]", text: "「来年もここで」って" },
            { timeTag: "[00:45.47]", text: "手を繋いだ" },
            { timeTag: "[00:48.06]", text: "当たり前のように" },
            { timeTag: "[00:49.31]", text: "隣にいると" },
            { timeTag: "[00:51.20]", text: "疑いもしなかった" },
            { timeTag: "[00:54.49]", text: "私が馬鹿みたいだね" },
            { timeTag: "[00:59.73]", text: "あの日々は" },
            { timeTag: "[01:00.38]", text: "どこへ消えたの？" },
            { timeTag: "[01:02.42]", text: "喧嘩したわけじゃない" },
            { timeTag: "[01:06.18]", text: "ただ少しずつ" },
            { timeTag: "[01:06.72]", text: "二人のリズムが" },
            { timeTag: "[01:08.61]", text: "ズレていっただけ" },
            { timeTag: "[01:10.51]", text: "気づいた時にはもう" },
            { timeTag: "[01:15.35]", text: "手遅れだった" },
            { timeTag: "[01:18.11]", text: "あなたがいない聖夜" },
            { timeTag: "[01:21.37]", text: "白い雪が降り積もる" },
            { timeTag: "[01:23.40]", text: "冷えた指先を" },
            { timeTag: "[01:25.77]", text: "温めるポケットは空っぽで" },
            { timeTag: "[01:29.28]", text: "「元気でいてね」なんて" },
            { timeTag: "[01:32.00]", text: "今さら強がり" },
            { timeTag: "[01:35.00]", text: "届かない想いだけが" },
            { timeTag: "[01:38.98]", text: "白く白く" },
            { timeTag: "[01:41.21]", text: "溶けていく" },
            { timeTag: "[01:46.10]", text: "不器用なあなただから" },
            { timeTag: "[01:48.00]", text: "少し心配" },
            { timeTag: "[01:52.41]", text: "私にできることは" },
            { timeTag: "[01:54.20]", text: "もう何もないけれど" },
            { timeTag: "[01:58.74]", text: "遠い空の下で" },
            { timeTag: "[02:05.00]", text: "あなたの無事を願う" },
            { timeTag: "[02:08.30]", text: "時間は戻せない" },
            { timeTag: "[02:09.82]", text: "わかってるけど" },
            { timeTag: "[02:12.37]", text: "今日だけは" },
            { timeTag: "[02:14.00]", text: "思い出させて" },
            { timeTag: "[02:17.51]", text: "あたたかかった" },
            { timeTag: "[02:20.73]", text: "あの背中を" },
            { timeTag: "[02:24.46]", text: "あなたがいない聖夜" },
            { timeTag: "[02:27.70]", text: "街は華やいでいく" },
            { timeTag: "[02:31.06]", text: "私の心だけ" },
            { timeTag: "[02:33.20]", text: "時が止まったまま" },
            { timeTag: "[02:37.52]", text: "それでも夜は明けて" },
            { timeTag: "[02:40.45]", text: "明日は来るから" },
            { timeTag: "[02:42.27]", text: "さよなら、愛しい人" },
            { timeTag: "[02:46.22]", text: "メリークリスマス" },
            { timeTag: "[02:51.64]", text: "Happy holidays to you..." },
            { timeTag: "[02:58.46]", text: "元気でいてね..." },
          ],
        }}
      />
      <Composition
        id="WhiteReset"
        component={WhiteResetVideo}
        durationInFrames={4500} // ~2m30s
        fps={30}
        width={1920}
        height={1080}
        schema={whiteResetSchema}
        defaultProps={{
          fontSize: 35,
          rightOffset: 0,
          topOffset: 100,
          timeShift: 0,
          lyrics: whiteResetData.lyrics,
        }}
      />
      <Composition
        id="Arigatou"
        component={ArigatouVideo}
        durationInFrames={5100} // ~2m50s
        fps={30}
        width={1920}
        height={1080}
        schema={arigatouSchema}
        defaultProps={{
          fontSize: 40,
          bottomOffset: 150,
          videoSource: arigatouData.videoSource,

          lyrics: arigatouData.lyrics,
        }}
      />
      <Composition
        id="RestartLine"
        component={RestartLineVideo}
        durationInFrames={30 * 180} // 3 minutes
        fps={30}
        width={1920}
        height={1080}
        schema={restartLineSchema}
        defaultProps={{
          fontSize: 55,
          bottomOffset: 50,
          videoSource: restartLineData.videoSource,
          lyrics: restartLineData.lyrics,
        }}
      />
      <Composition
        id="Sakebe"
        component={SakebeVideo}
        durationInFrames={30 * 130} // 2 minutes 10 seconds (approx)
        fps={30}
        width={1920}
        height={1080}
        schema={sakebeSchema}
        defaultProps={{
          fontSize: 35,
          videoSource: sakebeData.videoSource,
          lyrics: [
            {
              timeTag: "[00:00.67]",
              text: "鳴り響くアラーム　冷え切った朝の空気",
            },
            {
              timeTag: "[00:05.80]",
              text: "「おめでとう」の余韻は　もうどこにもない",
            },
            { timeTag: "[00:09.43]", text: "上司の小言　終わらないタスクの山" },
            { timeTag: "[00:12.62]", text: "解けない数式　インクで汚れた指先" },
            {
              timeTag: "[00:17.00]",
              text: "既読がつかないスマホ　ため息で曇る窓",
            },
            {
              timeTag: "[00:23.08]",
              text: "「普通」を演じるだけで　精一杯なんだ",
            },
            {
              timeTag: "[00:33.02]",
              text: "飲み込んだ言葉が　喉の奥で暴れてる",
            },
            { timeTag: "[00:37.06]", text: "限界だろ？　もう我慢しなくていい" },
            {
              timeTag: "[00:40.45]",
              text: "心拍数が　爆音でカウントダウンを始めた",
            },
            { timeTag: "[00:45.54]", text: "叫べ！　溜め込んだその感情を" },
            { timeTag: "[00:47.96]", text: "叫べ！　正解なんて後回しでいい" },
            { timeTag: "[00:51.69]", text: "仕事も勉強も　ぐちゃぐちゃな恋も" },
            { timeTag: "[00:55.08]", text: "全部この音に　叩きつけてしまえ！" },
            { timeTag: "[01:02.58]", text: "運命を揺らせ　お前の声で！" },
            {
              timeTag: "[01:09.56]",
              text: "休み明けの街は　なんだか他人事（ひとごと）で",
            },
            { timeTag: "[01:12.56]", text: "置いてけぼりみたいな　妙な焦燥感" },
            {
              timeTag: "[01:16.36]",
              text: "アイツとの喧嘩　言い返せなかったあの日",
            },
            {
              timeTag: "[01:20.36]",
              text: "「自分なんて」って言葉　呪いみたいにまとわりつく",
            },
            { timeTag: "[01:26.54]", text: "空っぽになったっていい" },
            { timeTag: "[01:29.07]", text: "またここから　満たしていけばいい" },
            { timeTag: "[01:32.49]", text: "準備はいいか？　魂を震わせろ！" },
            {
              timeTag: "[01:37.75]",
              text: "叫べ！　誰のためでもない自分のために",
            },
            { timeTag: "[01:41.07]", text: "叫べ！　明日を変えるのはその声だ" },
            { timeTag: "[01:46.57]", text: "嫌なこと全部　この空に放り投げて" },
            { timeTag: "[01:50.05]", text: "笑えるくらいに　バカになれ！" },
            { timeTag: "[01:54.80]", text: "何度でも　叫べ！" },
            { timeTag: "[01:57.74]", text: "さぁ、行こうぜ！" },
          ],
        }}
      />
      <Composition
        id="Ikiro"
        component={IkiroVideo}
        durationInFrames={30 * 232} // 3:52 video length
        fps={30}
        width={1920}
        height={1080}
        schema={ikiroSchema}
        defaultProps={{
          fontSize: 30,
          bottomOffset: 50,
          videoSource: staticFile("生きろ.mp4"),
          title: "生きろ",
          artist: "Rin",
          layoutMode: "horizontal" as const,
          lyrics: [
            {
              timeTag: "[00:11.42]",
              text: "また誰かの「幸せ」がタイムラインを流れてく",
            },
            {
              timeTag: "[00:16.71]",
              text: "指先ひとつで　自分の価値が下がっていく気がした",
            },
            {
              timeTag: "[00:23.01]",
              text: "鏡に映る顔は　昨日よりも疲れていて",
            },
            {
              timeTag: "[00:28.10]",
              text: "「なんで自分だけ」って　飲み込んだ言葉が喉を焼く",
            },
            { timeTag: "[00:34.33]", text: "上手くいかないことばかり数えて" },
            {
              timeTag: "[00:39.32]",
              text: "布団の中で　朝が来るのを怖がっている",
            },
            { timeTag: "[00:44.97]", text: "積み上げた期待は　簡単に崩れて" },
            {
              timeTag: "[00:50.33]",
              text: "ため息と一緒に　部屋の隅へ溶けていく",
            },
            { timeTag: "[00:55.79]", text: "それでも心臓は　勝手に動いている" },
            { timeTag: "[01:01.37]", text: "だから…" },
            { timeTag: "[01:02.50]", text: "生きろ！" },
            {
              timeTag: "[01:04.28]",
              text: "たとえ昨日までが　泥にまみれた失敗作でも",
            },
            { timeTag: "[01:13.68]", text: "生きろ！" },
            {
              timeTag: "[01:15.54]",
              text: "変えられない過去に　足を取られても",
            },
            { timeTag: "[01:24.08]", text: "明日はまだ　一秒も始まっていない" },
            {
              timeTag: "[01:27.20]",
              text: "白紙の時間を　その足で踏み出すために",
            },
            { timeTag: "[01:31.68]", text: "ただ、息を吸って　生きろ" },
            {
              timeTag: "[01:36.05]",
              text: "「頑張れば報われる」なんて　綺麗な嘘だ",
            },
            {
              timeTag: "[01:40.84]",
              text: "擦りむいた膝の痛みが　現実を教えてくる",
            },
            {
              timeTag: "[01:46.43]",
              text: "正しさだけじゃ　守れないものもある",
            },
            {
              timeTag: "[01:51.36]",
              text: "失うことの連続で　空っぽになりそうだ",
            },
            {
              timeTag: "[01:57.49]",
              text: "それでも夜は明けて　世界は回り続ける",
            },
            { timeTag: "[02:03.02]", text: "だから…" },
            { timeTag: "[02:04.21]", text: "生きろ！" },
            {
              timeTag: "[02:06.12]",
              text: "明日のことなんて　誰にもわかりはしない",
            },
            { timeTag: "[02:15.53]", text: "生きろ！" },
            {
              timeTag: "[02:17.21]",
              text: "その暗闇の先を　その目で見るために",
            },
            {
              timeTag: "[02:25.59]",
              text: "雨が止まないなら　濡れたまま行けばいい",
            },
            {
              timeTag: "[02:31.23]",
              text: "泥ハネさえ　今日の証（あかし）にしてしまえ",
            },
            { timeTag: "[02:37.34]", text: "明日を見るために　生きろ" },
            {
              timeTag: "[02:43.34]",
              text: "今日つけた傷は　一生消えないかもしれない",
            },
            {
              timeTag: "[02:48.55]",
              text: "昨日失くしたものは　二度と帰ってこない",
            },
            {
              timeTag: "[02:53.79]",
              text: "それでも　錆びついた手すりを　握り直して",
            },
            { timeTag: "[02:59.40]", text: "冷たい風の匂いを　肺に満たして" },
            { timeTag: "[03:04.75]", text: "新しい明日のために……" },
            { timeTag: "[03:13.60]", text: "生きろ！" },
            { timeTag: "[03:14.99]", text: "明日　来年　10年後…" },
            {
              timeTag: "[03:17.28]",
              text: "シワの増えた手で　何を掴んでいる？",
            },
            { timeTag: "[03:24.47]", text: "すり減った鍵か　あたたかい手か" },
            { timeTag: "[03:30.15]", text: "それを確かめるために" },
            { timeTag: "[03:34.62]", text: "その答え合わせをするために" },
            { timeTag: "[03:38.74]", text: "理由なんていらない" },
            { timeTag: "[03:43.51]", text: "ただ　しがみついてでも　生きろ" },
          ],
          emphasisLines: [
            { timeTag: "[01:02.50]", text: "生きろ！" },
            { timeTag: "[01:13.68]", text: "生きろ！" },
            { timeTag: "[02:04.21]", text: "生きろ！" },
            { timeTag: "[02:15.53]", text: "生きろ！" },
            { timeTag: "[03:13.60]", text: "生きろ！" },
          ],
          sections: [
            {
              name: "A1",
              startTimeTag: "[00:11.42]",
              overlayOpacity: 0.2,
              fontScale: 0.95,
            },
            {
              name: "B1",
              startTimeTag: "[00:44.97]",
              overlayOpacity: 0.28,
              fontScale: 1,
            },
            {
              name: "サビ1",
              startTimeTag: "[01:02.50]",
              overlayOpacity: 0.4,
              fontScale: 1.2,
            },
            {
              name: "A2",
              startTimeTag: "[01:36.05]",
              overlayOpacity: 0.2,
              fontScale: 0.95,
            },
            {
              name: "B2",
              startTimeTag: "[02:03.02]",
              overlayOpacity: 0.28,
              fontScale: 1,
            },
            {
              name: "サビ2",
              startTimeTag: "[02:04.21]",
              overlayOpacity: 0.4,
              fontScale: 1.2,
            },
            {
              name: "ブリッジ",
              startTimeTag: "[02:43.34]",
              overlayOpacity: 0.26,
              fontScale: 1.05,
            },
            {
              name: "ラスサビ",
              startTimeTag: "[03:13.60]",
              overlayOpacity: 0.42,
              fontScale: 1.22,
            },
          ],
          rightOffset: 3,
          topOffset: 5,
        }}
      />
      <Composition
        id="Saitekikai"
        component={SaitekikaiVideo}
        durationInFrames={30 * 100} // ~1m40s
        fps={30}
        width={1920}
        height={1080}
        schema={saitekikaiSchema}
        defaultProps={{
          fontSize: 40,
          videoSource: "http://localhost:3000/src/HelloWorld/最適解.mp4",
          lyrics: [
            { timeTag: "[00:08.06]", text: "きみの好みなら 全部知ってる" },
            { timeTag: "[00:10.42]", text: "言わなくたって わかるんだ" },
            { timeTag: "[00:12.16]", text: "あつめた癖や 選ぶ色" },
            { timeTag: "[00:14.50]", text: "僕の中で 膨れ上がってる" },
            { timeTag: "[00:16.89]", text: "先回りして 用意した" },
            { timeTag: "[00:19.23]", text: "完璧な週末のプラン" },
            { timeTag: "[00:20.97]", text: "「すごいね」って笑うきみの" },
            { timeTag: "[00:22.53]", text: "瞳の奥 解析(よ)めないな" },
            { timeTag: "[00:24.17]", text: "正解ばかり 選び続けて" },
            { timeTag: "[00:28.58]", text: "傷つかない術 学んだけど" },
            { timeTag: "[00:32.61]", text: "きみがふいに 落とした涙は" },
            { timeTag: "[00:34.78]", text: "どんな予測も 追いつかないエラー" },
            { timeTag: "[00:40.15]", text: "計算ずくの優しさじゃ" },
            { timeTag: "[00:42.87]", text: "きみの孤独は 埋まらない" },
            { timeTag: "[00:45.02]", text: "ゼロとイチの 隙間に落ちた" },
            { timeTag: "[00:46.45]", text: "割り切れない熱に 触れたいんだ" },
            { timeTag: "[00:48.59]", text: "アップデートなんて いらないよ" },
            { timeTag: "[00:50.53]", text: "不器用なままの ノイズ混じりで" },
            {
              timeTag: "[00:53.30]",
              text: "ただ きみと同期（シンクロ）したい",
            },
            { timeTag: "[00:57.00]", text: "" },
            { timeTag: "[01:05.10]", text: "過去のログを 辿るよりも" },
            { timeTag: "[01:06.46]", text: "今この瞬間を 重ねたい" },
            {
              timeTag: "[01:08.99]",
              text: "自動生成(つく)られた 言葉じゃない",
            },
            { timeTag: "[01:10.23]", text: "生の声を 届けに行くよ" },
            { timeTag: "[01:13.75]", text: "計算ずくの優しさじゃ" },
            { timeTag: "[01:17.06]", text: "きみの孤独は 埋まらない" },
            { timeTag: "[01:19.14]", text: "ゼロとイチの 隙間に落ちた" },
            { timeTag: "[01:20.61]", text: "割り切れない熱に 触れたいんだ" },
            { timeTag: "[01:22.96]", text: "バグだらけの 僕の心で" },
            { timeTag: "[01:24.43]", text: "ただ きみを愛してる" },
            { timeTag: "[01:30.70]", text: "きみだけの 僕でいたい" },
            { timeTag: "[01:34.90]", text: "最適解なんて 飛び越えて" },
          ],
          bottomOffset: 75,
        }}
      />
      <Composition
        id="BokuraWaMata"
        component={BokuraWaMataVideo}
        durationInFrames={30 * 165} // ~2m45s
        fps={30}
        width={1920}
        height={1080}
        schema={bokuraWaMataSchema}
        defaultProps={{
          fontSize: 32,
          videoSource: bokuraWaMataData.videoSource,
          title: bokuraWaMataData.title,
          artist: bokuraWaMataData.artist,
          lyrics: bokuraWaMataData.lyrics,
        }}
      />
      <Composition
        id="KamenButokai"
        component={KamenButokaiVideo}
        durationInFrames={30 * 160}
        fps={30}
        width={1920}
        height={1080}
        schema={kamenButokaiSchema}
        defaultProps={{
          fontSize: 25,
          bottomOffset: 120,
          videoSource: staticFile("仮面舞踏会.mp4"),
          title: "仮面舞踏会",
          artist: "",
          lyrics: [
            {
              timeTag: "[00:14.09]",
              text: "手のひらで回る 終わらない舞踏会",
              side: "left" as const,
            },
            {
              timeTag: "[00:17.96]",
              text: "「理想の私」演じて 踊り続けるの",
              side: "right" as const,
            },
            {
              timeTag: "[00:20.72]",
              text: "通知のファンファーレ 止まらない喝采",
              side: "left" as const,
            },
            {
              timeTag: "[00:22.86]",
              text: "みんなが言うの 「素敵なドレスね」って",
              side: "right" as const,
            },
            {
              timeTag: "[00:30.22]",
              text: "画面消せば 魔法は解けて",
              side: "left" as const,
            },
            {
              timeTag: "[00:32.00]",
              text: "散らかった部屋 静寂のバックステージ",
              side: "right" as const,
            },
            {
              timeTag: "[00:35.18]",
              text: "「サヨナラ」告げた 彼の背中と",
              side: "left" as const,
            },
            {
              timeTag: "[00:37.21]",
              text: "一人ぼっちの 冷めたディナー",
              side: "right" as const,
            },
            {
              timeTag: "[00:41.13]",
              text: "輝くアイコン 煌めく虚構",
              side: "left" as const,
            },
            {
              timeTag: "[00:42.82]",
              text: "仮面姿の 私が微笑む",
              side: "right" as const,
            },
            {
              timeTag: "[00:46.33]",
              text: "完璧なステップ でも奥が痛むの",
              side: "left" as const,
            },
            {
              timeTag: "[00:49.69]",
              text: "仮面のない私… それは私？",
              side: "right" as const,
            },
            {
              timeTag: "[00:53.35]",
              text: "自分が誰か わからない",
              side: "left" as const,
            },
            {
              timeTag: "[00:59.20]",
              text: "もう この曲に合わせて踊れない",
              side: "right" as const,
            },
            {
              timeTag: "[01:02.17]",
              text: "誰かの期待 振りほどきたいのに",
              side: "left" as const,
            },
            {
              timeTag: "[01:04.75]",
              text: "震える指先 仮面に触れて",
              side: "right" as const,
            },
            {
              timeTag: "[01:07.74]",
              text: "ホールの出口で 躊躇ってる",
              side: "left" as const,
            },
            {
              timeTag: "[01:09.99]",
              text: "このドアを開けるのが 怖いから",
              side: "right" as const,
            },
            {
              timeTag: "[01:21.03]",
              text: "傷つくことから 逃げ回って",
              side: "left" as const,
            },
            {
              timeTag: "[01:23.23]",
              text: "作り笑いの ドレスを纏った",
              side: "right" as const,
            },
            {
              timeTag: "[01:25.29]",
              text: "でもその重さに 押しつぶされて",
              side: "left" as const,
            },
            {
              timeTag: "[01:26.99]",
              text: "息をするのも 苦しいの",
              side: "right" as const,
            },
            {
              timeTag: "[01:36.00]",
              text: "張り付いた嘘が 肌に食い込む",
              side: "left" as const,
            },
            {
              timeTag: "[01:38.83]",
              text: "痛いよ 怖いよ でも",
              side: "right" as const,
            },
            {
              timeTag: "[01:40.09]",
              text: "重たい扉の 隙間から",
              side: "left" as const,
            },
            {
              timeTag: "[01:42.30]",
              text: "夜風が頬を 撫でていく",
              side: "right" as const,
            },
            {
              timeTag: "[01:46.88]",
              text: "今ならきっと…！",
              side: "center" as const,
            },
            {
              timeTag: "[01:50.85]",
              text: "誰かのステップなんて 踏まない",
              side: "left" as const,
            },
            {
              timeTag: "[01:53.07]",
              text: "私はここで 踊るのをやめる",
              side: "right" as const,
            },
            {
              timeTag: "[01:55.75]",
              text: "たとえあなたが ホールに残っても",
              side: "left" as const,
            },
            {
              timeTag: "[01:58.54]",
              text: "ドレスを脱ぎ捨て 生きていく",
              side: "right" as const,
            },
            {
              timeTag: "[02:01.14]",
              text: "涙も傷も 抱きしめて",
              side: "left" as const,
            },
            {
              timeTag: "[02:20.67]",
              text: "Unmasked, I'm real.",
              side: "center" as const,
            },
            {
              timeTag: "[02:21.84]",
              text: "喧騒を背に 歩き出す",
              side: "left" as const,
            },
            {
              timeTag: "[02:23.77]",
              text: "冷たい風が 心地いい",
              side: "right" as const,
            },
            {
              timeTag: "[02:25.40]",
              text: "これが本当の 世界",
              side: "left" as const,
            },
            {
              timeTag: "[02:27.42]",
              text: "これが本当の 私",
              side: "center" as const,
            },
          ],
        }}
      />
      <Composition
        id="MikanseiNoChizu"
        component={MikanseiNoChizuVideo}
        durationInFrames={30 * 200} // ~3m20s (extra time for ending effect)
        fps={30}
        width={1920}
        height={1080}
        schema={mikanseiNoChizuSchema}
        defaultProps={{
          fontSize: 42,
          bottomOffset: 50,
          videoSource: staticFile("未完成の地図.mp4"),
          title: "未完成の地図",
          artist: "",
          lyrics: [
            {
              timeTag: "[00:04.49]",
              text: "静まりかえった午前二時 窓に映る自分の影と目が合う",
            },
            { timeTag: "[00:10.51]", text: "街の明かりが遠くに見えて" },
            { timeTag: "[00:14.53]", text: "世界に取り残されたような気がした" },
            {
              timeTag: "[00:24.01]",
              text: "ペン先が刻む小さな音だけが 今の僕を証明している",
            },
            {
              timeTag: "[00:31.00]",
              text: "真っ白なページに書き込んだ迷いは いつか",
            },
            { timeTag: "[00:35.07]", text: "誰にも負けない答えに変わるかな" },
            {
              timeTag: "[00:41.44]",
              text: "「これでいいのか」なんて 投げ出したくなる夜もあるけれど",
            },
            { timeTag: "[00:46.33]", text: "君が灯したその小さな光を" },
            { timeTag: "[00:49.03]", text: "一番近くで　未来の" },
            { timeTag: "[00:53.07]", text: "君が見つめている" },
            {
              timeTag: "[00:58.33]",
              text: "走り出せ　まだ誰も知らない場所へ",
              isEmphasis: true,
            },
            { timeTag: "[01:04.28]", text: "その足跡が　いつか道になるから" },
            { timeTag: "[01:09.17]", text: "今はまだ　答えが見えなくてもいい" },
            { timeTag: "[01:12.82]", text: "震える手で　明日への扉を叩け" },
            { timeTag: "[01:17.51]", text: "孤独の数は　強さの証明" },
            {
              timeTag: "[01:20.44]",
              text: "夜明けの向こうで　最高の景色が待っている",
              isEmphasis: true,
            },
            { timeTag: "[01:28.14]", text: "SNSを閉じて　深呼吸した" },
            { timeTag: "[01:32.00]", text: "隣の芝生が青く見えても" },
            { timeTag: "[01:34.20]", text: "君が歩んでいるその泥臭い日々は" },
            { timeTag: "[01:37.75]", text: "誰にも真似できない　宝石の原石だ" },
            {
              timeTag: "[01:43.68]",
              text: "他人（だれか）が引いた　安全な境界線",
            },
            { timeTag: "[01:46.65]", text: "飛び越えるのは　少し怖いけれど" },
            { timeTag: "[01:49.64]", text: "積み上げた時間は　裏切りはしない" },
            { timeTag: "[01:52.88]", text: "風を切って　自分を信じて" },
            { timeTag: "[01:59.25]", text: "一人じゃないなんて　綺麗事かな？" },
            {
              timeTag: "[02:01.49]",
              text: "だけど　同じ月を見上げている仲間（ライバル）が",
            },
            { timeTag: "[02:04.85]", text: "どこかで　拳を握りしめている" },
            {
              timeTag: "[02:08.57]",
              text: "その熱さが　君の背中をそっと押すはず",
            },
            {
              timeTag: "[02:18.15]",
              text: "走り出せ　まだ誰も知らない場所へ",
              isEmphasis: true,
            },
            { timeTag: "[02:24.08]", text: "その足跡が　いつか道になるから" },
            { timeTag: "[02:29.07]", text: "今はまだ　答えが見えなくてもいい" },
            { timeTag: "[02:32.72]", text: "震える手で　明日への扉を叩け" },
            { timeTag: "[02:37.09]", text: "孤独の数は　強さの証明" },
            {
              timeTag: "[02:40.40]",
              text: "夜明けの向こうで　最高の景色が待っている",
              isEmphasis: true,
            },
            { timeTag: "[02:50.62]", text: "さあ、顔を上げて", isFinal: true },
            {
              timeTag: "[02:53.25]",
              text: "新しい風が　今吹き抜ける",
              isFinal: true,
            },
            {
              timeTag: "[02:56.14]",
              text: "君だけの地図を　描き続けよう",
              isFinal: true,
            },
            { timeTag: "[03:02.98]", text: "ほら、夜が明ける", isFinal: true },
          ],
        }}
      />
      <Composition
        id="SujigakinonaiTabi"
        component={SujigakinonaiTabiVideo}
        durationInFrames={30 * 230} // ~3m50s
        fps={30}
        width={1920}
        height={1080}
        schema={sujigakinonaiTabiSchema}
        defaultProps={{
          fontSize: 25,
          titleFontSize: 30,
          videoSource: staticFile("sujigakinonai_tabi.mp4"),
          title: "筋書きのない旅",
          artist: "",
          lyrics: [
            { timeTag: "[00:10.78]", text: "同じ色の天井　同じ味のコーヒー" },
            {
              timeTag: "[00:15.87]",
              text: "「前へ倣え」で進む　窮屈な月曜の朝",
            },
            {
              timeTag: "[00:21.14]",
              text: "スクロールする画面の中　誰かの完璧な写真（サクセス）",
            },
            { timeTag: "[00:26.34]", text: "綺麗すぎて" },
            {
              timeTag: "[00:30.89]",
              text: "なんだか息が詰まる　ノイズキャンセリングした日常で",
            },
            { timeTag: "[00:37.38]", text: "僕の心の音まで　消えかかっていた" },
            {
              timeTag: "[00:44.25]",
              text: "着せられた制服（スーツ）を　脱ぎ捨てるように",
            },
            {
              timeTag: "[00:49.19]",
              text: "ガイドブックの「正解」を　カバンから放り出す",
            },
            { timeTag: "[00:55.77]", text: "一人でも　仲間とでも　関係ない" },
            {
              timeTag: "[00:59.53]",
              text: "大事なのは　自分の足で踏み出すこと",
            },
            {
              timeTag: "[01:02.57]",
              text: "決められたレールなんて　もういらない",
            },
            {
              timeTag: "[01:06.89]",
              text: "吸い込んだことのない風を　肺いっぱいに満たして",
            },
            {
              timeTag: "[01:12.05]",
              text: "知らない色の空が　僕らを更新（アップデート）する",
            },
            {
              timeTag: "[01:17.39]",
              text: "パッケージされた感動はいらない　不格好でも　泥だらけでもいい",
            },
            { timeTag: "[01:26.89]", text: "これが　僕らだけの旅（リアル）だ" },
            {
              timeTag: "[01:32.10]",
              text: "まだ見たことない世界が　僕らを待ってる",
            },
            {
              timeTag: "[01:38.85]",
              text: "予定通りに進むだけの　綺麗なツアーじゃ",
            },
            {
              timeTag: "[01:43.04]",
              text: "本当の自分なんて　見つかりはしない",
            },
            { timeTag: "[01:48.06]", text: "突然の雨も　迷い込んだ路地裏も" },
            {
              timeTag: "[01:51.29]",
              text: "「ハプニング」じゃなく「ドラマ」と呼べばいい",
            },
            { timeTag: "[01:54.50]", text: "傷つくことも　自由の証だ" },
            {
              timeTag: "[01:58.34]",
              text: "迷ったからこそ　出逢えた景色がある",
            },
            { timeTag: "[02:03.05]", text: "他人の物差しで　測られていた場所" },
            {
              timeTag: "[02:08.15]",
              text: "そこじゃ決して手に入らない　熱を今、握りしめてる",
            },
            {
              timeTag: "[02:15.11]",
              text: "トラブルさえも　笑い話に変える魔法",
            },
            {
              timeTag: "[02:20.66]",
              text: "はみ出した先でしか　見れない夢がある",
            },
            {
              timeTag: "[02:29.01]",
              text: "吸い込んだことのない風を　肺いっぱいに満たして",
            },
            {
              timeTag: "[02:33.89]",
              text: "知らない色の空が　僕らを更新（アップデート）する",
            },
            {
              timeTag: "[02:39.01]",
              text: "予定調和なシナリオなんて　破り捨ててしまえばいい",
            },
            { timeTag: "[02:48.42]", text: "コンパスはいらない　鼓動を信じて" },
            {
              timeTag: "[02:55.22]",
              text: "どんな嵐も　この足跡（メロディ）に変えていく",
            },
            { timeTag: "[03:02.67]", text: "チケットの半券は　終わりじゃない" },
            { timeTag: "[03:06.15]", text: "帰り道は　次の自由へのプロローグ" },
            {
              timeTag: "[03:12.03]",
              text: "長い長い　型のないこの旅路（ロード）を",
            },
            { timeTag: "[03:17.47]", text: "僕らはまだ　歩き始めたばかり" },
            { timeTag: "[03:24.49]", text: "No more scripts, just us..." },
            {
              timeTag: "[03:31.90]",
              text: "まだ見たことない世界が　僕らを待ってる",
            },
          ],
        }}
      />
      <Composition
        id="CurtainCall"
        component={CurtainCallVideo}
        durationInFrames={30 * 185} // ~3m05s
        fps={30}
        width={1920}
        height={1080}
        schema={curtainCallSchema}
        defaultProps={{
          fontSize: 30,
          bottomOffset: 50,
          title: "カーテンコール",
          artist: "紗季（Saki）",
          videoSource: staticFile("curtain_call.mp4"),
          lyrics: [
            { timeTag: "[00:00.86]", text: "画面の中　ピエロが踊る" },
            { timeTag: "[00:06.18]", text: "「いいね」の数が　僕の全て" },
            { timeTag: "[00:10.92]", text: "踊り続けた日々" },
            { timeTag: "[00:13.97]", text: "気づけば　今日も一人" },
            {
              timeTag: "[00:21.71]",
              text: "増えるフォロワー　でもこの虚しさはなに？",
            },
            { timeTag: "[00:25.07]", text: "誰かを叩けば　喜ぶ世界" },
            { timeTag: "[00:27.53]", text: "画面の奥で笑ってる　君は誰？" },
            { timeTag: "[00:32.42]", text: "画面の向こう　知らない誰か" },
            { timeTag: "[00:34.92]", text: "目の前にいる　君が見えない" },
            {
              timeTag: "[00:37.92]",
              text: "道化師（ピエロ）は　今日も笑い続ける",
            },
            { timeTag: "[00:42.60]", text: "本当の顔　どこへ行った" },
            { timeTag: "[00:46.14]", text: "スワイプする指　止まらない" },
            {
              timeTag: "[00:48.57]",
              text: "このままじゃダメだ　わかってるのに",
            },
            { timeTag: "[00:53.57]", text: "インスタ　X　終わらないショー" },
            { timeTag: "[00:56.24]", text: "バズることだけ　考えてた" },
            { timeTag: "[00:58.92]", text: "誰かを幸せに　したかっただけ" },
            { timeTag: "[01:01.42]", text: "なのに　幸せなのは誰？" },
            { timeTag: "[01:04.40]", text: "通知の音に　隠れた声" },
            { timeTag: "[01:09.80]", text: "「ねえ、楽しい？」" },
            { timeTag: "[01:11.60]", text: "君の言葉　遠くで響く" },
            {
              timeTag: "[01:15.54]",
              text: "涙を流した君　誰のために頑張ってるの？",
            },
            { timeTag: "[01:20.25]", text: "君を見つめた　その瞬間に" },
            { timeTag: "[01:23.03]", text: "欲しかった笑顔が　そこにあった" },
            { timeTag: "[01:25.75]", text: "画面じゃない　この世界に" },
            {
              timeTag: "[01:29.94]",
              text: "もう終わりにしよう　デジタルのショー",
            },
            { timeTag: "[01:33.00]", text: "ログアウトして　いいんだよ" },
            { timeTag: "[01:35.95]", text: "目の前にいる　大切な人" },
            { timeTag: "[01:38.59]", text: "それが全て" },
            { timeTag: "[02:02.99]", text: "カーテンコール　さあ幕を下ろそう" },
            { timeTag: "[02:07.98]", text: "画面を閉じて　君を見よう" },
            { timeTag: "[02:13.45]", text: "追い求めてた　幸せは" },
            { timeTag: "[02:17.95]", text: "ずっとここに　あったんだ" },
            { timeTag: "[02:24.03]", text: "もう自由だよ　さあピエロさん" },
            { timeTag: "[02:28.09]", text: "仮面を外して　目の前の世界" },
            { timeTag: "[02:30.62]", text: "本当の笑顔　輝いてる" },
            { timeTag: "[02:33.59]", text: "君と僕の　この世界（リアル）で" },
            { timeTag: "[02:38.30]", text: "ありがとう　そしてさよなら" },
            { timeTag: "[02:47.18]", text: "デジタルのピエロさん" },
            { timeTag: "[02:49.93]", text: "これからは　この手で" },
            { timeTag: "[02:54.67]", text: "目の前の君を　笑顔にするよ" },
          ],
        }}
      />
      {/* 早咲きの春 - 切ないリリック動画 */}
      <Composition
        id="HayazakiNoHaru"
        component={HayazakiNoHaruVideo}
        durationInFrames={5100}
        fps={30}
        width={1920}
        height={1080}
        schema={hayazakiNoHaruSchema}
        defaultProps={{
          fontSize: 35,
          bottomOffset: 50,
          title: "早咲きの春",
          artist: "AI ミュージックビデオ",
          videoSource: staticFile("suno_PJ/done/早咲きの春full.mp4"),
          lyrics: [
            { timeTag: "[00:12.22]", text: "まだ雪が残る土の上で" },
            { timeTag: "[00:17.38]", text: "誰より先に花を開いた" },
            { timeTag: "[00:24.08]", text: "誰かに見せたくて咲いたのに" },
            { timeTag: "[00:29.35]", text: "冷たい風に揺れながら" },
            { timeTag: "[00:35.42]", text: "いつもそう、いつもそう" },
            { timeTag: "[00:37.92]", text: "走り出すのが早すぎて" },
            { timeTag: "[00:46.40]", text: "梅の花みたい 早咲きばかり" },
            { timeTag: "[00:51.68]", text: "私が散る頃に 桜が笑う" },
            { timeTag: "[00:58.26]", text: "みんなは振り向く 桜の方に" },
            { timeTag: "[01:04.21]", text: "私はもう 葉になってた" },
            { timeTag: "[01:21.05]", text: "あなたはいつも 春の陽だまりの中" },
            { timeTag: "[01:25.04]", text: "遅れてきてもなぜか輝いて" },
            { timeTag: "[01:28.21]", text: "「遅いね」って言いたいのに" },
            { timeTag: "[01:30.40]", text: "その笑顔に何も言えなくて" },
            { timeTag: "[01:33.50]", text: "いつもそう、いつもそう" },
            { timeTag: "[01:36.25]", text: "タイミングが少しずれてて" },
            { timeTag: "[01:44.60]", text: "梅の花みたい 早咲きばかり" },
            { timeTag: "[01:49.64]", text: "私が散る頃に 桜が笑う" },
            { timeTag: "[01:55.88]", text: "みんなは振り向く 桜の方に" },
            { timeTag: "[02:01.85]", text: "私はもう 葉になってた" },
            { timeTag: "[02:07.40]", text: "でもね、梅の香りは" },
            { timeTag: "[02:10.59]", text: "桜より深いって知ってる？" },
            { timeTag: "[02:14.07]", text: "誰かがきっと気づいてくれる" },
            { timeTag: "[02:22.04]", text: "私の春を" },
            { timeTag: "[02:24.31]", text: "また来年も 先に咲いてみせる" },
            { timeTag: "[02:30.34]", text: "これが私の 早咲きの春" },
          ],
        }}
      />
      {/* 沈丁花 - 春のリリック動画 */}
      <Composition
        id="Jinchouge"
        component={JinchougeVideo}
        durationInFrames={5190}
        fps={30}
        width={1920}
        height={1080}
        schema={jinchougeSchema}
        defaultProps={{
          fontSize: 35,
          bottomOffset: 40,
          title: "沈丁花",
          artist: "Suno AI",
          videoSource: staticFile("suno_PJ/done/沈丁花.mp4"),
          lyrics: [
            { timeTag: "[00:00.67]", text: "段ボールに詰めた　三年分の日々" },
            {
              timeTag: "[00:04.14]",
              text: "「ここまでだ」って言った声は　思ったより静かだった",
            },
            {
              timeTag: "[00:07.49]",
              text: "鍵を返す手が震えた　最後のドアを閉めて",
            },
            { timeTag: "[00:10.96]", text: "ポケットの中　何も入ってない" },
            {
              timeTag: "[00:14.40]",
              text: "商店街のパン屋　いつの間にか開いてる",
            },
            {
              timeTag: "[00:17.65]",
              text: "名前も知らない花が　植え込みで揺れてた",
            },
            {
              timeTag: "[00:21.43]",
              text: "まだ三月なのに　陽射しがやけに眩しい",
            },
            { timeTag: "[00:24.78]", text: "目を細めたら　なぜか涙が出た" },
            { timeTag: "[00:28.18]", text: "喉の奥の塊が　溶けてゆく" },
            { timeTag: "[00:31.57]", text: "泣いていいなら　もう少しだけ" },
            { timeTag: "[00:34.79]", text: "春よ　背中を押して" },
            { timeTag: "[00:37.57]", text: "凍りついた僕を　溶かしてくれ" },
            { timeTag: "[00:41.51]", text: "握りしめすぎた拳を開いたら" },
            { timeTag: "[00:45.39]", text: "掌に　種がひとつ残ってた" },
            { timeTag: "[00:49.23]", text: "植えてみる　枯れたっていい" },
            { timeTag: "[00:51.68]", text: "まず土を掘る" },
            {
              timeTag: "[01:01.07]",
              text: "面接帰りの電車は　思ったより空いてた",
            },
            { timeTag: "[01:04.71]", text: "志望動機の欄が　真っ白のまま" },
            {
              timeTag: "[01:07.98]",
              text: "帰り道　公園のベンチで缶コーヒーを開けたら",
            },
            { timeTag: "[01:11.45]", text: "隣に座った猫が　あくびをした" },
            { timeTag: "[01:15.00]", text: "答え合わせは　まだずっと先" },
            { timeTag: "[01:18.42]", text: "この居心地の悪さごと　抱えて歩く" },
            { timeTag: "[01:21.71]", text: "春に　追いつかれた" },
            {
              timeTag: "[01:24.85]",
              text: "逃げてたはずなのに　うなじに陽が当たる",
            },
            { timeTag: "[01:29.28]", text: "靴紐を結び直した足が" },
            { timeTag: "[01:32.40]", text: "勝手に　次の角を曲がる" },
            { timeTag: "[01:36.19]", text: "歩いてる　不格好でも" },
            { timeTag: "[01:38.65]", text: "前に進んでる" },
            { timeTag: "[01:54.00]", text: "ああ　そうか　わかった" },
            { timeTag: "[01:56.24]", text: "押してたのは　春じゃなくて" },
            { timeTag: "[02:00.15]", text: "ずっと　この胸の奥の" },
            { timeTag: "[02:03.09]", text: "まだ諦めきれない　馬鹿な火だ" },
            { timeTag: "[02:09.06]", text: "春より　先に咲く" },
            { timeTag: "[02:11.83]", text: "背中を押さなくても　歩けるから" },
            { timeTag: "[02:16.48]", text: "枯れた冬を越えた　この根っこが" },
            { timeTag: "[02:19.77]", text: "水を吸って　幹になってゆく" },
            { timeTag: "[02:23.77]", text: "咲いてみる　誰のためでもない" },
            { timeTag: "[02:26.84]", text: "自分の花" },
            { timeTag: "[02:35.63]", text: "商店街のパン屋の前" },
            {
              timeTag: "[02:38.83]",
              text: "あれは沈丁花(じんちょうげ)って言うらしい",
            },
          ],
        }}
      />
      <Composition
        id="YukitokenoLoveLetter"
        component={YukitokenoLoveLetterVideo}
        durationInFrames={6300}
        fps={30}
        width={1920}
        height={1080}
        schema={yukitokenoLoveLetterSchema}
        defaultProps={yukitokenoLoveLetterData}
      />
    </>
  );
};
