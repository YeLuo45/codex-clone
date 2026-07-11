"""Screenshot local dev server for codex-clone visual QA."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path('/home/hermes/projects/codex-clone/docs/design-references')
OUT.mkdir(parents=True, exist_ok=True)

URL = 'http://127.0.0.1:5180/'

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path='/home/hermes/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
        args=['--no-sandbox', '--disable-dev-shm-usage']
    )

    # Desktop
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, locale='zh-CN')
    page = ctx.new_page()
    resp = page.goto(URL, wait_until='domcontentloaded', timeout=30000)
    page.wait_for_timeout(2500)
    page.screenshot(path=str(OUT / 'codex-clone-desktop-full.png'), full_page=True)
    page.screenshot(path=str(OUT / 'codex-clone-desktop-viewport.png'), full_page=False)
    print(f'desktop: status={resp.status if resp else None}, h={page.evaluate("document.documentElement.scrollHeight")}')

    # Mobile
    ctx2 = browser.new_context(viewport={'width': 390, 'height': 844}, locale='zh-CN')
    page2 = ctx2.new_page()
    page2.goto(URL, wait_until='domcontentloaded', timeout=30000)
    page2.wait_for_timeout(2500)
    page2.screenshot(path=str(OUT / 'codex-clone-mobile-full.png'), full_page=True)
    print(f'mobile: h={page2.evaluate("document.documentElement.scrollHeight")}')

    # Broken images check
    broken = page.evaluate('() => [...document.querySelectorAll("img")].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src)')
    print(f'broken: {len(broken)}')
    for b in broken[:5]:
        print(f'  {b}')

    browser.close()