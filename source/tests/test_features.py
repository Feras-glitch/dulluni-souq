"""ميزات الإصدار ١٫٢: حجم التسجيل، والنسخ الاحتياطي سطرًا سطرًا، ورمز الاستعادة، وقفل الرمز الدائم،
والمعلم وملاحظاته، والقراءة جملةً جملة، والفهرس، والإعدادات، والتصدير دون صوت الأهل، والحماية عند الاستعادة،
والتركيز بعد إعادة الرسم، والشاشة الصغيرة، وسياسة أمان المحتوى."""
import functools, http.server, threading, pathlib, sys, json, base64
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from helpers import enter_parent, exit_parent, add_child_in_parent, close_modal
ROOT = pathlib.Path(__file__).resolve().parent.parent; DIST = ROOT / 'dist'; SHOTS = ROOT / 'shots'; SHOTS.mkdir(exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8768), functools.partial(Q, directory=str(DIST)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:8768/book.html'
res = []
def check(n, c, info=''): res.append(bool(c)); print(('PASS ' if c else 'FAIL ') + n + ('' if c else ' — ' + str(info)), flush=True)
MOCK_TTS = "window.__said=[]; window.__rates=[]; window.speechSynthesis.speak = u => { window.__said.push(u.text); window.__rates.push(u.rate); setTimeout(() => u.onend && u.onend(), 15); };"
ARGS = ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required']
def rec(pg, sel, ms=1200):
    pg.click(sel); pg.wait_for_selector('canvas.wave', timeout=8000); pg.wait_for_timeout(ms)
    pg.click('.btn-stop'); pg.wait_for_function('Rec.state === "idle"', timeout=8000)

with sync_playwright() as pw:
    br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=ARGS)
    ctx = br.new_context(bypass_csp=True, viewport={'width': 1000, 'height': 900}, accept_downloads=True); ctx.grant_permissions(['microphone'])
    ctx.add_init_script(MOCK_TTS)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
    pg.goto(URL); pg.wait_for_selector('.profiles')
    pg.fill('#new-name', 'دلال'); pg.check('input[value=f]'); pg.click('.add-form button[type=submit]'); pg.wait_for_selector('.cover')
    pg.evaluate('toProfiles()'); pg.wait_for_selector('.profiles')

    # الاسم المكرر
    enter_parent(pg, '2468')
    rcode = pg.evaluate('window.__rcode')
    check('recovery code shown once at PIN creation', bool(rcode) and len(rcode) == 9 and rcode[4] == '-', rcode)
    check('recovery code stored only as hash', rcode.replace('-', '') not in json.dumps(pg.evaluate('S.store.getMeta("pin")')))
    n0 = pg.locator('.parent .profile-row').count()
    pg.fill('.parent #new-name', 'دَلَال'); pg.click('.parent .add-form button[type=submit]'); pg.wait_for_timeout(300)
    check('duplicate child name refused (ignoring tashkeel)', pg.locator('.parent .profile-row').count() == n0 and 'يُوجَدُ' in pg.inner_text('#toast'))
    add_child_in_parent(pg, 'كريم')
    check('parent dashboard per child', pg.locator('.parent .dash .meter').count() >= 8)
    check('version shown in parent mode', '١٫٢' in pg.inner_text('.version') or '١.٢' in pg.inner_text('.version'), pg.inner_text('.version'))
    # رمز المعلم
    pg.click('[data-teacher-pin]'); pg.fill('#pin1', '2468'); pg.fill('#pin2', '2468'); pg.click('[data-pin-save]')
    check('teacher PIN must differ from parent PIN', pg.locator('#pin1').count() == 1 and 'يَخْتَلِفَ' in pg.inner_text('#toast'))
    pg.fill('#pin1', '1357'); pg.fill('#pin2', '1357'); pg.click('[data-pin-save]'); pg.wait_for_selector('#modal-root', state='hidden')
    exit_parent(pg)
    check('teacher button appears on the readers screen', pg.locator('[data-teacher-btn]').count() == 1)

    # التسجيل: حجم معقول، وبصمة النص
    pg.locator('.profile-btn', has_text='دلال').click(); pg.wait_for_selector('.cover')
    pg.evaluate('go(4)'); pg.wait_for_selector('.story')
    rec(pg, '.rec-box:not(.compact) .btn-rec', 3000)
    kbps = pg.evaluate('S.recs.p4.blob.size * 8 / S.recs.p4.duration')
    check('recording bitrate about 32 kbps (≤ 48)', kbps <= 48, round(kbps, 1))
    check('recording stores the text version', pg.evaluate('S.recs.p4.tv === textVersion("p4") && S.recs.p4.tv.length > 3'))
    pg.evaluate('S.recs.p4.tv = "old"; renderAll()')
    check('stale recording flagged after text change', pg.locator('.my-rec .warn-line').count() == 1)
    # القراءة جملةً جملة
    pg.evaluate('go(3)'); pg.wait_for_selector('.story')
    pg.click('[data-echo-toggle]'); pg.wait_for_selector('.echo')
    n = pg.evaluate('sentences(STORY_PAGES[2].text).length')
    check('echo mode lists every sentence with its own recorder', pg.locator('.echo-row').count() == n and pg.locator('.echo-row .btn-rec').count() == n)
    for i in range(n):
        rec(pg, f'.echo-row[data-echo="{i}"] .btn-rec', 800)
    check('page counts as recorded when all sentences are', pg.evaluate('pageRecorded(STORY_PAGES[2])') and not pg.evaluate('!!S.recs.p3'))
    check('«my voice» offered for a page recorded sentence by sentence', pg.locator('.story-text .spk-chip', has_text='صَوْتِي').count() == 1)
    pg.locator('.story-text .spk-chip').first.click(); pg.wait_for_function('Player.audio !== null', timeout=5000)
    check('sentence recordings play with sentence highlight', pg.evaluate('!!document.querySelector(".story .sent.speaking")'))
    pg.evaluate('Player.stop()')
    # الفهرس
    pg.click('[data-toc]'); pg.wait_for_selector('.toc')
    check('table of contents lists every screen', pg.locator('.toc-btn').count() == pg.evaluate('SCREENS.length'))
    check('pages read are marked', pg.locator('.toc-item.done').count() >= 2)
    pg.click('[data-toc-go="timeline"]'); pg.wait_for_selector('.timeline')
    check('toc jumps to a screen', pg.evaluate('SCREENS[S.page].id') == 'timeline')
    # التركيز بعد إعادة الرسم
    pg.locator('.tl-moves button:not([disabled])').nth(1).focus(); pg.keyboard.press('Enter')
    check('keyboard focus survives re-render', pg.evaluate('!!document.activeElement.closest(".tl-moves")'))
    # الإعدادات
    pg.click('[data-settings]'); pg.click('[data-set-font="2"]'); pg.click('[data-set-speed="0"]'); close_modal(pg)
    check('font size setting applied', pg.evaluate('document.documentElement.dataset.font') == '2')
    pg.evaluate('window.__rates = []'); pg.evaluate('goId("map")'); pg.click('.activity .heading .spk'); pg.wait_for_function('!Player.active()')
    check('reading speed setting used by TTS', abs(pg.evaluate('window.__rates[0]') - 0.65) < 0.01, pg.evaluate('window.__rates'))
    pg.click('[data-settings]'); pg.click('[data-set-font="1"]'); pg.click('[data-set-speed="1"]'); close_modal(pg)
    # ترحيل رقم الصفحة القديم
    check('old numeric page migrates by screen id', pg.evaluate('savedScreen({ page: 22 })') == pg.evaluate('screenIndex("flashcards")'))
    pg.evaluate('toProfiles()'); pg.wait_for_selector('.profiles')

    # المعلم: ملاحظة وطلب إعادة
    pg.click('[data-teacher-btn]'); pg.fill('#pin1', '1357'); pg.click('[data-pin-enter]'); pg.wait_for_selector('.teacher')
    check('teacher sees children with dashboards, no delete or restore', pg.locator('.teacher .dash').count() == 2 and pg.locator('.teacher .btn-danger, [data-restore], [data-backup]').count() == 0)
    pg.click('[data-teacher-kid]'); pg.wait_for_selector('.trow')
    check('teacher lists the child recordings', pg.locator('.trow').count() == 1 + n, pg.locator('.trow').count())
    row = pg.locator('.trow[data-trow="p4"]')
    row.locator('textarea').fill('أَحْسَنْتِ، وَانْتَبِهِي لِمَخَارِجِ الْحُرُوفِ.'); row.locator('input[type=checkbox]').check(); row.locator('[data-note-save]').click()
    pg.wait_for_timeout(300)
    pg.click('[data-teacher-btn]'); pg.wait_for_selector('.profiles')
    pg.locator('.profile-btn', has_text='دلال').click(); pg.wait_for_selector('#topbar .who'); pg.evaluate('go(4)'); pg.wait_for_selector('.story')
    check('child sees the teacher note and the redo request', 'انْتَبِهِي' in pg.inner_text('.tnote') and 'تُعِيدِي' in pg.inner_text('.tnote'))
    rec(pg, '.rec-box:not(.compact) .btn-rec', 900)
    check('note hidden once the child records again', pg.locator('.tnote').count() == 0)
    pg.evaluate('toProfiles()'); pg.wait_for_selector('.profiles')

    # تسجيل جارٍ في نافذة القاموس لا يبقى يتيمًا
    enter_parent(pg, '2468'); pg.click('[data-narrate]'); pg.wait_for_selector('.banner.narr')
    pg.evaluate('go(1)'); pg.click('[data-gloss]'); pg.wait_for_selector('.modal .btn-rec')
    pg.click('.modal .btn-rec'); pg.wait_for_selector('.modal canvas.wave', timeout=8000); pg.wait_for_timeout(900)
    pg.keyboard.press('Escape'); pg.wait_for_function('Rec.state === "idle"', timeout=8000)
    check('closing a window while recording stops and saves it', pg.evaluate('Object.keys(S.parentRecs).some(k => k.startsWith("gl:"))'))
    check('narrator mode uses plural address', pg.evaluate('u("yourRec")') == 'تَسْجِيلُكُمْ')
    pg.click('.banner.narr .btn-ghost'); pg.wait_for_selector('.toc-count')
    check('narrator text list shows counts per screen', pg.locator('.toc-count').count() >= 20)
    close_modal(pg)
    pg.click('.banner.narr [data-finish]'); pg.wait_for_selector('.parent')

    # النسخ الاحتياطي سطرًا سطرًا
    with pg.expect_download() as dl: pg.click('[data-backup]')
    bk = DIST / 'backup-v2.json'; dl.value.save_as(str(bk))
    lines = bk.read_text('utf-8').strip().split('\n')
    head = json.loads(lines[0])
    check('backup v2: header line then one line per recording', head['v'] == 2 and len(lines) - 1 == sum(1 for l in lines[1:] if json.loads(l).get('data')) and len(lines) >= 6, len(lines))
    check('backup has no PIN and includes teacher notes', '"pin"' not in lines[0] and 'انْتَبِهِي' in lines[0])
    with pg.expect_download() as dl: pg.click('[data-voicepack]')
    vp = DIST / 'voices.json'; dl.value.save_as(str(vp))
    vl = vp.read_text('utf-8').strip().split('\n')
    check('voice pack holds only the family voice', json.loads(vl[0])['kind'] == 'voicepack' and all(json.loads(l)['pid'] == '_parent' for l in vl[1:]) and len(vl) >= 2)
    # تصدير بصوت الطفل فقط
    pg.locator('.parent .profile-row', has_text='دلال').locator('text=تَصْدِيرُ').click()
    with pg.expect_download() as dl: pg.click('[data-export-child]')
    ex = DIST / 'export-child.html'; dl.value.save_as(str(ex))
    payload = ex.read_text('utf-8').split('id="export-data">')[1].split('</' + 'script>')[0]
    check('child-only export carries no family voice', '"parentRecs":{}' in payload)
    # الرمز: قفل يبقى بعد إعادة التحميل
    exit_parent(pg)
    for _ in range(5):
        pg.click('[data-parent-btn]'); pg.fill('#pin1', '0000'); pg.click('[data-pin-enter]'); pg.wait_for_timeout(150); close_modal(pg)
    pg.reload(); pg.wait_for_selector('.profiles')
    pg.click('[data-parent-btn]'); pg.fill('#pin1', '2468'); pg.click('[data-pin-enter]'); pg.wait_for_timeout(300)
    check('PIN lockout survives a reload', pg.locator('.parent').count() == 0 and 'انْتَظِرُوا' in pg.inner_text('#toast'))
    pg.evaluate('S.store.putMeta("pinTries", { n: 0, until: 0, locks: 0 })')
    # الاستعادة برمز الاستعادة
    pg.click('[data-forgot]'); pg.fill('#rcode', 'AAAA-BBBB'); pg.click('[data-recovery-enter]'); pg.wait_for_timeout(200)
    check('wrong recovery code refused', pg.locator('#rcode').count() == 1 and pg.locator('.parent').count() == 0)
    pg.fill('#rcode', rcode.lower()); pg.click('[data-recovery-enter]'); pg.wait_for_selector('[data-pin-save]')
    pg.fill('#pin1', '9753'); pg.fill('#pin2', '9753'); pg.click('[data-pin-save]'); pg.wait_for_selector('.parent')
    check('recovery code resets the PIN and keeps all data', pg.locator('.parent .profile-row.kid').count() == 2)
    exit_parent(pg); enter_parent(pg, '9753')
    check('new PIN works', pg.locator('.parent').count() == 1)
    check('no errors (main)', not errs, errs)

    # الاستعادة في جهاز آخر، مع ملف خبيث وملف قديم
    ctx2 = br.new_context(bypass_csp=True, accept_downloads=True); ctx2.add_init_script(MOCK_TTS)
    p2 = ctx2.new_page(); e2 = []; p2.on('pageerror', lambda e: e2.append(str(e))); p2.on('dialog', lambda d: d.accept())
    p2.goto(URL); p2.wait_for_selector('.profiles'); enter_parent(p2, '1111')
    p2.set_input_files('[data-restore-input]', str(bk)); p2.wait_for_function('document.querySelectorAll(".parent .profile-row.kid").length === 2', timeout=15000)
    p2.wait_for_timeout(500)
    cnt = p2.evaluate('(async () => { const ps = await S.store.getProfiles(); let n = 0; for (const p of ps.concat([{id: "_parent"}])) n += Object.keys(await S.store.getRecs(p.id)).length; return n; })()')
    check('v2 backup restores every recording', cnt == len(lines) - 1, (cnt, len(lines) - 1))
    evil = DIST / 'evil.json'
    good = base64.b64encode(b'x' * 50).decode()
    evil.write_text(json.dumps({'app': 'dulluni-souq', 'kind': 'backup', 'v': 2, 'profiles': [{'id': 'pevil1', 'name': '<img src=x onerror=alert(1)>\u0000', 'gender': 'x'}, {'id': '../../x', 'name': 'bad'}],
        'progress': {'pevil1': {'quiz': {'best': 999}, 'values': {'v1': True, 'zz': True}, 'project': [{'what': 'a', 'cost': -5, 'price': 3}]}}}) + '\n' +
        json.dumps({'pid': 'pevil1', 'key': 'p1', 'mime': 'text/html', 'duration': 1000, 'data': good}) + '\n' +
        json.dumps({'pid': 'pevil1', 'key': 'p2', 'mime': 'audio/webm', 'duration': 1e9, 'data': good}) + '\n' +
        json.dumps({'pid': 'pevil1', 'key': 'p3', 'mime': 'audio/webm', 'duration': 1000, 'data': '<script>'}) + '\n' +
        json.dumps({'pid': 'pother', 'key': 'p1', 'mime': 'audio/webm', 'duration': 1000, 'data': good}) + '\n' +
        json.dumps({'pid': 'pevil1', 'key': 'p5', 'mime': 'audio/webm;codecs=opus', 'duration': 1000, 'data': good}) + '\n', 'utf-8')
    p2.set_input_files('[data-restore-input]', str(evil)); p2.wait_for_timeout(1200)
    st = p2.evaluate('(async () => { const p = (await S.store.getProfiles()).find(x => x.id === "pevil1"); const g = await S.store.getProgress("pevil1"); const r = await S.store.getRecs("pevil1"); return { name: p && p.name, gender: p && p.gender, bad: !!(await S.store.getProfiles()).find(x => x.id === "../../x"), best: g.quiz.best, vals: Object.keys(g.values), proj: g.project.length, recs: Object.keys(r).sort(), other: Object.keys(await S.store.getRecs("pother")).length }; })()')
    check('restore sanitizes: invalid ids, progress values, mime, duration and data rejected', st == {'name': '<img src=x onerror=alert(1)>'[:24], 'gender': 'm', 'bad': False, 'best': 0, 'vals': ['v1'], 'proj': 0, 'recs': ['p5'], 'other': 0}, st)
    check('restored hostile name renders as text', p2.evaluate('!document.querySelector("#app img")'))
    legacy = DIST / 'legacy.json'
    legacy.write_text(json.dumps({'app': 'dulluni-souq', 'kind': 'backup', 'v': 1, 'profiles': [{'id': 'plegacy1', 'name': 'قديم', 'gender': 'f', 'created': 1}], 'progress': {}, 'recs': {'plegacy1': {'p1': {'mime': 'audio/webm', 'duration': 900, 'data': good}}}}), 'utf-8')
    p2.set_input_files('[data-restore-input]', str(legacy)); p2.wait_for_timeout(800)
    check('legacy v1 backup still restores', p2.evaluate('(async () => Object.keys(await S.store.getRecs("plegacy1")).length)()') == 1)
    p2.set_input_files('[data-restore-input]', str(vp)); p2.wait_for_timeout(800)
    check('no errors (device 2)', not e2, e2)
    ctx2.close()

    # شاشة صغيرة ٣٦٠
    ctx3 = br.new_context(bypass_csp=True, viewport={'width': 360, 'height': 640}, is_mobile=True, has_touch=True)
    p3 = ctx3.new_page(); p3.goto(URL); p3.wait_for_selector('.profiles')
    check('360px: first screen has no horizontal overflow', p3.evaluate('document.scrollingElement.scrollWidth') <= 360, p3.evaluate('document.scrollingElement.scrollWidth'))
    box = p3.evaluate('(() => { const f = document.querySelector(".add-form").getBoundingClientRect(), c = document.querySelector(".profiles").getBoundingClientRect(); return f.right <= c.right + 1 && f.left >= c.left - 1; })()')
    check('360px: add form stays inside its card', box)
    p3.screenshot(path=str(SHOTS / 's360-profiles.png'), full_page=True)
    p3.fill('#new-name', 'فرح'); p3.click('.add-form button[type=submit]'); p3.wait_for_selector('.cover')
    vis = p3.evaluate('(() => { const b = document.querySelector("[data-start]").getBoundingClientRect(), p = document.getElementById("pager").getBoundingClientRect(); return b.bottom <= p.top; })()')
    check('360px: start button visible above the pager', vis)
    p3.screenshot(path=str(SHOTS / 's360-cover.png'))
    sizes = p3.evaluate('[...document.querySelectorAll("#app button, #pager button")].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); })')
    check('touch targets ≥ 44px on the cover', min(sizes) >= 43.5, min(sizes))
    p3.evaluate('go(1)'); p3.wait_for_timeout(100)
    sizes = p3.evaluate('[...document.querySelectorAll("#view .spk, #view .dot")].map(b => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); })')
    check('speaker buttons and scene dots ≥ 44px', min(sizes) >= 43.5, min(sizes))
    order = p3.evaluate('(() => { const t = document.querySelector(".story-text").getBoundingClientRect().top, a = document.querySelector(".story .scene").getBoundingClientRect().top; return t < a; })()')
    check('story text comes before the scene', order)
    p3.screenshot(path=str(SHOTS / 's360-p1.png'), full_page=True)
    ctx3.close()
    # عرض أفقي على شاشة عريضة: عمودان
    ctx4 = br.new_context(bypass_csp=True, viewport={'width': 1280, 'height': 800})
    p4 = ctx4.new_page(); p4.goto(URL); p4.wait_for_selector('.profiles')
    p4.fill('#new-name', 'ع'); p4.click('.add-form button[type=submit]'); p4.wait_for_selector('.cover'); p4.evaluate('go(1)'); p4.wait_for_timeout(150)
    two = p4.evaluate('(() => { const a = document.querySelector(".story-main").getBoundingClientRect(), b = document.querySelector(".story-side").getBoundingClientRect(); return Math.abs(a.top - b.top) < 40 && a.right > b.right; })()')
    check('landscape: text and scene side by side', two)
    p4.screenshot(path=str(SHOTS / 'l1280-p1.png'))
    ctx4.close()
    # سياسة أمان المحتوى مفعّلة: الكتاب يعمل والتسجيل يعمل دون مخالفات
    ctx5 = br.new_context(viewport={'width': 900, 'height': 800}); ctx5.grant_permissions(['microphone'])
    p5 = ctx5.new_page(); e5 = []
    p5.on('console', lambda m: e5.append(m.text) if m.type == 'error' or 'Content Security Policy' in m.text else None); p5.on('pageerror', lambda e: e5.append(str(e)))
    p5.goto(URL); p5.wait_for_selector('.profiles')
    p5.fill('#new-name', 'س'); p5.click('.add-form button[type=submit]'); p5.wait_for_selector('.cover')
    p5.click('[data-next]'); p5.wait_for_selector('.story'); p5.click('.rec-box:not(.compact) .btn-rec'); p5.wait_for_selector('canvas.wave', timeout=8000); p5.wait_for_timeout(900)
    p5.click('.btn-stop'); p5.wait_for_selector('.my-rec audio', timeout=8000)
    ok = p5.evaluate('new Promise(r => { const a = document.querySelector(".my-rec audio"); a.onloadedmetadata = () => r(true); a.onerror = () => r(false); a.load(); })')
    check('with CSP active: book, recording and playback work', ok and not e5, e5)
    has_csp = p5.evaluate('!!document.querySelector("meta[http-equiv=Content-Security-Policy]")')
    check('CSP meta present', has_csp)
    ctx5.close()
    br.close()
print('%d/%d passed' % (sum(res), len(res))); sys.exit(0 if all(res) else 1)
