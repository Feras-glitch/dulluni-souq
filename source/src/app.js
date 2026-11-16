/* =====================================================================
 * منطق التطبيق. يُبنى كل DOM بـ textContent؛ لا innerHTML لأي نص يدخله المستخدم.
 * الاستثناء الوحيد: رسوم SVG الثابتة من art.js (ثوابت مكتوبة في الملف نفسه).
 * ===================================================================== */
'use strict';

/* نسخة نظيفة من الملف قبل أي تعديل على DOM — تُستعمل في التصدير */
const PRISTINE_HTML = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

/* المنصة: تطبيق أندرويد (Capacitor) أو تطبيق ويندوز (Electron) أو متصفح */
const CAP = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const CAP_PLUGINS = CAP ? (window.Capacitor.Plugins || {}) : {};
const ELECTRON = /\bElectron\//.test(navigator.userAgent);
const NATIVE = CAP || ELECTRON;

/* ---------- نصوص الواجهة: نص واحد أو [مذكر، مؤنث] ---------- */
const UI = {
  appTitle: 'دُلُّونِي عَلَى السُّوقِ',
  whoReads: 'مَنْ يَقْرَأُ الْيَوْمَ؟',
  addChild: '➕ إِضَافَةُ طِفْلٍ',
  nameLabel: 'الِاسْمُ',
  boy: 'وَلَدٌ',
  girl: 'بِنْتٌ',
  add: 'إِضَافَةٌ',
  cancel: 'إِلْغَاءٌ',
  nameEmpty: 'اكْتُبِ الِاسْمَ أَوَّلًا.',
  welcome: ['أَهْلًا بِكَ يَا {name}!', 'أَهْلًا بِكِ يَا {name}!'],
  start: ['ابْدَأِ الْقِرَاءَةَ', 'ابْدَئِي الْقِرَاءَةَ'],
  resume: ['تَابِعْ مِنْ حَيْثُ تَوَقَّفْتَ', 'تَابِعِي مِنْ حَيْثُ تَوَقَّفْتِ'],
  next: 'التَّالِي',
  prev: 'السَّابِقُ',
  readers: 'الْقُرَّاءُ',
  hideTashkeel: 'إِخْفَاءُ التَّشْكِيلِ',
  showTashkeel: 'إِظْهَارُ التَّشْكِيلِ',
  listen: ['🔊 اسْتَمِعْ', '🔊 اسْتَمِعِي'],
  stopListen: '⏹ إِيقَافُ الْقِرَاءَةِ',
  record: ['🎙 سَجِّلْ بِصَوْتِكَ', '🎙 سَجِّلِي بِصَوْتِكِ'],
  recordAgain: ['🎙 سَجِّلْ مِنْ جَدِيدٍ', '🎙 سَجِّلِي مِنْ جَدِيدٍ'],
  stopRec: '⏹ إِنْهَاءُ التَّسْجِيلِ',
  requesting: 'جَارٍ طَلَبُ الْمِيكْرُوفُونِ…',
  recording: 'جَارٍ التَّسْجِيلُ…',
  compiling: 'جَارٍ التَّجْمِيعُ…',
  yourRec: ['تَسْجِيلُكَ', 'تَسْجِيلُكِ'],
  play: '▶ تَشْغِيلٌ',
  deleteRec: '🗑 حَذْفُ التَّسْجِيلِ',
  deleteRecConfirm: ['هَلْ تُرِيدُ حَذْفَ هَذَا التَّسْجِيلِ؟', 'هَلْ تُرِيدِينَ حَذْفَ هَذَا التَّسْجِيلِ؟'],
  replaceRecConfirm: ['سَيَحُلُّ التَّسْجِيلُ الْجَدِيدُ مَحَلَّ الْقَدِيمِ. هَلْ تُرِيدُ الْمُتَابَعَةَ؟', 'سَيَحُلُّ التَّسْجِيلُ الْجَدِيدُ مَحَلَّ الْقَدِيمِ. هَلْ تُرِيدِينَ الْمُتَابَعَةَ؟'],
  draftNote: 'تَسْجِيلٌ لَمْ يَكْتَمِلْ، حُفِظَ مُسَوَّدَةً عِنْدَ تَرْكِ الصَّفْحَةِ.',
  keepDraft: '✓ اعْتِمَادُ الْمُسَوَّدَةِ',
  discardDraft: '🗑 حَذْفُ الْمُسَوَّدَةِ',
  optionalRec: 'التَّسْجِيلُ هُنَا اخْتِيَارِيٌّ.',
  micDenied: 'لَمْ يُؤْذَنْ بِاسْتِخْدَامِ الْمِيكْرُوفُونِ. يُمْكِنُ السَّمَاحُ بِهِ مِنْ إِعْدَادَاتِ الْمُتَصَفِّحِ.',
  micMissing: 'لَمْ يُعْثَرْ عَلَى مِيكْرُوفُونٍ فِي هَذَا الْجِهَازِ.',
  noRecorder: 'التَّسْجِيلُ غَيْرُ مَدْعُومٍ فِي هَذَا الْمُتَصَفِّحِ.',
  recTooShort: 'التَّسْجِيلُ قَصِيرٌ جِدًّا، فَلَمْ يُحْفَظْ.',
  recLimit: 'بَلَغَ التَّسْجِيلُ حَدَّهُ الْأَقْصَى (٣:٠٠) فَتَوَقَّفَ وَحُفِظَ.',
  noTTS: 'الْقِرَاءَةُ الْآلِيَّةُ غَيْرُ مُتَاحَةٍ فِي هَذَا الْمُتَصَفِّحِ.',
  noArVoice: 'لَا يُوجَدُ صَوْتٌ عَرَبِيٌّ مُثَبَّتٌ فِي هَذَا الْجِهَازِ، فَقَدْ تَكُونُ الْقِرَاءَةُ غَيْرَ وَاضِحَةٍ.',
  sourceBtn: '📚 الْمَصْدَرُ الْمُوَثَّقُ',
  sourceTitle: 'الْمَصْدَرُ الْمُوَثَّقُ',
  sourceIntro: 'لِلْوَالِدَيْنِ: مَصَادِرُ هَذِهِ الصَّفْحَةِ وَدَرَجَتُهَا.',
  close: 'إِغْلَاقٌ',
  storageFull: 'امْتَلَأَتْ مَسَاحَةُ التَّخْزِينِ فِي الْجِهَازِ، فَلَمْ يُحْفَظْ آخِرُ تَغْيِيرٍ. صَدِّرُوا نُسْخَةً ثُمَّ احْذِفُوا بَعْضَ التَّسْجِيلَاتِ.',
  storageError: 'تَعَذَّرَ الْحِفْظُ عَلَى هَذَا الْجِهَازِ.',
  noStorage: 'الْحِفْظُ غَيْرُ مُتَاحٍ هُنَا؛ سَيَضِيعُ التَّقَدُّمُ وَالتَّسْجِيلَاتُ عِنْدَ إِغْلَاقِ الصَّفْحَةِ.',
  notPersistent: 'لَمْ يَمْنَحِ الْمُتَصَفِّحُ حِفْظًا دَائِمًا، فَقَدْ يَمْسَحُ الْبَيَانَاتِ إِذَا امْتَلَأَ الْجِهَازُ. يُسْتَحْسَنُ التَّصْدِيرُ مِنْ حِينٍ لِآخَرَ.',
  parentArea: 'لِلْوَالِدَيْنِ',
  exportBtn: '⬇ تَصْدِيرُ نُسْخَةٍ لِلْعَرْضِ',
  exporting: 'جَارٍ تَجْهِيزُ النُّسْخَةِ…',
  exportDone: 'جُهِّزَتِ النُّسْخَةُ لِلتَّنْزِيلِ.',
  iosNotice: 'تَنْبِيهٌ: عَلَى أَجْهِزَةِ الْآيْفُونِ افْتَحُوا الْمَلَفَّ فِي مُتَصَفِّحِ سَفَارِي، لَا فِي الْمُعَايَنَةِ.',
  exportFail: 'تَعَذَّرَ تَجْهِيزُ النُّسْخَةِ.',
  deleteProfile: '🗑 حَذْفٌ',
  deleteProfileConfirm: ['سَيُحْذَفُ تَقَدُّمُ {name} وَتَسْجِيلَاتُهُ نِهَائِيًّا. هَلْ أَنْتَ مُتَأَكِّدٌ؟', 'سَيُحْذَفُ تَقَدُّمُ {name} وَتَسْجِيلَاتُهَا نِهَائِيًّا. هَلْ أَنْتَ مُتَأَكِّدٌ؟'],
  readonlyBanner: 'نُسْخَةٌ لِلْعَرْضِ فَقَطْ: لَا يُحْفَظُ فِيهَا شَيْءٌ.',
  correct: ['أَحْسَنْتَ! إِجَابَةٌ صَحِيحَةٌ.', 'أَحْسَنْتِ! إِجَابَةٌ صَحِيحَةٌ.'],
  tryAgain: ['حَاوِلْ مَرَّةً أُخْرَى.', 'حَاوِلِي مَرَّةً أُخْرَى.'],
  qCounter: 'السُّؤَالُ {n} مِنْ ٥',
  nextQ: 'السُّؤَالُ التَّالِي',
  showResult: 'النَّتِيجَةُ',
  quizScore: ['نَتِيجَتُكَ مِنَ الْمُحَاوَلَةِ الْأُولَى: {n} مِنْ ٥', 'نَتِيجَتُكِ مِنَ الْمُحَاوَلَةِ الْأُولَى: {n} مِنْ ٥'],
  quizRule: 'يُنَالُ الْوِسَامُ بِأَرْبَعِ إِجَابَاتٍ صَحِيحَةٍ مِنْ أَوَّلِ مُحَاوَلَةٍ.',
  quizBest: 'أَفْضَلُ نَتِيجَةٍ: {n} مِنْ ٥',
  retake: ['أَعِدِ الِاخْتِبَارَ', 'أَعِيدِي الِاخْتِبَارَ'],
  earned: ['نِلْتَ {badge}!', 'نِلْتِ {badge}!'],
  mapIntro: ['اضْغَطْ عَلَى أَيِّ مَوْضِعٍ فِي الْخَرِيطَةِ لِتَعْرِفَ مَا جَرَى فِيهِ.', 'اضْغَطِي عَلَى أَيِّ مَوْضِعٍ فِي الْخَرِيطَةِ لِتَعْرِفِي مَا جَرَى فِيهِ.'],
  valuesStrip: 'تَأَمَّلِ السُّؤَالَ، وَسَجِّلْ إِجَابَتَكَ إِنْ شِئْتَ، ثُمَّ اكْشِفِ الدَّرْسَ لِتَنَالَ وِسَامَ عِزَّةِ النَّفْسِ.',
  reveal: ['اكْشِفِ الدَّرْسَ', 'اكْشِفِي الدَّرْسَ'],
  timelineIntro: ['رَتِّبِ الْأَحْدَاثَ مِنَ الْأَقْدَمِ إِلَى الْأَحْدَثِ بِالسَّهْمَيْنِ، ثُمَّ تَحَقَّقْ.', 'رَتِّبِي الْأَحْدَاثَ مِنَ الْأَقْدَمِ إِلَى الْأَحْدَثِ بِالسَّهْمَيْنِ، ثُمَّ تَحَقَّقِي.'],
  check: '✓ تَحَقُّقٌ',
  moveUp: 'تقديم',
  moveDown: 'تأخير',
  timelineWrong: ['بَعْضُ الْأَحْدَاثِ فِي غَيْرِ مَكَانِهَا؛ حَاوِلْ مَرَّةً أُخْرَى.', 'بَعْضُ الْأَحْدَاثِ فِي غَيْرِ مَكَانِهَا؛ حَاوِلِي مَرَّةً أُخْرَى.'],
  timelineRight: ['أَحْسَنْتَ! هَذَا هُوَ التَّرْتِيبُ الصَّحِيحُ.', 'أَحْسَنْتِ! هَذَا هُوَ التَّرْتِيبُ الصَّحِيحُ.'],
  marketIntro: ['كَمْ رَبِحْتَ مِنْ مَشْرُوعِكَ الصَّغِيرِ؟ اخْتَرِ الْعَدَدَ ثُمَّ وَزِّعْهُ عَلَى الْحَصَّالَاتِ.', 'كَمْ رَبِحْتِ مِنْ مَشْرُوعِكِ الصَّغِيرِ؟ اخْتَارِي الْعَدَدَ ثُمَّ وَزِّعِيهِ عَلَى الْحَصَّالَاتِ.'],
  distribute: ['وَزِّعْ', 'وَزِّعِي'],
  less: 'إنقاص',
  more: 'زيادة',
  marketNote: 'قُسِّمَ الرِّبْحُ أَثْلَاثًا، وَمَا لَا يَنْقَسِمُ ذَهَبَ إِلَى الصَّدَقَةِ.',
  flashIntro: ['اضْغَطْ عَلَى الْبِطَاقَةِ لِتَرَى الْجَوَابَ.', 'اضْغَطِي عَلَى الْبِطَاقَةِ لِتَرَيِ الْجَوَابَ.'],
  badgesTitle: 'الْأَوْسِمَةُ',
  notYet: 'لَمْ يُنَلْ بَعْدُ',
  printCert: '🖨 طِبَاعَةُ الشَّهَادَةِ',
  certTitle: ['شَهَادَةُ الرَّاوِي الْأَمِينِ', 'شَهَادَةُ الرَّاوِيَةِ الْأَمِينَةِ'],
  certTo: ['تُقَدَّمُ هَذِهِ الشَّهَادَةُ إِلَى الْبَطَلِ:', 'تُقَدَّمُ هَذِهِ الشَّهَادَةُ إِلَى الْبَطَلَةِ:'],
  certBody: ['لِإِتْمَامِهِ قِرَاءَةَ قِصَّةِ عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ رَضِيَ اللَّهُ عَنْهُ، وَتَعَلُّمِهِ قِيَمَ الْأَمَانَةِ، وَعِزَّةِ النَّفْسِ، وَالْعَمَلِ الشَّرِيفِ، وَالْإِيثَارِ، وَالْعِلْمِ النَّافِعِ.',
             'لِإِتْمَامِهَا قِرَاءَةَ قِصَّةِ عَبْدِ الرَّحْمَنِ بْنِ عَوْفٍ رَضِيَ اللَّهُ عَنْهُ، وَتَعَلُّمِهَا قِيَمَ الْأَمَانَةِ، وَعِزَّةِ النَّفْسِ، وَالْعَمَلِ الشَّرِيفِ، وَالْإِيثَارِ، وَالْعِلْمِ النَّافِعِ.'],
  certRecorded: ['الصَّفَحَاتُ الْمُسَجَّلَةُ بِصَوْتِهِ: {n} مِنْ ١٦', 'الصَّفَحَاتُ الْمُسَجَّلَةُ بِصَوْتِهَا: {n} مِنْ ١٦'],
  narratorRule: 'يُنَالُ بِتَسْجِيلِ نِصْفِ صَفَحَاتِ الْقِصَّةِ عَلَى الْأَقَلِّ: {n} مِنْ ٨',
  pageOf: '{n} / {t}',
  glossaryHint: 'الْكَلِمَاتُ الْمُلَوَّنَةُ لَهَا شَرْحٌ.',
  gradeLabel: 'الدَّرَجَةُ:'
};

