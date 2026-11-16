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
  gradeLabel: 'الدَّرَجَةُ:',
  myVoice: 'صَوْتِي',
  familyVoice: 'صَوْتُ أَهْلِي',
  recShort: '🎙 تَسْجِيلٌ',
  recShortAgain: '🎙 إِعَادَةُ التَّسْجِيلِ',
  parentBtn: '🔒 لِلْوَالِدَيْنِ',
  parentTitle: 'لِلْوَالِدَيْنِ',
  exitParent: 'خُرُوجٌ',
  addInParent: 'إِضَافَةُ الْأَطْفَالِ وَحَذْفُهُمْ مِنْ «لِلْوَالِدَيْنِ».',
  pinSetTitle: 'إِنْشَاءُ رَمْزِ الْوَالِدَيْنِ',
  pinSetIntro: 'اخْتَارُوا رَمْزًا مِنْ أَرْبَعَةِ أَرْقَامٍ لَا يَعْرِفُهُ الْأَطْفَالُ.',
  pinEnterTitle: 'رَمْزُ الْوَالِدَيْنِ',
  pinLabel: 'الرَّمْزُ',
  pinConfirm: 'تَأْكِيدُ الرَّمْزِ',
  pinInvalid: 'الرَّمْزُ أَرْبَعَةُ أَرْقَامٍ.',
  pinMismatch: 'الرَّمْزَانِ غَيْرُ مُتَطَابِقَيْنِ.',
  pinWrong: 'الرَّمْزُ غَيْرُ صَحِيحٍ.',
  pinLocked: 'مُحَاوَلَاتٌ كَثِيرَةٌ؛ انْتَظِرُوا نِصْفَ دَقِيقَةٍ.',
  pinChanged: 'تَغَيَّرَ الرَّمْزُ.',
  enter: 'دُخُولٌ',
  save: 'حِفْظٌ',
  changePin: '🔑 تَغْيِيرُ الرَّمْزِ',
  narrateBtn: '🎙 تَسْجِيلُ الْكِتَابِ بِصَوْتِي',
  narrateIntro: 'سَجِّلُوا نُصُوصَ الْكِتَابِ بِأَصْوَاتِكُمْ؛ يَسْمَعُهَا كُلُّ طِفْلٍ بِزِرِّ «صَوْتُ أَهْلِي». وَمَا لَمْ يُسَجَّلْ يُقْرَأُ آلِيًّا.',
  narrateProgress: 'الْمُسَجَّلُ: {n} / {t}',
  narratorBanner: '🎙 تَسْجِيلُ صَوْتِ الْأَهْلِ',
  finishNarrate: 'إِنْهَاءٌ',
  narrCertNote: 'الشَّهَادَةُ تَحْمِلُ اسْمَ الطِّفْلِ، فَتُقْرَأُ آلِيًّا وَلَا تُسَجَّلُ.',
  childrenTitle: 'الْأَطْفَالُ',
  deleteChildRecs: ['🗑 حَذْفُ تَسْجِيلَاتِهِ', '🗑 حَذْفُ تَسْجِيلَاتِهَا'],
  deleteRecsConfirm: 'سَتُحْذَفُ تَسْجِيلَاتُ {name} كُلُّهَا نِهَائِيًّا. هَلْ أَنْتَ مُتَأَكِّدٌ؟',
  recsDeleted: 'حُذِفَتِ التَّسْجِيلَاتُ.',
  backupTitle: 'النَّسْخُ الِاحْتِيَاطِيُّ',
  backupIntro: 'نُسْخَةٌ كَامِلَةٌ: الْأَطْفَالُ وَتَقَدُّمُهُمْ وَتَسْجِيلَاتُهُمْ وَصَوْتُ الْأَهْلِ. تُسْتَعَادُ عَلَى هَذَا الْجِهَازِ أَوْ عَلَى غَيْرِهِ.',
  backupBtn: '⬇ حِفْظُ نُسْخَةٍ احْتِيَاطِيَّةٍ',
  backupDone: 'جُهِّزَتِ النُّسْخَةُ الِاحْتِيَاطِيَّةُ.',
  restoreBtn: '⬆ اسْتِعَادَةُ نُسْخَةٍ',
  restoreConfirm: 'سَتُضَافُ بَيَانَاتُ النُّسْخَةِ، وَيُسْتَبْدَلُ مَا يُطَابِقُهَا. هَلْ تُتَابِعُونَ؟',
  restoreDone: 'اسْتُعِيدَتِ النُّسْخَةُ.',
  restoreFail: 'الْمَلَفُّ لَيْسَ نُسْخَةً احْتِيَاطِيَّةً صَالِحَةً.'
};
const PARENT_ID = '_parent';

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
  profiles: [], profile: null, progress: null, recs: {}, parentRecs: {}, parentMode: false, narrator: false,
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
    const r = indexedDB.open(DB_NAME, 2);
    r.onupgradeneeded = e => {
      const db = r.result;
      if (e.oldVersion < 1) {
        db.createObjectStore('profiles', { keyPath: 'id' });
        db.createObjectStore('progress');
        db.createObjectStore('recs');
      }
      if (e.oldVersion < 2) db.createObjectStore('meta');   /* الرمز السري وإعدادات الأهل */
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
  getMeta(k) { return this._r('meta', s => s.get(k)); }
  putMeta(k, v) { return this._w('meta', s => s.put(v, k)); }
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
  constructor(seed, readonly) { this.p = {}; this.g = {}; this.r = {}; this.m = {}; this.ro = !!readonly; if (seed) seed(this); }
  async getMeta(k) { return this.m[k]; }
  async putMeta(k, v) { if (!this.ro) this.m[k] = v; }
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
 * النطق: القراءة الآلية جملةً جملة، أو تشغيل تسجيل (صوت الطفل أو صوت الأهل)
 * ===================================================================== */
const TTS = {
  voiceCache: undefined,
  plugin: () => CAP_PLUGINS.TextToSpeech || null,
  supported() { return CAP ? !!this.plugin() : ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window); },
  async voice() {
    if (this.voiceCache !== undefined) return this.voiceCache;
    let vs = speechSynthesis.getVoices();
    if (!vs.length) {
      await new Promise(res => {
        const t = setTimeout(res, 1500);
        speechSynthesis.addEventListener('voiceschanged', () => { clearTimeout(t); res(); }, { once: true });
      });
      vs = speechSynthesis.getVoices();
    }
    this.voiceCache = vs.find(v => /^ar[-_]SA/i.test(v.lang)) || vs.find(v => /^ar/i.test(v.lang)) || null;
    if (!this.voiceCache && !S.warnedVoice) { S.warnedVoice = true; toast(UI.noArVoice); }
    return this.voiceCache;
  },
  cancel() {
    if (CAP) { const pl = this.plugin(); if (pl) pl.stop().catch(() => {}); }
    else if ('speechSynthesis' in window) speechSynthesis.cancel();
  },
  /* نطق نص واحد؛ يعيد 'fail' عند التعذر */
  async say(text) {
    if (!this.supported()) { toast(UI.noTTS, 'error'); return 'fail'; }
    const t = speechText(text);
    if (CAP) {
      try { await this.plugin().speak({ text: t, lang: 'ar-SA', rate: 0.9, pitch: 1.0, volume: 1.0, category: 'playback' }); return 'ok'; }
      catch (e) { if (!S.warnedVoice) { S.warnedVoice = true; toast(UI.noArVoice, 'error'); } return 'fail'; }
    }
    const voice = await this.voice();
    return new Promise(res => {
      const ut = new SpeechSynthesisUtterance(t);
      ut.lang = voice ? voice.lang : 'ar-SA';
      if (voice) ut.voice = voice;
      ut.rate = 0.85;
      ut.onend = () => res('ok'); ut.onerror = () => res('ok');
      speechSynthesis.speak(ut);
    });
  }
};

