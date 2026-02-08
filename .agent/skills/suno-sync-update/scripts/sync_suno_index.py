"""
sync_suno_index.py
fetched.json と既存Markdownファイルを比較して差分を反映する。

使い方:
  python sync_suno_index.py [--fetched fetched.json] [--songs-dir ../../public/suno_PJ/Suno/01_Songs] [--index ../../public/suno_PJ/Suno/_index.md]
"""

import argparse
import json
import os
import re
import unicodedata
from datetime import date
from pathlib import Path


# ---------------------------------------------------------------------------
# ユーティリティ
# ---------------------------------------------------------------------------


def normalize_title(title: str) -> str:
    """タイトルを正規化して比較用文字列を返す。"""
    # 全角→半角
    t = unicodedata.normalize("NFKC", title)
    # 小文字化
    t = t.lower()
    # 記号・括弧・スペースを除去
    t = re.sub(r"[\s\-_　・【】「」『』（）()【】〔〕\[\]〈〉《》]+", "", t)
    return t


def extract_song_id_from_url(url: str) -> str:
    """https://suno.com/song/<id> から id 部分を抽出。"""
    m = re.search(r"suno\.com/song/([a-f0-9\-]+)", url or "")
    return m.group(1) if m else ""


# ---------------------------------------------------------------------------
# 既存曲ファイルの読み込み
# ---------------------------------------------------------------------------


def load_existing_songs(songs_dir: Path) -> list[dict]:
    """01_Songs/*.md から frontmatter を読み込んでリストで返す。"""
    songs = []
    for md_file in sorted(songs_dir.glob("SNG-*.md")):
        content = md_file.read_text(encoding="utf-8")
        fm = parse_frontmatter(content)
        fm["_file"] = md_file
        fm["_content"] = content
        songs.append(fm)
    return songs


def parse_frontmatter(content: str) -> dict:
    """YAML frontmatter を簡易パース（yaml不要）。"""
    fm = {}
    m = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not m:
        return fm
    for line in m.group(1).splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            key = key.strip()
            val = val.strip()
            # リスト形式 [a, b, c]
            if val.startswith("[") and val.endswith("]"):
                inner = val[1:-1]
                fm[key] = [v.strip() for v in inner.split(",") if v.strip()]
            else:
                fm[key] = val
    return fm


def next_song_id(songs: list[dict], year: int) -> str:
    """現在最大番号 + 1 の SNG-YYYY-NNNN を返す。"""
    max_n = 0
    prefix = f"SNG-{year}-"
    for s in songs:
        sid = s.get("id", "")
        if sid.startswith(prefix):
            try:
                n = int(sid[len(prefix):])
                max_n = max(max_n, n)
            except ValueError:
                pass
    return f"{prefix}{max_n + 1:04d}"


# ---------------------------------------------------------------------------
# マッチング
# ---------------------------------------------------------------------------


def match_clip_to_song(clip: dict, songs: list[dict]) -> dict | None:
    """
    優先順位:
      1. suno_song_url の song id 一致
      2. タイトル完全一致
      3. タイトル正規化一致
    """
    clip_id = clip["id"]
    clip_title_norm = normalize_title(clip["title"])

    # 1. URL中のsong id
    for s in songs:
        url = s.get("suno_song_url", "")
        if extract_song_id_from_url(url) == clip_id:
            return s

    # 2. タイトル完全一致
    for s in songs:
        if s.get("title", "").strip() == clip["title"]:
            return s

    # 3. 正規化一致
    for s in songs:
        if normalize_title(s.get("title", "")) == clip_title_norm:
            return s

    return None


def is_ambiguous(clip: dict, songs: list[dict]) -> bool:
    """同名タイトル（正規化後）が複数存在する場合は曖昧と判断。"""
    norm = normalize_title(clip["title"])
    count = sum(1 for s in songs if normalize_title(s.get("title", "")) == norm)
    return count > 1


# ---------------------------------------------------------------------------
# ファイル更新
# ---------------------------------------------------------------------------


def update_frontmatter_field(content: str, key: str, value: str) -> str:
    """frontmatter の特定キーを更新する。"""
    pattern = rf"^({re.escape(key)}:).*$"
    replacement = f"{key}: {value}"
    new_content, n = re.subn(pattern, replacement, content, flags=re.MULTILINE)
    if n == 0:
        # キーが存在しない場合、--- の直前に追加
        new_content = re.sub(r"^(---\n)", rf"\1{key}: {value}\n", content)
    return new_content


def pick_tags(clip: dict) -> list[str]:
    """display_tags → metadata.tags の優先順でタグを取得。"""
    tags = clip.get("display_tags") or clip.get("tags") or []
    return [t.strip() for t in tags if t.strip()]