const BADGES = {
  narrator: ['وِسَامُ الرَّاوِي الْفَصِيحِ', 'وِسَامُ الرَّاوِيَةِ الْفَصِيحَةِ'],
  values: 'وِسَامُ عِزَّةِ النَّفْسِ',
  quiz: ['وِسَامُ التَّاجِرِ الصَّادِقِ', 'وِسَامُ التَّاجِرَةِ الصَّادِقَةِ'],
  timeline: ['وِسَامُ الْمُؤَرِّخِ الصَّغِيرِ', 'وِسَامُ الْمُؤَرِّخَةِ الصَّغِيرَةِ'],
  market: ['وِسَامُ الْغَنِيِّ الشَّاكِرِ', 'وِسَامُ الْغَنِيَّةِ الشَّاكِرَةِ']
};
const BADGE_ICONS = { narrator: '🎙', values: '💎', quiz: '⚖', timeline: '⏳', market: '🪙' };
const NARRATOR_MIN = 8;
const REC_MAX_MS = 180000;
const REC_MIN_MS = 700;

/* ---------- النطق الآلي: يُطبَّق على النص المنطوق فقط ---------- */
const SPEECH_MAP = [
  ['سَنَةَ ٣٢ هـ', 'سَنَةَ اثْنَتَيْنِ وَثَلَاثِينَ لِلْهِجْرَةِ'],
  ['وَعُمْرُهُ ٧٥', 'وَعُمْرُهُ خَمْسٌ وَسَبْعُونَ سَنَةً'],
  ['١٧ هـ', 'سَنَةَ سَبْعَ عَشْرَةَ لِلْهِجْرَةِ'],
  ['٢٤ هـ', 'سَنَةَ أَرْبَعٍ وَعِشْرِينَ لِلْهِجْرَةِ'],
  ['١ هـ', 'السَّنَةَ الْأُولَى لِلْهِجْرَةِ'],
  ['٣ هـ', 'سَنَةَ ثَلَاثٍ لِلْهِجْرَةِ'],
  ['٩ هـ', 'سَنَةَ تِسْعٍ لِلْهِجْرَةِ'],
  ['ﷺ', 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ'],
  [' … ', '، ']
];
function speechText(s) {
  let out = s;
  for (const [a, b] of SPEECH_MAP) out = out.split(a).join(b);
  return out.replace(/[«»]/g, '');
}

/* ---------- أدوات ---------- */
const DIAC = /[ً-ٰٟ]/g;
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const arNum = n => String(n).replace(/\d/g, d => AR_DIGITS[d]);
const fmtDur = ms => { const s = Math.max(0, Math.round(ms / 1000)); return arNum(Math.floor(s / 60)) + ':' + arNum(String(s % 60).padStart(2, '0')); };

const S = {
  store: null, readonly: false, storageOk: true, persistent: null,
  profiles: [], profile: null, progress: null, recs: {},
  page: 0, session: null, toastTimer: 0, warnedVoice: false
};

function T(s) { return (S.progress && S.progress.tashkeel === false) ? String(s).replace(DIAC, '') : String(s); }
function gi() { return S.profile && S.profile.gender === 'f' ? 1 : 0; }
function u(key, vars) {
  let v = UI[key];
  if (Array.isArray(v)) v = v[gi()];
  if (vars) for (const k in vars) v = v.split('{' + k + '}').join(vars[k]);
  return v;
}
function badgeName(k) { const v = BADGES[k]; return Array.isArray(v) ? v[gi()] : v; }

function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  if (props) for (const k of Object.keys(props)) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = T(v);
    else if (k === 'plain') el.textContent = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'dataset') Object.assign(el.dataset, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(typeof c === 'string' ? document.createTextNode(T(c)) : c);
  }
  return el;
}
function svg(tag, attrs, ...kids) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  for (const c of kids) if (c != null) el.append(typeof c === 'string' ? document.createTextNode(T(c)) : c);
  return el;
}
function artEl(name) {
  const t = document.createElement('template');
  t.innerHTML = ILLUSTRATIONS[name] || ''; /* ثابت مكتوب في الملف، لا يدخله المستخدم */
  const box = h('div', { class: 'art', 'aria-hidden': 'true' });
  const walk = document.createTreeWalker(t.content, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) n.nodeValue = T(n.nodeValue);
  box.append(t.content);
  return box;
}
function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}
function toast(msg, kind, ms) {
  const el = document.getElementById('toast');
  el.textContent = T(msg);
  el.className = 'toast show' + (kind ? ' ' + kind : '');
  clearTimeout(S.toastTimer);
  S.toastTimer = setTimeout(() => { el.className = 'toast'; }, ms || 5000);
}
function uid() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

