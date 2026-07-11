#!/usr/bin/env python3
"""Download + parse multiple OpenAI Codex-related pages from Wayback Machine."""
import json
import re
import subprocess
from pathlib import Path
from html.parser import HTMLParser

# URLs we have archived snapshots for
SOURCES = [
    ('en-codex', 'https://web.archive.org/web/20260711100632/https://openai.com/codex/'),
    ('api-pricing', 'https://web.archive.org/web/20260616145602/https://openai.com/api/pricing/'),
    ('developers', 'https://web.archive.org/web/20260708065238/https://developers.openai.com/codex'),
    ('platform-codex', 'https://web.archive.org/web/20250813162046/https://platform.openai.com/docs/models/codex'),
]

OUT_DIR = Path('/home/hermes/projects/codex-clone/docs')
TMP_HTML = Path('/tmp/wm-pages')
TMP_HTML.mkdir(parents=True, exist_ok=True)


def extract_text(html):
    texts = []
    for tag in ['h1', 'h2', 'h3', 'h4', 'p', 'li', 'button', 'a']:
        for m in re.finditer(rf'<{tag}[^>]*>([^<]+)</{tag}>', html):
            text = m.group(1).strip()
            if text and 1 < len(text) < 1000:
                texts.append({'tag': tag, 'text': text})
    return texts


def extract_images(html):
    images = []
    for match in re.finditer(r'<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?', html):
        src, alt = match.groups()
        if 'data:' in src or '1x1' in src or 'pixel' in src.lower():
            continue
        images.append({'src': src, 'alt': alt or ''})
    return images


def fetch_and_parse(slug, url):
    print(f'\n=== {slug} ===')
    print(f'  URL: {url}')
    # Strip Wayback Machine prefix to get real URL for filename only
    out_html = TMP_HTML / f'{slug}.html'
    if not out_html.exists():
        try:
            subprocess.run(
                ['curl', '-sSL', '--tlsv1.2', '--tls-max', '1.2',
                 '--max-time', '60', '-o', str(out_html), url],
                check=False, timeout=90
            )
        except Exception as e:
            print(f'  fetch error: {e}')

    if not out_html.exists() or out_html.stat().st_size < 1000:
        print(f'  FAIL: empty or missing')
        return None

    html = out_html.read_text(encoding='utf-8', errors='ignore')
    print(f'  size: {len(html)} bytes')

    # Strip Wayback toolbar
    m = re.search(r'<!-- END WAYBACK TOOLBAR INSERT -->(.*?)<!-- BEGIN WAYBACK TOOLBAR INSERT -->', html, re.DOTALL)
    page = m.group(1) if m else html
    print(f'  page size: {len(page)} bytes')

    title = ''
    tm = re.search(r'<title>([^<]+)</title>', page)
    if tm:
        title = tm.group(1).strip()

    return {
        'slug': slug,
        'source_url': url,
        'html_size': len(html),
        'page_size': len(page),
        'title': title,
        'texts': extract_text(page),
        'images': extract_images(page),
    }


results = []
for slug, url in SOURCES:
    r = fetch_and_parse(slug, url)
    if r:
        results.append(r)
        print(f'  title: {r["title"][:80]}')
        print(f'  texts: {len(r["texts"])}')
        print(f'  images: {len(r["images"])}')
        print(f'  first 15 texts:')
        for t in r['texts'][:15]:
            print(f"    [{t['tag']:6s}] {t['text'][:100]}")

# Save aggregated
out_json = OUT_DIR / 'wm-multi-extract.json'
out_json.write_text(json.dumps(results, ensure_ascii=False, indent=2))
print(f'\n✓ Saved to {out_json}')