/* مشغّل واحد للكتاب كله: تسلسل من {text, sel, rec?}؛ الضغط على الزر نفسه أثناء التشغيل يوقفه */
const Player = {
  token: 0, audio: null, btn: null,
  active() { return !!this.btn || !!this.audio; },
  stop() {
    this.token++;
    if (this.audio) { try { this.audio.pause(); } catch (e) { /* */ } this.audio = null; }
    TTS.cancel();
    document.querySelectorAll('.speaking').forEach(e => e.classList.remove('speaking'));
    document.querySelectorAll('.spk.playing').forEach(b => b.classList.remove('playing'));
    this.btn = null;
  },
  highlight(sel) {
    document.querySelectorAll('.speaking').forEach(e => e.classList.remove('speaking'));
    const el = sel && document.querySelector(sel);
    if (el) { el.classList.add('speaking'); el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  },
  playRec(rec) {
    return new Promise(res => {
      const a = new Audio(recUrl(rec));
      this.audio = a;
      a.onended = () => res('ok');
      a.onerror = () => res('fail');
      const p = a.play(); if (p && p.catch) p.catch(() => res('fail'));
    });
  },
  async play(seq, btn) {
    const toggleOff = btn && btn === this.btn;
    this.stop();
    if (toggleOff) return;
    const my = ++this.token;
    this.btn = btn || null;
    if (btn) btn.classList.add('playing');
    for (const it of seq) {
      if (my !== this.token) return;
      this.highlight(it.sel);
      const r = it.rec ? await this.playRec(it.rec) : await TTS.say(it.text);
      if (r === 'fail') break;
    }
    if (my === this.token) this.stop();
  }
};

/* ---------- الوحدات النصية: كل نص قابل للاستماع له مفتاح ---------- */
/* unit = { key, text, sel, sentences?, ttsOnly? }
 * key: مفتاح التسجيل (صوت الأهل لكل الوحدات، وصوت الطفل للغلاف ونصوص القصة فقط)
 * sentences: للقراءة الآلية جملةً جملة مع إبراز كل جملة */
const UNITS = new Map();
function childVoiceKey(key) { return key === 'cover' || /^p\d+$/.test(key); }
function ttsSeq(unit) { return unit.sentences && unit.sentences.length ? unit.sentences : [{ text: unit.text, sel: unit.sel }]; }
function voiceBar(unit) {
  const bar = h('span', { class: 'vbar' });
  if (unit.key) { bar.dataset.unit = unit.key; UNITS.set(unit.key, unit); }
  fillVoiceBar(bar, unit);
  return bar;
}
function fillVoiceBar(bar, unit) {
  bar.textContent = '';
  const child = !S.narrator && unit.key && childVoiceKey(unit.key) ? S.recs[unit.key] : null;
  const parent = !unit.ttsOnly && unit.key ? S.parentRecs[unit.key] : null;
  const mk = (label, aria, cls, seqFn) => {
    const b = h('button', { class: 'spk ' + cls, type: 'button', 'aria-label': aria }, label);
    b.addEventListener('click', e => { e.stopPropagation(); Player.play(seqFn(), b); });
    return b;
  };
  if (!child && !parent) { bar.append(mk('🔊', 'استمع', 'spk-icon', () => ttsSeq(unit))); return; }
  if (child) bar.append(mk(['🔊 ', UI.myVoice], 'صوتي', 'spk-chip', () => [{ text: unit.text, sel: unit.sel, rec: child }]));
  if (parent) bar.append(mk(['🔊 ', UI.familyVoice], 'صوت أهلي', 'spk-chip spk-family', () => [{ text: unit.text, sel: unit.sel, rec: parent }]));
}
/* عنصر نصي مع زر الاستماع؛ وفي وضع تسجيل الأهل يُضاف تحته صندوق تسجيل */
function voiced(el, unit) {
  el.append(' ', voiceBar(unit));
  if (S.narrator && unit.key && !unit.ttsOnly) return [el, recBox(unit.key, false, true)];
  return el;
}
/* أفضل مصدر للتشغيل التلقائي: صوت الأهل، وإلا القراءة الآلية */
function autoSeq(units) {
  const out = [];
  for (const u2 of units) {
    const parent = u2.key && S.parentRecs[u2.key];
    if (parent) out.push({ text: u2.text, sel: u2.sel, rec: parent }); else out.push(...ttsSeq(u2));
  }
  return out;
}
function refreshVoiceBars() {
  document.querySelectorAll('.vbar[data-unit]').forEach(b => { const unit = UNITS.get(b.dataset.unit); if (unit) fillVoiceBar(b, unit); });
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
    Player.stop();
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
function recBox(key, optional, compact) {
  const box = h('div', { class: 'rec-box' + (compact ? ' compact' : ''), 'data-rec-key': key });
  if (optional) box.dataset.optional = '1';
  if (compact) box.dataset.compact = '1';
  fillRecBox(box, key, optional, compact);
  return box;
}
function fillRecBox(box, key, optional, compact) {
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
      const b = h('button', { class: 'btn btn-rec', type: 'button', disabled: busy || !Rec.supported() }, compact ? (rec ? UI.recShortAgain : UI.recShort) : (rec ? u('recordAgain') : u('record')));
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
  a.addEventListener('play', () => Player.stop());
  return a;
}
function refreshRecUI() {
  document.querySelectorAll('.rec-box').forEach(b => fillRecBox(b, b.dataset.recKey, b.dataset.optional === '1', b.dataset.compact === '1'));
  refreshVoiceBars();
  const c = document.querySelector('[data-narr-count]');
  if (c && S.narrator) { const keys = allNarrationKeys(); c.textContent = T(u('narrateProgress', { n: arNum(keys.filter(k => S.parentRecs[k]).length), t: arNum(keys.length) })); }
}

/* =====================================================================
 * النوافذ المنبثقة
 * ===================================================================== */
function modal(title, ...body) {
  const root = document.getElementById('modal-root');
  const prevFocus = document.activeElement;
  const close = () => { Player.stop(); root.textContent = ''; root.hidden = true; document.removeEventListener('keydown', onKey); if (prevFocus && prevFocus.focus) prevFocus.focus(); };
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
  const unit = { key: 'gl:' + g.match, text: g.title + '. ' + g.meaning, sel: '.modal .gloss-meaning' };
  modal(g.title, voiced(h('p', { class: 'gloss-meaning' }, g.meaning), unit));
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
 * قائمة كل النصوص التي يسجّلها الأهل (لعدّاد التقدّم في وضع التسجيل)
 * ===================================================================== */
function allNarrationKeys() {
  const k = ['cover'];
  for (const p of STORY_PAGES) k.push('p' + p.n + ':t', 'p' + p.n, 'p' + p.n + ':c');
  for (const a of Object.keys(ACTIVITY_TITLES)) if (a !== 'certificate') k.push('act:' + a);
  for (const l of MAP_LOCATIONS) k.push('map:' + l.id);
  k.push('values:strip');
  for (const v of VALUES) k.push(v.id + ':q', v.id + ':a');
  for (const q of QUIZ) { k.push(q.id); q.options.forEach((_, i) => k.push(q.id + ':o' + i)); if (q.explain) k.push(q.id + ':e'); }
  for (const t of TIMELINE) k.push('tl:' + t.order);
  k.push('mk:h'); for (const j of MARKET.jars) k.push('mk:' + j.id); k.push('mk:n');
  FLASHCARDS.forEach((_, i) => k.push('fc' + i + ':q', 'fc' + i + ':a'));
  for (const g of GLOSSARY) k.push('gl:' + g.match);
  return k;
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
function announceBadge(k, before) { if (!S.narrator && !before[k] && badges()[k]) toast(u('earned', { badge: badgeName(k) }), 'ok'); }

function renderTop() {
  const top = document.getElementById('topbar');
  top.textContent = '';
  if (!S.profile) {
    top.append(h('div', { class: 'brand-wrap' }, h('h1', { class: 'brand' }, UI.appTitle)));
    if (!S.readonly) top.append(h('button', { class: 'btn btn-ghost btn-small', type: 'button', 'data-parent-btn': '', onclick: S.parentMode ? exitParent : enterParent },
      S.parentMode ? UI.exitParent : UI.parentBtn));
    return;
  }
  top.append(
    h('button', { class: 'btn btn-ghost btn-small', type: 'button', onclick: toProfiles }, '🏠 ', S.narrator ? UI.parentTitle : UI.readers),
    h('div', { class: 'brand-wrap' }, h('h1', { class: 'brand' }, UI.appTitle),
      S.narrator ? h('span', { class: 'who' }, UI.narratorBanner) : h('span', { class: 'who', plain: S.profile.name })),
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
function narratorStrip() {
  const keys = allNarrationKeys();
  const done = keys.filter(k => S.parentRecs[k]).length;
  return h('div', { class: 'banner narr' },
    h('span', null, UI.narratorBanner, ' — ', h('span', { 'data-narr-count': '', plain: T(u('narrateProgress', { n: arNum(done), t: arNum(keys.length) })) })),
    h('button', { class: 'btn btn-small', type: 'button', onclick: toProfiles }, UI.finishNarrate));
}
function renderAll() {
  UNITS.clear();
  renderTop(); renderPager();
  const v = document.getElementById('view');
  v.textContent = '';
  if (S.readonly) v.append(h('div', { class: 'banner' }, UI.readonlyBanner));
  if (!S.storageOk) v.append(h('div', { class: 'banner warn' }, UI.noStorage));
  if (!S.profile) { v.append(S.parentMode ? viewParent() : viewProfiles()); return; }
  if (S.narrator) v.append(narratorStrip());
  const sc = SCREENS[S.page];
  const fn = { cover: viewCover, story: viewStory, map: viewMap, values: viewValues, quiz: viewQuiz, timeline: viewTimeline, market: viewMarket, flashcards: viewFlash, certificate: viewCert }[sc.kind];
  v.append(fn(sc));
}
async function go(n) {
  if (n < 0 || n >= SCREENS.length || n === S.page) return;
  Player.stop();
  await Rec.stop(true);         /* مغادرة الصفحة أثناء التسجيل تحفظه مسوّدة */
  S.page = n; S.progress.page = n; saveProgress();
  renderAll();
  window.scrollTo(0, 0);
  const v = document.getElementById('view'); v.focus({ preventScroll: true });
}
async function toProfiles() {
  Player.stop(); await Rec.stop(true);
  const wasNarrator = S.narrator;
  S.profile = null; S.progress = null; S.recs = {}; S.session = null; S.narrator = false;
  for (const url of objUrls.values()) URL.revokeObjectURL(url);
  objUrls.clear();
  S.parentMode = wasNarrator;
  if (!S.readonly) S.profiles = await S.store.getProfiles().catch(() => S.profiles);
  renderAll();
}
async function loadParentRecs() {
  const all = await S.store.getRecs(PARENT_ID).catch(() => ({}));
  const out = {};
  for (const k of Object.keys(all)) if (!k.endsWith('|draft')) out[k] = all[k];
  return out;
}
async function openProfile(p) {
  S.profile = p; S.parentMode = false; S.narrator = false;
  S.progress = Object.assign(freshProgress(), (await S.store.getProgress(p.id).catch(() => null)) || {});
  S.recs = await S.store.getRecs(p.id).catch(() => ({}));
  S.parentRecs = await loadParentRecs();
  S.session = { quiz: null, timeline: null, mapSel: 'makkah', flipped: {}, marketN: 10 };
  S.page = S.readonly ? 0 : Math.min(S.progress.page || 0, SCREENS.length - 1);
  renderAll();
  /* الغلاف يُقرأ تلقائيًا عند فتح الكتاب */
  if (S.page === 0) setTimeout(() => { if (S.profile === p && S.page === 0 && !Player.active()) Player.play(autoSeq([coverUnit()])); }, 500);
}
async function openNarrator() {
  S.profile = { id: PARENT_ID, name: '', gender: 'm' }; S.parentMode = false; S.narrator = true;
  S.progress = Object.assign(freshProgress(), (await S.store.getProgress(PARENT_ID).catch(() => null)) || {});
  S.recs = await S.store.getRecs(PARENT_ID).catch(() => ({}));
  S.parentRecs = S.recs;          /* في وضع التسجيل: تسجيلات الأهل هي تسجيلات هذه الجلسة */
  S.session = { quiz: null, timeline: null, mapSel: 'makkah', flipped: {}, marketN: 10 };
  S.page = Math.min(S.progress.page || 0, SCREENS.length - 1);
  renderAll();
}

/* ---------- شاشة القرّاء (للطفل) ---------- */
function addChildForm(after) {
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
    await after(p);
  } },
    h('h3', { class: 'small strong' }, UI.addChild),
    h('label', { class: 'field' }, h('span', null, UI.nameLabel), name),
    h('div', { class: 'row' }, rb('m', UI.boy, true), rb('f', UI.girl, false)),
    h('button', { class: 'btn btn-primary', type: 'submit' }, UI.add));
  return form;
}
function viewProfiles() {
  const wrap = h('section', { class: 'profiles card' }, h('h2', { class: 'heading' }, UI.whoReads));
  const list = h('div', { class: 'profile-list' });
  const sorted = S.profiles.slice().sort((a, b) => a.created - b.created);
  for (const p of sorted) {
    list.append(h('div', { class: 'profile-row' },
      h('button', { class: 'profile-btn', type: 'button', onclick: () => openProfile(p) },
        h('span', { class: 'avatar', 'aria-hidden': 'true' }, p.gender === 'f' ? '🌸' : '⭐'),
        h('span', { class: 'pname', plain: p.name }))));
  }
  wrap.append(list);
  /* أول تشغيل: يُضاف الطفل الأول من هنا؛ وبعد ذلك من وضع الوالدين */
  if (!S.readonly && !S.profiles.length) wrap.append(addChildForm(p => openProfile(p)));
  else if (!S.readonly) wrap.append(h('p', { class: 'muted small' }, UI.addInParent));
  return wrap;
}

/* =====================================================================
 * وضع الوالدين: رمز سري، وتسجيل الكتاب بصوت الأهل، وإدارة الأطفال، والنسخ الاحتياطي
 * ===================================================================== */
const PIN_TRIES = { n: 0, until: 0 };
async function sha256(s) {
  if (window.crypto && crypto.subtle) {
    const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
    return Array.from(new Uint8Array(d)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0;   /* احتياط نادر */
  return 'h' + x;
}
function pinField(id, label) {
  return h('label', { class: 'field' }, h('span', null, label),
    h('input', { id, type: 'password', inputmode: 'numeric', autocomplete: 'off', maxlength: '4', pattern: '[0-9]{4}', class: 'pin' }));
}
const toWestern = s => s.replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
async function enterParent() {
  const meta = await S.store.getMeta('pin').catch(() => null);
  if (!meta) {
    const close = modal(UI.pinSetTitle,
      h('p', { class: 'muted small' }, UI.pinSetIntro),
      pinField('pin1', UI.pinLabel), pinField('pin2', UI.pinConfirm),
      h('button', { class: 'btn btn-primary', type: 'button', 'data-pin-save': '', onclick: async () => {
        const a = toWestern(document.getElementById('pin1').value), b = toWestern(document.getElementById('pin2').value);
        if (!/^\d{4}$/.test(a)) { toast(UI.pinInvalid, 'error'); return; }
        if (a !== b) { toast(UI.pinMismatch, 'error'); return; }
        const salt = uid();
        const hash = await sha256(salt + a);
        if (!(await safe(() => S.store.putMeta('pin', { salt, hash })))) return;
        close(); S.parentMode = true; renderAll();
      } }, UI.save));
    document.getElementById('pin1').focus();
    return;
  }
  const close = modal(UI.pinEnterTitle, pinField('pin1', UI.pinLabel),
    h('button', { class: 'btn btn-primary', type: 'button', 'data-pin-enter': '', onclick: async () => {
      if (Date.now() < PIN_TRIES.until) { toast(UI.pinLocked, 'error'); return; }
      const a = toWestern(document.getElementById('pin1').value);
      if (await sha256(meta.salt + a) === meta.hash) { PIN_TRIES.n = 0; close(); S.parentMode = true; renderAll(); return; }
      if (++PIN_TRIES.n >= 5) { PIN_TRIES.n = 0; PIN_TRIES.until = Date.now() + 30000; toast(UI.pinLocked, 'error'); }
      else toast(UI.pinWrong, 'error');
      document.getElementById('pin1').value = '';
    } }, UI.enter));
  const f = document.getElementById('pin1');
  f.focus();
  f.addEventListener('keydown', e => { if (e.key === 'Enter') document.querySelector('[data-pin-enter]').click(); });
}
function exitParent() { S.parentMode = false; renderAll(); }
async function changePin() {
  const close = modal(UI.changePin.replace('🔑 ', ''), pinField('pin1', UI.pinLabel), pinField('pin2', UI.pinConfirm),
    h('button', { class: 'btn btn-primary', type: 'button', onclick: async () => {
      const a = toWestern(document.getElementById('pin1').value), b = toWestern(document.getElementById('pin2').value);
      if (!/^\d{4}$/.test(a)) { toast(UI.pinInvalid, 'error'); return; }
      if (a !== b) { toast(UI.pinMismatch, 'error'); return; }
      const salt = uid();
      const hash = await sha256(salt + a);
      if (await safe(() => S.store.putMeta('pin', { salt, hash }))) { close(); toast(UI.pinChanged, 'ok'); }
    } }, UI.save));
  document.getElementById('pin1').focus();
}
function viewParent() {
  const keys = allNarrationKeys();
  const sec = h('section', { class: 'card parent' }, h('h2', { class: 'heading' }, UI.parentTitle));
  /* ١. تسجيل الكتاب بصوت الأهل */
  const narr = h('div', { class: 'parent-block' },
    h('h3', { class: 'small strong' }, UI.narrateBtn.replace('🎙 ', '')),
    h('p', { class: 'muted small' }, UI.narrateIntro),
    h('p', { class: 'small', 'data-narr-total': '' }),
    h('button', { class: 'btn btn-primary', type: 'button', 'data-narrate': '', onclick: openNarrator }, UI.narrateBtn));
  loadParentRecs().then(r => {
    const el = narr.querySelector('[data-narr-total]');
    if (el) el.textContent = T(u('narrateProgress', { n: arNum(keys.filter(k => r[k]).length), t: arNum(keys.length) }));
  });
  sec.append(narr);
  /* ٢. الأطفال */
  const kids = h('div', { class: 'parent-block' }, h('h3', { class: 'small strong' }, UI.childrenTitle));
  for (const p of S.profiles.slice().sort((a, b) => a.created - b.created)) {
    const gi2 = p.gender === 'f' ? 1 : 0;
    kids.append(h('div', { class: 'profile-row' },
      h('span', { class: 'pname strong' }, h('span', { 'aria-hidden': 'true' }, p.gender === 'f' ? '🌸 ' : '⭐ '), h('span', { plain: p.name })),
      h('div', { class: 'profile-tools' },
        h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => doExport(p) }, UI.exportBtn),
        h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => deleteChildRecs(p) }, UI.deleteChildRecs[gi2]),
        h('button', { class: 'btn btn-small btn-danger', type: 'button', onclick: () => deleteProfile(p) }, UI.deleteProfile))));
  }
  kids.append(addChildForm(async () => { renderAll(); }));
  sec.append(kids);
  /* ٣. النسخ الاحتياطي */
  const fileIn = h('input', { type: 'file', accept: '.json,application/json', hidden: true, 'data-restore-input': '' });
  fileIn.addEventListener('change', () => { if (fileIn.files[0]) restoreBackup(fileIn.files[0]); fileIn.value = ''; });
  sec.append(h('div', { class: 'parent-block' },
    h('h3', { class: 'small strong' }, UI.backupTitle),
    h('p', { class: 'muted small' }, UI.backupIntro),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', 'data-backup': '', onclick: doBackup }, UI.backupBtn),
      h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => fileIn.click() }, UI.restoreBtn),
      fileIn),
    !NATIVE && S.persistent === false ? h('p', { class: 'muted small' }, UI.notPersistent) : null));
  /* ٤. الرمز */
  sec.append(h('div', { class: 'parent-block row' },
    h('button', { class: 'btn btn-ghost', type: 'button', onclick: changePin }, UI.changePin),
    h('button', { class: 'btn btn-ghost', type: 'button', onclick: exitParent }, UI.exitParent)));
  return sec;
}
async function deleteProfile(p) {
  const msg = UI.deleteProfileConfirm[p.gender === 'f' ? 1 : 0].split('{name}').join(p.name);
  if (!confirm(msg)) return;
  if (await safe(() => S.store.deleteProfile(p.id))) { S.profiles = S.profiles.filter(x => x.id !== p.id); renderAll(); }
}
async function deleteChildRecs(p) {
  if (!confirm(UI.deleteRecsConfirm.split('{name}').join(p.name))) return;
  const all = await S.store.getRecs(p.id).catch(() => ({}));
  for (const k of Object.keys(all)) await safe(() => S.store.delRec(p.id, k));
  toast(UI.recsDeleted, 'ok');
}

