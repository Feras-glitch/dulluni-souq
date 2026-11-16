#!/usr/bin/env bash
# أذونات الميكروفون، وإتاحة محرك النطق في أندرويد ١١ فما بعد
set -euo pipefail
M=android/app/src/main/AndroidManifest.xml
grep -q RECORD_AUDIO "$M" || sed -i 's#<uses-permission android:name="android.permission.INTERNET" />#<uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />\n    <queries>\n        <intent>\n            <action android:name="android.intent.action.TTS_SERVICE" />\n        </intent>\n    </queries>#' "$M"
grep -q RECORD_AUDIO "$M" || { echo "patch failed"; exit 1; }
cat "$M"