/* =====================================================================
 * التخزين: IndexedDB مع مساحة اسم لكل طفل؛ ذاكرة مؤقتة عند التعذر؛ قراءة فقط في النسخة المصدَّرة
 * ===================================================================== */
const DB_NAME = 'dulluni-souq-book';
function reqP(r) { return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
function txDone(tx) { return new Promise((res, rej) => { tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error || new DOMException('abort', 'AbortError')); }); }

class IDBStore {
  async open() {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => {
      const db = r.result;
      db.createObjectStore('profiles', { keyPath: 'id' });
      db.createObjectStore('progress');
      db.createObjectStore('recs');
    };
    this.db = await reqP(r);
    return this;
  }
  async _w(store, fn) { const tx = this.db.transaction(store, 'readwrite'); fn(tx.objectStore(store)); await txDone(tx); }
  async _r(store, fn) { const tx = this.db.transaction(store, 'readonly'); return reqP(fn(tx.objectStore(store))); }
  getProfiles() { return this._r('profiles', s => s.getAll()); }
  putProfile(p) { return this._w('profiles', s => s.put(p)); }
  getProgress(pid) { return this._r('progress', s => s.get(pid)); }
  putProgress(pid, v) { return this._w('progress', s => s.put(v, pid)); }
  async getRecs(pid) {
    const range = IDBKeyRange.bound(pid + '|', pid + '|￿');
    const tx = this.db.transaction('recs', 'readonly'); const st = tx.objectStore('recs');
    const [keys, vals] = await Promise.all([reqP(st.getAllKeys(range)), reqP(st.getAll(range))]);
    const out = {}; keys.forEach((k, i) => { out[k.slice(pid.length + 1)] = vals[i]; });
    return out;
  }
  putRec(pid, key, v) { return this._w('recs', s => s.put(v, pid + '|' + key)); }
  delRec(pid, key) { return this._w('recs', s => s.delete(pid + '|' + key)); }
  async deleteProfile(pid) {
    const tx = this.db.transaction(['profiles', 'progress', 'recs'], 'readwrite');
    tx.objectStore('profiles').delete(pid);
    tx.objectStore('progress').delete(pid);
    tx.objectStore('recs').delete(IDBKeyRange.bound(pid + '|', pid + '|￿'));
    await txDone(tx);
  }
}
class MemStore {
  constructor(seed, readonly) { this.p = {}; this.g = {}; this.r = {}; this.ro = !!readonly; if (seed) seed(this); }
  async open() { return this; }
  async getProfiles() { return Object.values(this.p); }
  async putProfile(p) { if (!this.ro) this.p[p.id] = p; }
  async getProgress(pid) { return this.g[pid] ? JSON.parse(JSON.stringify(this.g[pid])) : undefined; }
  async putProgress(pid, v) { if (!this.ro) this.g[pid] = JSON.parse(JSON.stringify(v)); }
  async getRecs(pid) { return Object.assign({}, this.r[pid] || {}); }
  async putRec(pid, k, v) { if (!this.ro) (this.r[pid] = this.r[pid] || {})[k] = v; }
  async delRec(pid, k) { if (!this.ro && this.r[pid]) delete this.r[pid][k]; }
  async deleteProfile(pid) { if (!this.ro) { delete this.p[pid]; delete this.g[pid]; delete this.r[pid]; } }
}

async function safe(fn) {
  try { await fn(); return true; }
  catch (e) {
    const quota = e && (e.name === 'QuotaExceededError' || (e.inner && e.inner.name === 'QuotaExceededError'));
    toast(quota ? UI.storageFull : UI.storageError, 'error');
    return false;
  }
}
function saveProgress() {
  if (!S.profile || S.readonly) return Promise.resolve(true);
  return safe(() => S.store.putProgress(S.profile.id, S.progress));
}
function freshProgress() {
  return { v: 1, page: 0, tashkeel: true, values: {}, quiz: { best: 0, rounds: 0 }, timeline: { solved: false }, market: { done: false, last: null }, map: {} };
}

/* =====================================================================
 * القراءة الآلية: جملة جملة مع إبراز الجملة عند بدء نطقها
 * ===================================================================== */