/* ---------- الغلاف ---------- */
function coverUnit() { return { key: 'cover', text: COVER.title + '. ' + COVER.subtitle, sel: '.cover .cover-text' }; }
function viewCover() {
  const unit = coverUnit();
  return h('section', { class: 'card cover' },
    artEl('cover'),
    voiced(h('div', { class: 'cover-text' },
      h('h2', { class: 'cover-title' }, COVER.title),
      h('p', { class: 'cover-sub' }, COVER.subtitle)), unit),
    S.narrator ? null : h('p', { class: 'welcome' }, u('welcome', { name: S.profile.name })),
    h('button', { class: 'btn btn-primary btn-big', type: 'button', onclick: () => go(1) }, u('start')),
    S.narrator ? null : recBox('cover', true));
}

/* ---------- صفحة القصة ---------- */
function viewStory({ p }) {
  const sents = sentences(p.text);
  const used = new Set(), glosses = glossFor(p.n);
  const body = h('div', { class: 'story-text', lang: 'ar' });
  sents.forEach((s, i) => { body.append(h('span', { class: 'sent', 'data-s': String(i) }, sentenceNodes(s, glosses, used)), ' '); });
  const bodyUnit = { key: 'p' + p.n, text: p.text, sel: '.story .story-text', sentences: sents.map((s, i) => ({ text: s, sel: '.story [data-s="' + i + '"]' })) };
  return h('article', { class: 'card story' },
    h('div', { class: 'chapter' }, CHAPTERS[p.chapter]),
    voiced(h('h2', { class: 'heading' }, h('span', { class: 'pnum', plain: arNum(p.n) }), ' ', p.title), { key: 'p' + p.n + ':t', text: p.title, sel: '.story .heading' }),
    h('figure', null, sceneEl(p), voiced(h('figcaption', null, p.caption), { key: 'p' + p.n + ':c', text: p.caption, sel: '.story figcaption' })),
    voiced(body, bodyUnit),
    glosses.length ? h('p', { class: 'muted small' }, UI.glossaryHint) : null,
    h('div', { class: 'row tools' },
      h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => showSources(p) }, UI.sourceBtn)),
    S.narrator ? null : recBox('p' + p.n, false));
}

