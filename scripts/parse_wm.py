#!/usr/bin/env python3
"""Parse Wayback Machine HTML to extract page structure + assets + content."""
import json
import re
import sys
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse, unquote

HTML_FILE = '/tmp/codex-wm.html'
WM_PREFIX = 'https://web.archive.org/web/20260711044313/'

with open(HTML_FILE, encoding='utf-8') as f:
    html = f.read()

# Strip Wayback toolbar/script wrapper
# The actual page content is between <!-- BEGIN WAYBACK TOOLBAR INSERT --> and <!-- END WAYBACK TOOLBAR INSERT -->
m = re.search(r'<!-- END WAYBACK TOOLBAR INSERT -->(.*?)<!-- BEGIN WAYBACK TOOLBAR INSERT -->', html, re.DOTALL)
if m:
    page_html = m.group(1)
else:
    page_html = html

# Wayback Machine rewrites URLs to point to /web/<timestamp>/<original>
# We need to extract original URLs from href/src attributes

# Extract images
images = []
for match in re.finditer(r'<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?', page_html):
    src, alt = match.groups()
    if 'data:' in src or '1x1' in src or 'pixel' in src.lower():
        continue
    images.append({'src': src, 'alt': alt or ''})

# Extract videos
videos = []
for match in re.finditer(r'<video[^>]*src="([^"]+)"[^>]*poster="([^"]*)"', page_html):
    src, poster = match.groups()
    videos.append({'src': src, 'poster': poster})

# Extract text content (h1, h2, h3, p, button, a)
def extract_text():
    texts = []
    # h1, h2, h3
    for tag in ['h1', 'h2', 'h3', 'p', 'button', 'a']:
        for m in re.finditer(rf'<{tag}[^>]*>([^<]+)</{tag}>', page_html):
            text = m.group(1).strip()
            if text and len(text) > 1 and len(text) < 500:
                texts.append({'tag': tag, 'text': text})
    return texts

texts = extract_text()

# Extract navigation links
nav_links = []
for m in re.finditer(r'<a[^>]+href="([^"]+)"[^>]*class="[^"]*nav[^"]*"[^>]*>([^<]+)</a>', page_html):
    href, text = m.groups()
    nav_links.append({'href': href, 'text': text.strip()})

# Extract section structure
sections = []
for m in re.finditer(r'<section[^>]*id="([^"]*)"[^>]*>', page_html):
    sections.append({'id': m.group(1)})

# Extract meta tags
metas = {}
for m in re.finditer(r'<meta[^>]+name="([^"]+)"[^>]+content="([^"]+)"', page_html):
    name, content = m.groups()
    metas[name] = content
for m in re.finditer(r'<meta[^>]+property="([^"]+)"[^>]+content="([^"]+)"', page_html):
    prop, content = m.groups()
    metas[f'og:{prop.split(":")[-1]}'] = content

# Extract CSS links
css_links = []
for m in re.finditer(r'<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"', page_html):
    css_links.append(m.group(1))

# Extract font links
font_links = []
for m in re.finditer(r'<link[^>]+href="([^"]+)"[^>]*rel="preload"[^>]*as="font"', page_html):
    font_links.append(m.group(1))

# Extract favicons
favicons = []
for m in re.finditer(r'<link[^>]+rel="icon[^"]*"[^>]+href="([^"]+)"', page_html):
    favicons.append(m.group(1))

result = {
    'source_url': 'https://openai.com/zh-Hans-CN/codex/',
    'archive_timestamp': '20260711044313',
    'html_size_bytes': len(html),
    'page_html_size': len(page_html),
    'metas': metas,
    'favicons': favicons,
    'css_links': css_links[:10],
    'font_links': font_links,
    'images_count': len(images),
    'images_sample': images[:30],
    'videos_count': len(videos),
    'videos_sample': videos[:10],
    'nav_links': nav_links[:20],
    'texts_count': len(texts),
    'texts_sample': texts[:100],
    'sections_count': len(sections),
    'sections_ids': [s['id'] for s in sections],
}

with open('/home/hermes/projects/codex-clone/docs/wm-extract.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f'OK')
print(f'  HTML size: {len(html)} → page: {len(page_html)}')
print(f'  metas: {len(metas)}')
print(f'  images: {len(images)} (showing first 10)')
for img in images[:10]:
    print(f"    {img['src'][:120]}  alt={img['alt'][:40]!r}")
print(f'  videos: {len(videos)}')
for v in videos:
    print(f"    src={v['src'][:100]}  poster={v['poster'][:80]}")
print(f'  texts (h1/h2/h3/p/button/a): {len(texts)}')
print(f'  First 30 texts:')
for t in texts[:30]:
    print(f"    [{t['tag']}] {t['text'][:120]}")
print(f'\n  Saved to /home/hermes/projects/codex-clone/docs/wm-extract.json')