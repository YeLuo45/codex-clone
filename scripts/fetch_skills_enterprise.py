#!/usr/bin/env python3
"""Download + parse Skills and Enterprise Codex pages."""
import json
import re
import subprocess
from pathlib import Path

SOURCES = [
    ('skills', 'https://web.archive.org/web/20260705235947/https://developers.openai.com/codex/skills'),
    ('enterprise', 'https://web.archive.org/web/20260120130823/https://developers.openai.com/codex/enterprise'),
]

TMP = Path('/tmp/wm-pages')
TMP.mkdir(parents=True, exist_ok=True)
OUT = Path('/home/hermes/projects/codex-clone/docs')


def extract(html):
    texts = []
    for tag in ['h1', 'h2', 'h3', 'h4', 'p', 'li', 'button', 'a', 'code', 'pre']:
        for m in re.finditer(rf'<{tag}[^>]*>([^<]+)</{tag}>', html):
            text = m.group(1).strip()
            if text and 1 < len(text) < 1500:
                texts.append({'tag': tag, 'text': text})
    images = []
    for m in re.finditer(r'<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?', html):
        src, alt = m.groups()
        if 'data:' in src or '1x1' in src:
            continue
        images.append({'src': src, 'alt': alt or ''})
    return texts, images


results = []
for slug, url in SOURCES:
    out = TMP / f'{slug}.html'
    if not out.exists() or out.stat().st_size < 1000:
        subprocess.run(
            ['curl', '-sSL', '--tlsv1.2', '--tls-max', '1.2',
             '--max-time', '60', '-o', str(out), url],
            check=False, timeout=90
        )
    if not out.exists():
        print(f'{slug}: FAIL fetch')
        continue
    html = out.read_text(encoding='utf-8', errors='ignore')
    m = re.search(r'<!-- END WAYBACK TOOLBAR INSERT -->(.*?)<!-- BEGIN WAYBACK TOOLBAR INSERT -->', html, re.DOTALL)
    page = m.group(1) if m else html
    title = ''
    tm = re.search(r'<title>([^<]+)</title>', page)
    if tm:
        title = tm.group(1).strip()
    texts, images = extract(page)
    print(f'\n=== {slug} ===')
    print(f'  size: {len(html)} ({len(page)} page)')
    print(f'  title: {title[:80]}')
    print(f'  texts: {len(texts)}, images: {len(images)}')
    print(f'  first 25 texts:')
    for t in texts[:25]:
        print(f"    [{t['tag']:5s}] {t['text'][:120]}")
    results.append({'slug': slug, 'source_url': url, 'title': title, 'texts': texts, 'images': images})

Path('/home/hermes/projects/codex-clone/docs/wm-pages-extract.json').write_text(
    json.dumps(results, ensure_ascii=False, indent=2)
)
print(f'\n✓ Saved to /home/hermes/projects/codex-clone/docs/wm-pages-extract.json')