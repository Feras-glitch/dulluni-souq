import base64, pathlib, json, hashlib, shutil
R = pathlib.Path(__file__).parent
src = R / 'src'
b64 = lambda p: base64.b64encode((R / p).read_bytes()).decode()
NOTICE = 'تَنْبِيهٌ: عَلَى أَجْهِزَةِ الْآيْفُونِ افْتَحُوا الْمَلَفَّ فِي مُتَصَفِّحِ سَفَارِي، لَا فِي الْمُعَايَنَةِ.'
TITLE = 'دُلُّونِي عَلَى السُّوقِ'
css = (src / 'style.css').read_text('utf-8').replace('{{AMIRI400}}', b64('amiri-400.woff2')).replace('{{AMIRI700}}', b64('amiri-700.woff2'))
js = '\n'.join((src / f).read_text('utf-8') for f in ('data.js', 'art.js', 'photos.js', 'app.js'))
assert '</script' not in js.lower() and '<!--' not in js
tpl = (src / 'template.html').read_text('utf-8').replace('{{CSS}}', css).replace('{{NOTICE}}', NOTICE)

PWA_HEAD = ('<!--pwa-->\n<link rel="manifest" href="manifest.json">\n'
            '<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">\n'
            '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
            '<meta name="mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-capable" content="yes">\n'
            '<meta name="apple-mobile-web-app-title" content="دلوني على السوق">\n'
            '<meta name="apple-mobile-web-app-status-bar-style" content="default">\n<!--/pwa-->\n')
def page(head):
    # استبدال JS أخيرًا حتى لا تُستبدل عناصر نائبة داخل الكود
    return tpl.replace('{{PWA_HEAD}}', head).replace('{{JS}}', js)

dist = R / 'dist'; dist.mkdir(exist_ok=True)
(dist / 'book.html').write_text(page('<link rel="icon" href="data:,">\n'), 'utf-8')

pwa = dist / 'pwa'
if pwa.exists(): shutil.rmtree(pwa)
(pwa / 'icons').mkdir(parents=True)
for f in ('icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'):
    shutil.copy(src / 'icons' / f, pwa / 'icons' / f)
(pwa / 'index.html').write_text(page(PWA_HEAD), 'utf-8')
manifest = {
  "id": "./", "name": "دُلُّونِي عَلَى السُّوقِ — حِكَايَةُ التَّاجِرِ الْأَمِينِ", "short_name": "دلوني على السوق",
  "description": "كتاب تفاعلي للأطفال عن سيرة عبد الرحمن بن عوف رضي الله عنه",
  "lang": "ar", "dir": "rtl", "start_url": "./", "scope": "./", "display": "standalone",
  "orientation": "any", "background_color": "#FBF7EE", "theme_color": "#FBF7EE", "categories": ["education", "books", "kids"],
  "icons": [
    {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
    {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
(pwa / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), 'utf-8')
assets = ['./', 'index.html', 'manifest.json'] + ['icons/' + p.name for p in sorted((pwa / 'icons').iterdir())]
h = hashlib.sha256()
for p in sorted(pwa.rglob('*')):
    if p.is_file(): h.update(p.read_bytes())
sw = (src / 'sw.js').read_text('utf-8').replace('__VERSION__', h.hexdigest()[:12]).replace('__ASSETS__', json.dumps(assets))
(pwa / 'sw.js').write_text(sw, 'utf-8')
(pwa / '.nojekyll').write_text('')
print('book.html', round((dist / 'book.html').stat().st_size / 1024), 'KB; pwa version', h.hexdigest()[:12])