/* ---------- الخريطة ---------- */
function activityHead(k, extra) {
  return [h('div', { class: 'chapter' }, CHAPTERS.act),
    voiced(h('h2', { class: 'heading' }, ACTIVITY_TITLES[k]), { key: 'act:' + k, text: ACTIVITY_TITLES[k], sel: '.activity .heading' }),
    activityArt(k), extra || null];
}
function instr(text, cls) { return voiced(h('p', { class: cls || 'muted instr' }, text), { key: null, text, sel: null, ttsOnly: true }); }
function viewMap() {
  const sel = MAP_LOCATIONS.find(l => l.id === S.session.mapSel) || MAP_LOCATIONS[0];
  const L = id => MAP_LOCATIONS.find(l => l.id === id);
  const route = (ids, color, dash) => svg('path', {
    d: ids.map((id, i) => (i ? 'L' : 'M') + L(id).cx + ' ' + L(id).cy).join(' '),
    stroke: color, 'stroke-width': '2.5', 'stroke-dasharray': dash, fill: 'none', 'stroke-linecap': 'round', class: 'route' });
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
    const pick = () => {
      S.session.mapSel = l.id; S.progress.map[l.id] = true; saveProgress(); Player.stop(); renderAll();
      if (!S.narrator) Player.play(autoSeq([{ key: 'map:' + l.id, text: l.name + '. ' + l.desc, sel: '.map-info .loc-body' }]));
    };
    g.addEventListener('click', pick);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    m.append(g);
  }
  const ph = PLACE_PHOTOS[sel.id];
  const info = h('div', { class: 'map-info' },
    ph ? photoEl(ph) : null,
    voiced(h('div', { class: 'loc-body' }, h('h3', { class: 'loc-name' }, sel.name), h('p', { class: 'loc-desc' }, sel.desc)),
      { key: 'map:' + sel.id, text: sel.name + '. ' + sel.desc, sel: '.map-info .loc-body' }));
  const sec = h('section', { class: 'card activity' },
    h('div', { class: 'chapter' }, CHAPTERS.act),
    voiced(h('h2', { class: 'heading' }, ACTIVITY_TITLES.map), { key: 'act:map', text: ACTIVITY_TITLES.map, sel: '.activity .heading' }),
    instr(u('mapIntro')),
    h('div', { class: 'map-grid' }, h('div', { class: 'map-box' }, m), info));
  if (S.narrator) {
    /* في وضع التسجيل تُعرض المواضع كلها ليُسجَّل كل منها */
    sec.append(h('div', { class: 'narr-list' }, MAP_LOCATIONS.filter(l => l.id !== sel.id).map(l =>
      voiced(h('p', { class: 'loc-desc', 'data-loc-text': l.id }, h('strong', null, l.name), '. ', l.desc), { key: 'map:' + l.id, text: l.name + '. ' + l.desc, sel: '[data-loc-text="' + l.id + '"]' }))));
  }
  return sec;
}

