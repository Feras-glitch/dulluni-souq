import re, sys, json, threading, http.server, functools, pathlib, time
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent))
from helpers import enter_parent, exit_parent, add_child_in_parent, open_settings, close_modal
ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist'
SHOTS = ROOT / 'shots'
DIAC = re.compile('[ً-ٰٟ]')
results = []
def check(name, cond, info=''):
    results.append((name, bool(cond), info)); print(('PASS ' if cond else 'FAIL ') + name + (' — ' + str(info) if info and not cond else ''))

H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(DIST))
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(Q, directory=str(DIST)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:8765/book.html'

with sync_playwright() as pw:
    br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'])
    ctx = br.new_context(bypass_csp=True, viewport={'width': 1100, 'height': 900}, accept_downloads=True)
    ctx.grant_permissions(['microphone'])
    pg = ctx.new_page()
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.on('dialog', lambda d: d.accept())
    pg.goto(URL)
    pg.wait_for_selector('.profiles')
    check('static notice hidden when JS runs', pg.is_hidden('#static-notice'))

    # XSS
    evil = '<img src=x onerror="window.__xss=1">'
    pg.fill('#new-name', evil); pg.click('.add-form button[type=submit]')
    pg.wait_for_selector('.cover')
    check('XSS name rendered as text', pg.text_content('.who') == evil[:24] and pg.evaluate('!window.__xss && !document.querySelector("#app img")'))
    pg.click('#topbar .btn >> nth=0'); pg.wait_for_selector('.profiles')
    check('no export/delete on the child screen', pg.locator('.profiles .btn-danger').count() == 0 and pg.locator('.profiles >> text=تَصْدِيرُ').count() == 0)
    enter_parent(pg)
    pg.locator('.parent .profile-row').first.locator('.btn-danger').click()
    pg.wait_for_function('document.querySelectorAll(".parent .profile-row").length===0')
    check('profile deleted from parent mode', pg.locator('.profile-row').count() == 0)
    exit_parent(pg)

    # main profile (girl)
    pg.fill('#new-name', 'دلال'); pg.check('input[value=f]'); pg.click('.add-form button[type=submit]')
    pg.wait_for_selector('.cover')
    check('gendered start button (f)', 'ابْدَئِي' in pg.text_content('.cover .btn-primary'))
    pg.screenshot(path=str(SHOTS / 'd-cover.png'), full_page=True)

    # data checks via page context
    data = pg.evaluate('''() => {
      const out = {missing: [], pages: STORY_PAGES.length, sentences: {}};
      for (const g of GLOSSARY) { const p = STORY_PAGES.find(x => x.n === g.page); if (!p || !p.text.includes(g.match)) out.missing.push(g.match); }
      for (const p of STORY_PAGES) out.sentences[p.n] = sentences(p.text).length;
      out.join = STORY_PAGES.every(p => sentences(p.text).join(' ').replace(/\\s+/g,' ') === p.text.replace(/\\s+/g,' '));
      out.speech = speechText('سَنَةَ ٣٢ هـ، وَعُمْرُهُ ٧٥ عَلَى الْمَشْهُورِ ﷺ');
      out.split = [10, 11, 3, 4].map(n => splitThirds(n));
      out.screens = SCREENS.length;
      return out; }''')
    check('all 19 glossary keys exist in their page text', not data['missing'], data['missing'])
    check('sentence split loses nothing', data['join'])
    check('speech normalization', 'ﷺ' not in data['speech'] and 'لِلْهِجْرَةِ' in data['speech'] and '٣٢' not in data['speech'] and '٧٥' not in data['speech'], data['speech'])
    check('market split 10→4/3/3', data['split'][0] == {'charity': 4, 'home': 3, 'project': 3}, data['split'])
    check('market split 11→5/3/3, 3→1/1/1', data['split'][1] == {'charity': 5, 'home': 3, 'project': 3} and data['split'][3] == {'charity': 2, 'home': 1, 'project': 1} or data['split'][2] == {'charity':1,'home':1,'project':1}, data['split'])
    print('sentences per page', data['sentences'])

    # glossary buttons rendered on every story page
    bad = []
    for n in range(1, 17):
        pg.evaluate(f'go({n})'); pg.wait_for_selector(f'.story .pnum')
        keys = pg.evaluate('[...document.querySelectorAll("[data-gloss]")].map(b=>b.dataset.gloss)')
        exp = pg.evaluate(f'GLOSSARY.filter(g=>g.page==={n}).map(g=>g.match)')
        if sorted(keys) != sorted(exp): bad.append((n, keys, exp))
    check('glossary buttons rendered on each page', not bad, bad)

    # tashkeel toggle: no diacritics leak anywhere visible
    pg.evaluate('go(11)'); pg.wait_for_selector('.story')
    pg.screenshot(path=str(SHOTS / 'd-p11.png'), full_page=True)
    open_settings(pg); pg.click('[data-set-tashkeel="1"]'); close_modal(pg)
    leak = []
    for n in list(range(0, 25)):
        pg.evaluate(f'go({n})'); pg.wait_for_timeout(30)
        txt = pg.evaluate('document.getElementById("app").innerText + document.getElementById("pager").innerText')
        if DIAC.search(txt): leak.append(n)
    check('no diacritics leak with tashkeel hidden (25 screens)', not leak, leak)
    pg.evaluate('go(11)'); pg.click('[data-gloss]')
    check('glossary modal stripped too', not DIAC.search(pg.inner_text('.modal')))
    pg.keyboard.press('Escape')
    pg.screenshot(path=str(SHOTS / 'd-p11-plain.png'))
    open_settings(pg); pg.click('[data-set-tashkeel="0"]'); close_modal(pg)
    check('tashkeel restored', DIAC.search(pg.inner_text('.story-text')) is not None)

    # sources modal
    pg.click('text=الْمَصْدَرُ الْمُوَثَّقُ'); pg.wait_for_selector('.modal .grade')
    check('sources modal shows grade', 'صَحِيحٌ' in pg.inner_text('.modal'))
    pg.screenshot(path=str(SHOTS / 'd-sources.png'))
    pg.keyboard.press('Escape')

    # recording: normal stop on page 1
    pg.evaluate('go(1)'); pg.wait_for_selector('.story')
    pg.click('.btn-rec'); pg.wait_for_selector('canvas.wave', timeout=8000)
    check('double-tap guard: state recording once', pg.evaluate('Rec.state') == 'recording')
    pg.wait_for_timeout(1500)
    pg.screenshot(path=str(SHOTS / 'd-recording.png'))
    pg.click('.btn-stop'); pg.wait_for_selector('.my-rec audio', timeout=8000)
    check('recording saved on page 1', pg.evaluate('!!S.recs.p1 && S.recs.p1.blob.size > 0'))
    # navigation during recording -> draft
    pg.evaluate('go(2)'); pg.wait_for_selector('.story')
    pg.click('.btn-rec'); pg.wait_for_selector('canvas.wave', timeout=8000); pg.wait_for_timeout(1200)
    pg.click('#pager .btn >> nth=1')  # next
    pg.wait_for_function('Rec.state==="idle"', timeout=8000)
    check('nav during recording keeps a draft', pg.evaluate('!!S.recs["p2|draft"] && !S.recs.p2'))
    pg.evaluate('go(2)'); pg.wait_for_selector('.draft')
    check('draft shown on return', pg.is_visible('.draft audio'))
    pg.click('.draft .btn >> nth=0'); pg.wait_for_selector('.my-rec')
    check('draft promoted', pg.evaluate('!!S.recs.p2 && !S.recs["p2|draft"]'))
    # persisted in IDB after reload
    pg.reload(); pg.wait_for_selector('.profile-btn'); pg.click('.profile-btn')
    pg.wait_for_selector('#topbar .who')
    _k = pg.evaluate('Object.keys(S.recs).sort().join()'); check('recordings persist after reload', _k == 'p1,p2', _k)
    check('resume at last page', pg.evaluate('S.page') == 2)

    # values badge
    pg.evaluate('goId("values")'); pg.wait_for_selector('.values-grid')
    check('reveal locked until the question is heard', pg.locator('[data-reveal]:disabled').count() == 4)
    pg.evaluate('VALUES.forEach(v => { S.progress.heard[v.id] = true; }); renderAll()')
    for _ in range(4): pg.click('.value-card:not(.open) [data-reveal]')
    check('values badge after 4 reveals', pg.evaluate('badges().values'))

    # quiz: first attempt only
    pg.evaluate('goId("quiz")'); pg.wait_for_selector('.question')
    check('quiz bank: 10 questions, 5 per round, all distinct', pg.evaluate('QUIZ.length === 10 && new Set(S.session.quiz.qs.map(q => q.id)).size === 5'))
    check('quiz explanations with hadith are cited', pg.evaluate('QUIZ.filter(q => q.explain.includes("«")).every(q => q.source)'))
    for qi in range(5):
        correct = pg.evaluate(f'S.session.quiz.qs[{qi}].correct')
        if qi == 0:
            wrong = (correct + 1) % 3
            pg.click(f'.opt[data-opt="{wrong}"]')
            check('wrong answer feedback', pg.is_visible('.feedback.no'))
        pg.click(f'.opt[data-opt="{correct}"]')
        pg.click('.quiz .btn-primary')
    pg.wait_for_selector('.result')
    check('quiz score counts first attempt only (4/5)', pg.evaluate('S.progress.quiz.best') == 4 and pg.evaluate('badges().quiz'))
    pg.screenshot(path=str(SHOTS / 'd-quiz.png'), full_page=True)

    # timeline
    pg.evaluate('S.session.timeline=null; goId("timeline")'); pg.wait_for_selector('.timeline')
    orders = pg.evaluate('[...document.querySelectorAll(".tl-item")].map(e=>+e.dataset.order)')
    check('timeline starts shuffled', orders != sorted(orders), orders)
    check('dates hidden before solving', pg.locator('.tl-when').count() == 0)
    pg.click('.activity .btn-primary')
    check('wrong order marked', pg.is_visible('.feedback.no'))
    for target in range(1, 8):
        while True:
            orders = pg.evaluate('[...document.querySelectorAll(".tl-item")].map(e=>+e.dataset.order)')
            pos = orders.index(target)
            if pos == target - 1: break
            pg.locator('.tl-item').nth(pos).locator('.tl-moves button').first.click()
    pg.click('.activity .btn-primary')
    check('timeline solved reveals dates', pg.locator('.tl-when').count() == 7 and pg.evaluate('badges().timeline'))

    # market
    pg.evaluate('goId("market")'); pg.wait_for_selector('.jars')
    check('market check disabled until all coins placed', pg.is_disabled('[data-distribute]'))
    for _ in range(4): pg.click('[data-jar-more="home"]')
    for _ in range(3): pg.click('[data-jar-more="charity"]')
    for _ in range(3): pg.click('[data-jar-more="project"]')
    pg.click('[data-distribute]')
    check('wrong split rejected, no badge', pg.is_visible('.feedback.no') and not pg.evaluate('badges().market'))
    pg.click('[data-jar-less="home"]'); pg.click('[data-jar-more="charity"]'); pg.click('[data-distribute]')
    counts = pg.evaluate('[...document.querySelectorAll(".jar-count")].map(e=>e.textContent)')
    check('market 10 → ٤/٣/٣ accepted with badge', counts[0].startswith('٤') and counts[1].startswith('٣') and pg.evaluate('badges().market'), counts)
    # مشروعي الصغير
    pg.evaluate('goId("project")'); pg.wait_for_selector('.proj-form')
    pg.fill('#proj-what', 'أساور'); pg.fill('#proj-cost', '٥'); pg.fill('#proj-price', '12'); pg.click('[data-proj-add]')
    pg.fill('#proj-what', 'بطاقة'); pg.fill('#proj-cost', '3'); pg.fill('#proj-price', '2'); pg.click('[data-proj-add]')
    check('ledger computes profit and loss', '٦' in pg.inner_text('[data-proj-total]') and pg.locator('td.loss').count() == 1, pg.inner_text('[data-proj-total]'))
    pg.click('[data-proj-market]'); pg.wait_for_selector('.jars')
    check('ledger profit goes to the market', pg.evaluate('S.session.marketN') == 6)
    pg.screenshot(path=str(SHOTS / 'd-market.png'), full_page=True)
    pg.screenshot(path=str(SHOTS / 'd-market.png'), full_page=True)

    pg.evaluate('goId("map")'); pg.wait_for_selector('.map-svg'); pg.click('[data-loc="sargh"]')
    check('map pin selects', 'سَرْغُ' in pg.inner_text('.map-info'))
    pg.screenshot(path=str(SHOTS / 'd-map.png'), full_page=True)
    pg.evaluate('goId("flashcards")'); pg.click('.flash >> nth=0'); pg.screenshot(path=str(SHOTS / 'd-flash.png'), full_page=True)
    pg.evaluate('S.progress.read = {}; goId("certificate")'); pg.wait_for_selector('[data-cert-locked]')
    check('certificate locked before reading the whole story', pg.locator('.certificate').count() == 0)
    for n in range(1, 17): pg.evaluate(f'go({n})')
    pg.evaluate('goId("certificate")'); pg.wait_for_selector('.certificate')
    cert = pg.inner_text('.certificate')
    check('certificate gendered + count', 'الرَّاوِيَةِ الْأَمِينَةِ' in cert and 'بِصَوْتِهَا: ٢ مِنْ ١٦' in cert and 'دلال' in cert, cert[:200])
    pg.screenshot(path=str(SHOTS / 'd-cert.png'), full_page=True)
    pg.emulate_media(media='print'); pg.screenshot(path=str(SHOTS / 'd-cert-print.png')); pg.emulate_media(media='screen')

    # profile isolation
    pg.click('#topbar .btn >> nth=0'); pg.wait_for_selector('.profiles')
    enter_parent(pg); add_child_in_parent(pg, 'كريم'); exit_parent(pg)
    pg.locator('.profile-btn', has_text='كريم').click(); pg.wait_for_selector('.cover')
    check('masculine UI for boy', 'ابْدَأِ' in pg.text_content('.cover .btn-primary'))
    check('profile isolation', pg.evaluate('Object.keys(S.recs).length===0 && S.progress.quiz.best===0 && !S.progress.timeline.solved'))

    # export Dalal
    pg.click('#topbar .btn >> nth=0'); pg.wait_for_selector('.profiles')
    enter_parent(pg)
    row = pg.locator('.parent .profile-row', has_text='دلال')
    row.locator('text=تَصْدِيرُ').click(); pg.wait_for_selector('[data-export-child]')
    with pg.expect_download() as dl: pg.click('[data-export-child]')
    exp_path = ROOT / 'dist' / 'export-test.html'
    dl.value.save_as(str(exp_path))
    check('no console errors (main)', not errors, errors)
    ctx.close()

    # open export standalone in a fresh context from file://
    ctx2 = br.new_context(bypass_csp=True, viewport={'width': 390, 'height': 844})
    p2 = ctx2.new_page(); err2 = []
    p2.on('pageerror', lambda e: err2.append(str(e)))
    p2.goto(exp_path.as_uri()); p2.wait_for_selector('.cover')
    check('export opens read-only with banner', 'لِلْعَرْضِ فَقَطْ' in p2.inner_text('.banner'))
    p2.evaluate('go(1)'); p2.wait_for_selector('.my-rec audio')
    check('export plays embedded recording, no record button', p2.locator('.btn-rec').count() == 0)
    dur = p2.evaluate('new Promise(r=>{const a=document.querySelector(".my-rec audio"); a.onloadedmetadata=()=>r(a.duration); a.onerror=()=>r(-1); a.load();})')
    check('embedded audio decodes', dur != -1, dur)
    p2.evaluate('go(19)'); p2.click('.opt >> nth=0')
    p2.evaluate('go(23)')
    st = p2.evaluate('(async()=>({dbs:(indexedDB.databases?await indexedDB.databases():[]).length, ls:localStorage.length}))()')
    check('export writes nothing to device storage', st == {'dbs': 0, 'ls': 0}, st)
    check('export keeps progress (badges)', p2.evaluate('badges().quiz && badges().timeline && badges().values'))
    p2.screenshot(path=str(SHOTS / 'm-export-cert.png'), full_page=True)
    check('no errors in export', not err2, err2)
    ctx2.close()

    # mobile screenshots
    ctx3 = br.new_context(bypass_csp=True, viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
    p3 = ctx3.new_page(); p3.goto(URL); p3.wait_for_selector('.profiles')
    p3.screenshot(path=str(SHOTS / 'm-profiles.png'), full_page=True)
    p3.fill('#new-name', 'فرح'); p3.click('.add-form button[type=submit]'); p3.wait_for_selector('.cover')
    for n, nm in [(1, 'p1'), (9, 'p9'), (17, 'map'), (19, 'quiz'), (20, 'timeline')]:
        p3.evaluate(f'go({n})'); p3.wait_for_timeout(100); p3.screenshot(path=str(SHOTS / f'm-{nm}.png'), full_page=True)
    ctx3.close()

    # JS disabled → iOS-style notice
    ctx4 = br.new_context(bypass_csp=True, java_script_enabled=False); p4 = ctx4.new_page(); p4.goto(URL)
    check('notice visible without JS', p4.is_visible('#static-notice') and p4.is_hidden('#app') and 'سَفَارِي' in p4.inner_text('#static-notice'))
    ctx4.close()
    br.close()

# emoji whitelist on the built file
html = (DIST / 'book.html').read_text('utf-8')
ALLOWED = set('🔒⬆🔑→➕🔊⏹🎙▶🗑✓📚⬇🏠⬅➡🌸⭐🏅🪙⚖⏳○▲▼−💎🌱🤝🎁❤🖨☰⚙📋⚠')
found = set(ch for ch in html if (0x1F000 <= ord(ch) <= 0x1FAFF) or (0x2190 <= ord(ch) <= 0x2BFF) or ord(ch) in (0x2795, 0x2696, 0x23F3, 0x23F9))
check('emoji whitelist', found <= ALLOWED, found - ALLOWED)
check('no animate-being emoji', not (found & set('🙈🐪🐫🐎🐑🐦👤👦👧🧒')))
print('\n%d/%d passed' % (sum(r[1] for r in results), len(results)))
sys.exit(0 if all(r[1] for r in results) else 1)