const TTS = {
  token: 0, active: false,
  /* في أندرويد: محرك النطق الأصلي، لأن متصفح التطبيقات المضمَّن لا يدعم القراءة الآلية */
  plugin: () => CAP_PLUGINS.TextToSpeech || null,
  supported() { return CAP ? !!this.plugin() : ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window); },
  async voice() {
    let vs = speechSynthesis.getVoices();
    if (!vs.length) {
      await new Promise(res => {
        const t = setTimeout(res, 1500);
        speechSynthesis.addEventListener('voiceschanged', () => { clearTimeout(t); res(); }, { once: true });
      });
      vs = speechSynthesis.getVoices();
    }
    return vs.find(v => /^ar[-_]SA/i.test(v.lang)) || vs.find(v => /^ar/i.test(v.lang)) || null;
  },
  stop() {
    this.token++; this.active = false;
    if (CAP) { const pl = this.plugin(); if (pl) pl.stop().catch(() => {}); }
    else if (this.supported()) speechSynthesis.cancel();
    document.querySelectorAll('.speaking').forEach(e => e.classList.remove('speaking'));
    document.querySelectorAll('[data-tts-btn]').forEach(b => { b.textContent = T(u('listen')); });
  },
  /* items: [{text, sel}] — sel محدد CSS يُبحث عنه لحظة النطق ليصمد أمام إعادة الرسم */
  async speak(items, btn) {
    if (!this.supported()) { toast(UI.noTTS, 'error'); return; }
    if (this.active) { this.stop(); return; }
    this.stop();
    const my = ++this.token; this.active = true;
    if (btn) btn.textContent = T(UI.stopListen);
    const highlight = it => {
      document.querySelectorAll('.speaking').forEach(e => e.classList.remove('speaking'));
      const el = it.sel && document.querySelector(it.sel);
      if (el) { el.classList.add('speaking'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    };
    if (CAP) {
      const pl = this.plugin();
      for (const it of items) {
        if (my !== this.token) return;
        highlight(it);
        let failed = false;
        await pl.speak({ text: speechText(it.text), lang: 'ar-SA', rate: 0.9, pitch: 1.0, volume: 1.0, category: 'playback' })
          .catch(() => { failed = true; });
        if (failed && my === this.token) { if (!S.warnedVoice) { S.warnedVoice = true; toast(UI.noArVoice, 'error'); } break; }
      }
      if (my === this.token) this.stop();
      return;
    }
    const voice = await this.voice();
    if (my !== this.token) return;
    if (!voice && !S.warnedVoice) { S.warnedVoice = true; toast(UI.noArVoice); }
    for (const it of items) {
      if (my !== this.token) return;
      await new Promise(res => {
        const ut = new SpeechSynthesisUtterance(speechText(it.text));
        ut.lang = voice ? voice.lang : 'ar-SA';
        if (voice) ut.voice = voice;
        ut.rate = 0.85;
        ut.onstart = () => highlight(it);
        ut.onend = res; ut.onerror = res;
        speechSynthesis.speak(ut);
      });
    }
    if (my === this.token) this.stop();
  }
};
function listenBtn(itemsFn) {
  const b = h('button', { class: 'btn btn-listen', 'data-tts-btn': '', type: 'button' }, u('listen'));
  b.addEventListener('click', () => TTS.speak(itemsFn(), b));
  return b;
}

/* =====================================================================
 * المسجّل: آلة حالات idle → requesting → recording → stopping → idle
 * ===================================================================== */
const Rec = {
  state: 'idle', key: null, cancel: false, mr: null, stream: null, chunks: [], t0: 0,
  ctx: null, analyser: null, raf: 0, tick: 0, asDraft: false, done: null, mime: '',
  supported: () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder),
  pickMime() {
    const c = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'];
    for (const m of c) { try { if (MediaRecorder.isTypeSupported(m)) return m; } catch (e) { /* تجاهل */ } }
    return '';
  },
  async start(key) {
    if (this.state !== 'idle' || S.readonly) return;           /* حارس النقرة المزدوجة */
    if (!this.supported()) { toast(UI.noRecorder, 'error'); return; }
    TTS.stop();
    this.state = 'requesting'; this.key = key; this.cancel = false; refreshRecUI();
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
    catch (e) {
      this.state = 'idle'; this.key = null; refreshRecUI();
      toast(e && e.name === 'NotFoundError' ? UI.micMissing : UI.micDenied, 'error');
      return;
    }
    if (this.cancel) { stream.getTracks().forEach(t => t.stop()); this.state = 'idle'; this.key = null; refreshRecUI(); return; }
    this.stream = stream; this.chunks = [];
    this.mime = this.pickMime();
    try { this.mr = this.mime ? new MediaRecorder(stream, { mimeType: this.mime }) : new MediaRecorder(stream); }
    catch (e) { stream.getTracks().forEach(t => t.stop()); this.state = 'idle'; this.key = null; refreshRecUI(); toast(UI.noRecorder, 'error'); return; }
    this.mime = this.mr.mimeType || this.mime || 'audio/webm';
    this.mr.ondataavailable = e => { if (e.data && e.data.size) this.chunks.push(e.data); };
    this.mr.start(250);
    this.t0 = performance.now(); this.state = 'recording'; this.asDraft = false;
    this.wave(stream);
    this.tick = setInterval(() => {
      const el = document.querySelector('.rec-elapsed');
      const ms = performance.now() - this.t0;
      if (el) el.textContent = fmtDur(ms);
      if (ms >= REC_MAX_MS) { toast(UI.recLimit); this.stop(false); }
    }, 250);
    refreshRecUI();
  },
  wave(stream) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      const src = this.ctx.createMediaStreamSource(stream);
      this.analyser = this.ctx.createAnalyser(); this.analyser.fftSize = 1024;
      src.connect(this.analyser);
      const buf = new Uint8Array(this.analyser.fftSize);
      const draw = () => {
        if (this.state !== 'recording') return;
        const cv = document.querySelector('canvas.wave');
        if (cv) {
          const g = cv.getContext('2d'); const w = cv.width, hh = cv.height;
          this.analyser.getByteTimeDomainData(buf);
          g.clearRect(0, 0, w, hh); g.lineWidth = 2; g.strokeStyle = '#C25934'; g.beginPath();
          for (let i = 0; i < buf.length; i++) { const x = i / (buf.length - 1) * w, y = buf[i] / 255 * hh; i ? g.lineTo(x, y) : g.moveTo(x, y); }
          g.stroke();
        }
        this.raf = requestAnimationFrame(draw);
      };
      draw();
    } catch (e) { /* الموجة تحسين بصري فقط */ }
  },
  /* asDraft=true عند مغادرة الصفحة: لا يُرمى التسجيل أبدًا */
  stop(asDraft) {
    if (this.state === 'requesting') { this.cancel = true; return Promise.resolve(); }
    if (this.state === 'stopping') return this.done || Promise.resolve();
    if (this.state !== 'recording') return Promise.resolve();
    this.state = 'stopping'; this.asDraft = !!asDraft; refreshRecUI();
    clearInterval(this.tick); cancelAnimationFrame(this.raf);
    const key = this.key, pid = S.profile.id, dur = performance.now() - this.t0;
    this.done = new Promise(res => {
      this.mr.onstop = async () => {
        const blob = new Blob(this.chunks, { type: this.mime });
        this.cleanup();
        if (dur >= REC_MIN_MS && blob.size) {
          const rec = { blob, mime: this.mime, duration: dur, at: Date.now() };
          const k = this.asDraft ? key + '|draft' : key;
          if (await safe(() => S.store.putRec(pid, k, rec))) {
            if (S.profile && S.profile.id === pid) S.recs[k] = rec;
            if (!this.asDraft) { await safe(() => S.store.delRec(pid, key + '|draft')); delete S.recs[key + '|draft']; }
          }
        } else if (!this.asDraft) toast(UI.recTooShort);
        this.state = 'idle'; this.key = null; this.done = null;
        refreshRecUI();
        res();
      };
      try { this.mr.stop(); } catch (e) { this.mr.onstop(); }
    });
    return this.done;
  },
  cleanup() {
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.ctx) { try { this.ctx.close(); } catch (e) { /* */ } }
    this.stream = null; this.ctx = null; this.analyser = null; this.mr = null; this.chunks = [];
  }
};

const objUrls = new Map();
function recUrl(rec) {
  if (!objUrls.has(rec.blob)) objUrls.set(rec.blob, URL.createObjectURL(rec.blob));
  return objUrls.get(rec.blob);
}