/* ---------- بطاقات القيم ---------- */
function viewValues() {
  const before = badges();
  const cards = VALUES.map(v => {
    const open = S.narrator || S.progress.values[v.id] === true;
    const qSel = '[data-vq="' + v.id + '"]', aSel = '[data-va="' + v.id + '"]';
    return h('div', { class: 'value-card' + (open ? ' open' : '') },
      h('h3', { class: 'value-title' }, h('span', { 'aria-hidden': 'true' }, v.icon), ' ', v.title),
      voiced(h('p', { class: 'value-q', 'data-vq': v.id }, v.q), { key: v.id + ':q', text: v.q, sel: qSel }),
      S.narrator ? null : recBox(v.id, true),
      open ? voiced(h('p', { class: 'value-a', 'data-va': v.id }, v.a), { key: v.id + ':a', text: v.a, sel: aSel })
           : h('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
               S.progress.values[v.id] = true; saveProgress(); renderAll(); announceBadge('values', before);
               Player.play(autoSeq([{ key: v.id + ':a', text: v.a, sel: aSel }]));
             } }, u('reveal')));
  });
  return h('section', { class: 'card activity' },
    ...activityHead('values'),
    voiced(h('p', { class: 'strip' }, UI.valuesStrip), { key: 'values:strip', text: UI.valuesStrip, sel: '.strip' }),
    h('div', { class: 'values-grid' }, cards));
}

