"""OpenAI Codex page reconnaissance — full page screenshots + token/section extraction."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path('/home/hermes/projects/codex-clone/docs/design-references')
OUT.mkdir(parents=True, exist_ok=True)

URL = 'https://openai.com/zh-Hans-CN/codex/'

results = {}

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path='/home/hermes/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
            args=['--no-sandbox', '--disable-dev-shm-usage']
        )
        ctx = browser.new_context(
            viewport={'width': 1440, 'height': 900},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            locale='zh-CN'
        )
        page = ctx.new_page()

        # OpenAI has heavy JS + long-polling, use domcontentloaded
        resp = page.goto(URL, wait_until='domcontentloaded', timeout=60000)
        results['status'] = resp.status if resp else None
        results['final_url'] = page.url
        results['title'] = page.title()

        # Wait for hydration
        try:
            page.wait_for_selector('main, section, [class*="hero"], h1, h2', timeout=15000)
        except: pass
        page.wait_for_timeout(7000)

        # Screenshots — desktop full + viewport
        page.screenshot(path=str(OUT / 'codex-overview-desktop-full.png'), full_page=True)
        page.screenshot(path=str(OUT / 'codex-overview-desktop-viewport.png'), full_page=False)

        # Mobile
        ctx2 = browser.new_context(
            viewport={'width': 390, 'height': 844},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
            locale='zh-CN'
        )
        page2 = ctx2.new_page()
        page2.goto(URL, wait_until='domcontentloaded', timeout=60000)
        try:
            page2.wait_for_selector('main, section, h1, h2', timeout=10000)
        except: pass
        page2.wait_for_timeout(5000)
        page2.screenshot(path=str(OUT / 'codex-overview-mobile-full.png'), full_page=True)

        # Comprehensive metrics extraction
        metrics = page.evaluate('''() => {
            const docHeight = document.documentElement.scrollHeight;
            const docWidth = document.documentElement.scrollWidth;
            const get = (el, prop) => el ? getComputedStyle(el)[prop] : null;

            // Sections
            const sectionSelectors = ['section', 'main > div', 'main > section', '[class*="section"]'];
            let sections = [];
            sectionSelectors.forEach(sel => {
                document.querySelectorAll(sel).forEach((s, idx) => {
                    if (idx < 30) {
                        const rect = s.getBoundingClientRect();
                        sections.push({
                            tag: s.tagName,
                            classes: (s.className?.toString() || '').slice(0, 100),
                            rect: {
                                x: Math.round(rect.x),
                                y: Math.round(rect.y + window.scrollY),
                                w: Math.round(rect.width),
                                h: Math.round(rect.height),
                            },
                            text: (s.innerText || '').slice(0, 300),
                            childCount: s.children.length,
                            bg: get(s, 'backgroundColor'),
                        });
                    }
                });
            });

            // Sample fonts
            const sampleEls = document.querySelectorAll('h1, h2, h3, p, span, button, a, div');
            const fonts = [...new Set([...sampleEls].slice(0, 300).map(el => getComputedStyle(el).fontFamily))].slice(0, 15);

            // Colors
            const colorEls = document.querySelectorAll('section, div, header, footer, button, a');
            const bgColors = [...new Set([...colorEls].slice(0, 200).map(el => getComputedStyle(el).backgroundColor).filter(c => c && c !== 'rgba(0, 0, 0, 0)'))].slice(0, 25);
            const textColors = [...new Set([...document.querySelectorAll('h1, h2, h3, p, span, a, button')].slice(0, 200).map(el => getComputedStyle(el).color))].slice(0, 15);

            // Images
            const images = [...document.querySelectorAll('img')].slice(0, 60).map(img => ({
                src: img.src || img.currentSrc || '',
                alt: img.alt || '',
                w: img.naturalWidth || 0,
                h: img.naturalHeight || 0,
                cls: (img.className?.toString() || '').slice(0, 60),
            })).filter(i => i.src && i.w >= 30);

            // Headings
            const headings = [...document.querySelectorAll('h1, h2, h3')].slice(0, 30).map(h => ({
                tag: h.tagName,
                text: (h.innerText || '').trim().slice(0, 200),
                fontSize: getComputedStyle(h).fontSize,
                fontWeight: getComputedStyle(h).fontWeight,
                color: getComputedStyle(h).color,
            }));

            return {
                docHeight,
                docWidth,
                sectionCount: document.querySelectorAll('section').length,
                headerCount: document.querySelectorAll('header').length,
                footerCount: document.querySelectorAll('footer').length,
                h1Count: document.querySelectorAll('h1').length,
                h2Count: document.querySelectorAll('h2').length,
                h3Count: document.querySelectorAll('h3').length,
                buttonCount: document.querySelectorAll('button').length,
                imgCount: document.querySelectorAll('img').length,
                videoCount: document.querySelectorAll('video').length,
                svgCount: document.querySelectorAll('svg').length,
                linkCount: document.querySelectorAll('a').length,
                bodyBg: get(document.body, 'backgroundColor'),
                bodyFont: get(document.body, 'fontFamily'),
                bodyColor: get(document.body, 'color'),
                htmlClass: document.documentElement.className,
                textContent: document.body.innerText.slice(0, 8000),
                sections,
                fonts,
                bgColors,
                textColors,
                images,
                headings,
            };
        }''')

        results['metrics'] = metrics

        # Asset discovery
        assets = page.evaluate('''() => ({
            favicons: [...document.querySelectorAll('link[rel*="icon"]')].map(l => l.href).slice(0, 5),
            ogImages: [...document.querySelectorAll('meta[property^="og:image"]')].map(m => m.content).slice(0, 5),
            cssLinks: [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href).slice(0, 8),
            fontLinks: [...document.querySelectorAll('link[href*="fonts"], link[as="font"]')].map(l => l.href).slice(0, 5),
            videos: [...document.querySelectorAll('video')].map(v => ({
                src: v.src || (v.querySelector('source') ? v.querySelector('source').src : ''),
                poster: v.poster || '',
            })).filter(v => v.src || v.poster),
        })''')
        results['assets'] = assets

        browser.close()

    Path('/home/hermes/projects/codex-clone/docs/recon.json').write_text(
        json.dumps(results, ensure_ascii=False, indent=2)
    )

    print('OK')
    print(f"  status: {results['status']}")
    print(f"  url: {results['final_url']}")
    print(f"  title: {results['title'][:100]}")
    m = results['metrics']
    print(f"  doc: {m['docWidth']}x{m['docHeight']}")
    print(f"  sections: {m['sectionCount']}, h1/h2/h3: {m['h1Count']}/{m['h2Count']}/{m['h3Count']}")
    print(f"  imgs: {m['imgCount']}, videos: {m['videoCount']}, svgs: {m['svgCount']}")
    print(f"  body bg: {m['bodyBg']}, color: {m['bodyColor']}")
    print(f"  body font: {(m['bodyFont'] or '')[:100]}")
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f'FAIL: {e}', file=sys.stderr)
    sys.exit(1)