/* واجهة التسجيل لمفتاح معيّن (صفحة قصة p1… أو بطاقة قيمة v1…) */
function recBox(key, optional) {
  const box = h('div', { class: 'rec-box', 'data-rec-key': key });
  if (optional) box.dataset.optional = '1';
  fillRecBox(box, key, optional);
  return box;
}
function fillRecBox(box, key, optional) {
  box.textContent = '';
  const mine = Rec.key === key;
  const rec = S.recs[key], draft = S.recs[key + '|draft'];
  if (optional) box.append(h('p', { class: 'muted small' }, UI.optionalRec));
  if (!S.readonly) {
    if (mine && Rec.state === 'requesting') box.append(h('div', { class: 'rec-status' }, UI.requesting));
    else if (mine && Rec.state === 'recording') {
      const cv = h('canvas', { class: 'wave', width: '320', height: '56', 'aria-hidden': 'true' });
      box.append(h('div', { class: 'rec-live' },
        h('span', { class: 'rec-dot', 'aria-hidden': 'true' }),
        h('span', { class: 'rec-status' }, UI.recording),
        h('span', { class: 'rec-elapsed', plain: fmtDur(performance.now() - Rec.t0) })),
      cv,
      h('button', { class: 'btn btn-stop', type: 'button', onclick: () => Rec.stop(false) }, UI.stopRec));
    } else if (mine && Rec.state === 'stopping') box.append(h('div', { class: 'rec-status' }, UI.compiling));
    else {
      const busy = Rec.state !== 'idle';
      const b = h('button', { class: 'btn btn-rec', type: 'button', disabled: busy || !Rec.supported() }, rec ? u('recordAgain') : u('record'));
      b.addEventListener('click', () => {
        if (rec && !confirm(T(u('replaceRecConfirm')))) return;
        Rec.start(key);
      });
      box.append(b);
      if (!Rec.supported()) box.append(h('p', { class: 'muted small' }, UI.noRecorder));
    }
  }
  if (draft && !(mine && Rec.state !== 'idle')) {
    box.append(h('div', { class: 'draft' },
      h('p', { class: 'small' }, UI.draftNote),
      player(draft),
      S.readonly ? null : h('div', { class: 'row' },
        h('button', { class: 'btn btn-small', type: 'button', onclick: async () => {
          if (await safe(() => S.store.putRec(S.profile.id, key, draft))) {
            await safe(() => S.store.delRec(S.profile.id, key + '|draft'));
            S.recs[key] = draft; delete S.recs[key + '|draft']; refreshRecUI();
          }
        } }, UI.keepDraft),
        h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: async () => {
          if (await safe(() => S.store.delRec(S.profile.id, key + '|draft'))) { delete S.recs[key + '|draft']; refreshRecUI(); }
        } }, UI.discardDraft))));
  }
  if (rec && !(mine && Rec.state !== 'idle')) {
    box.append(h('div', { class: 'my-rec' },
      h('span', { class: 'small strong' }, u('yourRec'), ' ', h('span', { plain: '(' + fmtDur(rec.duration) + ')' })),
      player(rec),
      S.readonly ? null : h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: async () => {
        if (!confirm(T(u('deleteRecConfirm')))) return;
        if (await safe(() => S.store.delRec(S.profile.id, key))) { delete S.recs[key]; refreshRecUI(); }
      } }, UI.deleteRec)));
  }
}
function player(rec) {
  const a = h('audio', { controls: true, preload: 'metadata' });
  a.src = recUrl(rec);
  a.addEventListener('play', () => TTS.stop());
  return a;
}
function refreshRecUI() {
  document.querySelectorAll('.rec-box').forEach(b => fillRecBox(b, b.dataset.recKey, b.dataset.optional === '1'));
}

/* =====================================================================
 * النوافذ المنبثقة
 * ===================================================================== */
function modal(title, ...body) {
  const root = document.getElementById('modal-root');
  const prevFocus = document.activeElement;
  const close = () => { root.textContent = ''; root.hidden = true; document.removeEventListener('keydown', onKey); if (prevFocus) prevFocus.focus(); };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const closeBtn = h('button', { class: 'btn btn-ghost', type: 'button', onclick: close }, UI.close);
  const card = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title.replace(DIAC, '') },
    h('h3', { class: 'modal-title' }, title), ...body, h('div', { class: 'modal-actions' }, closeBtn));
  const veil = h('div', { class: 'veil', onclick: e => { if (e.target === veil) close(); } }, card);
  root.textContent = ''; root.append(veil); root.hidden = false;
  document.addEventListener('keydown', onKey);
  closeBtn.focus();
  return close;
}
function showSources(page) {
  modal(UI.sourceTitle,
    h('p', { class: 'muted small' }, UI.sourceIntro),
    h('ul', { class: 'sources' }, page.sources.map(([txt, g]) =>
      h('li', null, h('span', { class: 'grade grade-' + g }, GRADES[g]), ' ', h('span', { plain: txt })))));
}
function showGloss(g) {
  modal(g.title,
    h('p', { class: 'gloss-meaning' }, g.meaning),
    listenBtn(() => [{ text: g.title + '. ' + g.meaning }]));
}

/* =====================================================================
 * تقطيع النص إلى جمل (لا يُقطع داخل علامتي التنصيص) وربط القاموس
 * ===================================================================== */
function sentences(text) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i]; cur += c;
    if (c === '«') depth++;
    let boundary = false;
    if (c === '»') { depth = Math.max(0, depth - 1); if (depth === 0 && /[.؟!]/.test(text[i - 1])) boundary = true; }
    else if (/[.؟!]/.test(c) && depth === 0 && text[i + 1] !== '»') boundary = true;
    if (boundary && (i + 1 === text.length || text[i + 1] === ' ')) { out.push(cur.trim()); cur = ''; }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function glossFor(pageN) { return GLOSSARY.filter(g => g.page === pageN); }
function sentenceNodes(sent, glosses, used) {
  /* يُبحث في النص المشكول الأصلي، ثم يُعرض كل جزء عبر T — فلا تتسرّب الحركات عند إخفائها */
  const nodes = [];
  let rest = sent;
  while (rest) {
    let best = null;
    for (const g of glosses) {
      if (used.has(g.match)) continue;
      const i = rest.indexOf(g.match);
      if (i >= 0 && (!best || i < best.i)) best = { i, g };
    }
    if (!best) { nodes.push(rest); break; }
    if (best.i) nodes.push(rest.slice(0, best.i));
    used.add(best.g.match);
    const g = best.g;
    nodes.push(h('button', { class: 'gloss', type: 'button', 'data-gloss': g.match, onclick: () => showGloss(g) }, g.match));
    rest = rest.slice(best.i + g.match.length);
  }
  return nodes;
}

/* =====================================================================
 * الشاشات
 * ===================================================================== */
const SCREENS = [{ kind: 'cover' }]
  .concat(STORY_PAGES.map(p => ({ kind: 'story', p })))
  .concat(['map', 'values', 'quiz', 'timeline', 'market', 'flashcards', 'certificate'].map(k => ({ kind: k })));

function storyRecordedCount() { return STORY_PAGES.filter(p => S.recs['p' + p.n]).length; }
function badges() {
  const pr = S.progress;
  return {
    narrator: storyRecordedCount() >= NARRATOR_MIN,
    values: VALUES.every(v => pr.values[v.id] === true),
    quiz: pr.quiz.best >= 4,
    timeline: !!pr.timeline.solved,
    market: !!pr.market.done
  };
}
function announceBadge(k, before) { if (!before[k] && badges()[k]) toast(u('earned', { badge: badgeName(k) }), 'ok'); }

function renderTop() {
  const top = document.getElementById('topbar');
  top.textContent = '';
  if (!S.profile) { top.append(h('h1', { class: 'brand' }, UI.appTitle)); return; }
  top.append(
    h('button', { class: 'btn btn-ghost btn-small', type: 'button', onclick: toProfiles }, '🏠 ', UI.readers),
    h('div', { class: 'brand-wrap' }, h('h1', { class: 'brand' }, UI.appTitle), h('span', { class: 'who', plain: S.profile.name })),
    h('button', { class: 'btn btn-ghost btn-small', type: 'button', 'aria-pressed': String(S.progress.tashkeel), onclick: () => {
      S.progress.tashkeel = !S.progress.tashkeel; saveProgress(); renderAll();
    } }, S.progress.tashkeel ? UI.hideTashkeel : UI.showTashkeel));
}
function renderPager() {
  const nav = document.getElementById('pager');
  nav.textContent = '';
  nav.hidden = !S.profile;
  if (!S.profile) return;
  const n = S.page, t = SCREENS.length;
  nav.append(
    h('button', { class: 'btn', type: 'button', disabled: n === 0, onclick: () => go(n - 1), 'aria-label': 'السابق' }, '➡ ', UI.prev),
    h('span', { class: 'counter', plain: u('pageOf', { n: arNum(n + 1), t: arNum(t) }) }),
    h('button', { class: 'btn', type: 'button', disabled: n === t - 1, onclick: () => go(n + 1), 'aria-label': 'التالي' }, UI.next, ' ⬅'));
}
function renderAll() {
  renderTop(); renderPager();
  const v = document.getElementById('view');
  v.textContent = '';
  if (S.readonly) v.append(h('div', { class: 'banner' }, UI.readonlyBanner));
  if (!S.storageOk) v.append(h('div', { class: 'banner warn' }, UI.noStorage));
  if (!S.profile) { v.append(viewProfiles()); return; }
  const sc = SCREENS[S.page];
  const fn = { cover: viewCover, story: viewStory, map: viewMap, values: viewValues, quiz: viewQuiz, timeline: viewTimeline, market: viewMarket, flashcards: viewFlash, certificate: viewCert }[sc.kind];
  v.append(fn(sc));
}
async function go(n) {
  if (n < 0 || n >= SCREENS.length || n === S.page) return;
  TTS.stop();
  await Rec.stop(true);         /* مغادرة الصفحة أثناء التسجيل تحفظه مسوّدة */
  S.page = n; S.progress.page = n; saveProgress();
  renderAll();
  window.scrollTo(0, 0);
  const v = document.getElementById('view'); v.focus({ preventScroll: true });
}
async function toProfiles() {
  TTS.stop(); await Rec.stop(true);
  S.profile = null; S.progress = null; S.recs = {}; S.session = null;
  for (const url of objUrls.values()) URL.revokeObjectURL(url);
  objUrls.clear();
  if (!S.readonly) S.profiles = await S.store.getProfiles().catch(() => S.profiles);
  renderAll();
}
async function openProfile(p) {
  S.profile = p;
  S.progress = Object.assign(freshProgress(), (await S.store.getProgress(p.id).catch(() => null)) || {});
  S.recs = await S.store.getRecs(p.id).catch(() => ({}));
  S.session = { quiz: null, timeline: null, mapSel: 'makkah', flipped: {}, marketN: 10 };
  S.page = S.readonly ? 0 : Math.min(S.progress.page || 0, SCREENS.length - 1);
  renderAll();
}