/* ---------- الاختبار: المحاولة الأولى وحدها تُحتسب ---------- */
function newQuizRound() {
  return { i: 0, first: {}, solved: {}, wrong: {}, order: QUIZ.map(q => shuffle(q.options.map((_, k) => k))), done: false };
}
function quizNarrator() {
  return QUIZ.map(q => h('div', { class: 'narr-q' },
    voiced(h('h3', { class: 'question', 'data-qq': q.id }, q.q), { key: q.id, text: q.q, sel: '[data-qq="' + q.id + '"]' }),
    q.options.map((o, k) => voiced(h('p', { class: 'opt-text', 'data-qo': q.id + k }, o), { key: q.id + ':o' + k, text: o, sel: '[data-qo="' + q.id + k + '"]' })),
    q.explain ? voiced(h('p', { class: 'explain', 'data-qe': q.id }, q.explain), { key: q.id + ':e', text: q.explain, sel: '[data-qe="' + q.id + '"]' }) : null));
}
function viewQuiz() {
  const pr = S.progress;
  const sec = h('section', { class: 'card activity quiz' }, ...activityHead('quiz'), instr(UI.quizRule, 'muted small instr'));
  if (S.narrator) { sec.append(...quizNarrator()); return sec; }
  if (!S.session.quiz) S.session.quiz = newQuizRound();
  const R = S.session.quiz;
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
    const btn = h('button', { class: cls, type: 'button', disabled: solved || (R.wrong[q.id] || []).includes(k), 'data-opt': String(k), onclick: () => {
      Player.stop();
      if (!(q.id in R.first)) R.first[q.id] = k;               /* تُسجَّل المحاولة الأولى فقط */
      if (k === q.correct) { R.solved[q.id] = true; R.msg = 'ok'; }
      else { (R.wrong[q.id] = R.wrong[q.id] || []).push(k); R.msg = 'no'; }
      renderAll();
    } }, q.options[k]);
    opts.append(h('div', { class: 'opt-row' }, btn, voiceBar({ key: q.id + ':o' + k, text: q.options[k], sel: '[data-opt="' + k + '"]' })));
  });
  sec.append(
    h('p', { class: 'muted small', plain: T(u('qCounter', { n: arNum(R.i + 1) })) }),
    voiced(h('h3', { class: 'question' }, q.q), { key: q.id, text: q.q, sel: '.quiz .question' }),
    opts);
  if (R.msg === 'no' && !solved) sec.append(h('p', { class: 'feedback no', role: 'status' }, u('tryAgain')));
  if (solved) {
    sec.append(h('p', { class: 'feedback ok', role: 'status' }, u('correct')));
    if (q.explain) sec.append(voiced(h('p', { class: 'explain' }, q.explain), { key: q.id + ':e', text: q.explain, sel: '.quiz .explain' }));
    const last = R.i === QUIZ.length - 1;
    sec.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
      R.msg = null; Player.stop();
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
  const solved = S.narrator || !!pr.timeline.solved;
  if (!S.session.timeline) S.session.timeline = { order: solved ? TIMELINE.map((_, i) => i) : shuffledNotSorted(TIMELINE.length), marks: null };
  const st = S.session.timeline;
  if (solved) st.order = TIMELINE.map((_, i) => i);
  const list = h('ol', { class: 'timeline' });
  st.order.forEach((idx, pos) => {
    const it = TIMELINE[idx];
    const mark = st.marks ? (st.marks[pos] ? ' right' : ' wrong') : '';
    const move = d => { const j = pos + d; [st.order[pos], st.order[j]] = [st.order[j], st.order[pos]]; st.marks = null; renderAll(); };
    const li = h('li', { class: 'tl-item' + mark + (solved ? ' right' : ''), 'data-order': String(it.order) },
      h('span', { class: 'tl-text' }, it.text), voiceBar({ key: 'tl:' + it.order, text: it.text, sel: '[data-order="' + it.order + '"]' }),
      solved ? h('span', { class: 'tl-when' }, it.when) : h('span', { class: 'tl-moves' },
        h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.moveUp, disabled: pos === 0, onclick: () => move(-1) }, '▲'),
        h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.moveDown, disabled: pos === st.order.length - 1, onclick: () => move(1) }, '▼')));
    list.append(li);
    if (S.narrator) list.append(recBox('tl:' + it.order, false, true));
  });
  const sec = h('section', { class: 'card activity' },
    ...activityHead('timeline'),
    solved && !S.narrator ? h('p', { class: 'feedback ok' }, u('timelineRight')) : instr(u('timelineIntro')),
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
  const n = S.session.marketN;
  const shown = pr.market.last;
  const num = h('span', { class: 'stepper-val', plain: arNum(n) });
  const set = d => { S.session.marketN = Math.min(99, Math.max(3, S.session.marketN + d)); num.textContent = arNum(S.session.marketN); };
  const jars = h('div', { class: 'jars' }, MARKET.jars.map(j => h('div', { class: 'jar', 'data-jar': j.id },
    h('div', { class: 'jar-icon', 'aria-hidden': 'true' }, j.icon),
    voiced(h('div', { 'data-jartext': j.id }, h('h3', { class: 'jar-title' }, j.title), h('p', { class: 'small muted' }, j.desc)),
      { key: 'mk:' + j.id, text: j.title + '. ' + j.desc, sel: '[data-jartext="' + j.id + '"]' }),
    h('div', { class: 'jar-count', plain: shown ? arNum(shown[j.id]) + ' 🪙' : '—' }))));
  return h('section', { class: 'card activity' },
    ...activityHead('market'),
    voiced(h('blockquote', { class: 'hadith' }, MARKET.hadith,
      h('span', { class: 'cite' }, ' — ', h('span', { plain: MARKET.hadithSource[0] }), ' ', h('span', { class: 'grade grade-' + MARKET.hadithSource[1] }, GRADES[MARKET.hadithSource[1]]))),
      { key: 'mk:h', text: MARKET.hadith, sel: '.hadith' }),
    instr(u('marketIntro'), 'instr'),
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
    voiced(h('p', { class: 'note' }, MARKET.note), { key: 'mk:n', text: MARKET.note, sel: '.note' }));
}

