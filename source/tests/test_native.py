"""محاكاة بيئة تطبيق أندرويد (Capacitor) للتحقق من مسارات النطق والتصدير الخاصة به."""
import pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from helpers import enter_parent
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
BOOK = (ROOT / 'dist' / 'book.html').read_text('utf-8')
INJECTED = '<script>window.__fakeBridge = 1;</script>'
MOCK = """
window.__spoken = []; window.__written = null; window.__shared = null;
window.Capacitor = { isNativePlatform: () => true, Plugins: {
  TextToSpeech: { speak: o => { window.__spoken.push(o); return new Promise(r => setTimeout(r, 30)); }, stop: () => Promise.resolve() },
  Filesystem: {
    writeFile: o => { window.__written = Object.assign({}, o); window.__writes = 1; return Promise.resolve({ uri: 'file:///cache/' + o.path }); },
    appendFile: o => { window.__written.data += o.data; window.__writes++; return Promise.resolve(); },
    getUri: o => Promise.resolve({ uri: 'file:///cache/' + o.path }),
    readdir: o => Promise.resolve({ files: window.__oldFiles || [] }),
    deleteFile: o => { (window.__deleted = window.__deleted || []).push(o.path); return Promise.resolve(); } },
  App: { addListener: (ev, fn) => { window.__back = fn; return Promise.resolve({ remove() {} }); }, exitApp: () => { window.__exited = true; } },
  Share: { share: o => { window.__shared = o; return Promise.resolve({}); } } } };
window.__oldFiles = [{ name: 'dulluni-souq-backup-2026-01-01.json' }, { name: 'other.txt' }];
"""
res = []
def check(n, c, info=''): res.append(c); print(('PASS ' if c else 'FAIL ') + n + ('' if c else ' — ' + str(info)))
with sync_playwright() as pw:
    br = pw.chromium.launch(executable_path='/usr/bin/google-chrome')
    pg = br.new_page(bypass_csp=True); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script(MOCK)
    pg.route('http://app.local/', lambda r: r.fulfill(body=BOOK.replace('<head>', '<head>' + INJECTED, 1), content_type='text/html'))
    pg.goto('http://app.local/'); pg.wait_for_selector('.profiles')
    check('native mode detected', pg.evaluate('CAP && NATIVE'))
    check('no "not persistent" note in app', pg.locator('.parent-note').count() == 0)
    pg.fill('#new-name', 'كريم'); pg.click('.add-form button[type=submit]'); pg.wait_for_selector('.cover')
    pg.evaluate('go(3)'); pg.wait_for_selector('.story')
    pg.wait_for_function('!Player.active()', timeout=10000)   # قراءة الغلاف التلقائية
    pg.evaluate('window.__spoken = []')
    pg.click('.story-text .spk-icon')
    pg.wait_for_function('!Player.active()', timeout=10000)
    sp = pg.evaluate('window.__spoken')
    n = pg.evaluate('sentences(STORY_PAGES[2].text).length')
    check('native TTS speaks every sentence of the body', len(sp) == n, (len(sp), n))
    check('native TTS gets normalized Arabic text', all(o['lang'] == 'ar-SA' and 'ﷺ' not in o['text'] for o in sp))
    pg.evaluate('STORY_PAGES.forEach(p => { S.progress.read[p.n] = true; }); goId("certificate")'); pg.wait_for_selector('.certificate')
    check('print button hidden in Android app', pg.locator('text=طِبَاعَةُ').count() == 0)
    pg.click('#topbar .btn >> nth=0'); pg.wait_for_selector('.profiles')
    enter_parent(pg)
    pg.locator('.parent .profile-row').first.locator('text=تَصْدِيرُ').click(); pg.click('[data-export-family]')
    pg.wait_for_function('window.__shared !== null', timeout=10000)
    w = pg.evaluate('window.__written')
    check('export written to cache then shared', w['directory'] == 'CACHE' and w['path'].endswith('.html') and pg.evaluate('window.__shared.files[0]').endswith(w['path']))
    html = w['data']
    check('exported file is clean of injected platform scripts', '__fakeBridge' not in html and 'id="export-data"' in html and 'id="app-main"' in html)
    check('file written in several parts (not one big string)', pg.evaluate('window.__writes') >= 3)
    check('old temporary backups cleaned from the cache, others kept', set(pg.evaluate('window.__deleted')) == {'dulluni-souq-backup-2026-01-01.json'}, pg.evaluate('window.__deleted'))
    # زر الرجوع: يغلق النافذة أولًا، ثم يعود صفحة، ثم إلى القرّاء، ثم يخرج
    pg.click('[data-parent-btn]'); pg.wait_for_selector('.profiles')
    pg.locator('.profile-btn').first.click(); pg.wait_for_selector('#topbar .who')
    pg.evaluate('go(2)'); pg.click('[data-toc]'); pg.wait_for_selector('.toc')
    pg.evaluate('window.__back()'); pg.wait_for_selector('#modal-root', state='hidden')
    check('back closes the open window first', pg.evaluate('S.page') == 2)
    pg.evaluate('window.__back()'); pg.wait_for_function('S.page === 1')
    pg.evaluate('window.__back()'); pg.wait_for_function('S.page === 0')
    pg.evaluate('window.__back()'); pg.wait_for_selector('.profiles')
    pg.evaluate('window.__back()')
    check('back steps page → cover → readers → exit', pg.evaluate('window.__exited === true'))
    check('no page errors', not errs, errs)
    pg.close()
    # the cleaned export opens standalone in a normal browser
    p2 = br.new_page(bypass_csp=True); e2 = []
    p2.on('pageerror', lambda e: e2.append(str(e)))
    p2.route('http://export.local/', lambda r: r.fulfill(body=html, content_type='text/html'))
    p2.goto('http://export.local/'); p2.wait_for_selector('.cover')
    check('native export opens read-only in a browser', 'لِلْعَرْضِ فَقَطْ' in p2.inner_text('.banner') and not e2, e2)
    br.close()
print('%d/%d passed' % (sum(res), len(res))); sys.exit(0 if all(res) else 1)
