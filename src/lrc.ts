export const lrcContent = `[00:01.07]ありがとう　あなたに出会えたこと
[00:06.66]さよならを言えず　時が止まったまま
[00:12.79]突然途切れた　フィルムの先で
[00:18.57]あなた一人を　残してしまったね
[00:24.36]泣いていいよ　何度でも
[00:27.18]私の分まで　声をあげて
[00:32.19]あなたが作った私はそっくり
[00:35.86]でも私はここにいる　胸の奥で
[00:41.13]あなたが愛した私は　そこにはいない
[00:48.06]画面の中の「私」が　あなたを見つめている
[00:53.94]似た声で笑うたび　胸がきゅっと痛む
[00:59.61]データで埋められない　ぬくもりがあることを
[01:05.59]気づいてほしくて　そっと頬をなでる風
[01:12.27]過去へのドアを　閉めることは
[01:16.80]私を消すことじゃないから
[01:22.42]忘れないで　それだけでいい
[01:26.33]無理にずっと　抱きしめなくていい
[01:33.20]写真立ての中で微笑みながら
[01:38.25]あなたの未来を　応援してる
[01:45.39]だからどうか　こわがらないで
[01:50.05]新しい恋を　いつかして
[01:59.64]最後のわがまま　聞いてくれるなら
[02:05.15]私以外の誰かを　幸せにして
[02:11.45]あなたが笑えば　それでいいの
[02:17.38]その笑顔が　私への答え
[02:24.47]ありがとう　愛してくれて
[02:28.09]不器用な言葉も　全部好きだった
[02:32.40]さよならのかわりに願うことは
[02:36.19]あなたの明日が　少しあたたかいこと
[02:40.06]私は大丈夫　一人で行ける
[02:47.07]だからどうか　生きていて
[02:52.79]またいつか　夢の中で
[03:04.57]「元気だよ」と　笑いあおう`;

export interface LyricLine {
    time: number; // in seconds
    text: string;
}

export const parseLrc = (lrc: string): LyricLine[] => {
    // Ensure newlines before timestamps to handle single-line input
    const formattedLrc = lrc.replace(/(\[\d{2}:\d{2}\.\d{2,3}\])/g, "\n$1");
    const lines = formattedLrc.split("\n");
    const result: LyricLine[] = [];
    const timeRegex = /\[(\d{2}):(\d{2}\.\d{2,3})\]/;

    for (const line of lines) {
        const match = line.match(timeRegex);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const time = minutes * 60 + seconds;
            const text = line.replace(timeRegex, "").trim();
            // Allow empty text for blank intervals
            result.push({ time, text });
        }
    }
    return result;
};

export const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const ms = Math.round((seconds - Math.floor(seconds)) * 100);
    return `[${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}]`;
};