/* ---------- بطاقات المراجعة ---------- */
function viewFlash() {
  const grid = h('div', { class: 'flash-grid' });
  FLASHCARDS.forEach(([q, a], i) => {
    if (S.narrator) {
      grid.append(h('div', { class: 'flash-wrap narr' },
        voiced(h('p', { class: 'flash-text', 'data-fq': i }, q), { key: 'fc' + i + ':q', text: q, sel: '[data-fq="' + i + '"]' }),
        voiced(h('p', { class: 'flash-text', 'data-fa': i }, a), { key: 'fc' + i + ':a', text: a, sel: '[data-fa="' + i + '"]' })));
      return;
    }
    const flipped = !!S.session.flipped[i];
    const card = h('button', { class: 'flash' + (flipped ? ' flipped' : ''), type: 'button', 'aria-pressed': String(flipped), 'data-flash': i, onclick: () => { Player.stop(); S.session.flipped[i] = !flipped; renderAll(); } },
      h('span', { class: 'flash-num', plain: arNum(i + 1) }),
      h('span', { class: 'flash-text' }, flipped ? a : q));
    const key = 'fc' + i + (flipped ? ':a' : ':q');
    grid.append(h('div', { class: 'flash-wrap' }, card, voiceBar({ key, text: flipped ? a : q, sel: '[data-flash="' + i + '"]' })));
  });
  return h('section', { class: 'card activity' }, ...activityHead('flashcards'), instr(u('flashIntro')), grid);
}

/* ---------- الشهادة ---------- */
function viewCert() {
  if (S.narrator) {
    return h('section', { class: 'card activity' }, h('p', { class: 'muted' }, UI.narrCertNote), narratorStrip());
  }
  const b = badges();
  const rec = storyRecordedCount();
  const list = h('ul', { class: 'badges' }, Object.keys(BADGES).map(k =>
    h('li', { class: b[k] ? 'got' : 'not', 'data-badge': k },
      h('span', { class: 'b-icon', 'aria-hidden': 'true' }, b[k] ? BADGE_ICONS[k] : '○'), ' ',
      h('span', null, badgeName(k)),
      b[k] ? null : h('span', { class: 'small muted' }, ' — ', k === 'narrator' ? u('narratorRule', { n: arNum(rec) }) : UI.notYet))));
  const certText = [u('certTitle'), u('certTo'), S.profile.name, u('certBody')].join('. ');
  return h('section', { class: 'card activity' },
    activityArt('certificate'),
    h('div', { class: 'certificate' },
      h('div', { class: 'cert-frame' },
        h('h2', { class: 'cert-title' }, u('certTitle')),
        h('p', { class: 'cert-to' }, u('certTo')),
        h('p', { class: 'cert-name', plain: S.profile.name }),
        voiced(h('p', { class: 'cert-body' }, u('certBody')), { key: null, text: certText, sel: '.cert-frame', ttsOnly: true }),
        h('p', { class: 'cert-rec' }, u('certRecorded', { n: arNum(rec) })),
        h('h3', { class: 'small strong' }, UI.badgesTitle),
        list)),
    CAP ? null : h('div', { class: 'row no-print' }, h('button', { class: 'btn btn-primary', type: 'button', onclick: () => window.print() }, UI.printCert)));
}

/* =====================================================================
 * المشاهد والصور
 * ===================================================================== */
/* مشهدان لكل صفحة قصة يتبدّلان بنقطتين تحت الرسم؛ والثاني من art.js باسم <art>2 */
function sceneEl(p) {
  const names = [p.art, p.art + '2'].filter(n => ILLUSTRATIONS[n]);
  if (S.session && S.session.scene == null) S.session.scene = {};
  const idx = Math.min((S.session.scene[p.n] || 0), names.length - 1);
  const box = h('div', { class: 'scene' }, artEl(names[idx]));
  if (names.length > 1) {
    box.append(h('div', { class: 'scene-dots', role: 'group', 'aria-label': 'المشاهد' }, names.map((_, i) =>
      h('button', { class: 'dot' + (i === idx ? ' on' : ''), type: 'button', 'aria-label': 'المشهد ' + (i + 1), 'aria-pressed': String(i === idx), onclick: () => { S.session.scene[p.n] = i; renderAll(); } }))));
  }
  const ph = PLACE_PHOTOS['p' + p.n];
  if (ph) box.append(photoEl(ph));
  return box;
}
function activityArt(k) { return ILLUSTRATIONS['act_' + k] ? artEl('act_' + k) : null; }
function photoEl(ph) {
  const img = h('img', { src: ph.src, alt: '', loading: 'lazy', decoding: 'async' });
  return h('figure', { class: 'photo' }, img,
    h('figcaption', { class: 'photo-cap' }, h('span', null, ph.caption), ' ', h('span', { class: 'credit', plain: '(' + ph.credit + ')' })));
}