/* ---------- شاشة القرّاء ---------- */
function viewProfiles() {
  const wrap = h('section', { class: 'profiles card' }, h('h2', { class: 'heading' }, UI.whoReads));
  const list = h('div', { class: 'profile-list' });
  const sorted = S.profiles.slice().sort((a, b) => a.created - b.created);
  for (const p of sorted) {
    const row = h('div', { class: 'profile-row' },
      h('button', { class: 'profile-btn', type: 'button', onclick: () => openProfile(p) },
        h('span', { class: 'avatar', 'aria-hidden': 'true' }, p.gender === 'f' ? '🌸' : '⭐'),
        h('span', { class: 'pname', plain: p.name })));
    if (!S.readonly) row.append(h('div', { class: 'profile-tools' },
      h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => doExport(p) }, UI.exportBtn),
      h('button', { class: 'btn btn-small btn-danger', type: 'button', onclick: () => deleteProfile(p) }, UI.deleteProfile)));
    list.append(row);
  }
  wrap.append(list);
  if (!S.readonly) {
    const name = h('input', { id: 'new-name', type: 'text', maxlength: '24', autocomplete: 'off', 'aria-label': 'الاسم' });
    const rb = (val, label, checked) => h('label', { class: 'radio' },
      h('input', { type: 'radio', name: 'gender', value: val, checked }), ' ', label);
    const form = h('form', { class: 'add-form', onsubmit: async e => {
      e.preventDefault();
      const nm = name.value.replace(/\s+/g, ' ').trim().slice(0, 24);
      if (!nm) { toast(UI.nameEmpty, 'error'); name.focus(); return; }
      const gender = form.querySelector('input[name=gender]:checked').value === 'f' ? 'f' : 'm';
      const p = { id: uid(), name: nm, gender, created: Date.now() };
      if (!(await safe(() => S.store.putProfile(p)))) return;
      S.profiles.push(p);
      if (navigator.storage && navigator.storage.persist && S.persistent !== true) {
        try { S.persistent = await navigator.storage.persist(); } catch (err) { S.persistent = false; }
      }
      await openProfile(p);
    } },
      h('h3', { class: 'small strong' }, UI.addChild),
      h('label', { class: 'field' }, h('span', null, UI.nameLabel), name),
      h('div', { class: 'row' }, rb('m', UI.boy, true), rb('f', UI.girl, false)),
      h('button', { class: 'btn btn-primary', type: 'submit' }, UI.add));
    wrap.append(form);
    if (!NATIVE && S.persistent === false && S.profiles.length) wrap.append(h('p', { class: 'muted small parent-note' }, UI.notPersistent));
  }
  return wrap;
}
async function deleteProfile(p) {
  const msg = UI.deleteProfileConfirm[p.gender === 'f' ? 1 : 0].split('{name}').join(p.name);
  if (!confirm(msg)) return;
  if (await safe(() => S.store.deleteProfile(p.id))) { S.profiles = S.profiles.filter(x => x.id !== p.id); renderAll(); }
}

/* ---------- الغلاف ---------- */
function viewCover() {
  const resumeAt = S.progress.page > 0;
  return h('section', { class: 'card cover' },
    artEl('cover'),
    h('h2', { class: 'cover-title' }, COVER.title),
    h('p', { class: 'cover-sub' }, COVER.subtitle),
    h('p', { class: 'welcome' }, u('welcome', { name: S.profile.name })),
    h('button', { class: 'btn btn-primary btn-big', type: 'button', onclick: () => go(1) }, u('start')));
}

/* ---------- صفحة القصة ---------- */
function viewStory({ p }) {
  const sents = sentences(p.text);
  const used = new Set(), glosses = glossFor(p.n);
  const body = h('div', { class: 'story-text', lang: 'ar' });
  sents.forEach((s, i) => { body.append(h('span', { class: 'sent', 'data-s': String(i) }, sentenceNodes(s, glosses, used)), ' '); });
  return h('article', { class: 'card story' },
    h('div', { class: 'chapter' }, CHAPTERS[p.chapter]),
    h('h2', { class: 'heading' }, h('span', { class: 'pnum', plain: arNum(p.n) }), ' ', p.title),
    h('figure', null, artEl(p.art), h('figcaption', null, p.caption)),
    body,
    glosses.length ? h('p', { class: 'muted small' }, UI.glossaryHint) : null,
    h('div', { class: 'row tools' },
      listenBtn(() => [{ text: p.title, sel: '.story .heading' }].concat(sents.map((s, i) => ({ text: s, sel: '.story [data-s="' + i + '"]' })))),
      h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => showSources(p) }, UI.sourceBtn)),
    recBox('p' + p.n, false));
}

/* ---------- الخريطة ---------- */
function viewMap() {
  const sel = MAP_LOCATIONS.find(l => l.id === S.session.mapSel) || MAP_LOCATIONS[0];
  const L = id => MAP_LOCATIONS.find(l => l.id === id);
  const route = (ids, color, dash) => svg('path', {
    d: ids.map((id, i) => (i ? 'L' : 'M') + L(id).cx + ' ' + L(id).cy).join(' '),
    stroke: color, 'stroke-width': '2.5', 'stroke-dasharray': dash, fill: 'none', 'stroke-linecap': 'round' });
  const m = svg('svg', { viewBox: '0 0 380 290', class: 'map-svg', role: 'group', 'aria-label': 'خريطة' },
    svg('rect', { width: '380', height: '290', fill: '#B8E0F6' }),
    svg('path', { d: 'M135 20 L275 20 L335 120 L315 245 L210 275 L165 215 L130 95 Z', fill: '#F4DFB6', stroke: '#C99E67', 'stroke-width': '3' }),
    svg('path', { d: 'M40 155 L125 145 L155 245 L95 285 L35 265 Z', fill: '#EBD2A0', stroke: '#C99E67', 'stroke-width': '3' }),
    route(['makkah', 'habasha'], '#1D3557', '5,4'),
    route(['makkah', 'madinah'], '#C25934', '6,4'),
    route(['madinah', 'tabuk', 'sargh'], '#9B4121', '6,4'),
    route(['madinah', 'dumat'], '#1E5631', '4,4'));
  for (const l of MAP_LOCATIONS) {
    const g = svg('g', { class: 'pin' + (l.id === sel.id ? ' active' : '') + (S.progress.map[l.id] ? ' seen' : ''), tabindex: '0', role: 'button', 'aria-label': l.name.replace(DIAC, ''), 'data-loc': l.id },
      svg('circle', { cx: l.cx, cy: l.cy, r: '9' }),
      svg('text', { x: l.cx, y: l.cy - 14, 'text-anchor': 'middle' }, l.short));
    const pick = () => { S.session.mapSel = l.id; S.progress.map[l.id] = true; saveProgress(); TTS.stop(); renderAll(); };
    g.addEventListener('click', pick);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    m.append(g);
  }
  return h('section', { class: 'card activity' },
    h('div', { class: 'chapter' }, CHAPTERS.act),
    h('h2', { class: 'heading' }, ACTIVITY_TITLES.map),
    h('p', { class: 'muted' }, u('mapIntro')),
    h('div', { class: 'map-grid' },
      h('div', { class: 'map-box' }, m),
      h('div', { class: 'map-info' },
        h('h3', { class: 'loc-name' }, sel.name),
        h('p', { class: 'loc-desc' }, sel.desc),
        listenBtn(() => [{ text: sel.name + '. ' + sel.desc, sel: '.map-info .loc-desc' }]))));
}

