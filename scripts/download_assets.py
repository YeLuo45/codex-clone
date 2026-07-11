#!/usr/bin/env python3
"""Download OpenAI Codex page images from Wayback Machine."""
import re
import subprocess
import json
from pathlib import Path

WM_TIMESTAMP = '20260711044313'
OUT = Path('/home/hermes/projects/codex-clone/web/public/assets')

with open('/home/hermes/projects/codex-clone/docs/wm-extract.json') as f:
    d = json.load(f)

# Define semantic names based on filename patterns
NAMES = {
    '77tJ5U1tgxHMZflZ5m4Z24': 'hero-blossom-icon.png',
    '3VNkIvFSqReRhjyqqBUOjd': 'feature-built.png',
    'UtVI8zlaSGX2kpwGW6pYH': 'feature-designed.png',
    '6ZHpURIvfkGDl4gt6WMCPc': 'feature-adapts.png',
    '6F8UWSzmwmGiAla39KwMI8': 'feature-made-for.png',
    '7eEkHwSfjAAJMP20Dcjh50': 'feature-raise-bar.png',
    '4VICAqwJvjaSSJZpERHfXo': 'surface-chatgpt-app.png',
    '67q8M6lUey7LslnSRTQD5o': 'surface-ide-extension.png',
    '5zIp2sCdBS7Dwx6XEb6pUk': 'surface-cli.png',
}


def get_name(url):
    """Extract semantic name from CTFassets URL."""
    for hash_id, name in NAMES.items():
        if hash_id in url:
            return name
    # Fallback: hash + last segment
    m = re.search(r'/([a-f0-9]{24})/([^/?]+)', url)
    if m:
        return f"{m.group(1)[:8]}-{m.group(2)}"
    return url.split('/')[-1].split('?')[0]


downloaded = 0
for img in d['images_sample']:
    src = img['src']
    # Skip Wayback Machine prefix, use direct CTFassets URL
    real_url = src.replace(f'https://web.archive.org/web/{WM_TIMESTAMP}/', '')
    # Decode HTML entities
    real_url = real_url.replace('&amp;', '&')
    name = get_name(real_url)
    outpath = OUT / name
    if outpath.exists():
        continue
    try:
        result = subprocess.run(
            ['curl', '-sSL', '--max-time', '30',
             '-A', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
             '-o', str(outpath), real_url],
            capture_output=True, timeout=40
        )
        if outpath.exists() and outpath.stat().st_size > 1000:
            downloaded += 1
            print(f'  ✓ {name} ({outpath.stat().st_size // 1024}KB)')
        else:
            if outpath.exists():
                outpath.unlink()
            print(f'  ✗ {name} (empty or failed)')
    except Exception as e:
        print(f'  ✗ {name} ({e})')

# Also try favicon
favicon = 'https://openai.com/favicon.ico'
favpath = OUT / 'favicon.ico'
if not favpath.exists():
    subprocess.run(['curl', '-sSL', '--max-time', '15',
                    '-A', 'Mozilla/5.0', '-o', str(favpath), favicon],
                   capture_output=True, timeout=20)
    if favpath.exists():
        print(f'  favicon.ico ({favpath.stat().st_size}B)')

print(f'\nDone: {downloaded} images downloaded')
print(f'Total assets: {len(list(OUT.iterdir()))}')