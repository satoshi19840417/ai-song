"""
fetch_suno_profile.py
Sunoプロフィールから全曲情報を取得してJSONに保存する。

使い方:
  python fetch_suno_profile.py <handle> [--output fetched.json]

環境変数:
  SUNO_COOKIE: ブラウザから取得したCookieヘッダー文字列
"""

import argparse
import json
import os
import sys
import time

import requests


def fetch_clips(handle: str, cookie: str) -> list[dict]:
    """全ページを取得して clips のリストを返す。"""
    base_url = (
        "https://studio-api.prod.suno.com/api/profiles/{handle}"
        "?page={page}&playlists_sort_by=created_at&clips_sort_by=created_at"
    )
    headers = {
        "Cookie": cookie,
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
    }

    clips = []
    page = 0
    while True:
        url = base_url.format(handle=handle, page=page)
        resp = requests.get(url, headers=headers, timeout=30)
        if resp.status_code != 200:
            print(
                f"[ERROR] ページ {page} 取得失敗: {resp.status_code}",
                file=sys.stderr,
            )
            raise SystemExit(1)

        data = resp.json()
        page_clips = data.get("clips", [])
        if not page_clips:
            # 空ページ = 全件取得完了
            break

        clips.extend(page_clips)
        print(f"[INFO] page={page} +{len(page_clips)} clips (累計 {len(clips)})")

        # 全件取得済みチェック
        total = data.get("num_clips") or data.get("total_count")
        if total and len(clips) >= total:
            break

        page += 1
        time.sleep(0.5)  # レート制限回避

    return clips


def normalize_clip(clip: dict) -> dict:
    """APIレスポンスから必要フィールドだけ抽出・正規化する。"""
    meta = clip.get("metadata") or {}
    return {
        "id": clip.get("id", ""),
        "title": clip.get("title", "").strip(),
        "created_at": clip.get("created_at", ""),
        "status": clip.get("status", ""),
        "display_tags": clip.get("display_tags") or [],
        "tags": meta.get("tags") or [],
        "url": f"https://suno.com/song/{clip.get('id', '')}",
    }


def main():
    parser = argparse.ArgumentParser(description="Sunoプロフィール曲取得")
    parser.add_argument("handle", help="Sunoハンドル名 (@ なし)")
    parser.add_argument("--output", default="fetched.json", help="出力JSONパス")
    args = parser.parse_args()

    cookie = os.environ.get("SUNO_COOKIE", "")
    if not cookie:
        print("[ERROR] 環境変数 SUNO_COOKIE が未設定です", file=sys.stderr)
        raise SystemExit(1)

    print(f"[INFO] {args.handle} の曲を取得中...")
    clips = fetch_clips(args.handle, cookie)
    normalized = [normalize_clip(c) for c in clips]

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(normalized, f, ensure_ascii=False, indent=2)

    print(f"[INFO] {len(normalized)} 件を {args.output} に保存しました")


if __name__ == "__main__":
    main()