def create_song_file(song_id: str, clip: dict, today: str, template_path: Path) -> str:
    """新規曲ファイルの内容を生成する。"""
    tags = pick_tags(clip)
    tags_str = "[" + ", ".join(tags) + "]" if tags else "[]"
    content = (
        f"---\n"
        f"type: suno_song\n"
        f"id: {song_id}\n"
        f"title: {clip['title']}\n"
        f"status: released\n"
        f"created: {today}\n"
        f"updated: {today}\n"
        f"tags: {tags_str}\n"
        f"suno_song_url: {clip['url']}\n"
        f"---\n"
        f"\n"
        f"## 1) Style\n"
        f"（Sunoから転記予定）\n"
        f"\n"
        f"## 2) Lyrics\n"
        f"（Sunoから転記予定）\n"
        f"\n"
        f"## 3) Suno貼り付け用\n"
        f"\n"
        f"### Title\n"
        f"{clip['title']}\n"
        f"\n"
        f"### Style\n"
        f"（要追記）\n"
        f"\n"
        f"### Lyrics\n"
        f"（歌詞をここに貼り付け）\n"
        f"\n"
        f"## 4) 制作メモ\n"
        f"- Sunoプロフィール同期で追加\n"
        f"\n"
        f"## 5) 変更履歴\n"
        f"- {today}: 初版作成\n"
    )
    return content


# ---------------------------------------------------------------------------
# _index.md 更新
# ---------------------------------------------------------------------------


def rebuild_index(
    index_path: Path,
    songs: list[dict],
    new_songs: list[dict],
    updated_songs: list[dict],
    unresolved: list[dict],
    today: str,
    handle: str,
    total_fetched: int,
):
    """_index.md を読み込み、公開済みテーブル・タグ索引・同期メモを更新する。"""
    content = index_path.read_text(encoding="utf-8")

    # 全 released 曲をリロード（新規追加後）
    all_songs = load_existing_songs(index_path.parent / "01_Songs")
    released = [s for s in all_songs if s.get("status") == "released"]

    # --- 公開済みテーブル再構築 ---
    table_lines = [
        "| ID | タイトル | タグ | Suno URL |",
        "|----|---------|------|----------|",
    ]
    for s in sorted(released, key=lambda x: x.get("id", "")):
        sid = s.get("id", "")
        title = s.get("title", "")
        file_name = s["_file"].name
        tags = s.get("tags", [])
        if isinstance(tags, list):
            tag_str = ", ".join(tags[:2])
        else:
            tag_str = str(tags)
        url = s.get("suno_song_url", "-") or "-"
        table_lines.append(f"| {sid} | [{title}](01_Songs/{file_name}) | {tag_str} | {url} |")

    table_block = "\n".join(table_lines)

    # 公開済みテーブルを置換
    content = re.sub(
        r"(## 公開済 \(released\)\n\n)(\|.*\n)+",
        f"\\1{table_block}\n",
        content,
    )

    # --- タグ別索引再構築 ---
    genre_map: dict[str, list[str]] = {}
    theme_map: dict[str, list[str]] = {}

    for s in released:
        title = s.get("title", "")
        raw_tags = s.get("tags", [])
        if isinstance(raw_tags, str):
            raw_tags = [t.strip() for t in raw_tags.split(",")]

        for tag in raw_tags:
            tag = tag.strip()
            if not tag:
                continue
            # 簡易ジャンル/テーマ分類（tag-policy.md 参照）
            if any(
                g in tag.lower()
                for g in ["pop", "rock", "ballad", "バラード", "folk", "electro", "jazz", "blues", "クール"]
            ):
                genre_map.setdefault(tag, []).append(title)
            else:
                theme_map.setdefault(tag, []).append(title)

    genre_lines = ["### ジャンル"]
    for g, titles in sorted(genre_map.items()):
        genre_lines.append(f"- **{g}**: {', '.join(titles)}")

    theme_lines = ["### テーマ"]
    for t, titles in sorted(theme_map.items()):
        theme_lines.append(f"- **{t}**: {', '.join(titles)}")

    tag_block = "\n".join(genre_lines) + "\n\n" + "\n".join(theme_lines) + "\n"

    content = re.sub(
        r"## タグ別索引\n\n(.*)",
        f"## タグ別索引\n\n{tag_block}",
        content,
        flags=re.DOTALL,
    )

    # --- 同期メモ更新 ---
    unresolved_lines = ""
    if unresolved:
        unresolved_lines = "\n### 未確定・要確認\n\n" + "\n".join(
            f"- `{u['clip']['title']}` ({u['clip']['url']}): {u['reason']}"
            for u in unresolved
        )

    sync_memo = (
        f"## Suno同期メモ ({today})\n\n"
        f"- 参照元: https://suno.com/@{handle}\n"
        f"- 公開クリップ数: {total_fetched}（API取得時点）\n"
        f"- 今回追加: {len(new_songs)} 件\n"
        f"- 今回更新: {len(updated_songs)} 件\n"
        f"{unresolved_lines}"
    )

    content = re.sub(
        r"## Suno同期メモ.*?(?=\n## |\Z)",
        sync_memo + "\n\n",
        content,
        flags=re.DOTALL,
    )

    # 最終更新日
    content = re.sub(r"最終更新: \d{4}-\d{2}-\d{2}", f"最終更新: {today}", content)

    index_path.write_text(content, encoding="utf-8")


