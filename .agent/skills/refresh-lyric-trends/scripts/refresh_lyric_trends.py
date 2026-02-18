"""
refresh_lyric_trends.py
released楽曲の傾向スナップショットを生成する。
"""

import argparse
import hashlib
import os
import re
import sys
import tempfile
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

SCHEMA_VERSION = 1
DEFAULT_TTL_DAYS = 3
UTF8_BOM = "\ufeff"

FIRST_PERSON_WORDS = [
    "私",
    "わたし",
    "僕",
    "ぼく",
    "俺",
    "おれ",
    "うち",
    "自分",
    "僕ら",
    "私たち",
]
SECOND_PERSON_WORDS = [
    "君",
    "きみ",
    "あなた",
    "お前",
    "きみたち",
]
POSITIVE_WORDS = [
    "光",
    "希望",
    "明日",
    "進む",
    "笑う",
    "叶う",
    "生きる",
    "翼",
    "春",
]
NEGATIVE_WORDS = [
    "涙",
    "雨",
    "夜",
    "孤独",
    "痛み",
    "消える",
    "迷う",
    "別れ",
    "冬",
]

MISSING_LYRICS_MARKERS = {
    "（Sunoから転記予定）",
    "（歌詞をここに貼り付け）",
    "（歌詞をここに記入）",
    "（要追記）",
}


def strip_bom(text: str) -> str:
    return text[1:] if text.startswith(UTF8_BOM) else text


def parse_frontmatter(content: str) -> tuple[dict, str]:
    text = strip_bom(content)
    m = re.match(r"^---\n(.*?)\n---\n?", text, re.DOTALL)
    if not m:
        return {}, text

    fm: dict[str, str | list[str]] = {}
    for line in m.group(1).splitlines():
        if ":" not in line:
            continue
        key, _, val = line.partition(":")
        key = key.strip()
        val = val.strip()
        if val.startswith("[") and val.endswith("]"):
            inner = val[1:-1]
            fm[key] = [v.strip() for v in inner.split(",") if v.strip()]
        else:
            fm[key] = val
    return fm, text[m.end():]


def parse_tags(raw: str | list[str] | None) -> list[str]:
    if raw is None:
        return []
    if isinstance(raw, list):
        return [t.strip() for t in raw if t and t.strip()]
    text = str(raw).strip()
    if not text:
        return []
    if text.startswith("[") and text.endswith("]"):
        inner = text[1:-1]
        return [v.strip() for v in inner.split(",") if v.strip()]
    return [v.strip() for v in text.split(",") if v.strip()]


def extract_lyrics_block(content: str) -> str:
    patterns = [
        r"^##\s*2\)\s*Lyrics\s*\n(.*?)(?=^##\s|\Z)",
        r"^###\s*Lyrics\s*\n(.*?)(?=^###\s|^##\s|\Z)",
    ]
    for pattern in patterns:
        m = re.search(pattern, content, re.DOTALL | re.MULTILINE)
        if not m:
            continue
        lyrics = m.group(1).strip()
        compact = re.sub(r"\s+", "", lyrics)
        if not compact:
            return ""
        if compact in {re.sub(r"\s+", "", x) for x in MISSING_LYRICS_MARKERS}:
            return ""
        return lyrics
    return ""


def count_occurrences(text: str, words: list[str]) -> int:
    return sum(text.count(w) for w in words)


def classify_viewpoint(lyrics: str) -> str:
    first = count_occurrences(lyrics, FIRST_PERSON_WORDS)
    second = count_occurrences(lyrics, SECOND_PERSON_WORDS)
    if first == 0 and second == 0:
        return "中立"
    if first >= second + 2 and first >= int(second * 1.3):
        return "一人称優勢"
    if second >= first + 2 and second >= int(first * 1.3):
        return "二人称優勢"
    return "混合"