/* ---------- بطاقات القيم ---------- */
function viewValues() {
  const before = badges();
  const cards = VALUES.map(v => {
    const open = S.progress.values[v.id] === true;
    const box = recBox(v.id, true);
    return h('div', { class: 'value-card' + (open ? ' open' : '') },
      h('h3', { class: 'value-title' }, h('span', { 'aria-hidden': 'true' }, v.icon), ' ', v.title),
      h('p', { class: 'value-q' }, v.q),
      h('div', { class: 'row' }, listenBtn(() => [{ text: v.q }].concat(open ? [{ text: v.a }] : []))),
      box,
      open ? h('p', { class: 'value-a' }, v.a)
           : h('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
               S.progress.values[v.id] = true; saveProgress(); renderAll(); announceBadge('values', before);
             } }, u('reveal')));
  });
  return h('section', { class: 'card activity' },
    h('div', { class: 'chapter' }, CHAPTERS.act),
    h('h2', { class: 'heading' }, ACTIVITY_TITLES.values),
    h('p', { class: 'strip' }, UI.valuesStrip),
    h('div', { class: 'values-grid' }, cards));
}

/* ---------- الاختبار: المحاولة الأولى وحدها تُحتسب ---------- */
function newQuizRound() {
  return { i: 0, first: {}, solved: {}, wrong: {}, order: QUIZ.map(q => shuffle(q.options.map((_, k) => k))), done: false };
}
function viewQuiz() {
  const pr = S.progress;
  if (!S.session.quiz) S.session.quiz = newQuizRound();
  const R = S.session.quiz;
  const sec = h('section', { class: 'card activity quiz' },
    h('div', { class: 'chapter' }, CHAPTERS.act),
    h('h2', { class: 'heading' }, ACTIVITY_TITLES.quiz),
    h('p', { class: 'muted small' }, UI.quizRule));
  if (R.done) {
    const score = QUIZ.filter(q => R.first[q.id] === q.correct).length;
    sec.append(h('div', { class: 'result' },
      h('p', { class: 'score' }, u('quizScore', { n: arNum(score) })),
      h('p', { class: 'muted' }, u('quizBest', { n: arNum(pr.quiz.best) })),
      pr.quiz.best >= 4 ? h('p', { class: 'badge-line' }, '🏅 ', badgeName('quiz')) : null,
      h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { S.session.quiz = newQuizRound(); renderAll(); } }, u('retake'))));
    return sec;
  }
  const q = QUIZ[R.i];
  const solved = R.solved[q.id];
  const opts = h('div', { class: 'options', role: 'group' });
  R.order[R.i].forEach(k => {
    const cls = 'opt' + (solved && k === q.correct ? ' right' : '') + ((R.wrong[q.id] || []).includes(k) ? ' wrong' : '');
    opts.append(h('button', { class: cls, type: 'button', disabled: solved || (R.wrong[q.id] || []).includes(k), 'data-opt': String(k), onclick: () => {
      if (!(q.id in R.first)) R.first[q.id] = k;               /* تُسجَّل المحاولة الأولى فقط */
      if (k === q.correct) { R.solved[q.id] = true; R.msg = 'ok'; }
      else { (R.wrong[q.id] = R.wrong[q.id] || []).push(k); R.msg = 'no'; }
      renderAll();
    } }, q.options[k]));
  });
  sec.append(
    h('p', { class: 'muted small', plain: T(u('qCounter', { n: arNum(R.i + 1) })) }),
    h('h3', { class: 'question' }, q.q),
    opts);
  if (R.msg === 'no' && !solved) sec.append(h('p', { class: 'feedback no', role: 'status' }, u('tryAgain')));
  if (solved) {
    sec.append(h('p', { class: 'feedback ok', role: 'status' }, u('correct')));
    if (q.explain) sec.append(h('p', { class: 'explain' }, q.explain));
    const last = R.i === QUIZ.length - 1;
    sec.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
      R.msg = null;
      if (!last) { R.i++; renderAll(); return; }
      const before = badges();
      const score = QUIZ.filter(x => R.first[x.id] === x.correct).length;
      R.done = true; pr.quiz.rounds++; pr.quiz.best = Math.max(pr.quiz.best, score);
      saveProgress(); renderAll(); announceBadge('quiz', before);
    } }, last ? UI.showResult : UI.nextQ));
  }
  return sec;
}

/* ---------- خط الزمن: خلط مضمون ألّا يكون مرتّبًا، والتواريخ تظهر بعد النجاح ---------- */
function shuffledNotSorted(n) {
  let o;
  do { o = shuffle([...Array(n).keys()]); } while (o.every((v, i) => v === i));
  return o;
}
function viewTimeline() {
  const pr = S.progress;
  const solved = !!pr.timeline.solved;
  if (!S.session.timeline) S.session.timeline = { order: solved ? TIMELINE.map((_, i) => i) : shuffledNotSorted(TIMELINE.length), marks: null };
  const st = S.session.timeline;
  const list = h('ol', { class: 'timeline' });
  st.order.forEach((idx, pos) => {
    const it = TIMELINE[idx];
    const mark = st.marks ? (st.marks[pos] ? ' right' : ' wrong') : '';
    const move = d => { const j = pos + d; [st.order[pos], st.order[j]] = [st.order[j], st.order[pos]]; st.marks = null; renderAll(); };
    list.append(h('li', { class: 'tl-item' + mark + (solved ? ' right' : ''), 'data-order': String(it.order) },
      h('span', { class: 'tl-text' }, it.text),
      solved ? h('span', { class: 'tl-when' }, it.when) : h('span', { class: 'tl-moves' },
        h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.moveUp, disabled: pos === 0, onclick: () => move(-1) }, '▲'),
        h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.moveDown, disabled: pos === st.order.length - 1, onclick: () => move(1) }, '▼'))));
  });
  const sec = h('section', { class: 'card activity' },
    h('div', { class: 'chapter' }, CHAPTERS.act),
    h('h2', { class: 'heading' }, ACTIVITY_TITLES.timeline),
    solved ? h('p', { class: 'feedback ok' }, u('timelineRight')) : h('p', { class: 'muted' }, u('timelineIntro')),
    list);
  if (!solved) {
    if (st.marks) sec.append(h('p', { class: 'feedback no', role: 'status' }, u('timelineWrong')));
    sec.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
      const marks = st.order.map((idx, pos) => TIMELINE[idx].order === pos + 1);
      if (marks.every(Boolean)) { const before = badges(); pr.timeline.solved = true; saveProgress(); renderAll(); announceBadge('timeline', before); }
      else { st.marks = marks; renderAll(); }
    } }, UI.check));
  }
  return sec;
}

/* ---------- السوق والحصالات: قسمة صحيحة والباقي للصدقة ---------- */
function splitThirds(n) { const b = Math.floor(n / 3); return { charity: b + (n - 3 * b), home: b, project: b }; }
function viewMarket() {
  const pr = S.progress;
  let n = S.session.marketN;
  const shown = pr.market.last;
  const num = h('span', { class: 'stepper-val', plain: arNum(n) });
  const set = d => { S.session.marketN = Math.min(99, Math.max(3, S.session.marketN + d)); num.textContent = arNum(S.session.marketN); };
  const jars = h('div', { class: 'jars' }, MARKET.jars.map(j => h('div', { class: 'jar', 'data-jar': j.id },
    h('div', { class: 'jar-icon', 'aria-hidden': 'true' }, j.icon),
    h('h3', { class: 'jar-title' }, j.title),
    h('p', { class: 'small muted' }, j.desc),
    h('div', { class: 'jar-count', plain: shown ? arNum(shown[j.id]) + ' 🪙' : '—' }))));
  return h('section', { class: 'card activity' },
    h('div', { class: 'chapter' }, CHAPTERS.act),
    h('h2', { class: 'heading' }, ACTIVITY_TITLES.market),
    h('blockquote', { class: 'hadith' }, MARKET.hadith,
      h('span', { class: 'cite' }, ' — ', h('span', { plain: MARKET.hadithSource[0] }), ' ', h('span', { class: 'grade grade-' + MARKET.hadithSource[1] }, GRADES[MARKET.hadithSource[1]]))),
    h('p', null, u('marketIntro')),
    h('div', { class: 'stepper' },
      h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.less, onclick: () => set(-1) }, '−'),
      num, h('span', { 'aria-hidden': 'true' }, ' 🪙 '),
      h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.more, onclick: () => set(1) }, '+'),
      h('button', { class: 'btn btn-primary', type: 'button', 'data-distribute': '', onclick: () => {
        const before = badges();
        pr.market.last = splitThirds(S.session.marketN); pr.market.done = true; saveProgress(); renderAll(); announceBadge('market', before);
      } }, u('distribute'))),
    jars,
    shown ? h('p', { class: 'muted small' }, UI.marketNote) : null,
    h('p', { class: 'note' }, MARKET.note));
}

