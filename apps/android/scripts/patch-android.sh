#!/usr/bin/env bash
# تعديلات ملف الأذونات:
#  - إذن الميكروفون، وإتاحة محرك النطق في أندرويد ١١ فما بعد
#  - حذف إذن الإنترنت: الكتاب كله داخل التطبيق ولا يتصل بشيء
#  - إيقاف نسخ أندرويد التلقائي إلى Google Drive، فلا تخرج أصوات الأطفال من الجهاز إلا بنسخة يصنعها الأهل
set -euo pipefail
M=android/app/src/main/AndroidManifest.xml
python3 - "$M" <<'PY'
import re, sys, pathlib
p = pathlib.Path(sys.argv[1]); s = p.read_text()
s = re.sub(r'\s*<uses-permission android:name="android.permission.INTERNET"\s*/>', '', s)
if 'RECORD_AUDIO' not in s:
    s = s.replace('</manifest>', '''    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <queries>
        <intent>
            <action android:name="android.intent.action.TTS_SERVICE" />
        </intent>
    </queries>
</manifest>''')
s = re.sub(r'android:allowBackup="true"', 'android:allowBackup="false"', s)
if 'android:allowBackup' not in s:
    s = s.replace('<application', '<application\n        android:allowBackup="false"', 1)
p.write_text(s)
PY
grep -q RECORD_AUDIO "$M" && grep -q 'allowBackup="false"' "$M" && ! grep -q 'permission.INTERNET' "$M" || { echo "patch failed"; exit 1; }
cat "$M"