def classify_emotion_curve(lyrics: str) -> str:
    lines = [line.strip() for line in lyrics.splitlines() if line.strip()]
    if len(lines) < 3:
        return "フラット"

    segment_scores = [0, 0, 0]
    total = len(lines)
    for idx, line in enumerate(lines):
        segment = min(2, (idx * 3) // total)
        score = count_occurrences(line, POSITIVE_WORDS) - count_occurrences(line, NEGATIVE_WORDS)
        segment_scores[segment] += score

    a, b, c = segment_scores
    spread = max(segment_scores) - min(segment_scores)
    if spread <= 1:
        return "フラット"
    if a > b and c > b:
        return "V字"
    if a < b and c < b:
        return "山型"
    if c - a >= 2:
        return "上昇"
    if a - c >= 2:
        return "下降"
    return "フラット"


def normalize_for_hash(text: str) -> str:
    text = strip_bom(text).replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in text.split("\n")]

    normalized: list[str] = []
    prev_blank = False
    for line in lines:
        is_blank = line == ""
        if is_blank and prev_blank:
            continue
        normalized.append(line)
        prev_blank = is_blank
    return "\n".join(normalized).strip()


def extract_section_body(content: str, heading: str) -> str:
    pattern = rf"^##\s*{re.escape(heading)}\s*\n(.*?)(?=^##\s|\Z)"
    m = re.search(pattern, content, re.DOTALL | re.MULTILINE)
    return m.group(1).strip() if m else ""


def compute_released_index_hash(index_path: Path) -> str:
    raw = strip_bom(index_path.read_text(encoding="utf-8"))

    released_body = extract_section_body(raw, "公開済 (released)")
    tag_body = extract_section_body(raw, "タグ別索引")
    if not released_body or not tag_body:
        raise RuntimeError("_index.md から必要セクションを抽出できませんでした")

    table_lines = [line.rstrip() for line in released_body.splitlines() if line.lstrip().startswith("|")]
    released_table = normalize_for_hash("\n".join(table_lines))
    tag_index = normalize_for_hash(tag_body)
    if not released_table:
        raise RuntimeError("公開済テーブルの抽出結果が空です")

    canonical = f"{released_table}\n---\n{tag_index}\n"
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def is_genre_tag(tag: str) -> bool:
    lower = tag.lower()
    genre_keywords = ["pop", "rock", "ballad", "バラード", "folk", "electro", "jazz", "blues", "クール"]
    return any(key in lower for key in genre_keywords)


