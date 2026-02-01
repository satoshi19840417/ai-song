/* eslint-disable no-irregular-whitespace */
import { staticFile } from "remotion";

/**
 * Study Session Opening Video Data
 * 勉強会オープニング動画用データ
 */
export const studySessionData = {
    // 勉強会タイトル
    title: "AIを「便利なチャット」から「仕事の補助役」へ",
    subtitle: "話題の活用法を学ぶ",

    // 会社名
    company: "セルジェンテック",

    // シーン別テキスト
    scenes: {
        hook: {
            line1: "コードを書くのは...",
            line2: "もう人間だけじゃない",
        },
        problem: {
            line1: "でも、AIは",
            emphasis: "あなたの仕事",
            line2: "を知らない",
        },
        solution: {
            keyword: "Skills",
            line1: "AIに",
            emphasis: "あなたのやり方",
            line2: "を教える",
        },
        closing: {
            line1: "今日、一緒に学びましょう",
        },
    },

    // BGM（後で追加）
    bgmSource: staticFile("bgm/study_session_bgm.mp3"),
};
