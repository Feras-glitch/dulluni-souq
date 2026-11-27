import functools, http.server, threading, pathlib, json, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from helpers import enter_parent
ROOT = pathlib.Path(__file__).resolve().parent.parent; DIST = ROOT / 'dist'
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8766), functools.partial(Q, directory=str(DIST)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://localhost:8766/pwa/'   # مسار فرعي كما في GitHub Pages
res = []
def check(n, c, info=''): res.append(c); print(('PASS ' if c else 'FAIL ') + n + ('' if c else ' — ' + str(info)))
with sync_playwright() as pw:
    br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'])
    ctx = br.new_context(bypass_csp=True, accept_downloads=True); ctx.grant_permissions(['microphone'])
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
    pg.on('console', lambda m: errs.append(m.text + ' @ ' + str(m.location)) if m.type == 'error' else None)
    pg.goto(URL); pg.wait_for_selector('.profiles')
    pg.wait_for_function('navigator.serviceWorker.ready.then(()=>true)', timeout=15000)
    pg.reload(); pg.wait_for_selector('.profiles')
    check('service worker controls the page', pg.evaluate('!!navigator.serviceWorker.controller'))
    scope = pg.evaluate('navigator.serviceWorker.ready.then(r=>r.scope)')
    check('scope is the sub-path', scope == URL, scope)
    cdp = ctx.new_cdp_session(pg)
    m = cdp.send('Page.getAppManifest')
    check('manifest parsed without errors', m.get('errors') == [] and m.get('url', '').endswith('/pwa/manifest.json'), m.get('errors'))
    man = json.loads((DIST / 'pwa/manifest.json').read_text('utf-8'))
    for ic in man['icons']:
        sz = pg.evaluate('''src => new Promise(r=>{const i=new Image(); i.onload=()=>r(i.naturalWidth+'x'+i.naturalHeight); i.onerror=()=>r('err'); i.src=src;})''', ic['src'])
        check('icon ' + ic['src'] + ' is ' + ic['sizes'], sz == ic['sizes'], sz)
    cached = pg.evaluate('caches.keys().then(ks=>caches.open(ks[0])).then(c=>c.keys()).then(rs=>rs.map(r=>new URL(r.url).pathname))')
    check('all assets precached', len(cached) == 7, cached)
    # create profile + record online
    pg.fill('#new-name', 'دلال'); pg.check('input[value=f]'); pg.click('.add-form button[type=submit]'); pg.wait_for_selector('.cover')
    # offline
    ctx.set_offline(True)
    pg.reload(); pg.wait_for_selector('.profile-btn')
    check('opens offline from cache', pg.locator('.profile-btn').count() == 1)
    pg.click('.profile-btn'); pg.wait_for_selector('#topbar .who')
    pg.evaluate('go(1)'); pg.click('.btn-rec'); pg.wait_for_selector('canvas.wave', timeout=8000); pg.wait_for_timeout(1200)
    pg.click('.btn-stop'); pg.wait_for_selector('.my-rec audio', timeout=8000)
    check('records while offline', pg.evaluate('!!S.recs.p1'))
    pg.goto(URL + 'index.html?x=1'); pg.wait_for_selector('.profile-btn')
    check('index.html navigation served offline', True)
    n_before = len(errs)
    pg.goto(URL + 'manifest.json')   # المتصفح يطلب favicon من جذر النطاق خارج النطاق وهو غير متصل؛ خطأ متوقع
    check('direct navigation to manifest.json is not replaced by the book', '"short_name"' in pg.content())
    del errs[n_before:]
    pg.goto(URL); pg.wait_for_selector('.profile-btn')
    # export from PWA
    enter_parent(pg)
    pg.locator('.parent .profile-row').first.locator('text=تَصْدِيرُ').click()
    with pg.expect_download() as dl: pg.click('[data-export-child]')
    out = DIST / 'export-from-pwa.html'; dl.value.save_as(str(out))
    html = out.read_text('utf-8')
    check('export strips PWA links', '<link rel="manifest"' not in html and 'apple-touch-icon' not in html and 'id="export-data"' in html)
    check('export shows iPhone notice toast', 'سَفَارِي' in pg.inner_text('#toast'))
    errs[:] = [e for e in errs if '/favicon.ico' not in e]  # طلب المتصفح لأيقونة جذر النطاق، خارج نطاق الكتاب
    check('no console errors (pwa)', not errs, errs)
    ctx.close()
    c2 = br.new_context(); p2 = c2.new_page(); e2 = []
    p2.on('pageerror', lambda e: e2.append(str(e))); p2.on('console', lambda m: e2.append(m.text) if m.type == 'error' else None)
    p2.goto(out.as_uri()); p2.wait_for_selector('.cover')
    p2.evaluate('go(1)'); p2.wait_for_selector('.my-rec audio')
    check('exported file works standalone, no SW', p2.evaluate('!navigator.serviceWorker || !navigator.serviceWorker.controller') and not e2, e2)
    c2.close(); br.close()
    import tempfile
    pc = pw.chromium.launch_persistent_context(tempfile.mkdtemp(), executable_path='/usr/bin/google-chrome')
    pp = pc.new_page(); pp.goto(URL); pp.wait_for_selector('.profiles')
    pp.wait_for_function('navigator.serviceWorker.ready.then(()=>true)'); pp.reload(); pp.wait_for_selector('.profiles')
    inst = pc.new_cdp_session(pp).send('Page.getInstallabilityErrors')
    check('Chrome reports installable (normal profile)', inst.get('installabilityErrors') == [], inst)
    pc.close()
print('%d/%d passed' % (sum(res), len(res))); sys.exit(0 if all(res) else 1)