def safe_int(value: str | int, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def build_guide_lines(top_tags: list[tuple[str, int]], viewpoint: str, emotion: str) -> list[str]:
    tag_a = top_tags[0][0] if len(top_tags) >= 1 else "主要タグ"
    tag_b = top_tags[1][0] if len(top_tags) >= 2 else "補助タグ"
    return [
        f"- 準拠案: `{tag_a}/{tag_b}` を核に、視点は `{viewpoint}`、感情推移は `{emotion}` を維持する。",
        f"- 意外性案: `{tag_a}` の接点だけ残し、視点または感情推移を `{viewpoint}` / `{emotion}` から意図的に外す。",
        f"- トレンド案: 直近上昇タグを優先しつつ、`{tag_b}` をフックにして市場寄りの訴求へ寄せる。",
    ]


def format_tag_rank(items: list[tuple[str, int]], empty_label: str = "該当なし") -> list[str]:
    if not items:
        return [f"- {empty_label}"]
    return [f"- {idx}. {tag} ({score})" for idx, (tag, score) in enumerate(items, start=1)]


def format_delta_rank(items: list[tuple[str, float]], empty_label: str = "該当なし") -> list[str]:
    if not items:
        return [f"- {empty_label}"]
    return [f"- {idx}. {tag} ({delta:+.3f})" for idx, (tag, delta) in enumerate(items, start=1)]


def get_latest_released_song_id(released_songs: list[dict]) -> str:
    ids = [s.get("id", "") for s in released_songs if s.get("id", "").startswith("SNG-")]
    return max(ids) if ids else ""


def acquire_lock(lock_path: Path, timeout_sec: int) -> None:
    deadline = time.time() + timeout_sec
    while True:
        try:
            fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.write(f"pid={os.getpid()}\n")
            return
        except FileExistsError:
            if time.time() >= deadline:
                raise TimeoutError(f"lock取得タイムアウト: {lock_path}")
            time.sleep(0.2)


def release_lock(lock_path: Path) -> None:
    try:
        lock_path.unlink()
    except FileNotFoundError:
        pass


def atomic_write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(
        mode="w",
        encoding="utf-8",
        newline="\n",
        delete=False,
        dir=str(path.parent),
        prefix=f"{path.name}.",
        suffix=".tmp",
    ) as tmp:
        tmp.write(content)
        tmp_path = Path(tmp.name)
    os.replace(tmp_path, path)


def load_released_songs(songs_dir: Path) -> list[dict]:
    records: list[dict] = []
    for song_path in sorted(songs_dir.glob("SNG-*.md")):
        content = song_path.read_text(encoding="utf-8")
        frontmatter, body = parse_frontmatter(content)
        if frontmatter.get("status") != "released":
            continue

        song_id = str(frontmatter.get("id", "")).strip()
        if not song_id:
            song_id = song_path.stem.split("_")[0]

        tags = parse_tags(frontmatter.get("tags"))
        lyrics = extract_lyrics_block(body)

        records.append(
            {
                "id": song_id,
                "title": str(frontmatter.get("title", song_path.stem)),
                "tags": tags,
                "lyrics": lyrics,
            }
        )
    return records


def build_snapshot(
    released_songs: list[dict],
    generated_at_utc: str,
    ttl_days: int,
    recent_window: int,
    released_index_hash: str,
) -> str:
    song_count = len(released_songs)
    latest_released_song_id = get_latest_released_song_id(released_songs)

    all_tag_counter: Counter[str] = Counter()
    weighted_tag_counter: Counter[str] = Counter()
    recent_tag_counter: Counter[str] = Counter()
    viewpoint_counter: Counter[str] = Counter()
    emotion_counter: Counter[str] = Counter()
    lyrics_analyzed_count = 0

    sorted_songs = sorted(released_songs, key=lambda s: s.get("id", ""))
    recent_songs = sorted_songs[-recent_window:] if recent_window > 0 else []

    for song in sorted_songs:
        unique_tags = list(dict.fromkeys(song.get("tags", [])))
        for tag in unique_tags:
            all_tag_counter[tag] += 1
            weighted_tag_counter[tag] += 1

        lyrics = song.get("lyrics", "")
        if lyrics:
            lyrics_analyzed_count += 1
            viewpoint_counter[classify_viewpoint(lyrics)] += 1
            emotion_counter[classify_emotion_curve(lyrics)] += 1

    for song in recent_songs:
        for tag in list(dict.fromkeys(song.get("tags", []))):
            weighted_tag_counter[tag] += 1
            recent_tag_counter[tag] += 1

    genre_rank = [(k, v) for k, v in weighted_tag_counter.most_common() if is_genre_tag(k)][:5]
    theme_rank = [(k, v) for k, v in weighted_tag_counter.most_common() if not is_genre_tag(k)][:5]
    major_tag_rank = weighted_tag_counter.most_common(8)

    total_songs = max(1, song_count)
    total_recent = max(1, len(recent_songs))
    delta_scores: list[tuple[str, float]] = []
    for tag in set(all_tag_counter) | set(recent_tag_counter):
        all_freq = all_tag_counter[tag] / total_songs
        recent_freq = recent_tag_counter[tag] / total_recent
        delta_scores.append((tag, recent_freq - all_freq))
    increasing = [x for x in sorted(delta_scores, key=lambda x: x[1], reverse=True) if x[1] > 0][:5]
    decreasing = [x for x in sorted(delta_scores, key=lambda x: x[1]) if x[1] < 0][:5]

    dominant_viewpoint = viewpoint_counter.most_common(1)[0][0] if viewpoint_counter else "中立"
    dominant_emotion = emotion_counter.most_common(1)[0][0] if emotion_counter else "フラット"
    guide_lines = build_guide_lines(major_tag_rank, dominant_viewpoint, dominant_emotion)

    header_lines = [
        "---",
        f"schema_version: {SCHEMA_VERSION}",
        f"generated_at_utc: {generated_at_utc}",
        f"ttl_days: {ttl_days}",
        "source_scope: released",
        f"source_song_count: {song_count}",
        f"lyrics_analyzed_count: {lyrics_analyzed_count}",
        f"latest_released_song_id: {latest_released_song_id}",
        f"released_index_hash: {released_index_hash}",
        "---",
        "",
    ]

    body_lines = [
        "# 歌詞傾向スナップショット",
        "",
        "## メタ情報",
        f"- generated_at_utc: {generated_at_utc}",
        f"- source_song_count: {song_count}",
        f"- lyrics_analyzed_count: {lyrics_analyzed_count}",
        f"- weighting: 全曲=1, 直近{recent_window}曲ボーナス=+1",
        "",
        "## 全体傾向",
        "### ジャンルTop",
        *format_tag_rank(genre_rank),
        "",
        "### テーマTop",
        *format_tag_rank(theme_rank),
        "",
        "### 主要タグ",
        *format_tag_rank(major_tag_rank),
        "",
        "## 直近傾向",
        f"- recent_window: {recent_window}",
        "### 増加タグ",
        *format_delta_rank(increasing),
        "",
        "### 減少タグ",
        *format_delta_rank(decreasing),
        "",
        "## 語り口傾向",
        f"- 視点判定: {dominant_viewpoint}",
        f"- 感情曲線判定: {dominant_emotion}",
        "",
        "## 作詞ガイド要約",
        *guide_lines,
        "",
    ]
    return "\n".join(header_lines + body_lines)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="歌詞傾向スナップショット更新")
    parser.add_argument(
        "--songs-dir",
        default=str(Path(__file__).parent.parent.parent.parent.parent / "public/suno_PJ/Suno/01_Songs"),
        help="01_Songs ディレクトリ",
    )
    parser.add_argument(
        "--index",
        default=str(Path(__file__).parent.parent.parent.parent.parent / "public/suno_PJ/Suno/_index.md"),
        help="_index.md パス",
    )
    parser.add_argument(
        "--out",
        default=str(Path(__file__).parent.parent.parent.parent.parent / "public/suno_PJ/Suno/_trend_snapshot.md"),
        help="snapshot 出力パス",
    )
    parser.add_argument("--scope", default="released", choices=["released"], help="集計対象スコープ")
    parser.add_argument("--recent-window", type=int, default=12, help="直近加重の曲数")
    parser.add_argument("--ttl-days", type=int, default=DEFAULT_TTL_DAYS, help="TTL日数")
    parser.add_argument("--lock-timeout-sec", type=int, default=10, help="lock待機秒")
    parser.add_argument("--dry-run", action="store_true", help="ファイルを書き換えずに結果のみ表示")
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    songs_dir = Path(args.songs_dir)
    index_path = Path(args.index)
    out_path = Path(args.out)
    lock_path = out_path.with_suffix(out_path.suffix + ".lock")
    recent_window = max(1, safe_int(args.recent_window, 12))
    ttl_days = max(1, safe_int(args.ttl_days, DEFAULT_TTL_DAYS))
    lock_timeout_sec = max(1, safe_int(args.lock_timeout_sec, 10))

    if not songs_dir.exists():
        print(f"[ERROR] songs-dir が存在しません: {songs_dir}")
        return 1
    if not index_path.exists():
        print(f"[ERROR] index が存在しません: {index_path}")
        return 1

    released_songs = load_released_songs(songs_dir)
    if not released_songs:
        print("[ERROR] released 曲が0件のため snapshot を生成できません")
        return 1

    generated_at_utc = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    released_index_hash = compute_released_index_hash(index_path)
    snapshot = build_snapshot(
        released_songs=released_songs,
        generated_at_utc=generated_at_utc,
        ttl_days=ttl_days,
        recent_window=recent_window,
        released_index_hash=released_index_hash,
    )

    print(f"[INFO] released曲数: {len(released_songs)}")
    print(f"[INFO] latest_released_song_id: {get_latest_released_song_id(released_songs)}")
    print(f"[INFO] released_index_hash: {released_index_hash}")

    if args.dry_run:
        print(f"[DRY-RUN] snapshot 更新をスキップ: {out_path}")
        return 0

    acquire_lock(lock_path, lock_timeout_sec)
    try:
        atomic_write_text(out_path, snapshot)
    finally:
        release_lock(lock_path)

    print(f"[OK] snapshot を更新しました: {out_path}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # noqa: BLE001
        print(f"[ERROR] refresh失敗: {exc}")
        raise SystemExit(1)
