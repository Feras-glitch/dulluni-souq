"""الصوت ووضع الوالدين: أزرار الاستماع، واختيار الطفل بين صوته وصوت أهله، والرمز السري،
وتسجيل الأهل، والنسخ الاحتياطي والاستعادة، وترقية قاعدة البيانات من الإصدار الأول."""
import functools, http.server, threading, pathlib, sys, shutil, re
from playwright.sync_api import sync_playwright
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from helpers import enter_parent, exit_parent, add_child_in_parent
ROOT = pathlib.Path(__file__).resolve().parent.parent; DIST = ROOT / 'dist'
OLD = pathlib.Path('/home/claude/dulluni-souq/index.html')   # الإصدار المنشور سابقًا (قاعدة بيانات v1)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
if OLD.exists(): shutil.copy(OLD, DIST / 'old-v1.html')
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 8767), functools.partial(Q, directory=str(DIST)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:8767/'
res = []
def check(n, c, info=''): res.append(c); print(('PASS ' if c else 'FAIL ') + n + ('' if c else ' — ' + str(info)), flush=True)
MOCK_TTS = "window.__said=[]; window.speechSynthesis.speak = u => { window.__said.push(u.text); setTimeout(() => u.onend && u.onend(), 20); };"
def rec(pg, sel_btn, ms=1200):
    pg.click(sel_btn); pg.wait_for_selector('canvas.wave', timeout=8000); pg.wait_for_timeout(ms)
    pg.click('.btn-stop'); pg.wait_for_function('Rec.state === "idle"', timeout=8000)
with sync_playwright() as pw:
    br = pw.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream', '--autoplay-policy=no-user-gesture-required'])
    ctx = br.new_context(viewport={'width': 1000, 'height': 900}, accept_downloads=True); ctx.grant_permissions(['microphone'])
    ctx.add_init_script(MOCK_TTS)
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
    # ترقية من v1: طفل أُنشئ في الإصدار القديم يظهر في الجديد
    if OLD.exists():
        pg.goto(BASE + 'old-v1.html'); pg.wait_for_selector('.profiles')
        pg.fill('#new-name', 'قديم'); pg.click('.add-form button[type=submit]'); pg.wait_for_selector('.cover')
    pg.goto(BASE + 'book.html'); pg.wait_for_selector('.profiles')
    check('DB upgrade v1→v2 keeps existing children', pg.locator('.profile-btn', has_text='قديم').count() == 1)
    pg.locator('.profile-btn').first.click(); pg.wait_for_selector('.cover')
    pg.wait_for_function('window.__said.length >= 1', timeout=8000)
    check('cover is read automatically on opening', 'دُلُّونِي' in pg.evaluate('window.__said[0]'))
    pg.wait_for_function('!Player.active()')
    # زر استماع عند كل نص في كل شاشة
    counts = {}
    for n in range(24):
        pg.evaluate(f'go({n})'); pg.wait_for_timeout(40)
        counts[n] = pg.locator('#view .spk').count()
    check('every screen has speaker buttons', all(c >= 1 for c in counts.values()) and counts[1] == 3, counts)
    pg.evaluate('go(1)'); pg.wait_for_selector('.story')
    check('story: title, caption and body each have a speaker', pg.locator('.story .heading .spk').count() == 1 and pg.locator('.story .scene-cap .spk').count() == 1 and pg.locator('.story .story-text .spk').count() == 1)
    pg.evaluate('window.__said = []'); pg.click('.story-text .spk-icon')
    pg.wait_for_function('!Player.active()', timeout=8000)
    check('TTS reads the body sentence by sentence', pg.evaluate('window.__said.length') == pg.evaluate('sentences(STORY_PAGES[0].text).length'))
    # الطفل يسجّل الصفحة: يحلّ صوته محلّ القراءة الآلية
    rec(pg, '.rec-box:not(.compact) .btn-rec')
    check('after child recording: body shows «my voice», no TTS button', pg.locator('.story-text .spk-chip', has_text='صَوْتِي').count() == 1 and pg.locator('.story-text .spk-icon').count() == 0)
    pg.evaluate('window.__said = []'); pg.locator('.story-text .spk-chip').first.click()
    pg.wait_for_function('Player.audio !== null', timeout=5000)
    check('«my voice» plays the recording, not TTS', pg.evaluate('window.__said.length') == 0 and pg.evaluate('document.querySelector(".story-text").classList.contains("speaking")'))
    pg.evaluate('Player.stop()')
    # وضع الوالدين: الرمز
    pg.evaluate('toProfiles()'); pg.wait_for_selector('[data-parent-btn]')
    enter_parent(pg, '2468'); exit_parent(pg)
    pg.click('[data-parent-btn]'); pg.fill('#pin1', '1111'); pg.click('[data-pin-enter]')
    check('wrong PIN is refused', pg.locator('.parent').count() == 0 and pg.locator('#pin1').count() == 1)
    pg.keyboard.press('Escape')
    enter_parent(pg, '2468')
    check('PIN stored only as salted hash', '2468' not in str(pg.evaluate('S.store.getMeta("pin")')))
    # تسجيل الأهل
    pg.click('[data-narrate]'); pg.wait_for_selector('.banner.narr')
    pg.evaluate('go(1)'); pg.wait_for_selector('.story')
    check('narrator mode: record box under every text, no child box', pg.locator('.rec-box.compact').count() == 3 and pg.locator('.rec-box:not(.compact)').count() == 0)
    rec(pg, '.story .heading + .rec-box .btn-rec')
    rec(pg, '.story-text + .rec-box .btn-rec')
    check('narrator progress counter updates', '٢' in pg.inner_text('[data-narr-count]'))
    pg.click('.banner.narr .btn'); pg.wait_for_selector('.parent')
    exit_parent(pg)
    pg.locator('.profile-btn').first.click(); pg.wait_for_selector('#topbar .who'); pg.evaluate('go(1)'); pg.wait_for_selector('.story')
    check('title now offers «family voice» instead of TTS', pg.locator('.story .heading .spk-family').count() == 1 and pg.locator('.story .heading .spk-icon').count() == 0)
    check('body offers both voices for the child to choose', pg.locator('.story-text .spk-chip').count() == 2)
    check('untouched texts keep TTS', pg.locator('.story .scene-cap .spk-icon').count() == 1)
    # نسخة احتياطية ثم استعادة في جهاز آخر (سياق جديد)
    pg.evaluate('toProfiles()'); pg.wait_for_selector('[data-parent-btn]'); enter_parent(pg, '2468')
    with pg.expect_download() as dl: pg.click('[data-backup]')
    bk = DIST / 'backup-test.json'; dl.value.save_as(str(bk))
    txt = bk.read_text('utf-8')
    check('backup contains children, parent voice, and no PIN', '"_parent"' in txt and 'قديم' in txt and '"pin"' not in txt)
    check('no errors (device 1)', not errs, errs)
    ctx2 = br.new_context(accept_downloads=True); ctx2.add_init_script(MOCK_TTS)
    p2 = ctx2.new_page(); e2 = []; p2.on('pageerror', lambda e: e2.append(str(e))); p2.on('dialog', lambda d: d.accept())
    p2.goto(BASE + 'book.html'); p2.wait_for_selector('.profiles')
    enter_parent(p2, '1357')
    p2.set_input_files('[data-restore-input]', str(bk))
    p2.wait_for_function('document.querySelectorAll(".parent .profile-row").length >= 1', timeout=10000)
    exit_parent(p2)
    p2.locator('.profile-btn', has_text='قديم').click(); p2.wait_for_selector('#topbar .who'); p2.evaluate('go(1)'); p2.wait_for_selector('.story')
    check('restore brings back the child recording and the family voice', p2.locator('.story-text .spk-chip').count() == 2 and p2.locator('.story .heading .spk-family').count() == 1)
    check('no errors (device 2)', not e2, e2)
    br.close()
print('%d/%d passed' % (sum(res), len(res))); sys.exit(0 if all(res) else 1)
