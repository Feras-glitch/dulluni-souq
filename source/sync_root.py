"""ينسخ ملفات تطبيق الويب المبنية (dist/pwa) إلى جذر المستودع الذي تنشره GitHub Pages.
مع --check: لا ينسخ، بل يفشل إن اختلف الجذر عن البناء (يُستعمل في CI)."""
import sys, pathlib, filecmp, shutil
R = pathlib.Path(__file__).resolve().parent
PWA, ROOT = R / 'dist' / 'pwa', R.parent
files = [p.relative_to(PWA) for p in PWA.rglob('*') if p.is_file()]
check = '--check' in sys.argv
bad = [str(f) for f in files if not (ROOT / f).exists() or not filecmp.cmp(PWA / f, ROOT / f, shallow=False)]
if check:
    if bad: print('الجذر لا يطابق البناء:', ', '.join(bad)); sys.exit(1)
    print('الجذر يطابق البناء'); sys.exit(0)
for f in files:
    (ROOT / f).parent.mkdir(parents=True, exist_ok=True); shutil.copy(PWA / f, ROOT / f)
print('نُسخ', len(files), 'ملفًّا إلى الجذر')