/* =====================================================================
 * التصدير: نسخة مستقلة للقراءة فقط، لا تكتب شيئًا في تخزين الجهاز
 * ===================================================================== */
function blobToB64(blob) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = () => rej(r.error); r.readAsDataURL(blob); });
}
async function recsToB64(all) {
  const out = {};
  for (const k of Object.keys(all)) {
    if (k.endsWith('|draft')) continue;
    out[k] = { mime: all[k].mime, duration: all[k].duration, at: all[k].at || 0, data: await blobToB64(all[k].blob) };
  }
  return out;
}
function b64Recs(obj) {
  const out = {};
  for (const k of Object.keys(obj || {})) { const r = obj[k]; out[k] = { blob: b64ToBlob(r.data, r.mime), mime: r.mime, duration: r.duration, at: r.at || 0 }; }
  return out;
}
const safeJson = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
/* حفظ ملف: في أندرويد بالكتابة ثم نافذة المشاركة؛ وفي غيره بالتنزيل */
async function saveFile(fname, text, mime) {
  if (CAP && CAP_PLUGINS.Filesystem && CAP_PLUGINS.Share) {
    const w = await CAP_PLUGINS.Filesystem.writeFile({ path: fname, data: text, directory: 'CACHE', encoding: 'utf8' });
    await CAP_PLUGINS.Share.share({ title: fname, files: [w.uri] });
    return;
  }
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: fname });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
async function doExport(p) {
  toast(UI.exporting);
  try {
    const progress = Object.assign(freshProgress(), (await S.store.getProgress(p.id)) || {});
    const recs = await recsToB64(await S.store.getRecs(p.id));
    const parentRecs = await recsToB64(await loadParentRecs());
    const payload = { v: 2, exportedAt: new Date().toISOString(), profile: { name: p.name, gender: p.gender }, progress, recs, parentRecs };
    const tag = '<script type="application/json" id="export-data">' + safeJson(payload) + '</' + 'script>\n';
    const marker = '<script id="app-' + 'main">';
    if (PRISTINE_HTML.indexOf(marker) < 0) throw new Error('marker');
    /* النسخة المصدَّرة ملف مستقل: تُنزع منها روابط تطبيق الويب حتى لا تطلب ملفات غير موجودة */
    let base = PRISTINE_HTML.replace(new RegExp('<' + '!--pwa-->[\\s\\S]*?<' + '!--/pwa-->'), '<link rel="icon" href="data:,">');
    /* وتُنزع أي سكربتات حقنتها المنصة (مثل جسر تطبيق أندرويد) قبل سكربت الكتاب، فيبقى الملف نظيفًا */
    const j0 = base.indexOf(marker);
    base = base.slice(0, j0).replace(new RegExp('<script\\b[\\s\\S]*?<' + '/script>', 'gi'), '') + base.slice(j0);
    const j = base.indexOf(marker);
    const html = base.slice(0, j) + tag + base.slice(j);
    await saveFile('دلوني-على-السوق-' + p.name.replace(/[\\/:*?"<>|\s]+/g, '-') + '.html', html, 'text/html;charset=utf-8');
    toast(CAP ? UI.exportDone : UI.exportDone + ' ' + UI.iosNotice, 'ok', CAP ? 5000 : 10000);
  } catch (e) {
    if (e && /cancel/i.test(String(e.message || e))) return;   /* أغلق المستخدم نافذة المشاركة */
    toast(UI.exportFail, 'error');
  }
}
/* نسخة احتياطية كاملة: الأطفال وتقدّمهم وتسجيلاتهم وصوت الأهل (دون الرمز السري) */
async function doBackup() {
  toast(UI.exporting);
  try {
    const profiles = await S.store.getProfiles();
    const progress = {}, recs = {};
    for (const p of profiles) { progress[p.id] = (await S.store.getProgress(p.id)) || null; recs[p.id] = await recsToB64(await S.store.getRecs(p.id)); }
    recs[PARENT_ID] = await recsToB64(await S.store.getRecs(PARENT_ID));
    const data = { app: 'dulluni-souq', kind: 'backup', v: 1, createdAt: new Date().toISOString(), profiles, progress, recs };
    const d = new Date(); const stamp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    await saveFile('dulluni-souq-backup-' + stamp + '.json', JSON.stringify(data), 'application/json');
    toast(UI.backupDone, 'ok');
  } catch (e) {
    if (e && /cancel/i.test(String(e.message || e))) return;
    toast(UI.exportFail, 'error');
  }
}
async function restoreBackup(file) {
  let data;
  try { data = JSON.parse(await file.text()); } catch (e) { data = null; }
  if (!data || data.app !== 'dulluni-souq' || data.kind !== 'backup' || !Array.isArray(data.profiles)) { toast(UI.restoreFail, 'error'); return; }
  if (!confirm(UI.restoreConfirm)) return;
  let ok = true;
  for (const p of data.profiles) {
    if (!p || typeof p.id !== 'string' || typeof p.name !== 'string') continue;
    const clean = { id: p.id, name: String(p.name).slice(0, 24), gender: p.gender === 'f' ? 'f' : 'm', created: +p.created || Date.now() };
    ok = (await safe(() => S.store.putProfile(clean))) && ok;
    if (data.progress && data.progress[p.id]) ok = (await safe(() => S.store.putProgress(p.id, data.progress[p.id]))) && ok;
  }
  for (const pid of Object.keys(data.recs || {})) {
    if (pid !== PARENT_ID && !data.profiles.some(p => p && p.id === pid)) continue;
    const r = b64Recs(data.recs[pid]);
    for (const k of Object.keys(r)) ok = (await safe(() => S.store.putRec(pid, k, r[k]))) && ok;
  }
  S.profiles = await S.store.getProfiles().catch(() => S.profiles);
  renderAll();
  if (ok) toast(UI.restoreDone, 'ok');
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
      m.r[pid] = b64Recs(data.recs);
      m.r[PARENT_ID] = b64Recs(data.parentRecs);
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
  document.addEventListener('visibilitychange', () => { if (document.hidden) { Player.stop(); Rec.stop(true); } });
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
