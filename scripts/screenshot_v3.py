"""Screenshot all 7 pages of codex-clone for QA."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path('/home/hermes/projects/codex-clone/docs/design-references')
OUT.mkdir(parents=True, exist_ok=True)

PAGES = [
    ('/', 'v3-home.png'),
    ('/#/en', 'v3-en.png'),
    ('/#/pricing', 'v3-pricing.png'),
    ('/#/docs', 'v3-docs.png'),
    ('/#/skills', 'v3-skills.png'),
    ('/#/enterprise', 'v3-enterprise.png'),
    ('/#/code-search', 'v3-codesearch.png'),
]

PORT = 5183
with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        executable_path='/home/hermes/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
        args=['--no-sandbox', '--disable-dev-shm-usage']
    )
    ctx = browser.new_context(viewport={'width': 1440, 'height': 900}, locale='zh-CN')
    page = ctx.new_page()

    for url, name in PAGES:
        full_url = f'http://127.0.0.1:{PORT}{url}'
        try:
            resp = page.goto(full_url, wait_until='domcontentloaded', timeout=15000)
            page.wait_for_timeout(2500)
            page.screenshot(path=str(OUT / name), full_page=True)
            status = resp.status if resp else 'None'
            h = page.evaluate("document.documentElement.scrollHeight")
            print(f'  {url}: {status}, h={h}')
        except Exception as e:
            print(f'  {url}: FAIL {e}')

    # Test search modal opens with Cmd+K
    page.goto(f'http://127.0.0.1:{PORT}/#/docs', wait_until='domcontentloaded', timeout=15000)
    page.wait_for_timeout(2500)
    page.evaluate("document.body.focus()")
    page.keyboard.press('Control+k')
    page.wait_for_timeout(800)
    modal_open = page.evaluate("!!document.querySelector('input[placeholder*=\"搜索\"]') || !!document.querySelector('input[placeholder*=\"Search\"]')")
    print(f'  search modal: open={modal_open}')
    page.screenshot(path=str(OUT / 'v3-search-modal.png'), full_page=False)

    browser.close()