# ---------------------------------------------------------------------------
# メイン処理
# ---------------------------------------------------------------------------


def main():
    parser = argparse.ArgumentParser(description="Suno同期インデックス更新")
    parser.add_argument("--fetched", default="fetched.json", help="fetch_suno_profile.py の出力JSON")
    parser.add_argument(
        "--songs-dir",
        default=str(Path(__file__).parent.parent.parent.parent.parent / "public/suno_PJ/Suno/01_Songs"),
        help="01_Songs ディレクトリパス",
    )
    parser.add_argument(
        "--index",
        default=str(Path(__file__).parent.parent.parent.parent.parent / "public/suno_PJ/Suno/_index.md"),
        help="_index.md パス",
    )
    parser.add_argument("--handle", default="hypnotizingtonalities0343", help="Sunoハンドル名")
    parser.add_argument("--dry-run", action="store_true", help="ファイル書き込みをせず差分だけ表示")
    args = parser.parse_args()

    songs_dir = Path(args.songs_dir)
    index_path = Path(args.index)
    today = date.today().isoformat()

    # 取得済みJSONロード
    with open(args.fetched, encoding="utf-8") as f:
        fetched_clips: list[dict] = json.load(f)

    print(f"[INFO] 取得クリップ数: {len(fetched_clips)}")

    # 既存曲ロード
    songs = load_existing_songs(songs_dir)
    print(f"[INFO] 既存曲ファイル数: {len(songs)}")

    new_songs: list[dict] = []
    updated_songs: list[dict] = []
    unresolved: list[dict] = []

    for clip in fetched_clips:
        # 公開済みのみ処理（private は skip）
        if clip.get("status") not in ("", "public", None):
            if clip.get("status") == "private":
                unresolved.append({"clip": clip, "reason": "非公開クリップ"})
                continue

        matched = match_clip_to_song(clip, songs)

        if matched is None:
            # 新規曲
            if is_ambiguous(clip, songs):
                unresolved.append({"clip": clip, "reason": "同名タイトルが複数存在（要手動確認）"})
                continue

            song_id = next_song_id(songs + new_songs, date.today().year)
            title_safe = re.sub(r'[\\/:*?"<>|]', "_", clip["title"])
            file_name = f"{song_id}_{title_safe}.md"
            file_path = songs_dir / file_name

            content = create_song_file(song_id, clip, today, songs_dir / "_template_song.md")

            if not args.dry_run:
                file_path.write_text(content, encoding="utf-8")

            new_entry = {"id": song_id, "title": clip["title"], "_file": file_path}
            new_songs.append(new_entry)
            songs.append({**parse_frontmatter(content), "_file": file_path, "_content": content})
            print(f"[NEW] {song_id}: {clip['title']}")

        else:
            # 既存曲の更新
            changed = False
            content = matched["_content"]

            # suno_song_url が未設定なら追記
            if not matched.get("suno_song_url") and clip["url"]:
                content = update_frontmatter_field(content, "suno_song_url", clip["url"])
                changed = True

            # tags が空なら補完
            existing_tags = matched.get("tags", [])
            if (not existing_tags or existing_tags == [""]) and pick_tags(clip):
                tags_str = "[" + ", ".join(pick_tags(clip)) + "]"
                content = update_frontmatter_field(content, "tags", tags_str)
                changed = True

            if changed:
                if not args.dry_run:
                    matched["_file"].write_text(content, encoding="utf-8")
                updated_songs.append(matched)
                print(f"[UPDATE] {matched.get('id')}: {matched.get('title')}")
            else:
                print(f"[SKIP] {matched.get('id')}: {matched.get('title')} (変更なし)")

    # _index.md 更新
    if not args.dry_run:
        rebuild_index(
            index_path,
            songs,
            new_songs,
            updated_songs,
            unresolved,
            today,
            args.handle,
            len(fetched_clips),
        )
        print(f"[INFO] {index_path} を更新しました")

    # サマリー
    print("\n=== 同期サマリー ===")
    print(f"  新規追加: {len(new_songs)} 件")
    print(f"  更新:     {len(updated_songs)} 件")
    print(f"  未確定:   {len(unresolved)} 件")
    if unresolved:
        print("\n--- 未確定リスト ---")
        for u in unresolved:
            print(f"  - {u['clip']['title']}: {u['reason']}")


if __name__ == "__main__":
    main()