/* ---------- بطاقات المراجعة ---------- */
function viewFlash() {
  const grid = h('div', { class: 'flash-grid' });
  FLASHCARDS.forEach(([q, a], i) => {
    const flipped = !!S.session.flipped[i];
    const card = h('button', { class: 'flash' + (flipped ? ' flipped' : ''), type: 'button', 'aria-pressed': String(flipped), onclick: () => { S.session.flipped[i] = !flipped; renderAll(); } },
      h('span', { class: 'flash-num', plain: arNum(i + 1) }),
      h('span', { class: 'flash-text' }, flipped ? a : q));
    grid.append(h('div', { class: 'flash-wrap' }, card, listenBtn(() => [{ text: flipped ? a : q }])));
  });
  return h('section', { class: 'card activity' },
    h('div', { class: 'chapter' }, CHAPTERS.act),
    h('h2', { class: 'heading' }, ACTIVITY_TITLES.flashcards),
    h('p', { class: 'muted' }, u('flashIntro')),
    grid);
}

/* ---------- الشهادة ---------- */
function viewCert() {
  const b = badges();
  const rec = storyRecordedCount();
  const list = h('ul', { class: 'badges' }, Object.keys(BADGES).map(k =>
    h('li', { class: b[k] ? 'got' : 'not', 'data-badge': k },
      h('span', { class: 'b-icon', 'aria-hidden': 'true' }, b[k] ? BADGE_ICONS[k] : '○'), ' ',
      h('span', null, badgeName(k)),
      b[k] ? null : h('span', { class: 'small muted' }, ' — ', k === 'narrator' ? u('narratorRule', { n: arNum(rec) }) : UI.notYet))));
  return h('section', { class: 'card activity' },
    h('div', { class: 'certificate' },
      h('div', { class: 'cert-frame' },
        h('h2', { class: 'cert-title' }, u('certTitle')),
        h('p', { class: 'cert-to' }, u('certTo')),
        h('p', { class: 'cert-name', plain: S.profile.name }),
        h('p', { class: 'cert-body' }, u('certBody')),
        h('p', { class: 'cert-rec' }, u('certRecorded', { n: arNum(rec) })),
        h('h3', { class: 'small strong' }, UI.badgesTitle),
        list)),
    CAP ? null : h('div', { class: 'row no-print' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => window.print() }, UI.printCert)));
}

/* =====================================================================
 * التصدير: نسخة مستقلة للقراءة فقط، لا تكتب شيئًا في تخزين الجهاز
 * ===================================================================== */
function blobToB64(blob) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = () => rej(r.error); r.readAsDataURL(blob); });
}
async function doExport(p) {
  toast(UI.exporting);
  try {
    const progress = Object.assign(freshProgress(), (await S.store.getProgress(p.id)) || {});
    const all = await S.store.getRecs(p.id);
    const recs = {};
    for (const k of Object.keys(all)) {
      if (k.endsWith('|draft')) continue;
      recs[k] = { mime: all[k].mime, duration: all[k].duration, data: await blobToB64(all[k].blob) };
    }
    const payload = { v: 1, exportedAt: new Date().toISOString(), profile: { name: p.name, gender: p.gender }, progress, recs };
    const json = JSON.stringify(payload).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    const tag = '<script type="application/json" id="export-data">' + json + '</' + 'script>\n';
    const marker = '<script id="app-' + 'main">';
    if (PRISTINE_HTML.indexOf(marker) < 0) throw new Error('marker');
    /* النسخة المصدَّرة ملف مستقل: تُنزع منها روابط تطبيق الويب حتى لا تطلب ملفات غير موجودة */
    let base = PRISTINE_HTML.replace(new RegExp('<' + '!--pwa-->[\\s\\S]*?<' + '!--/pwa-->'), '<link rel="icon" href="data:,">');
    /* وتُنزع أي سكربتات حقنتها المنصة (مثل جسر تطبيق أندرويد) قبل سكربت الكتاب، فيبقى الملف نظيفًا */
    const j0 = base.indexOf(marker);
    base = base.slice(0, j0).replace(new RegExp('<script\\b[\\s\\S]*?<' + '/script>', 'gi'), '') + base.slice(j0);
    const j = base.indexOf(marker);
    const html = base.slice(0, j) + tag + base.slice(j);
    const fname = 'دلوني-على-السوق-' + p.name.replace(/[\\/:*?"<>|\s]+/g, '-') + '.html';
    if (CAP && CAP_PLUGINS.Filesystem && CAP_PLUGINS.Share) {
      /* متصفح أندرويد المضمَّن لا يدعم تنزيل الملفات؛ يُكتب الملف ثم يُفتح خيار المشاركة والحفظ */
      const w = await CAP_PLUGINS.Filesystem.writeFile({ path: fname, data: html, directory: 'CACHE', encoding: 'utf8' });
      await CAP_PLUGINS.Share.share({ title: fname, files: [w.uri] });
      toast(UI.exportDone, 'ok');
      return;
    }
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: fname });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    toast(UI.exportDone + ' ' + UI.iosNotice, 'ok', 10000);
  } catch (e) {
    if (e && /cancel/i.test(String(e.message || e))) return;   /* أغلق المستخدم نافذة المشاركة */
    toast(UI.exportFail, 'error');
  }
}
function b64ToBlob(b64, mime) {
  const bin = atob(b64); const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return new Blob([u8], { type: mime });
}

/* =====================================================================
 * الإقلاع
 * ===================================================================== */
async function boot() {
  const notice = document.getElementById('static-notice');
  if (notice) notice.hidden = true;           /* يبقى ظاهرًا حيث لا يعمل JS (مثل معاينة iOS) */
  document.getElementById('app').hidden = false;

  const exp = document.getElementById('export-data');
  if (exp) {
    S.readonly = true;
    let data;
    try { data = JSON.parse(exp.textContent); } catch (e) { data = null; }
    const pid = 'export';
    S.store = new MemStore(m => {
      if (!data) return;
      m.p[pid] = { id: pid, name: String(data.profile.name || ''), gender: data.profile.gender === 'f' ? 'f' : 'm', created: 0 };
      m.g[pid] = data.progress || freshProgress();
      m.r[pid] = {};
      for (const k of Object.keys(data.recs || {})) {
        const r = data.recs[k];
        m.r[pid][k] = { blob: b64ToBlob(r.data, r.mime), mime: r.mime, duration: r.duration };
      }
    }, true);
  } else {
    try {
      if (!('indexedDB' in window)) throw new Error('no idb');
      S.store = await new IDBStore().open();
    } catch (e) {
      S.storageOk = false; S.store = new MemStore(null, false);
    }
    if (navigator.storage && navigator.storage.persisted) {
      try { S.persistent = await navigator.storage.persisted(); } catch (e) { S.persistent = null; }
    }
  }
  S.profiles = await S.store.getProfiles().catch(() => []);
  if (S.readonly && S.profiles[0]) await openProfile(S.profiles[0]); else renderAll();

  document.addEventListener('keydown', e => {
    if (!S.profile || e.target.closest('input, textarea, [role=dialog]') || !document.getElementById('modal-root').hidden) return;
    if (e.key === 'ArrowLeft') go(S.page + 1);
    if (e.key === 'ArrowRight') go(S.page - 1);
  });
  /* إخفاء الصفحة أثناء التسجيل يحفظه مسوّدة */
  document.addEventListener('visibilitychange', () => { if (document.hidden) { TTS.stop(); Rec.stop(true); } });
  window.addEventListener('pagehide', () => { Rec.stop(true); });
  registerSW();
}
/* عامل الخدمة: في نسخة التطبيق فقط، وعلى https أو localhost، ولا يُسجَّل في النسخة المصدَّرة */
function registerSW() {
  if (NATIVE || S.readonly || !('serviceWorker' in navigator) || !document.querySelector('link[rel="manifest"]')) return;
  const okOrigin = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!okOrigin) return;
  navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(() => { /* الكتاب يعمل بدونه */ });
}
boot();
