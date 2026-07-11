"""Screenshot all 4 pages of codex-clone for QA."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path('/home/hermes/projects/codex-clone/docs/design-references')
OUT.mkdir(parents=True, exist_ok=True)

PAGES = [
    ('/', 'multi-home-zh.png'),
    ('/#/en', 'multi-home-en.png'),
    ('/#/pricing', 'multi-pricing.png'),
    ('/#/docs', 'multi-docs.png'),
]

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path='/home/hermes/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
        args=['--no-sandbox', '--disable-dev-shm-usage']
    )
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, locale='zh-CN')
    page = ctx.new_page()

    for url, name in PAGES:
        full_url = f'http://127.0.0.1:5181{url}'
        resp = page.goto(full_url, wait_until='domcontentloaded', timeout=30000)
        page.wait_for_timeout(2500)
        page.screenshot(path=str(OUT / name), full_page=True)
        print(f'  {url}: status={resp.status if resp else None}, h={page.evaluate("document.documentElement.scrollHeight")}')

    # Mobile view of one page
    ctx2 = browser.new_context(viewport={'width': 390, 'height': 844})
    page2 = ctx2.new_page()
    page2.goto('http://127.0.0.1:5181/#/pricing', wait_until='domcontentloaded', timeout=30000)
    page2.wait_for_timeout(2000)
    page2.screenshot(path=str(OUT / 'multi-pricing-mobile.png'), full_page=True)
    print(f'  mobile pricing: h={page2.evaluate("document.documentElement.scrollHeight")}')

    browser.close()