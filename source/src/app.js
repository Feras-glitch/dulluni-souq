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
  nameEmpty: 'اكْتُبِ الِاسْمَ أَوَّلًا.',
  welcome: ['أَهْلًا بِكَ يَا {name}!', 'أَهْلًا بِكِ يَا {name}!'],
  start: ['ابْدَأِ الْقِرَاءَةَ', 'ابْدَئِي الْقِرَاءَةَ'],
  next: 'التَّالِي',
  prev: 'السَّابِقُ',
  readers: 'الْقُرَّاءُ',
  hideTashkeel: 'إِخْفَاءُ التَّشْكِيلِ',
  showTashkeel: 'إِظْهَارُ التَّشْكِيلِ',
  record: ['🎙 سَجِّلْ بِصَوْتِكَ', '🎙 سَجِّلِي بِصَوْتِكِ'],
  recordAgain: ['🎙 سَجِّلْ مِنْ جَدِيدٍ', '🎙 سَجِّلِي مِنْ جَدِيدٍ'],
  stopRec: '⏹ إِنْهَاءُ التَّسْجِيلِ',
  requesting: 'جَارٍ طَلَبُ الْمِيكْرُوفُونِ…',
  recording: 'جَارٍ التَّسْجِيلُ…',
  compiling: 'جَارٍ التَّجْمِيعُ…',
  /* العنصر الثالث (إن وُجد) صيغة الجمع لوضع تسجيل الأهل */
  yourRec: ['تَسْجِيلُكَ', 'تَسْجِيلُكِ', 'تَسْجِيلُكُمْ'],
  deleteRec: '🗑 حَذْفُ التَّسْجِيلِ',
  deleteRecConfirm: ['هَلْ تُرِيدُ حَذْفَ هَذَا التَّسْجِيلِ؟', 'هَلْ تُرِيدِينَ حَذْفَ هَذَا التَّسْجِيلِ؟', 'هَلْ تُرِيدُونَ حَذْفَ هَذَا التَّسْجِيلِ؟'],
  replaceRecConfirm: ['سَيَحُلُّ التَّسْجِيلُ الْجَدِيدُ مَحَلَّ الْقَدِيمِ. هَلْ تُرِيدُ الْمُتَابَعَةَ؟', 'سَيَحُلُّ التَّسْجِيلُ الْجَدِيدُ مَحَلَّ الْقَدِيمِ. هَلْ تُرِيدِينَ الْمُتَابَعَةَ؟', 'سَيَحُلُّ التَّسْجِيلُ الْجَدِيدُ مَحَلَّ الْقَدِيمِ. هَلْ تُرِيدُونَ الْمُتَابَعَةَ؟'],
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
  exportBtn: '⬇ تَصْدِيرُ نُسْخَةٍ لِلْعَرْضِ',
  exporting: 'جَارٍ تَجْهِيزُ النُّسْخَةِ…',
  exportDone: 'جُهِّزَتِ النُّسْخَةُ لِلتَّنْزِيلِ.',
  iosNotice: 'تَنْبِيهٌ: عَلَى أَجْهِزَةِ الْآيْفُونِ افْتَحُوا الْمَلَفَّ فِي مُتَصَفِّحِ سَفَارِي، لَا فِي الْمُعَايَنَةِ.',
  exportFail: 'تَعَذَّرَ تَجْهِيزُ النُّسْخَةِ.',
  deleteProfile: '🗑 حَذْفٌ',
  deleteProfileConfirm: ['سَيُحْذَفُ تَقَدُّمُ {name} وَتَسْجِيلَاتُهُ نِهَائِيًّا. هَلْ أَنْتُمْ مُتَأَكِّدُونَ؟', 'سَيُحْذَفُ تَقَدُّمُ {name} وَتَسْجِيلَاتُهَا نِهَائِيًّا. هَلْ أَنْتُمْ مُتَأَكِّدُونَ؟'],
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
  deleteRecsConfirm: 'سَتُحْذَفُ تَسْجِيلَاتُ {name} كُلُّهَا نِهَائِيًّا. هَلْ أَنْتُمْ مُتَأَكِّدُونَ؟',
  recsDeleted: 'حُذِفَتِ التَّسْجِيلَاتُ.',
  backupTitle: 'النَّسْخُ الِاحْتِيَاطِيُّ',
  backupIntro: 'نُسْخَةٌ كَامِلَةٌ: الْأَطْفَالُ وَتَقَدُّمُهُمْ وَتَسْجِيلَاتُهُمْ وَصَوْتُ الْأَهْلِ. تُسْتَعَادُ عَلَى هَذَا الْجِهَازِ أَوْ عَلَى غَيْرِهِ.',
  backupBtn: '⬇ حِفْظُ نُسْخَةٍ احْتِيَاطِيَّةٍ',
  backupDone: 'جُهِّزَتِ النُّسْخَةُ الِاحْتِيَاطِيَّةُ.',
  restoreBtn: '⬆ اسْتِعَادَةُ نُسْخَةٍ',
  restoreConfirm: 'سَتُضَافُ بَيَانَاتُ النُّسْخَةِ، وَيُسْتَبْدَلُ مَا يُطَابِقُهَا. هَلْ تُتَابِعُونَ؟',
  restoreDone: 'اسْتُعِيدَتِ النُّسْخَةُ.',
  restoreFail: 'الْمَلَفُّ لَيْسَ نُسْخَةً احْتِيَاطِيَّةً صَالِحَةً.',
  restoring: 'جَارٍ الِاسْتِعَادَةُ…',
  nameDup: 'يُوجَدُ طِفْلٌ بِهَذَا الِاسْمِ؛ اخْتَارُوا اسْمًا آخَرَ.',
  unexpected: 'حَدَثَ خَطَأٌ غَيْرُ مُتَوَقَّعٍ. إِنْ تَكَرَّرَ فَأَعِيدُوا فَتْحَ الْكِتَابِ.',
  pinLockedFor: 'مُحَاوَلَاتٌ كَثِيرَةٌ؛ انْتَظِرُوا {t} ثُمَّ حَاوِلُوا مِنْ جَدِيدٍ.',
  /* رمز الاستعادة */
  recoveryTitle: 'رَمْزُ الِاسْتِعَادَةِ',
  recoveryIntro: 'اكْتُبُوا هَذَا الرَّمْزَ عَلَى وَرَقَةٍ، وَاحْفَظُوهَا بَعِيدًا عَنِ الْأَطْفَالِ. إِنْ نَسِيتُمْ رَمْزَ الْوَالِدَيْنِ أَعَدْتُمْ ضَبْطَهُ بِهِ دُونَ أَنْ يَضِيعَ شَيْءٌ.',
  recoveryOk: '✓ كَتَبْنَاهُ',
  forgotPin: 'نَسِيتُمُ الرَّمْزَ؟',
  recoveryEnter: 'اكْتُبُوا رَمْزَ الِاسْتِعَادَةِ الْمَكْتُوبَ عَلَى الْوَرَقَةِ.',
  recoveryWrong: 'رَمْزُ الِاسْتِعَادَةِ غَيْرُ صَحِيحٍ.',
  recoveryNone: 'لَمْ يُنْشَأْ رَمْزُ اسْتِعَادَةٍ عَلَى هَذَا الْجِهَازِ بَعْدُ.',
  newPinTitle: 'رَمْزٌ جَدِيدٌ لِلْوَالِدَيْنِ',
  newRecovery: '🔑 رَمْزُ اسْتِعَادَةٍ جَدِيدٌ',
  /* المعلم */
  teacherBtn: '📋 لِلْمُعَلِّمِ',
  teacherTitle: 'لِلْمُعَلِّمِ',
  teacherPinTitle: 'رَمْزُ الْمُعَلِّمِ',
  teacherPinIntro: 'يُتِيحُ لِلْمُعَلِّمِ مُتَابَعَةَ الْأَطْفَالِ، وَالِاسْتِمَاعَ إِلَى تَسْجِيلَاتِهِمْ، وَكِتَابَةَ الْمُلَاحَظَاتِ؛ دُونَ الْحَذْفِ أَوِ الِاسْتِعَادَةِ.',
  setTeacherPin: '🔑 إِنْشَاءُ رَمْزِ الْمُعَلِّمِ',
  changeTeacherPin: '🔑 تَغْيِيرُ رَمْزِ الْمُعَلِّمِ',
  removeTeacherPin: '🗑 إِلْغَاءُ رَمْزِ الْمُعَلِّمِ',
  removeTeacherConfirm: 'سَيُلْغَى دُخُولُ الْمُعَلِّمِ، وَتَبْقَى مُلَاحَظَاتُهُ. هَلْ أَنْتُمْ مُتَأَكِّدُونَ؟',
  teacherPinSame: 'يَجِبُ أَنْ يَخْتَلِفَ رَمْزُ الْمُعَلِّمِ عَنْ رَمْزِ الْوَالِدَيْنِ.',
  teacherSaved: 'حُفِظَ رَمْزُ الْمُعَلِّمِ.',
  listenRecs: '🔊 التَّسْجِيلَاتُ وَالْمُلَاحَظَاتُ',
  noRecsYet: 'لَا تَسْجِيلَاتَ بَعْدُ.',
  noteLabel: 'مُلَاحَظَةٌ',
  redoLabel: 'يُطْلَبُ إِعَادَةُ التَّسْجِيلِ',
  noteSaved: 'حُفِظَتِ الْمُلَاحَظَةُ.',
  teacherNote: 'مُلَاحَظَةُ الْمُعَلِّمِ:',
  redoAsk: ['يَطْلُبُ مِنْكَ الْمُعَلِّمُ أَنْ تُعِيدَ هَذَا التَّسْجِيلَ.', 'يَطْلُبُ مِنْكِ الْمُعَلِّمُ أَنْ تُعِيدِي هَذَا التَّسْجِيلَ.'],
  back: 'رُجُوعٌ',
  /* لوحة المتابعة */
  dashRead: 'الْقِرَاءَةُ: {n} مِنْ ١٦',
  dashRec: 'التَّسْجِيلُ: {n} مِنْ ١٦',
  dashQuiz: 'الِاخْتِبَارُ: {n} مِنْ ٥',
  dashBadges: 'الْأَوْسِمَةُ: {n} مِنْ ٥',
  dashLast: 'آخِرُ قِرَاءَةٍ: {d}',
  dashNever: ['لَمْ يَبْدَأْ بَعْدُ', 'لَمْ تَبْدَأْ بَعْدُ'],
  /* حزمة صوت الأهل والمساحة والإصدار */
  voicePackTitle: 'حُزْمَةُ صَوْتِ الْأَهْلِ',
  voicePackIntro: 'تَسْجِيلَاتُ الْأَهْلِ وَحْدَهَا فِي مَلَفٍّ وَاحِدٍ، تُنْقَلُ إِلَى جِهَازٍ آخَرَ وَتُسْتَعَادُ مِنْ «اسْتِعَادَةُ نُسْخَةٍ».',
  voicePackBtn: '⬇ حِفْظُ حُزْمَةِ الصَّوْتِ',
  storageUse: 'الْمَسَاحَةُ الْمُسْتَعْمَلَةُ: نَحْوُ {n} مِيغَابَايْت',
  version: 'الْإِصْدَارُ {v}',
  /* التصدير */
  exportIntro: 'مَلَفٌّ وَاحِدٌ يُفْتَحُ فِي أَيِّ مُتَصَفِّحٍ، فِيهِ تَقَدُّمُ {name} وَتَسْجِيلَاتُهُ. صَوْتُ الْأَهْلِ يُكَبِّرُ حَجْمَ الْمَلَفِّ.',
  exportChildOnly: 'بِصَوْتِ الطِّفْلِ فَقَطْ',
  exportWithFamily: 'مَعَ صَوْتِ الْأَهْلِ',
  /* الشهادة والقيم */
  certLocked: ['تَظْهَرُ الشَّهَادَةُ بَعْدَ قِرَاءَةِ صَفَحَاتِ الْقِصَّةِ كُلِّهَا: قَرَأْتَ {n} مِنْ ١٦.', 'تَظْهَرُ الشَّهَادَةُ بَعْدَ قِرَاءَةِ صَفَحَاتِ الْقِصَّةِ كُلِّهَا: قَرَأْتِ {n} مِنْ ١٦.'],
  openToc: ['افْتَحِ الْفِهْرِسَ', 'افْتَحِي الْفِهْرِسَ'],
  valuesWait: ['اسْتَمِعْ إِلَى السُّؤَالِ أَوْ سَجِّلْ إِجَابَتَكَ، ثُمَّ اكْشِفِ الدَّرْسَ.', 'اسْتَمِعِي إِلَى السُّؤَالِ أَوْ سَجِّلِي إِجَابَتَكِ، ثُمَّ اكْشِفِي الدَّرْسَ.'],
  /* السوق */
  marketSteps: ['ضَعْ فِي كُلِّ حَصَّالَةٍ نَصِيبَهَا بِزِرَّيِ الزِّيَادَةِ وَالْإِنْقَاصِ، ثُمَّ تَحَقَّقْ.', 'ضَعِي فِي كُلِّ حَصَّالَةٍ نَصِيبَهَا بِزِرَّيِ الزِّيَادَةِ وَالْإِنْقَاصِ، ثُمَّ تَحَقَّقِي.'],
  marketPlaced: 'وُضِعَ {a} مِنْ {n}',
  marketWrong: ['لَيْسَتِ الْقِسْمَةُ صَحِيحَةً بَعْدُ. تَذَكَّرْ: ثُلُثٌ لِكُلِّ حَصَّالَةٍ، وَمَا لَا يَنْقَسِمُ لِلصَّدَقَةِ.', 'لَيْسَتِ الْقِسْمَةُ صَحِيحَةً بَعْدُ. تَذَكَّرِي: ثُلُثٌ لِكُلِّ حَصَّالَةٍ، وَمَا لَا يَنْقَسِمُ لِلصَّدَقَةِ.'],
  marketRight: ['أَحْسَنْتَ! قِسْمَةٌ صَحِيحَةٌ.', 'أَحْسَنْتِ! قِسْمَةٌ صَحِيحَةٌ.'],
  /* مشروعي الصغير */
  projIntro: ['سَجِّلْ مَا بِعْتَهُ: اسْمَ الشَّيْءِ، وَكَمْ كَلَّفَكَ، وَبِكَمْ بِعْتَهُ؛ فَيُحْسَبُ رِبْحُكَ.', 'سَجِّلِي مَا بِعْتِهِ: اسْمَ الشَّيْءِ، وَكَمْ كَلَّفَكِ، وَبِكَمْ بِعْتِهِ؛ فَيُحْسَبُ رِبْحُكِ.'],
  projWhat: ['مَاذَا بِعْتَ؟', 'مَاذَا بِعْتِ؟'],
  projCost: 'التَّكْلِفَةُ',
  projPrice: 'سِعْرُ الْبَيْعِ',
  projProfit: 'الرِّبْحُ',
  projLoss: 'خَسَارَةٌ',
  projTotal: ['مَجْمُوعُ رِبْحِكَ: {n}', 'مَجْمُوعُ رِبْحِكِ: {n}'],
  projEmpty: 'لَمْ يُسَجَّلْ بَيْعٌ بَعْدُ.',
  projHonest: 'التَّاجِرُ الْأَمِينُ يَكْتُبُ الْحَقَّ: لَا يَزِيدُ فِيهِ وَلَا يَنْقُصُ.',
  projToMarket: ['وَزِّعْ رِبْحَكَ عَلَى الْحَصَّالَاتِ', 'وَزِّعِي رِبْحَكِ عَلَى الْحَصَّالَاتِ'],
  projBad: ['اكْتُبِ الِاسْمَ وَالْعَدَدَيْنِ.', 'اكْتُبِي الِاسْمَ وَالْعَدَدَيْنِ.'],
  projFull: 'امْتَلَأَ الدَّفْتَرُ: ثَلَاثُونَ بَيْعًا.',
  remove: 'حذف',
  /* الفهرس */
  tocBtn: '☰ الْفِهْرِسُ',
  tocTitle: 'رِحْلَةُ الْكِتَابِ',
  studioTitle: 'قَائِمَةُ النُّصُوصِ',
  textChanged: '⚠ تَغَيَّرَ النَّصُّ بَعْدَ هَذَا التَّسْجِيلِ.',
  /* القراءة جملةً جملة */
  echoOn: 'التَّسْجِيلُ جُمْلَةً جُمْلَةً',
  echoOff: 'التَّسْجِيلُ دَفْعَةً وَاحِدَةً',
  echoIntro: ['اسْتَمِعْ إِلَى الْجُمْلَةِ، ثُمَّ سَجِّلْهَا بِصَوْتِكَ.', 'اسْتَمِعِي إِلَى الْجُمْلَةِ، ثُمَّ سَجِّلِيهَا بِصَوْتِكِ.'],
  echoDone: 'الْجُمَلُ الْمُسَجَّلَةُ: {n} مِنْ {t}',
  /* الإعدادات */
  settingsBtn: '⚙ الْإِعْدَادَاتُ',
  settingsTitle: 'الْإِعْدَادَاتُ',
  tashkeelLabel: 'التَّشْكِيلُ',
  fontSize: 'حَجْمُ الْخَطِّ',
  fontSizes: ['صَغِيرٌ', 'مُتَوَسِّطٌ', 'كَبِيرٌ'],
  readSpeed: 'سُرْعَةُ الْقِرَاءَةِ الْآلِيَّةِ',
  speeds: ['بَطِيئَةٌ', 'عَادِيَّةٌ', 'سَرِيعَةٌ'],
  autoRead: 'قِرَاءَةُ الْغِلَافِ تِلْقَائِيًّا',
  yes: 'نَعَمْ',
  no: 'لَا',
  /* أوراق العمل */
  worksheetBtn: '🖨 أَوْرَاقُ عَمَلٍ لِلطِّبَاعَةِ',
  wsTitle: 'أَوْرَاقُ عَمَلٍ: دُلُّونِي عَلَى السُّوقِ',
  wsName: 'الِاسْمُ:',
  wsGloss: 'صِلِ الْكَلِمَةَ بِمَعْنَاهَا.',
  wsTimeline: 'رَتِّبِ الْأَحْدَاثَ بِكِتَابَةِ الرَّقْمِ مِنْ ١ إِلَى ٧.',
  wsQuiz: 'ضَعْ عَلَامَةً أَمَامَ الْإِجَابَةِ الصَّحِيحَةِ.',
  wsPrint: '🖨 طِبَاعَةٌ',
  /* المحذوف المؤقت */
  trashBtn: 'اسْتِرْجَاعُ تَسْجِيلَاتٍ مَحْذُوفَةٍ ({n})',
  trashTitle: 'تَسْجِيلَاتٌ مَحْذُوفَةٌ',
  trashIntro: 'يَبْقَى التَّسْجِيلُ الْمَحْذُوفُ أَوِ الْمُسْتَبْدَلُ هُنَا ثَلَاثِينَ يَوْمًا، ثُمَّ يُحْذَفُ نِهَائِيًّا.',
  restoreOne: 'اسْتِرْجَاعٌ',
  restoredOne: 'اسْتُرْجِعَ التَّسْجِيلُ.',
  deletedAt: 'حُذِفَ فِي {d}',
  /* أخرى */
  cantPlay: 'هَذَا التَّسْجِيلُ بِصِيغَةٍ لَا يُشَغِّلُهَا هَذَا الْجِهَازُ؛ افْتَحُوهُ فِي مُتَصَفِّحِ كْرُومْ أَوْ عَلَى جِهَازٍ آخَرَ.',
  updateReady: 'وَصَلَ تَحْدِيثٌ لِلْكِتَابِ.',
  updateNow: 'تَحْدِيثٌ الْآنَ'
};
const APP_VERSION = '__APP_VERSION__';
/* مفاتيح مساعدة لا تُعرض ولا تُصدَّر: المسوّدة، والمحذوف المؤقت */
const isAux = k => k.endsWith('|draft') || k.endsWith('|trash');
const TRASH_DAYS = 30;
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
  ['١٨ هـ', 'سَنَةَ ثَمَانِيَ عَشْرَةَ'],
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
  page: 0, session: null, toastTimer: 0, warnedVoice: false,
  teacher: false, notes: {}, closeModal: null
};

function T(s) { return (S.progress && S.progress.tashkeel === false) ? String(s).replace(DIAC, '') : String(s); }
function gi() { return S.profile && S.profile.gender === 'f' ? 1 : 0; }
function u(key, vars) {
  let v = UI[key];
  if (Array.isArray(v)) v = (S.narrator && v.length > 2) ? v[2] : v[gi()];
  if (vars) for (const k in vars) v = v.split('{' + k + '}').join(vars[k]);
  return v;
}
function badgeName(k) { const v = BADGES[k]; return Array.isArray(v) ? v[gi()] : v; }

/* ---------- أيقونات SVG بدل الرموز التعبيرية: شكل واحد على كل الأجهزة ---------- */
const ICONS = {
  '🎙': '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
  '⏹': '<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>',
  '🗑': '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
  '📚': '<path d="M12 6c-2-2-5-2-8-1v14c3-1 6-1 8 1 2-2 5-2 8-1V5c-3-1-6-1-8 1zM12 6v14"/>',
  '⬇': '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  '⬆': '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  '🔒': '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  '🔑': '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3M14.5 8.5l2 2"/>',
  '🏠': '<path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/>',
  '🔊': '<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
  '➕': '<path d="M12 5v14M5 12h14"/>',
  '✓': '<path d="M5 12.5l4.5 4.5L19 7"/>',
  '🖨': '<path d="M7 8V3h10v5M7 17H4v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7h-3"/><rect x="7" y="14" width="10" height="7"/>',
  '➡': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  '⬅': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  '🪙': '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/>',
  '🏅': '<circle cx="12" cy="15" r="5.5"/><path d="M8 3l4 6.5L16 3"/>',
  '🌸': '<g fill="currentColor" stroke="none"><circle cx="12" cy="6.5" r="3.6"/><circle cx="17.2" cy="10.3" r="3.6"/><circle cx="15.2" cy="16.4" r="3.6"/><circle cx="8.8" cy="16.4" r="3.6"/><circle cx="6.8" cy="10.3" r="3.6"/></g><circle cx="12" cy="12" r="2.4" fill="#FCECC9" stroke="none"/>',
  '⭐': '<path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="currentColor"/>',
  '💎': '<path d="M6 4h12l4 5-10 11L2 9zM2 9h20M9.5 4L12 9l2.5-5M7 9l5 11 5-11"/>',
  '⚖': '<path d="M12 4v16M7 20h10M4 7h16M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0z"/>',
  '⏳': '<path d="M6 3h12M6 21h12M7 3v3a5 5 0 0 0 10 0V3M7 21v-3a5 5 0 0 1 10 0v3"/>',
  '❤️': '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.4a4.2 4.2 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z" fill="currentColor"/>',
  '🌱': '<path d="M12 21v-9M12 12C12 8 9 5 4 5c0 4 3 7 8 7zM12 10c0-3 3-6 8-6 0 3-3 6-8 6z"/>',
  '🤝': '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  '🎁': '<rect x="4" y="10" width="16" height="11"/><path d="M3 7h18v3H3zM12 7v14M12 7C10 3 6 4 7.5 7M12 7c2-4 6-3 4.5 0"/>',
  '☰': '<path d="M4 6h16M4 12h16M4 18h16"/>',
  '⚙': '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>',
  '📋': '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 11h6M9 15h6"/>',
  '⚠': '<path d="M12 3l10 18H2zM12 10v5M12 18v.5"/>'
};
const ICON_RE = new RegExp('(' + Object.keys(ICONS).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace('\uFE0F', '\uFE0F?')).join('|') + ')');
function icon(k) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'ico'); s.setAttribute('aria-hidden', 'true');
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '2');
  s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML = ICONS[k] || ICONS[k + '\uFE0F'] || '';   /* ثابت مكتوب في الملف */
  return s;
}
/* يحوّل نصًّا فيه رموز معروفة إلى عُقد: نص + أيقونات */
function iconize(str) {
  const parts = str.split(ICON_RE);
  if (parts.length === 1) return [document.createTextNode(str)];
  const out = [];
  parts.forEach((p, i) => {
    if (!p) return;
    if (i % 2) out.push(icon(p.replace('\uFE0F', '') in ICONS ? p.replace('\uFE0F', '') : p));
    else out.push(document.createTextNode(p));
  });
  return out;
}

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
    if (typeof c === 'string') el.append(...iconize(T(c))); else el.append(c);
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
  el.textContent = ''; el.append(...iconize(T(msg)));
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
  return { v: 1, page: 0, tashkeel: true, values: {}, quiz: { best: 0, rounds: 0 }, timeline: { solved: false }, market: { done: false, last: null }, map: {},
    read: {}, heard: {}, settings: { font: 1, speed: 1, auto: true }, project: [], lastAt: 0 };
}

/* =====================================================================
 * النطق: القراءة الآلية جملةً جملة، أو تشغيل تسجيل (صوت الطفل أو صوت الأهل)
 * ===================================================================== */
function speedIdx() { const v = S.progress && S.progress.settings && S.progress.settings.speed; return v === 0 || v === 2 ? v : 1; }
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
      try { await this.plugin().speak({ text: t, lang: 'ar-SA', rate: [0.7, 0.9, 1.1][speedIdx()], pitch: 1.0, volume: 1.0, category: 'playback' }); return 'ok'; }
      catch (e) { if (!S.warnedVoice) { S.warnedVoice = true; toast(UI.noArVoice, 'error'); } return 'fail'; }
    }
    const voice = await this.voice();
    return new Promise(res => {
      const ut = new SpeechSynthesisUtterance(t);
      ut.lang = voice ? voice.lang : 'ar-SA';
      if (voice) ut.voice = voice;
      ut.rate = [0.65, 0.85, 1.05][speedIdx()];
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
      a.onerror = () => { toast(UI.cantPlay, 'error', 8000); res('fail'); };
      const p = a.play(); if (p && p.catch) p.catch(() => res('fail'));
    });
  },
  /* يعيد true إذا اكتمل التشغيل دون مقاطعة */
  async play(seq, btn) {
    const toggleOff = btn && btn === this.btn;
    this.stop();
    if (toggleOff) return false;
    const my = ++this.token;
    this.btn = btn || null;
    if (btn) btn.classList.add('playing');
    let ok = true;
    for (const it of seq) {
      if (my !== this.token) return false;
      this.highlight(it.sel);
      const r = it.rec ? await this.playRec(it.rec) : await TTS.say(it.text);
      if (r === 'fail') { ok = false; break; }
    }
    if (my !== this.token) return false;
    this.stop();
    return ok;
  }
};

/* ---------- الوحدات النصية: كل نص قابل للاستماع له مفتاح ---------- */
/* unit = { key, text, sel, sentences?, ttsOnly? }
 * key: مفتاح التسجيل (صوت الأهل لكل الوحدات، وصوت الطفل للغلاف ونصوص القصة فقط)
 * sentences: للقراءة الآلية جملةً جملة مع إبراز كل جملة */
const UNITS = new Map();
function childVoiceKey(key) { return key === 'cover' || /^p\d+(\.s\d+)?$/.test(key); }
/* تسجيل الطفل لوحدة: تسجيل كامل، أو جُمَل مسجّلة كلها (القراءة جملةً جملة) */
function childSeq(unit) {
  if (S.narrator || !unit.key || !childVoiceKey(unit.key)) return null;
  const whole = S.recs[unit.key];
  if (whole) return [{ text: unit.text, sel: unit.sel, rec: whole }];
  if (unit.sentences && unit.sentences.length > 1) {
    const parts = unit.sentences.map((s2, i) => S.recs[unit.key + '.s' + i]);
    if (parts.every(Boolean)) return unit.sentences.map((s2, i) => ({ text: s2.text, sel: s2.sel, rec: parts[i] }));
  }
  return null;
}
function ttsSeq(unit) { return unit.sentences && unit.sentences.length ? unit.sentences : [{ text: unit.text, sel: unit.sel }]; }
function voiceBar(unit) {
  const bar = h('span', { class: 'vbar' });
  if (unit.key) { bar.dataset.unit = unit.key; UNITS.set(unit.key, unit); }
  fillVoiceBar(bar, unit);
  return bar;
}
function fillVoiceBar(bar, unit) {
  bar.textContent = '';
  const child = childSeq(unit);
  const parent = !unit.ttsOnly && unit.key ? S.parentRecs[unit.key] : null;
  const mk = (label, aria, cls, seqFn) => {
    const b = h('button', { class: 'spk ' + cls, type: 'button', 'aria-label': aria }, label);
    b.addEventListener('click', e => {
      e.stopPropagation();
      Player.play(seqFn(), b).then(done => { if (done && unit.onDone) unit.onDone(); });
    });
    return b;
  };
  if (!child && !parent) { bar.append(mk('🔊', 'استمع', 'spk-icon', () => ttsSeq(unit))); return; }
  if (child) bar.append(mk(['🔊 ', UI.myVoice], 'صوتي', 'spk-chip', () => child));
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
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true } }); }
    catch (e) {
      this.state = 'idle'; this.key = null; refreshRecUI();
      toast(e && e.name === 'NotFoundError' ? UI.micMissing : UI.micDenied, 'error');
      return;
    }
    if (this.cancel) { stream.getTracks().forEach(t => t.stop()); this.state = 'idle'; this.key = null; refreshRecUI(); return; }
    this.stream = stream; this.chunks = [];
    this.mime = this.pickMime();
    /* ٣٢ ك.بت/ث تكفي الكلام بوضوح، وتصغّر التسجيل نحو أربع مرات */
    const opts = { audioBitsPerSecond: 32000 };
    if (this.mime) opts.mimeType = this.mime;
    try { this.mr = new MediaRecorder(stream, opts); }
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
          const rec = { blob, mime: this.mime, duration: dur, at: Date.now(), tv: textVersion(key) };
          const k = this.asDraft ? key + '|draft' : key;
          if (!this.asDraft && pid !== PARENT_ID && S.recs[key]) await toTrash(pid, key, S.recs[key]);
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
  if (!rec.blob && rec.data) return 'data:' + rec.mime + ';base64,' + rec.data;
  if (!objUrls.has(rec.blob)) objUrls.set(rec.blob, URL.createObjectURL(rec.blob));
  return objUrls.get(rec.blob);
}

/* المحذوف المؤقت: آخر تسجيل حُذف أو استُبدل لكل نص، يسترجعه الوالدان خلال ثلاثين يومًا */
async function toTrash(pid, key, rec) {
  if (!rec || !rec.blob) return;
  const t = Object.assign({}, rec, { deletedAt: Date.now() });
  if (await safe(() => S.store.putRec(pid, key + '|trash', t))) { if (S.profile && S.profile.id === pid) S.recs[key + '|trash'] = t; }
}
async function purgeTrash() {
  const limit = Date.now() - TRASH_DAYS * 86400000;
  for (const p of S.profiles) {
    const all = await S.store.getRecs(p.id).catch(() => ({}));
    for (const k of Object.keys(all)) if (k.endsWith('|trash') && (all[k].deletedAt || 0) < limit) await S.store.delRec(p.id, k).catch(() => {});
  }
}
async function showTrash(p) {
  const all = await S.store.getRecs(p.id).catch(() => ({}));
  const keys = Object.keys(all).filter(k => k.endsWith('|trash')).sort((a, b) => all[b].deletedAt - all[a].deletedAt);
  const list = h('div', { class: 'tlist' });
  for (const tk of keys) {
    const key = tk.slice(0, -6), r = all[tk];
    list.append(h('div', { class: 'trow', 'data-trash': key },
      h('p', { class: 'strong small', plain: T(recLabel(key)) + ' (' + fmtDur(r.duration) + ')' }),
      h('p', { class: 'small muted', plain: T(UI.deletedAt.replace('{d}', fmtDate(r.deletedAt))) }),
      player(r),
      h('button', { class: 'btn btn-small', type: 'button', 'data-trash-restore': key, onclick: async () => {
        const cur = (await S.store.getRecs(p.id).catch(() => ({})))[key];
        const back = Object.assign({}, r); delete back.deletedAt;
        if (cur) await safe(() => S.store.putRec(p.id, tk, Object.assign({}, cur, { deletedAt: Date.now() })));
        else await safe(() => S.store.delRec(p.id, tk));
        if (await safe(() => S.store.putRec(p.id, key, back))) { toast(UI.restoredOne, 'ok'); if (S.closeModal) S.closeModal(); renderAll(); }
      } }, UI.restoreOne)));
  }
  modal(UI.trashTitle, h('p', { class: 'muted small' }, UI.trashIntro), list);
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
          if (S.recs[key] && !S.narrator) await toTrash(S.profile.id, key, S.recs[key]);
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
    const note = !S.narrator && S.notes[key];
    const showNote = note && (note.text || note.redo) && (note.at || 0) >= (rec.at || 0);
    box.append(h('div', { class: 'my-rec' },
      h('span', { class: 'small strong' }, u('yourRec'), ' ', h('span', { plain: '(' + fmtDur(rec.duration) + ')' })),
      isStale(key, rec) ? h('p', { class: 'small warn-line' }, UI.textChanged) : null,
      showNote ? h('div', { class: 'tnote' },
        note.text ? h('p', { class: 'small' }, h('strong', null, UI.teacherNote), ' ', h('span', { plain: note.text })) : null,
        note.redo ? h('p', { class: 'small strong' }, u('redoAsk')) : null) : null,
      player(rec),
      S.readonly ? null : h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: async () => {
        if (!confirm(T(u('deleteRecConfirm')))) return;
        if (!S.narrator) await toTrash(S.profile.id, key, rec);
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
  const close = () => {
    /* تسجيل جارٍ داخل النافذة يُنهى ويُحفظ قبل إغلاقها، فلا يبقى تسجيل خفيّ بلا زر إيقاف */
    if (Rec.state !== 'idle' && Rec.key && root.querySelector('[data-rec-key="' + CSS.escape(Rec.key) + '"]')) Rec.stop(false);
    Player.stop(); root.textContent = ''; root.hidden = true; S.closeModal = null;
    document.removeEventListener('keydown', onKey); if (prevFocus && prevFocus.isConnected && prevFocus.focus) prevFocus.focus();
  };
  const onKey = e => { if (e.key === 'Escape') close(); };
  const closeBtn = h('button', { class: 'btn btn-ghost', type: 'button', onclick: close }, UI.close);
  const card = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title.replace(DIAC, '') },
    h('h3', { class: 'modal-title' }, title), ...body, h('div', { class: 'modal-actions' }, closeBtn));
  const veil = h('div', { class: 'veil', onclick: e => { if (e.target === veil) close(); } }, card);
  root.textContent = ''; root.append(veil); root.hidden = false;
  document.addEventListener('keydown', onKey);
  S.closeModal = close;
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
/* فهرس النصوص: المفتاح، والنص، والشاشة التي يظهر فيها — لعدّاد التسجيل، وقائمة النصوص، وربط التسجيل بنسخة النص */
let NARR_CACHE = null;
function narrationIndex() {
  if (NARR_CACHE) return NARR_CACHE;
  const out = [];
  const add = (key, text, screen) => out.push({ key, text, screen });
  add('cover', COVER.title + '. ' + COVER.subtitle, 'cover');
  for (const p of STORY_PAGES) {
    const sc = 'p' + p.n;
    add(sc + ':t', p.title, sc); add(sc, p.text, sc); add(sc + ':c', p.caption, sc);
    for (const g of GLOSSARY) if (g.page === p.n) add('gl:' + g.match, g.title + '. ' + g.meaning, sc);
  }
  for (const a of Object.keys(ACTIVITY_TITLES)) if (a !== 'certificate') add('act:' + a, ACTIVITY_TITLES[a], a);
  for (const l of MAP_LOCATIONS) add('map:' + l.id, l.name + '. ' + l.desc, 'map');
  add('values:strip', UI.valuesStrip, 'values');
  for (const v of VALUES) { add(v.id + ':q', v.q, 'values'); add(v.id + ':a', v.a, 'values'); }
  for (const q of QUIZ) {
    add(q.id, q.q, 'quiz'); q.options.forEach((o, i) => add(q.id + ':o' + i, o, 'quiz'));
    if (q.explain) add(q.id + ':e', q.explain, 'quiz');
  }
  for (const t of TIMELINE) add('tl:' + t.order, t.text, 'timeline');
  add('mk:h', MARKET.hadith, 'market');
  for (const j of MARKET.jars) add('mk:' + j.id, j.title + '. ' + j.desc, 'market');
  add('mk:n', MARKET.note, 'market');
  FLASHCARDS.forEach(([q, a], i) => { add('fc' + i + ':q', q, 'flashcards'); add('fc' + i + ':a', a, 'flashcards'); });
  NARR_CACHE = out;
  return out;
}
function allNarrationKeys() { return narrationIndex().map(x => x.key); }
/* نسخة النص: بصمة قصيرة تُحفظ مع التسجيل، فإذا تغيّر النص لاحقًا عُرف أن التسجيل قديم */
function hashText(t) { let x = 2166136261; for (let i = 0; i < t.length; i++) { x ^= t.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0).toString(36); }
function keyText(key) {
  const m = /^p(\d+)\.s(\d+)$/.exec(key);
  if (m) { const p = STORY_PAGES.find(x => x.n === +m[1]); return p ? (sentences(p.text)[+m[2]] || '') : ''; }
  const it = narrationIndex().find(x => x.key === key);
  if (it) return it.text;
  const v = VALUES.find(x => x.id === key);       /* إجابة الطفل على سؤال القيمة */
  return v ? v.q : '';
}
function textVersion(key) { const t = keyText(key); return t ? hashText(t) : ''; }
function isStale(key, rec) { return !!(rec && rec.tv && rec.tv !== textVersion(key)); }

/* =====================================================================
 * الشاشات
 * ===================================================================== */
const ACT_ORDER = ['map', 'values', 'quiz', 'timeline', 'market', 'project', 'flashcards', 'certificate'];
const SCREENS = [{ kind: 'cover', id: 'cover' }]
  .concat(STORY_PAGES.map(p => ({ kind: 'story', p, id: 'p' + p.n })))
  .concat(ACT_ORDER.map(k => ({ kind: k, id: k })));
/* ترتيب الشاشات قبل إضافة «مشروعي الصغير»: لترحيل رقم الصفحة المحفوظ */
const OLD_SCREEN_IDS = ['cover'].concat(STORY_PAGES.map(p => 'p' + p.n), ['map', 'values', 'quiz', 'timeline', 'market', 'flashcards', 'certificate']);
const screenIndex = id => Math.max(0, SCREENS.findIndex(x => x.id === id));
function savedScreen(pr) {
  if (pr && typeof pr.screen === 'string') return screenIndex(pr.screen);
  if (pr && typeof pr.page === 'number') return screenIndex(OLD_SCREEN_IDS[pr.page] || 'cover');
  return 0;
}

/* صفحة مسجّلة: تسجيل كامل، أو جُمَلها كلها */
function pageRecorded(p, recs) {
  recs = recs || S.recs;
  if (recs['p' + p.n]) return true;
  const n = sentences(p.text).length;
  for (let i = 0; i < n; i++) if (!recs['p' + p.n + '.s' + i]) return false;
  return n > 1;
}
function storyRecordedCount(recs) { return STORY_PAGES.filter(p => pageRecorded(p, recs)).length; }
function storyReadCount(pr) { pr = pr || S.progress; return STORY_PAGES.filter(p => pr.read && pr.read[p.n]).length; }
function badgesFor(pr, recs) {
  return {
    narrator: storyRecordedCount(recs) >= NARRATOR_MIN,
    values: VALUES.every(v => pr.values[v.id] === true),
    quiz: pr.quiz.best >= 4,
    timeline: !!pr.timeline.solved,
    market: !!pr.market.done
  };
}
function badges() { return badgesFor(S.progress, S.recs); }
function announceBadge(k, before) { if (!S.narrator && !before[k] && badges()[k]) toast(u('earned', { badge: badgeName(k) }), 'ok'); }

function topBtn(label, onclick, extra) { return h('button', Object.assign({ class: 'btn btn-ghost btn-small', type: 'button', onclick }, extra || {}), label); }
function renderTop() {
  const top = document.getElementById('topbar');
  top.textContent = '';
  if (!S.profile) {
    top.append(h('div', { class: 'brand-wrap' }, h('h1', { class: 'brand' }, UI.appTitle)));
    if (!S.readonly) {
      const tools = h('div', { class: 'top-tools' });
      if (S.teacher) tools.append(topBtn(UI.exitParent, exitTeacher, { 'data-teacher-btn': '' }));
      else {
        if (!S.parentMode && S.hasTeacher) tools.append(topBtn(UI.teacherBtn, enterTeacher, { 'data-teacher-btn': '' }));
        tools.append(topBtn(S.parentMode ? UI.exitParent : UI.parentBtn, S.parentMode ? exitParent : enterParent, { 'data-parent-btn': '' }));
      }
      top.append(tools);
    }
    return;
  }
  top.append(
    topBtn(['🏠 ', S.narrator ? UI.parentTitle : UI.readers], toProfiles, { 'data-home': '' }),
    h('div', { class: 'brand-wrap' }, h('h1', { class: 'brand' }, UI.appTitle),
      S.narrator ? h('span', { class: 'who' }, UI.narratorBanner) : h('span', { class: 'who', plain: S.profile.name })),
    h('div', { class: 'top-tools' },
      topBtn(UI.tocBtn, showToc, { 'data-toc': '', 'aria-label': 'الفهرس' }),
      topBtn('⚙', showSettings, { 'data-settings': '', 'aria-label': 'الإعدادات' })));
}
function renderPager() {
  const nav = document.getElementById('pager');
  nav.textContent = '';
  nav.hidden = !S.profile;
  if (!S.profile) return;
  const n = S.page, t = SCREENS.length;
  nav.append(
    h('button', { class: 'btn', type: 'button', disabled: n === 0, onclick: () => go(n - 1), 'aria-label': 'السابق', 'data-prev': '' }, '➡ ', UI.prev),
    h('span', { class: 'counter', plain: u('pageOf', { n: arNum(n + 1), t: arNum(t) }) }),
    h('button', { class: 'btn', type: 'button', disabled: n === t - 1, onclick: () => go(n + 1), 'aria-label': 'التالي', 'data-next': '' }, UI.next, ' ⬅'));
}
function narratorStrip() {
  const keys = allNarrationKeys();
  const done = keys.filter(k => S.parentRecs[k]).length;
  return h('div', { class: 'banner narr' },
    h('span', null, UI.narratorBanner, ' — ', h('span', { 'data-narr-count': '', plain: T(u('narrateProgress', { n: arNum(done), t: arNum(keys.length) })) })),
    h('div', { class: 'row' },
      h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: showToc }, UI.studioTitle),
      h('button', { class: 'btn btn-small', type: 'button', 'data-finish': '', onclick: toProfiles }, UI.finishNarrate)));
}
/* حفظ موضع التركيز عبر إعادة الرسم: يُعرَّف العنصر بوسمه وصنفه وسماته ونصه وترتيبه */
function focusKey(el) {
  if (!el || el === document.body || !document.getElementById('app').contains(el)) return null;
  const attrs = Array.from(el.attributes).filter(a => a.name.startsWith('data-') || a.name === 'id' || a.name === 'aria-label').map(a => '[' + a.name + '="' + CSS.escape(a.value) + '"]').join('');
  const sel = el.tagName.toLowerCase() + attrs;
  const txt = el.textContent;
  const same = Array.from(document.querySelectorAll(sel)).filter(e => e.textContent === txt);
  return { sel, txt, i: Math.max(0, same.indexOf(el)) };
}
function restoreFocus(k) {
  if (!k) return;
  const same = Array.from(document.querySelectorAll(k.sel)).filter(e => e.textContent === k.txt);
  const el = same[k.i] || same[0] || (document.querySelectorAll(k.sel).length === 1 ? document.querySelector(k.sel) : null);
  if (el && !el.disabled) el.focus({ preventScroll: true });
}
function applyFont() {
  const f = S.progress && S.progress.settings ? S.progress.settings.font : 1;
  document.documentElement.dataset.font = String(f === 0 || f === 2 ? f : 1);
}
function renderAll() {
  const fk = focusKey(document.activeElement);
  UNITS.clear();
  applyFont();
  renderTop(); renderPager();
  const v = document.getElementById('view');
  v.textContent = '';
  if (S.readonly) v.append(h('div', { class: 'banner' }, UI.readonlyBanner));
  if (!S.storageOk) v.append(h('div', { class: 'banner warn' }, UI.noStorage));
  if (S.updateReady) v.append(h('div', { class: 'banner narr', 'data-update': '' }, h('span', null, UI.updateReady),
    h('button', { class: 'btn btn-small', type: 'button', onclick: async () => { Player.stop(); await Rec.stop(true); location.reload(); } }, UI.updateNow)));
  if (!S.profile) { v.append(S.teacher ? viewTeacher() : S.parentMode ? viewParent() : viewProfiles()); restoreFocus(fk); return; }
  if (S.narrator) v.append(narratorStrip());
  const sc = SCREENS[S.page];
  const fn = { cover: viewCover, story: viewStory, map: viewMap, values: viewValues, quiz: viewQuiz, timeline: viewTimeline, market: viewMarket, project: viewProject, flashcards: viewFlash, certificate: viewCert }[sc.kind];
  v.append(fn(sc));
  restoreFocus(fk);
}
/* تسجيل قراءة الصفحة ووقتها */
function markRead() {
  if (S.narrator || S.readonly || !S.progress) return;
  const sc = SCREENS[S.page];
  S.progress.lastAt = Date.now();
  if (sc.kind === 'story') S.progress.read[sc.p.n] = true;
}
async function go(n) {
  if (n < 0 || n >= SCREENS.length || n === S.page) return;
  Player.stop();
  await Rec.stop(true);         /* مغادرة الصفحة أثناء التسجيل تحفظه مسوّدة */
  S.page = n; S.progress.page = n; S.progress.screen = SCREENS[n].id; markRead(); saveProgress();
  renderAll();
  window.scrollTo(0, 0);
  const v = document.getElementById('view'); v.focus({ preventScroll: true });
}
function goId(id) { return go(screenIndex(id)); }
async function toProfiles() {
  Player.stop(); await Rec.stop(true);
  const wasNarrator = S.narrator;
  S.profile = null; S.progress = null; S.recs = {}; S.session = null; S.narrator = false; S.notes = {};
  for (const url of objUrls.values()) URL.revokeObjectURL(url);
  objUrls.clear();
  S.parentMode = wasNarrator;
  if (!S.readonly) S.profiles = await S.store.getProfiles().catch(() => S.profiles);
  renderAll();
}
async function loadParentRecs() {
  const all = await S.store.getRecs(PARENT_ID).catch(() => ({}));
  const out = {};
  for (const k of Object.keys(all)) if (!isAux(k)) out[k] = all[k];
  return out;
}
function newSession() { return { quiz: null, timeline: null, mapSel: 'makkah', flipped: {}, marketN: 10, jars: null, echo: {} }; }
function loadProgress(raw) {
  const pr = Object.assign(freshProgress(), raw || {});
  pr.read = pr.read && typeof pr.read === 'object' ? pr.read : {};
  pr.heard = pr.heard && typeof pr.heard === 'object' ? pr.heard : {};
  pr.settings = Object.assign({ font: 1, speed: 1, auto: true }, pr.settings || {});
  pr.project = Array.isArray(pr.project) ? pr.project : [];
  return pr;
}
async function loadNotes(pid) {
  const all = await S.store.getMeta('notes').catch(() => null);
  return (all && all[pid]) || {};
}
async function openProfile(p) {
  S.profile = p; S.parentMode = false; S.narrator = false; S.teacher = false;
  S.progress = loadProgress(await S.store.getProgress(p.id).catch(() => null));
  S.recs = await S.store.getRecs(p.id).catch(() => ({}));
  S.parentRecs = await loadParentRecs();
  S.notes = await loadNotes(p.id);
  S.session = newSession();
  S.page = S.readonly ? 0 : Math.min(savedScreen(S.progress), SCREENS.length - 1);
  markRead();
  renderAll();
  /* الغلاف يُقرأ تلقائيًا عند فتح الكتاب، ما لم يُطفأ ذلك من الإعدادات */
  if (S.page === 0 && S.progress.settings.auto !== false) setTimeout(() => { if (S.profile === p && S.page === 0 && !Player.active()) Player.play(autoSeq([coverUnit()])); }, 500);
}
async function openNarrator(screenId) {
  S.profile = { id: PARENT_ID, name: '', gender: 'm' }; S.parentMode = false; S.narrator = true;
  S.progress = loadProgress(await S.store.getProgress(PARENT_ID).catch(() => null));
  S.recs = await S.store.getRecs(PARENT_ID).catch(() => ({}));
  S.parentRecs = S.recs;          /* في وضع التسجيل: تسجيلات الأهل هي تسجيلات هذه الجلسة */
  S.session = newSession();
  S.page = typeof screenId === 'string' ? screenIndex(screenId) : Math.min(savedScreen(S.progress), SCREENS.length - 1);
  renderAll();
}

/* ---------- الفهرس: رحلة الكتاب للطفل، وقائمة النصوص للأهل ---------- */
function screenTitle(sc) {
  if (sc.kind === 'cover') return CHAPTERS.c0;
  if (sc.kind === 'story') return sc.p.title;
  return ACTIVITY_TITLES[sc.kind];
}
function screenDone(sc) {
  const pr = S.progress, b = badges();
  if (sc.kind === 'story') return !!pr.read[sc.p.n];
  return { values: b.values, quiz: b.quiz, timeline: b.timeline, market: b.market, map: MAP_LOCATIONS.every(l => pr.map[l.id]), project: pr.project.length > 0 }[sc.kind] || false;
}
function showToc() {
  const idx = narrationIndex();
  const list = h('ol', { class: 'toc' });
  let lastChapter = null;
  SCREENS.forEach((sc, i) => {
    const ch = sc.kind === 'story' ? sc.p.chapter : sc.kind === 'cover' ? null : 'act';
    if (ch && ch !== lastChapter) { list.append(h('li', { class: 'toc-chapter' }, CHAPTERS[ch])); lastChapter = ch; }
    let status;
    if (S.narrator) {
      const items = idx.filter(x => x.screen === sc.id);
      const done = items.filter(x => S.parentRecs[x.key]).length;
      const stale = items.filter(x => isStale(x.key, S.parentRecs[x.key])).length;
      status = items.length ? h('span', { class: 'toc-count' + (done === items.length ? ' full' : ''), plain: arNum(done) + ' / ' + arNum(items.length) + (stale ? ' ⚠' : '') }) : null;
    } else status = screenDone(sc) ? h('span', { class: 'toc-done', 'aria-label': 'تم' }, '✓') : null;
    list.append(h('li', { class: 'toc-item' + (i === S.page ? ' here' : '') + (!S.narrator && screenDone(sc) ? ' done' : '') },
      h('button', { class: 'toc-btn', type: 'button', 'data-toc-go': sc.id, onclick: () => { if (S.closeModal) S.closeModal(); go(i); } },
        h('span', { class: 'toc-dot', 'aria-hidden': 'true', plain: sc.kind === 'story' ? arNum(sc.p.n) : '' }),
        h('span', { class: 'toc-name' }, screenTitle(sc)), status)));
  });
  modal(S.narrator ? UI.studioTitle : UI.tocTitle, list);
  const here = document.querySelector('.toc-item.here');
  if (here) here.scrollIntoView({ block: 'center' });
}
/* ---------- الإعدادات: لكل طفل ---------- */
function showSettings() {
  const st = S.progress.settings;
  const seg = (label, opts, cur, onPick, attr) => h('div', { class: 'setting' },
    h('span', { class: 'strong small' }, label),
    h('div', { class: 'seg', role: 'group', 'aria-label': label.replace(DIAC, '') }, opts.map((o, i) =>
      h('button', { class: 'seg-btn' + (i === cur ? ' on' : ''), type: 'button', 'aria-pressed': String(i === cur), [attr]: String(i), onclick: () => { onPick(i); saveProgress(); renderAll(); showSettings(); } }, o))));
  modal(UI.settingsTitle,
    seg(UI.tashkeelLabel, [UI.showTashkeel, UI.hideTashkeel], S.progress.tashkeel ? 0 : 1, i => { S.progress.tashkeel = i === 0; }, 'data-set-tashkeel'),
    seg(UI.fontSize, UI.fontSizes, st.font, i => { st.font = i; }, 'data-set-font'),
    seg(UI.readSpeed, UI.speeds, st.speed, i => { st.speed = i; }, 'data-set-speed'),
    seg(UI.autoRead, [UI.yes, UI.no], st.auto === false ? 1 : 0, i => { st.auto = i === 0; }, 'data-set-auto'));
}

/* ---------- شاشة القرّاء (للطفل) ---------- */
const normName = s2 => s2.replace(DIAC, '').replace(/[إأآ]/g, 'ا').replace(/\s+/g, ' ').trim();
function addChildForm(after) {
  const name = h('input', { id: 'new-name', type: 'text', maxlength: '24', autocomplete: 'off', 'aria-label': 'الاسم' });
  const rb = (val, label, checked) => h('label', { class: 'radio' },
    h('input', { type: 'radio', name: 'gender', value: val, checked }), ' ', label);
  const form = h('form', { class: 'add-form', onsubmit: async e => {
    e.preventDefault();
    const nm = name.value.replace(/\s+/g, ' ').trim().slice(0, 24);
    if (!nm) { toast(UI.nameEmpty, 'error'); name.focus(); return; }
    if (S.profiles.some(x => normName(x.name) === normName(nm))) { toast(UI.nameDup, 'error'); name.focus(); return; }
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
const avatarOf = p => p.gender === 'f' ? '🌸' : '⭐';
function viewProfiles() {
  const wrap = h('section', { class: 'profiles card' }, h('h2', { class: 'heading' }, UI.whoReads));
  const list = h('div', { class: 'profile-list' });
  const sorted = S.profiles.slice().sort((a, b) => a.created - b.created);
  for (const p of sorted) {
    list.append(h('div', { class: 'profile-row' },
      h('button', { class: 'profile-btn', type: 'button', onclick: () => openProfile(p) },
        h('span', { class: 'avatar av-' + p.gender, 'aria-hidden': 'true' }, avatarOf(p)),
        h('span', { class: 'pname', plain: p.name }))));
  }
  wrap.append(list);
  /* أول تشغيل: يُضاف الطفل الأول من هنا؛ وبعد ذلك من وضع الوالدين */
  if (!S.readonly && !S.profiles.length) wrap.append(addChildForm(p => openProfile(p)));
  else if (!S.readonly) wrap.append(h('p', { class: 'muted small' }, UI.addInParent));
  return wrap;
}

/* =====================================================================
 * الرموز السرية: رمز الوالدين (ومعه رمز استعادة يُكتب على ورقة)، ورمز المعلم
 * المحاولات الخاطئة تُحفظ في التخزين، فلا يُتجاوز الانتظار بإعادة تحميل الصفحة
 * ===================================================================== */
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
const RC_ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function newRecoveryCode() {
  const r = new Uint8Array(8); crypto.getRandomValues(r);
  const c = Array.from(r, b => RC_ALPHA[b % RC_ALPHA.length]).join('');
  return c.slice(0, 4) + '-' + c.slice(4);
}
const normCode = s => toWestern(String(s)).toUpperCase().replace(/[^A-Z0-9]/g, '');
async function getTries() { return (await S.store.getMeta('pinTries').catch(() => null)) || { n: 0, until: 0, locks: 0 }; }
async function lockedMsg() {
  const t = await getTries();
  if (Date.now() < t.until) { toast(T(u('pinLockedFor', { t: fmtDur(t.until - Date.now()) })), 'error'); return true; }
  return false;
}
async function failTry() {
  const t = await getTries();
  t.n = (t.n || 0) + 1;
  if (t.n >= 5) { t.locks = (t.locks || 0) + 1; t.n = 0; t.until = Date.now() + 30000 * Math.pow(2, Math.min(t.locks - 1, 5)); }
  await safe(() => S.store.putMeta('pinTries', t));
  if (t.until > Date.now()) toast(T(u('pinLockedFor', { t: fmtDur(t.until - Date.now()) })), 'error'); else toast(UI.pinWrong, 'error');
}
async function okTry() { await safe(() => S.store.putMeta('pinTries', { n: 0, until: 0, locks: 0 })); }
/* نموذج إنشاء رمز من أربعة أرقام مرتين؛ يعيد الرمز أو null */
function readNewPin() {
  const e1 = document.getElementById('pin1'), e2 = document.getElementById('pin2');
  if (!e1 || !e2) return null;
  const a = toWestern(e1.value), b = toWestern(e2.value);
  if (!/^\d{4}$/.test(a)) { toast(UI.pinInvalid, 'error'); return null; }
  if (a !== b) { toast(UI.pinMismatch, 'error'); return null; }
  return a;
}
async function makePinMeta(pin, keepRecovery) {
  const salt = uid();
  const m = { salt, hash: await sha256(salt + pin) };
  if (keepRecovery && keepRecovery.rhash) { m.rsalt = keepRecovery.rsalt; m.rhash = keepRecovery.rhash; }
  return m;
}
/* يُنشئ رمز استعادة جديدًا ويعرضه مرة واحدة */
async function issueRecovery(then) {
  const meta = await S.store.getMeta('pin').catch(() => null);
  if (!meta) return then && then();
  const code = newRecoveryCode();
  meta.rsalt = uid(); meta.rhash = await sha256(meta.rsalt + normCode(code));
  if (!(await safe(() => S.store.putMeta('pin', meta)))) return then && then();
  const close = modal(UI.recoveryTitle,
    h('p', { class: 'small' }, UI.recoveryIntro),
    h('p', { class: 'rcode', plain: code, 'data-recovery-code': '' }),
    h('button', { class: 'btn btn-primary', type: 'button', 'data-recovery-ok': '', onclick: () => { close(); if (then) then(); } }, UI.recoveryOk));
}
function setPinModal(title, intro, onSave) {
  const close = modal(title,
    intro ? h('p', { class: 'muted small' }, intro) : null,
    pinField('pin1', UI.pinLabel), pinField('pin2', UI.pinConfirm),
    h('button', { class: 'btn btn-primary', type: 'button', 'data-pin-save': '', onclick: async () => {
      const a = readNewPin(); if (!a) return;
      await onSave(a, close);
    } }, UI.save));
  document.getElementById('pin1').focus();
}
async function enterParent() {
  const meta = await S.store.getMeta('pin').catch(() => null);
  if (!meta) {
    setPinModal(UI.pinSetTitle, UI.pinSetIntro, async (a, close) => {
      if (!(await safe(async () => S.store.putMeta('pin', await makePinMeta(a))))) return;
      close(); await issueRecovery(() => { S.parentMode = true; renderAll(); });
    });
    return;
  }
  pinEntryModal(UI.pinEnterTitle, meta, async () => {
    S.parentMode = true; renderAll();
    if (!meta.rhash) await issueRecovery();      /* أجهزة أنشأت الرمز قبل ميزة الاستعادة */
  }, true);
}
function pinEntryModal(title, meta, onOk, withForgot) {
  const field = pinField('pin1', UI.pinLabel), inp = field.querySelector('input');
  const close = modal(title, field,
    h('div', { class: 'row' },
      h('button', { class: 'btn btn-primary', type: 'button', 'data-pin-enter': '', onclick: async () => {
        if (await lockedMsg()) return;
        const a = toWestern(inp.value);
        if (await sha256(meta.salt + a) === meta.hash) { await okTry(); close(); await onOk(); return; }
        await failTry();
        inp.value = '';
      } }, UI.enter),
      withForgot ? h('button', { class: 'btn btn-ghost btn-small', type: 'button', 'data-forgot': '', onclick: () => recoverPin(meta) }, UI.forgotPin) : null));
  const f = document.getElementById('pin1');
  f.focus();
  f.addEventListener('keydown', e => { if (e.key === 'Enter') document.querySelector('[data-pin-enter]').click(); });
}
function recoverPin(meta) {
  if (!meta.rhash) { toast(UI.recoveryNone, 'error'); return; }
  const inp = h('input', { id: 'rcode', type: 'text', autocomplete: 'off', class: 'rcode-in', maxlength: '12', 'aria-label': 'رمز الاستعادة' });
  modal(UI.recoveryTitle, h('p', { class: 'muted small' }, UI.recoveryEnter), inp,
    h('button', { class: 'btn btn-primary', type: 'button', 'data-recovery-enter': '', onclick: async () => {
      if (await lockedMsg()) return;
      if (await sha256(meta.rsalt + normCode(inp.value)) !== meta.rhash) { await failTry(); return; }
      await okTry();
      setPinModal(UI.newPinTitle, null, async (a, close) => {
        if (!(await safe(async () => S.store.putMeta('pin', await makePinMeta(a, meta))))) return;
        close(); toast(UI.pinChanged, 'ok'); S.parentMode = true; renderAll();
      });
    } }, UI.enter));
  inp.focus();
}
function exitParent() { S.parentMode = false; renderAll(); }
async function changePin() {
  const old = await S.store.getMeta('pin').catch(() => null);
  setPinModal(UI.changePin.replace('🔑 ', ''), null, async (a, close) => {
    if (await safe(async () => S.store.putMeta('pin', await makePinMeta(a, old)))) { close(); toast(UI.pinChanged, 'ok'); }
  });
}
/* رمز المعلم: يُنشئه الوالدان ويغيّرانه ويلغيانه */
async function setTeacherPin() {
  const pm = await S.store.getMeta('pin').catch(() => null);
  setPinModal(UI.teacherPinTitle, UI.teacherPinIntro, async (a, close) => {
    if (pm && await sha256(pm.salt + a) === pm.hash) { toast(UI.teacherPinSame, 'error'); return; }
    if (await safe(async () => S.store.putMeta('tpin', await makePinMeta(a)))) { S.hasTeacher = true; close(); toast(UI.teacherSaved, 'ok'); renderAll(); }
  });
}
async function removeTeacherPin() {
  if (!confirm(UI.removeTeacherConfirm)) return;
  if (await safe(() => S.store.putMeta('tpin', null))) { S.hasTeacher = false; renderAll(); }
}
async function enterTeacher() {
  const meta = await S.store.getMeta('tpin').catch(() => null);
  if (!meta) return;
  pinEntryModal(UI.teacherPinTitle, meta, async () => { S.teacher = true; S.parentMode = false; S.teacherChild = null; renderAll(); }, false);
}
function exitTeacher() { Player.stop(); S.teacher = false; S.teacherChild = null; renderAll(); }

/* ---------- لوحة المتابعة: للوالدين والمعلم ---------- */
async function childStats(p) {
  const pr = loadProgress(await S.store.getProgress(p.id).catch(() => null));
  const recs = await S.store.getRecs(p.id).catch(() => ({}));
  const b = badgesFor(pr, recs);
  return { pr, recs, read: storyReadCount(pr), rec: storyRecordedCount(recs), quiz: pr.quiz.best, badges: Object.values(b).filter(Boolean).length };
}
const fmtDate = t => { try { return new Date(t).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return ''; } };
function dashEl(p) {
  const box = h('div', { class: 'dash', 'data-dash': p.id });
  childStats(p).then(st => {
    const gi2 = p.gender === 'f' ? 1 : 0;
    const meter = (label, n, t) => h('div', { class: 'meter' },
      h('span', { class: 'small', plain: T(label) }),
      h('span', { class: 'bar', 'aria-hidden': 'true' }, h('span', { class: 'fill', style: 'width:' + Math.round(100 * n / t) + '%' })));
    box.append(
      meter(UI.dashRead.replace('{n}', arNum(st.read)), st.read, 16),
      meter(UI.dashRec.replace('{n}', arNum(st.rec)), st.rec, 16),
      meter(UI.dashQuiz.replace('{n}', arNum(st.quiz)), st.quiz, 5),
      meter(UI.dashBadges.replace('{n}', arNum(st.badges)), st.badges, 5),
      h('p', { class: 'small muted', plain: T(st.pr.lastAt ? UI.dashLast.replace('{d}', fmtDate(st.pr.lastAt)) : UI.dashNever[gi2]) }));
  });
  return box;
}

/* =====================================================================
 * وضع الوالدين: تسجيل الكتاب بصوت الأهل، وإدارة الأطفال، والمعلم، والنسخ الاحتياطي
 * ===================================================================== */
function viewParent() {
  const keys = allNarrationKeys();
  const sec = h('section', { class: 'card parent' }, h('h2', { class: 'heading' }, UI.parentTitle));
  /* ١. تسجيل الكتاب بصوت الأهل */
  const narr = h('div', { class: 'parent-block' },
    h('h3', { class: 'small strong' }, UI.narrateBtn.replace('🎙 ', '')),
    h('p', { class: 'muted small' }, UI.narrateIntro),
    h('p', { class: 'small', 'data-narr-total': '' }),
    h('button', { class: 'btn btn-primary', type: 'button', 'data-narrate': '', onclick: () => openNarrator() }, UI.narrateBtn));
  loadParentRecs().then(r => {
    const el = narr.querySelector('[data-narr-total]');
    if (el) el.textContent = T(u('narrateProgress', { n: arNum(keys.filter(k => r[k]).length), t: arNum(keys.length) }));
  });
  sec.append(narr);
  /* ٢. الأطفال ومتابعتهم */
  const kids = h('div', { class: 'parent-block' }, h('h3', { class: 'small strong' }, UI.childrenTitle));
  for (const p of S.profiles.slice().sort((a, b) => a.created - b.created)) {
    const gi2 = p.gender === 'f' ? 1 : 0;
    kids.append(h('div', { class: 'profile-row kid' },
      h('span', { class: 'pname strong' }, h('span', { class: 'avatar av-' + p.gender, 'aria-hidden': 'true' }, avatarOf(p)), ' ', h('span', { plain: p.name })),
      dashEl(p),
      h('div', { class: 'profile-tools' },
        h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => exportDialog(p) }, UI.exportBtn),
        h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => deleteChildRecs(p) }, UI.deleteChildRecs[gi2]),
        trashBtn(p),
        h('button', { class: 'btn btn-small btn-danger', type: 'button', onclick: () => deleteProfile(p) }, UI.deleteProfile))));
  }
  kids.append(addChildForm(async () => { renderAll(); }));
  sec.append(kids);
  /* ٣. المعلم */
  sec.append(h('div', { class: 'parent-block' },
    h('h3', { class: 'small strong' }, UI.teacherPinTitle),
    h('p', { class: 'muted small' }, UI.teacherPinIntro),
    h('div', { class: 'row' },
      h('button', { class: 'btn btn-ghost', type: 'button', 'data-teacher-pin': '', onclick: setTeacherPin }, S.hasTeacher ? UI.changeTeacherPin : UI.setTeacherPin),
      S.hasTeacher ? h('button', { class: 'btn btn-ghost btn-danger', type: 'button', onclick: removeTeacherPin }, UI.removeTeacherPin) : null)));
  /* ٤. النسخ الاحتياطي وحزمة الصوت */
  const fileIn = h('input', { type: 'file', accept: '.json,.dulluni,application/json', hidden: true, 'data-restore-input': '' });
  fileIn.addEventListener('change', () => { if (fileIn.files[0]) restoreBackup(fileIn.files[0]); fileIn.value = ''; });
  const usage = h('p', { class: 'muted small', 'data-usage': '' });
  if (navigator.storage && navigator.storage.estimate) navigator.storage.estimate().then(e => {
    if (e && e.usage) usage.textContent = T(UI.storageUse.replace('{n}', arNum(Math.max(1, Math.round(e.usage / 1048576)))));
  }).catch(() => {});
  sec.append(h('div', { class: 'parent-block' },
    h('h3', { class: 'small strong' }, UI.backupTitle),
    h('p', { class: 'muted small' }, UI.backupIntro),
    h('div', { class: 'row' },
      h('button', { class: 'btn', type: 'button', 'data-backup': '', onclick: () => doBackup('backup') }, UI.backupBtn),
      h('button', { class: 'btn btn-ghost', type: 'button', 'data-restore': '', onclick: () => fileIn.click() }, UI.restoreBtn),
      fileIn),
    h('h3', { class: 'small strong' }, UI.voicePackTitle),
    h('p', { class: 'muted small' }, UI.voicePackIntro),
    h('div', { class: 'row' }, h('button', { class: 'btn btn-ghost', type: 'button', 'data-voicepack': '', onclick: () => doBackup('voicepack') }, UI.voicePackBtn)),
    usage,
    !NATIVE && S.persistent === false ? h('p', { class: 'muted small' }, UI.notPersistent) : null));
  /* ٥. أوراق العمل والرمز */
  sec.append(h('div', { class: 'parent-block row' },
    CAP ? null : h('button', { class: 'btn btn-ghost', type: 'button', 'data-worksheet': '', onclick: showWorksheet }, UI.worksheetBtn),
    h('button', { class: 'btn btn-ghost', type: 'button', onclick: changePin }, UI.changePin),
    h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => issueRecovery() }, UI.newRecovery),
    h('button', { class: 'btn btn-ghost', type: 'button', onclick: exitParent }, UI.exitParent)));
  sec.append(h('p', { class: 'muted small version', plain: T(UI.version.replace('{v}', arNum(APP_VERSION))) }));
  return sec;
}
function trashBtn(p) {
  const b = h('button', { class: 'btn btn-small btn-ghost', type: 'button', hidden: true, 'data-trash-btn': p.id, onclick: () => showTrash(p) });
  S.store.getRecs(p.id).then(all => {
    const n = Object.keys(all).filter(k => k.endsWith('|trash')).length;
    if (n) { b.textContent = T(UI.trashBtn.replace('{n}', arNum(n))); b.hidden = false; }
  }).catch(() => {});
  return b;
}
async function deleteProfile(p) {
  const msg = UI.deleteProfileConfirm[p.gender === 'f' ? 1 : 0].split('{name}').join(p.name);
  if (!confirm(msg)) return;
  if (await safe(() => S.store.deleteProfile(p.id))) {
    const notes = (await S.store.getMeta('notes').catch(() => null)) || {};
    if (notes[p.id]) { delete notes[p.id]; await safe(() => S.store.putMeta('notes', notes)); }
    S.profiles = S.profiles.filter(x => x.id !== p.id); renderAll();
  }
}
async function deleteChildRecs(p) {
  if (!confirm(UI.deleteRecsConfirm.split('{name}').join(p.name))) return;
  const all = await S.store.getRecs(p.id).catch(() => ({}));
  for (const k of Object.keys(all)) await safe(() => S.store.delRec(p.id, k));
  toast(UI.recsDeleted, 'ok');
  renderAll();
}

/* =====================================================================
 * وضع المعلم: متابعة، واستماع، وملاحظة لكل تسجيل؛ لا حذف ولا استعادة
 * ===================================================================== */
function recLabel(key) {
  const m = /^p(\d+)(?:\.s(\d+))?$/.exec(key);
  if (m) { const p = STORY_PAGES.find(x => x.n === +m[1]); return arNum(m[1]) + ' — ' + (p ? p.title : '') + (m[2] != null ? ' (' + arNum(+m[2] + 1) + ')' : ''); }
  if (key === 'cover') return CHAPTERS.c0;
  const v = VALUES.find(x => x.id === key);
  return v ? ACTIVITY_TITLES.values + ' — ' + v.title : key;
}
function viewTeacher() {
  const sec = h('section', { class: 'card parent teacher' }, h('h2', { class: 'heading' }, UI.teacherTitle));
  const kid = S.teacherChild && S.profiles.find(p => p.id === S.teacherChild);
  if (!kid) {
    for (const p of S.profiles.slice().sort((a, b) => a.created - b.created)) {
      sec.append(h('div', { class: 'profile-row kid' },
        h('span', { class: 'pname strong' }, h('span', { class: 'avatar av-' + p.gender, 'aria-hidden': 'true' }, avatarOf(p)), ' ', h('span', { plain: p.name })),
        dashEl(p),
        h('button', { class: 'btn btn-small', type: 'button', 'data-teacher-kid': p.id, onclick: () => { S.teacherChild = p.id; renderAll(); } }, UI.listenRecs)));
    }
    return sec;
  }
  sec.append(h('div', { class: 'row' },
    h('button', { class: 'btn btn-small btn-ghost', type: 'button', onclick: () => { Player.stop(); S.teacherChild = null; renderAll(); } }, '➡ ', UI.back),
    h('span', { class: 'strong', plain: kid.name })));
  const list = h('div', { class: 'tlist' });
  sec.append(list);
  Promise.all([S.store.getRecs(kid.id).catch(() => ({})), S.store.getMeta('notes').catch(() => null)]).then(([recs, allNotes]) => {
    const notes = (allNotes && allNotes[kid.id]) || {};
    const order = k => { const m = /^p(\d+)(?:\.s(\d+))?$/.exec(k); return k === 'cover' ? -1 : m ? (+m[1]) * 100 + (m[2] ? +m[2] + 1 : 0) : 10000; };
    const keys = Object.keys(recs).filter(k => !isAux(k)).sort((a, b) => order(a) - order(b));
    if (!keys.length) { list.append(h('p', { class: 'muted' }, UI.noRecsYet)); return; }
    for (const k of keys) {
      const rec = recs[k], n = notes[k] || {};
      const ta = h('textarea', { class: 'note-in', rows: '2', maxlength: '300', 'aria-label': UI.noteLabel.replace(DIAC, '') });
      ta.value = n.text || '';
      const redo = h('input', { type: 'checkbox', checked: !!n.redo });
      list.append(h('div', { class: 'trow', 'data-trow': k },
        h('p', { class: 'strong small', plain: T(recLabel(k)) + ' (' + fmtDur(rec.duration) + ')' }),
        isStale(k, rec) ? h('p', { class: 'small warn-line' }, UI.textChanged) : null,
        player(rec),
        h('label', { class: 'field' }, h('span', { class: 'small' }, UI.noteLabel), ta),
        h('div', { class: 'row' },
          h('label', { class: 'radio small' }, redo, ' ', UI.redoLabel),
          h('button', { class: 'btn btn-small', type: 'button', 'data-note-save': k, onclick: async () => {
            const all = (await S.store.getMeta('notes').catch(() => null)) || {};
            const mine = all[kid.id] = all[kid.id] || {};
            const text = ta.value.replace(/\s+/g, ' ').trim().slice(0, 300);
            if (!text && !redo.checked) delete mine[k]; else mine[k] = { text, redo: redo.checked, at: Date.now() };
            if (await safe(() => S.store.putMeta('notes', all))) toast(UI.noteSaved, 'ok');
          } }, UI.save))));
    }
  });
  return sec;
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
    h('button', { class: 'btn btn-primary btn-big', type: 'button', 'data-start': '', onclick: () => go(1) }, u('start')),
    S.narrator ? null : recBox('cover', true));
}

/* ---------- صفحة القصة: النص أولًا ثم المشهد ---------- */
function echoBox(p, sents) {
  const done = sents.filter((_, i) => S.recs['p' + p.n + '.s' + i]).length;
  const box = h('div', { class: 'echo' },
    h('p', { class: 'small muted' }, u('echoIntro')),
    h('p', { class: 'small strong', 'data-echo-count': '', plain: T(UI.echoDone.replace('{n}', arNum(done)).replace('{t}', arNum(sents.length))) }));
  sents.forEach((s2, i) => {
    const key = 'p' + p.n + '.s' + i;
    box.append(h('div', { class: 'echo-row', 'data-echo': String(i) },
      voiced(h('p', { class: 'echo-text', 'data-es': String(i) }, s2), { key: null, text: s2, sel: '[data-es="' + i + '"]', ttsOnly: true }),
      recBox(key, false, true)));
  });
  return box;
}
function viewStory({ p }) {
  const sents = sentences(p.text);
  const used = new Set(), glosses = glossFor(p.n);
  const body = h('div', { class: 'story-text', lang: 'ar' });
  sents.forEach((s, i) => { body.append(h('span', { class: 'sent', 'data-s': String(i) }, sentenceNodes(s, glosses, used)), ' '); });
  const bodyUnit = { key: 'p' + p.n, text: p.text, sel: '.story .story-text', sentences: sents.map((s, i) => ({ text: s, sel: '.story [data-s="' + i + '"]' })) };
  const echo = !S.narrator && !S.readonly && S.session.echo[p.n];
  return h('article', { class: 'card story' },
    h('div', { class: 'story-main' },
      h('div', { class: 'chapter' }, CHAPTERS[p.chapter]),
      voiced(h('h2', { class: 'heading' }, h('span', { class: 'pnum', plain: arNum(p.n) }), ' ', p.title), { key: 'p' + p.n + ':t', text: p.title, sel: '.story .heading' }),
      voiced(body, bodyUnit),
      glosses.length ? h('p', { class: 'muted small' }, UI.glossaryHint) : null,
      /* في وضع تسجيل الأهل تظهر كلمات القاموس هنا لتُسجَّل دون فتح نوافذ */
      S.narrator && glosses.length ? h('div', { class: 'narr-list' }, glosses.map(g =>
        voiced(h('p', { class: 'loc-desc', 'data-gl-text': g.match }, h('strong', null, g.title), '. ', g.meaning), { key: 'gl:' + g.match, text: g.title + '. ' + g.meaning, sel: '[data-gl-text="' + g.match + '"]' }))) : null,
      h('div', { class: 'row tools' },
        h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => showSources(p) }, UI.sourceBtn),
        S.narrator || S.readonly ? null : h('button', { class: 'btn btn-ghost', type: 'button', 'data-echo-toggle': '', 'aria-pressed': String(!!echo), onclick: () => { Player.stop(); S.session.echo[p.n] = !echo; renderAll(); } }, '🎙 ', echo ? UI.echoOff : UI.echoOn)),
      S.narrator ? null : (echo ? echoBox(p, sents) : recBox('p' + p.n, false))),
    h('div', { class: 'story-side' },
      h('figure', null, sceneEl(p), voiced(h('figcaption', { class: 'scene-cap' }, p.caption), { key: 'p' + p.n + ':c', text: p.caption, sel: '.story .scene-cap' })),
      PLACE_PHOTOS['p' + p.n] ? photoEl(PLACE_PHOTOS['p' + p.n]) : null));
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
      svg('circle', { cx: l.cx, cy: l.cy, r: '22', class: 'hit' }),
      svg('circle', { cx: l.cx, cy: l.cy, r: '10', class: 'dotc' }),
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
    const ready = S.readonly || !!S.progress.heard[v.id] || !!S.recs[v.id] || !TTS.supported();
    const onDone = () => { if (!S.progress.heard[v.id]) { S.progress.heard[v.id] = true; saveProgress(); renderAll(); } };
    return h('div', { class: 'value-card' + (open ? ' open' : ''), 'data-value': v.id },
      h('h3', { class: 'value-title' }, h('span', { 'aria-hidden': 'true' }, v.icon), ' ', v.title),
      voiced(h('p', { class: 'value-q', 'data-vq': v.id }, v.q), { key: v.id + ':q', text: v.q, sel: qSel, onDone }),
      S.narrator ? null : recBox(v.id, true),
      open ? voiced(h('p', { class: 'value-a', 'data-va': v.id }, v.a), { key: v.id + ':a', text: v.a, sel: aSel })
           : h('div', { class: 'reveal-wrap' },
               ready ? null : h('p', { class: 'small muted' }, u('valuesWait')),
               h('button', { class: 'btn btn-primary', type: 'button', disabled: !ready, 'data-reveal': v.id, onclick: () => {
                 S.progress.values[v.id] = true; saveProgress(); renderAll(); announceBadge('values', before);
                 Player.play(autoSeq([{ key: v.id + ':a', text: v.a, sel: aSel }]));
               } }, u('reveal'))));
  });
  return h('section', { class: 'card activity' },
    ...activityHead('values'),
    voiced(h('p', { class: 'strip' }, UI.valuesStrip), { key: 'values:strip', text: UI.valuesStrip, sel: '.strip' }),
    h('div', { class: 'values-grid' }, cards));
}

/* ---------- الاختبار: المحاولة الأولى وحدها تُحتسب ---------- */
const QUIZ_ROUND = 5;
function newQuizRound() {
  const qs = shuffle(QUIZ).slice(0, QUIZ_ROUND);
  return { i: 0, qs, first: {}, solved: {}, wrong: {}, order: qs.map(q => shuffle(q.options.map((_, k) => k))), done: false };
}
function citeEl(src) {
  return src ? h('span', { class: 'cite' }, ' — ', h('span', { plain: src[0] }), ' ', h('span', { class: 'grade grade-' + src[1] }, GRADES[src[1]])) : null;
}
function quizNarrator() {
  return QUIZ.map(q => h('div', { class: 'narr-q' },
    voiced(h('h3', { class: 'question', 'data-qq': q.id }, q.q), { key: q.id, text: q.q, sel: '[data-qq="' + q.id + '"]' }),
    q.options.map((o, k) => voiced(h('p', { class: 'opt-text', 'data-qo': q.id + k }, o), { key: q.id + ':o' + k, text: o, sel: '[data-qo="' + q.id + k + '"]' })),
    q.explain ? voiced(h('p', { class: 'explain', 'data-qe': q.id }, q.explain, citeEl(q.source)), { key: q.id + ':e', text: q.explain, sel: '[data-qe="' + q.id + '"]' }) : null));
}
function viewQuiz() {
  const pr = S.progress;
  const sec = h('section', { class: 'card activity quiz' }, ...activityHead('quiz'), instr(UI.quizRule, 'muted small instr'));
  if (S.narrator) { sec.append(...quizNarrator()); return sec; }
  if (!S.session.quiz) S.session.quiz = newQuizRound();
  const R = S.session.quiz;
  if (R.done) {
    const score = R.qs.filter(q => R.first[q.id] === q.correct).length;
    sec.append(h('div', { class: 'result' },
      h('p', { class: 'score' }, u('quizScore', { n: arNum(score) })),
      h('p', { class: 'muted' }, u('quizBest', { n: arNum(pr.quiz.best) })),
      pr.quiz.best >= 4 ? h('p', { class: 'badge-line' }, '🏅 ', badgeName('quiz')) : null,
      h('button', { class: 'btn btn-primary', type: 'button', onclick: () => { S.session.quiz = newQuizRound(); renderAll(); } }, u('retake'))));
    return sec;
  }
  const q = R.qs[R.i];
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
    opts.append(h('div', { class: 'opt-row' }, btn));
  });
  /* زر استماع واحد يقرأ السؤال ثم خياراته بالترتيب المعروض، مع إبراز كل خيار */
  const qUnit = { key: q.id, text: q.q, sel: '.quiz .question' };
  const optUnits = R.order[R.i].map(k => ({ key: q.id + ':o' + k, text: q.options[k], sel: '[data-opt="' + k + '"]' }));
  const qh = h('h3', { class: 'question' }, q.q);
  const allBtn = h('button', { class: 'spk spk-icon', type: 'button', 'aria-label': 'استمع إلى السؤال والخيارات', 'data-listen-all': '' }, '🔊');
  allBtn.addEventListener('click', e => { e.stopPropagation(); Player.play(autoSeq([qUnit].concat(optUnits)), allBtn); });
  qh.append(' ', h('span', { class: 'vbar' }, allBtn));
  sec.append(
    h('p', { class: 'muted small', plain: T(u('qCounter', { n: arNum(R.i + 1) })) }),
    qh,
    opts);
  if (R.msg === 'no' && !solved) sec.append(h('p', { class: 'feedback no', role: 'status' }, u('tryAgain')));
  if (solved) {
    sec.append(h('p', { class: 'feedback ok', role: 'status' }, u('correct')));
    if (q.explain) sec.append(voiced(h('p', { class: 'explain' }, q.explain, citeEl(q.source)), { key: q.id + ':e', text: q.explain, sel: '.quiz .explain' }));
    const last = R.i === R.qs.length - 1;
    sec.append(h('button', { class: 'btn btn-primary', type: 'button', onclick: () => {
      R.msg = null; Player.stop();
      if (!last) { R.i++; renderAll(); return; }
      const before = badges();
      const score = R.qs.filter(x => R.first[x.id] === x.correct).length;
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
  const done = S.narrator || S.readonly;
  if (!S.session.jars) S.session.jars = { charity: 0, home: 0, project: 0 };
  const J = S.session.jars;
  const placed = J.charity + J.home + J.project;
  const shown = S.session.marketOk ? splitThirds(n) : null;
  const setN = d => { S.session.marketN = Math.min(99, Math.max(3, S.session.marketN + d)); S.session.jars = null; S.session.marketMsg = null; S.session.marketOk = false; renderAll(); };
  const setJ = (id, d) => {
    const nv = J[id] + d;
    if (nv < 0 || (d > 0 && placed >= n)) return;
    J[id] = nv; S.session.marketMsg = null; S.session.marketOk = false; renderAll();
  };
  const jars = h('div', { class: 'jars' }, MARKET.jars.map(j => h('div', { class: 'jar', 'data-jar': j.id },
    h('div', { class: 'jar-icon jar-' + j.id, 'aria-hidden': 'true' }, j.icon),
    voiced(h('div', { 'data-jartext': j.id }, h('h3', { class: 'jar-title' }, j.title), h('p', { class: 'small muted' }, j.desc)),
      { key: 'mk:' + j.id, text: j.title + '. ' + j.desc, sel: '[data-jartext="' + j.id + '"]' }),
    done ? null : h('div', { class: 'stepper small-step' },
      h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.less, 'data-jar-less': j.id, disabled: J[j.id] === 0, onclick: () => setJ(j.id, -1) }, '−'),
      h('span', { class: 'jar-count', 'data-jar-count': j.id, plain: arNum(J[j.id]) + ' ' }, '🪙'),
      h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.more, 'data-jar-more': j.id, disabled: placed >= n, onclick: () => setJ(j.id, 1) }, '+')))));
  const sec = h('section', { class: 'card activity' },
    ...activityHead('market'),
    voiced(h('blockquote', { class: 'hadith' }, MARKET.hadith, citeEl(MARKET.hadithSource)),
      { key: 'mk:h', text: MARKET.hadith, sel: '.hadith' }),
    instr(u('marketIntro'), 'instr'));
  if (!done) {
    sec.append(h('div', { class: 'stepper' },
      h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.less, onclick: () => setN(-1) }, '−'),
      h('span', { class: 'stepper-val', plain: arNum(n) }), h('span', { 'aria-hidden': 'true' }, ' 🪙 '),
      h('button', { class: 'btn btn-icon', type: 'button', 'aria-label': UI.more, onclick: () => setN(1) }, '+')),
      instr(u('marketSteps'), 'muted small instr'),
      h('p', { class: 'small strong', 'data-placed': '', plain: T(UI.marketPlaced.replace('{a}', arNum(placed)).replace('{n}', arNum(n))) }));
  }
  sec.append(jars);
  if (!done) {
    if (S.session.marketMsg === 'no') sec.append(h('p', { class: 'feedback no', role: 'status' }, u('marketWrong')));
    if (shown) sec.append(h('p', { class: 'feedback ok', role: 'status' }, u('marketRight')), h('p', { class: 'muted small' }, UI.marketNote));
    sec.append(h('button', { class: 'btn btn-primary', type: 'button', 'data-distribute': '', disabled: placed !== n, onclick: () => {
      const want = splitThirds(n);
      if (want.charity === J.charity && want.home === J.home && want.project === J.project) {
        const before = badges();
        pr.market.last = want; pr.market.done = true; S.session.marketOk = true; saveProgress(); renderAll(); announceBadge('market', before);
      } else { S.session.marketMsg = 'no'; renderAll(); }
    } }, UI.check));
  }
  sec.append(voiced(h('p', { class: 'note' }, MARKET.note), { key: 'mk:n', text: MARKET.note, sel: '.note' }));
  return sec;
}

/* ---------- مشروعي الصغير: دفتر بيع صغير يحسب الربح ثم يوزّعه في الحصالات ---------- */
function viewProject() {
  const pr = S.progress;
  const sec = h('section', { class: 'card activity' }, ...activityHead('project'));
  if (S.narrator) return sec;
  sec.append(instr(u('projIntro'), 'instr'), h('p', { class: 'strip' }, UI.projHonest));
  const num = v => { const x = parseInt(toWestern(String(v)).replace(/[^\d]/g, ''), 10); return isNaN(x) ? null : Math.min(9999, x); };
  if (!S.readonly) {
    const what = h('input', { type: 'text', maxlength: '30', id: 'proj-what', autocomplete: 'off' });
    const cost = h('input', { type: 'text', inputmode: 'numeric', maxlength: '4', id: 'proj-cost', class: 'num-in' });
    const price = h('input', { type: 'text', inputmode: 'numeric', maxlength: '4', id: 'proj-price', class: 'num-in' });
    sec.append(h('form', { class: 'proj-form', onsubmit: e => {
      e.preventDefault();
      const w = what.value.replace(/\s+/g, ' ').trim(), c = num(cost.value), sp = num(price.value);
      if (!w || c == null || sp == null) { toast(u('projBad'), 'error'); return; }
      if (pr.project.length >= 30) { toast(UI.projFull, 'error'); return; }
      pr.project.push({ what: w.slice(0, 30), cost: c, price: sp, at: Date.now() }); saveProgress(); renderAll();
      const f = document.getElementById('proj-what'); if (f) f.focus();
    } },
      h('label', { class: 'field' }, h('span', null, u('projWhat')), what),
      h('div', { class: 'row' },
        h('label', { class: 'field' }, h('span', null, UI.projCost), cost),
        h('label', { class: 'field' }, h('span', null, UI.projPrice), price)),
      h('button', { class: 'btn btn-primary', type: 'submit', 'data-proj-add': '' }, '➕ ', UI.add)));
  }
  if (!pr.project.length) { sec.append(h('p', { class: 'muted' }, UI.projEmpty)); return sec; }
  const total = pr.project.reduce((t, e) => t + (e.price - e.cost), 0);
  const tbl = h('table', { class: 'ledger' },
    h('thead', null, h('tr', null, h('th', null, u('projWhat').replace('؟', '')), h('th', null, UI.projCost), h('th', null, UI.projPrice), h('th', null, UI.projProfit), h('th', null))),
    h('tbody', null, pr.project.map((e, i) => {
      const pf = e.price - e.cost;
      return h('tr', { 'data-proj-row': String(i) },
        h('td', { plain: e.what }), h('td', { plain: arNum(e.cost) }), h('td', { plain: arNum(e.price) }),
        h('td', { class: pf < 0 ? 'loss' : 'gain', plain: pf < 0 ? T(UI.projLoss) + ' ' + arNum(-pf) : arNum(pf) }),
        h('td', null, S.readonly ? null : h('button', { class: 'btn btn-icon btn-ghost', type: 'button', 'aria-label': UI.remove, onclick: () => { pr.project.splice(i, 1); saveProgress(); renderAll(); } }, '🗑')));
    })));
  sec.append(h('div', { class: 'ledger-wrap' }, tbl),
    h('p', { class: 'score', 'data-proj-total': '', plain: T(u('projTotal', { n: total < 0 ? T(UI.projLoss) + ' ' + arNum(-total) : arNum(total) })) }));
  if (total >= 3 && !S.readonly) sec.append(h('button', { class: 'btn btn-primary', type: 'button', 'data-proj-market': '', onclick: () => {
    S.session.marketN = Math.min(99, total); S.session.jars = null; S.session.marketMsg = null; S.session.marketOk = false; goId('market');
  } }, u('projToMarket')));
  return sec;
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
  const read = storyReadCount();
  const list = h('ul', { class: 'badges' }, Object.keys(BADGES).map(k =>
    h('li', { class: b[k] ? 'got' : 'not', 'data-badge': k },
      h('span', { class: 'b-icon', 'aria-hidden': 'true' }, b[k] ? BADGE_ICONS[k] : '○'), ' ',
      h('span', null, badgeName(k)),
      b[k] ? null : h('span', { class: 'small muted' }, ' — ', k === 'narrator' ? u('narratorRule', { n: arNum(rec) }) : UI.notYet))));
  const certText = [u('certTitle'), u('certTo'), S.profile.name, u('certBody')].join('. ');
  if (read < STORY_PAGES.length) {
    return h('section', { class: 'card activity' },
      activityArt('certificate'),
      h('div', { class: 'cert-locked' },
        h('p', { class: 'strong', 'data-cert-locked': '' }, u('certLocked', { n: arNum(read) })),
        h('button', { class: 'btn btn-primary', type: 'button', onclick: showToc }, '☰ ', u('openToc'))),
      h('h3', { class: 'small strong' }, UI.badgesTitle), list);
  }
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

/* ---------- أوراق عمل للطباعة (للوالدين والمعلم، خارج تطبيق أندرويد) ---------- */
function showWorksheet() {
  const old = document.getElementById('worksheet'); if (old) old.remove();
  const letters = 'أبجدهوزحطيكلمنسعفصقرشتثخذ';
  const gl = shuffle(GLOSSARY).slice(0, 8);
  const meanings = shuffle(gl.map((g, i) => ({ i, m: g.meaning })));
  const ws = h('div', { id: 'worksheet', class: 'worksheet' },
    h('h1', null, UI.wsTitle),
    h('p', null, UI.wsName, ' ', h('span', { class: 'ws-line', plain: '' })),
    h('h2', null, '١. ', UI.wsGloss),
    h('div', { class: 'ws-cols' },
      h('ol', { class: 'ws-words' }, gl.map(g => h('li', null, g.title, ' ', h('span', { class: 'ws-box', plain: '' })))),
      h('ol', { class: 'ws-means', type: 'none' }, meanings.map((x, j) => h('li', null, h('strong', { plain: letters[j] + ') ' }), x.m)))),
    h('h2', null, '٢. ', UI.wsTimeline),
    h('ul', { class: 'ws-tl' }, shuffle(TIMELINE).map(t => h('li', null, h('span', { class: 'ws-box', plain: '' }), ' ', t.text))),
    h('h2', null, '٣. ', UI.wsQuiz),
    h('ol', { class: 'ws-quiz' }, shuffle(QUIZ).slice(0, 5).map(q => h('li', null, h('p', null, q.q),
      h('ul', null, q.options.map(o => h('li', null, h('span', { class: 'ws-circle', plain: '' }), ' ', o)))))));
  document.body.append(ws);
  document.body.classList.add('print-ws');
  const done = () => { document.body.classList.remove('print-ws'); ws.remove(); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  window.print();
  setTimeout(() => { if (!matchMedia('print').matches && document.getElementById('worksheet')) done(); }, 1500);
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
async function recToB64(r) { return { mime: r.mime, duration: r.duration, at: r.at || 0, tv: r.tv || '', data: await blobToB64(r.blob) }; }
async function recsToB64(all) {
  const out = {};
  for (const k of Object.keys(all)) { if (!isAux(k)) out[k] = await recToB64(all[k]); }
  return out;
}
/* في النسخة المصدَّرة يبقى الصوت نصًّا مشفّرًا ويُشغَّل مباشرة، فلا يُفكّ كله عند الفتح */
function b64Recs(obj) {
  const out = {};
  for (const k of Object.keys(obj || {})) { const r = obj[k]; if (r && typeof r.data === 'string') out[k] = { data: r.data, mime: r.mime, duration: r.duration, at: r.at || 0, tv: r.tv || '' }; }
  return out;
}
const safeJson = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

/* كاتب ملفات تدريجي: لا يُجمع الملف نصًّا واحدًا في الذاكرة.
 * أندرويد: كتابة ثم إلحاق في ذاكرة التخزين المؤقت، ثم نافذة المشاركة؛ وغيره: تنزيل */
const TMP_PREFIXES = ['dulluni-souq-', 'دلوني-'];
async function cleanTmp() {
  if (!(CAP && CAP_PLUGINS.Filesystem)) return;
  try {
    const r = await CAP_PLUGINS.Filesystem.readdir({ path: '', directory: 'CACHE' });
    for (const f of (r.files || [])) {
      const nm = typeof f === 'string' ? f : f.name;
      if (TMP_PREFIXES.some(pf => nm.startsWith(pf))) await CAP_PLUGINS.Filesystem.deleteFile({ path: nm, directory: 'CACHE' }).catch(() => {});
    }
  } catch (e) { /* ليس مهمًّا */ }
}
async function fileWriter(fname, mime) {
  if (CAP && CAP_PLUGINS.Filesystem && CAP_PLUGINS.Share) {
    await cleanTmp();
    let first = true;
    return {
      async write(str) {
        if (first) { await CAP_PLUGINS.Filesystem.writeFile({ path: fname, data: str, directory: 'CACHE', encoding: 'utf8' }); first = false; }
        else await CAP_PLUGINS.Filesystem.appendFile({ path: fname, data: str, directory: 'CACHE', encoding: 'utf8' });
      },
      async finish() {
        if (first) await this.write('');
        const uri = (await CAP_PLUGINS.Filesystem.getUri({ path: fname, directory: 'CACHE' })).uri;
        await CAP_PLUGINS.Share.share({ title: fname, files: [uri] });
      }
    };
  }
  let blob = new Blob([], { type: mime });
  return {
    async write(str) { blob = new Blob([blob, str], { type: mime }); },
    async finish() {
      const url = URL.createObjectURL(blob);
      const a = h('a', { href: url, download: fname });
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  };
}
async function saveFile(fname, text, mime) { const w = await fileWriter(fname, mime); await w.write(text); await w.finish(); }
const isCancel = e => e && /cancel/i.test(String(e.message || e));

function exportDialog(p) {
  const close = modal(UI.exportBtn.replace('⬇ ', ''),
    h('p', { class: 'muted small', plain: T(UI.exportIntro.split('{name}').join(p.name)) }),
    h('div', { class: 'row' },
      h('button', { class: 'btn btn-primary', type: 'button', 'data-export-child': '', onclick: () => { close(); doExport(p, false); } }, UI.exportChildOnly),
      h('button', { class: 'btn', type: 'button', 'data-export-family': '', onclick: () => { close(); doExport(p, true); } }, UI.exportWithFamily)));
}
async function doExport(p, withFamily) {
  toast(UI.exporting);
  try {
    const progress = loadProgress(await S.store.getProgress(p.id));
    const recs = await recsToB64(await S.store.getRecs(p.id));
    const parentRecs = withFamily ? await recsToB64(await loadParentRecs()) : {};
    const notes = await loadNotes(p.id);
    const payload = { v: 3, exportedAt: new Date().toISOString(), profile: { name: p.name, gender: p.gender }, progress, recs, parentRecs, notes };
    const marker = '<script id="app-' + 'main">';
    if (PRISTINE_HTML.indexOf(marker) < 0) throw new Error('marker');
    /* النسخة المصدَّرة ملف مستقل: تُنزع منها روابط تطبيق الويب حتى لا تطلب ملفات غير موجودة */
    let base = PRISTINE_HTML.replace(new RegExp('<' + '!--pwa-->[\\s\\S]*?<' + '!--/pwa-->'), '<link rel="icon" href="data:,">');
    /* وتُنزع أي سكربتات حقنتها المنصة (مثل جسر تطبيق أندرويد) قبل سكربت الكتاب، فيبقى الملف نظيفًا */
    const j0 = base.indexOf(marker);
    base = base.slice(0, j0).replace(new RegExp('<script\\b[\\s\\S]*?<' + '/script>', 'gi'), '') + base.slice(j0);
    const j = base.indexOf(marker);
    const w = await fileWriter('دلوني-على-السوق-' + p.name.replace(/[\\/:*?"<>|\s]+/g, '-') + '.html', 'text/html;charset=utf-8');
    await w.write(base.slice(0, j));
    await w.write('<script type="application/json" id="export-data">' + safeJson(payload) + '</' + 'script>\n');
    await w.write(base.slice(j));
    await w.finish();
    toast(CAP ? UI.exportDone : UI.exportDone + ' ' + UI.iosNotice, 'ok', CAP ? 5000 : 10000);
  } catch (e) {
    if (isCancel(e)) return;
    toast(UI.exportFail, 'error');
  }
}

/* نسخة احتياطية (الإصدار ٢): سطر أول فيه الأطفال وتقدّمهم والملاحظات، ثم سطر لكل تسجيل.
 * تُكتب سطرًا سطرًا وتُقرأ سطرًا سطرًا، فلا يُحمَّل الملف كله في الذاكرة. الرمز السري لا يُنسخ. */
async function doBackup(kind) {
  toast(UI.exporting, null, 60000);
  try {
    const voice = kind === 'voicepack';
    const profiles = voice ? [] : await S.store.getProfiles();
    const progress = {};
    if (!voice) for (const p of profiles) progress[p.id] = (await S.store.getProgress(p.id)) || null;
    const notes = voice ? {} : ((await S.store.getMeta('notes').catch(() => null)) || {});
    const d = new Date(); const stamp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const w = await fileWriter('dulluni-souq-' + (voice ? 'voices-' : 'backup-') + stamp + '.json', 'application/json');
    await w.write(JSON.stringify({ app: 'dulluni-souq', kind: voice ? 'voicepack' : 'backup', v: 2, version: APP_VERSION, createdAt: d.toISOString(), profiles, progress, notes }) + '\n');
    for (const pid of (voice ? [] : profiles.map(p => p.id)).concat(PARENT_ID)) {
      const recs = await S.store.getRecs(pid);
      for (const k of Object.keys(recs)) {
        if (isAux(k)) continue;
        await w.write(JSON.stringify(Object.assign({ pid, key: k }, await recToB64(recs[k]))) + '\n');
      }
    }
    await w.finish();
    toast(UI.backupDone, 'ok');
  } catch (e) {
    if (isCancel(e)) { toast('', null, 1); return; }
    toast(UI.exportFail, 'error');
  }
}
/* قراءة الملف سطرًا سطرًا */
async function* readLines(file) {
  if (!file.stream) { for (const l of (await file.text()).split('\n')) yield l; return; }
  const reader = file.stream().getReader(); const dec = new TextDecoder();
  let pending = [];
  for (;;) {
    const { done, value } = await reader.read();
    const str = done ? dec.decode() : dec.decode(value, { stream: true });
    let start = 0, i;
    while ((i = str.indexOf('\n', start)) >= 0) { pending.push(str.slice(start, i)); yield pending.join(''); pending = []; start = i + 1; }
    pending.push(str.slice(start));
    if (done) break;
  }
  const last = pending.join('');
  if (last) yield last;
}
/* تنقية البيانات المستعادة: لا يدخل التخزينَ إلا ما يطابق الشكل المتوقع */
const isInt = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;
const PID_RE = /^p[a-z0-9]{4,40}$/;
function cleanProfile(p) {
  if (!p || typeof p.id !== 'string' || !PID_RE.test(p.id) || typeof p.name !== 'string' || !p.name.trim()) return null;
  return { id: p.id, name: p.name.replace(/[\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24), gender: p.gender === 'f' ? 'f' : 'm', created: +p.created || Date.now() };
}
function cleanProgress(r) {
  const pr = freshProgress();
  if (!r || typeof r !== 'object') return pr;
  const flags = (src, ok) => { const o = {}; if (src && typeof src === 'object') for (const k of Object.keys(src)) if (ok(k) && src[k] === true) o[k] = true; return o; };
  pr.tashkeel = r.tashkeel !== false;
  pr.values = flags(r.values, k => VALUES.some(v => v.id === k));
  pr.heard = flags(r.heard, k => VALUES.some(v => v.id === k));
  pr.map = flags(r.map, k => MAP_LOCATIONS.some(l => l.id === k));
  pr.read = flags(r.read, k => STORY_PAGES.some(p => String(p.n) === k));
  if (r.quiz) pr.quiz = { best: isInt(r.quiz.best, 0, 5) ? r.quiz.best : 0, rounds: isInt(r.quiz.rounds, 0, 1e6) ? r.quiz.rounds : 0 };
  pr.timeline = { solved: !!(r.timeline && r.timeline.solved === true) };
  const L = r.market && r.market.last;
  pr.market = { done: !!(r.market && r.market.done === true), last: L && isInt(L.charity, 0, 99) && isInt(L.home, 0, 99) && isInt(L.project, 0, 99) ? { charity: L.charity, home: L.home, project: L.project } : null };
  const st = r.settings || {};
  pr.settings = { font: isInt(st.font, 0, 2) ? st.font : 1, speed: isInt(st.speed, 0, 2) ? st.speed : 1, auto: st.auto !== false };
  pr.project = Array.isArray(r.project) ? r.project.slice(0, 30).filter(e => e && typeof e.what === 'string' && isInt(e.cost, 0, 9999) && isInt(e.price, 0, 9999))
    .map(e => ({ what: e.what.slice(0, 30), cost: e.cost, price: e.price, at: +e.at || 0 })) : [];
  if (typeof r.screen === 'string' && SCREENS.some(x => x.id === r.screen)) pr.screen = r.screen;
  else if (isInt(r.page, 0, 40)) pr.page = r.page;
  pr.lastAt = +r.lastAt || 0;
  return pr;
}
const MIME_RE = /^audio\/[\w.+-]+(;\s*codecs="?[\w.,+-]+"?)?$/i;
const B64_RE = /^[A-Za-z0-9+/]*={0,2}$/;
function cleanRec(r) {
  if (!r || typeof r.data !== 'string' || !r.data || !MIME_RE.test(String(r.mime || '')) || !B64_RE.test(r.data)) return null;
  const dur = +r.duration;
  if (!(dur > 0 && dur <= REC_MAX_MS * 1.5)) return null;
  return { blob: b64ToBlob(r.data, r.mime), mime: r.mime, duration: dur, at: +r.at || Date.now(), tv: typeof r.tv === 'string' ? r.tv.slice(0, 16) : '' };
}
const okKey = k => typeof k === 'string' && k.length > 0 && k.length <= 120 && !/[\u0000-\u001f]/.test(k) && !isAux(k);
async function restoreBackup(file) {
  const it = readLines(file);
  let head;
  try { const first = await it.next(); head = first.done ? null : JSON.parse(first.value); } catch (e) { head = null; }
  if (!head || head.app !== 'dulluni-souq' || !['backup', 'voicepack'].includes(head.kind) || (head.kind === 'backup' && !Array.isArray(head.profiles))) { toast(UI.restoreFail, 'error'); return; }
  if (!confirm(UI.restoreConfirm)) return;
  toast(UI.restoring, null, 60000);
  let ok = true;
  const known = new Set([PARENT_ID]);
  for (const raw of head.profiles || []) {
    const p = cleanProfile(raw); if (!p) continue;
    known.add(p.id);
    ok = (await safe(() => S.store.putProfile(p))) && ok;
    if (head.progress && head.progress[raw.id]) ok = (await safe(() => S.store.putProgress(p.id, cleanProgress(head.progress[raw.id])))) && ok;
  }
  /* ملاحظات المعلم تُدمج مع الموجودة */
  if (head.notes && typeof head.notes === 'object') {
    const all = (await S.store.getMeta('notes').catch(() => null)) || {};
    for (const pid of Object.keys(head.notes)) {
      if (!known.has(pid) || !head.notes[pid] || typeof head.notes[pid] !== 'object') continue;
      const mine = all[pid] = all[pid] || {};
      for (const k of Object.keys(head.notes[pid])) {
        const n = head.notes[pid][k];
        if (okKey(k) && n && typeof n === 'object') mine[k] = { text: String(n.text || '').slice(0, 300), redo: n.redo === true, at: +n.at || 0 };
      }
    }
    ok = (await safe(() => S.store.putMeta('notes', all))) && ok;
  }
  const putOne = async (pid, k, r) => {
    if (!known.has(pid) || !okKey(k)) return;
    const rec = cleanRec(r); if (!rec) return;
    ok = (await safe(() => S.store.putRec(pid, k, rec))) && ok;
  };
  if (head.v === 1) {           /* الصيغة القديمة: كل شيء في سطر واحد */
    for (const pid of Object.keys(head.recs || {})) for (const k of Object.keys(head.recs[pid] || {})) await putOne(pid, k, head.recs[pid][k]);
  } else {
    for (;;) {
      let line;
      try { const n = await it.next(); if (n.done) break; line = n.value; } catch (e) { ok = false; break; }
      if (!line.trim()) continue;
      let r; try { r = JSON.parse(line); } catch (e) { ok = false; continue; }
      if (head.kind === 'voicepack' && r.pid !== PARENT_ID) continue;
      await putOne(r.pid, r.key, r);
    }
  }
  S.profiles = await S.store.getProfiles().catch(() => S.profiles);
  renderAll();
  toast(ok ? UI.restoreDone : UI.storageError, ok ? 'ok' : 'error');
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
      m.m.notes = { [pid]: data.notes || {} };
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
  S.hasTeacher = !S.readonly && !!(await S.store.getMeta('tpin').catch(() => null));
  if (S.readonly && S.profiles[0]) await openProfile(S.profiles[0]); else renderAll();
  cleanTmp();
  if (!S.readonly) purgeTrash();
  /* خطأ غير متوقع: رسالة واحدة بدل صمت الصفحة */
  let lastErr = 0;
  const onErr = () => { if (Date.now() - lastErr > 8000) { lastErr = Date.now(); toast(UI.unexpected, 'error'); } };
  window.addEventListener('error', e => { if (e && e.error) onErr(); });
  window.addEventListener('unhandledrejection', onErr);
  /* زر الرجوع في أندرويد: يغلق النافذة، ثم يعود صفحة، ثم إلى القرّاء، ثم يخرج */
  if (CAP && CAP_PLUGINS.App && CAP_PLUGINS.App.addListener) {
    CAP_PLUGINS.App.addListener('backButton', () => {
      if (S.closeModal) { S.closeModal(); return; }
      if (Player.active()) { Player.stop(); return; }
      if (S.profile) { if (S.page > 0) go(S.page - 1); else toProfiles(); return; }
      if (S.teacher) { if (S.teacherChild) { S.teacherChild = null; renderAll(); } else exitTeacher(); return; }
      if (S.parentMode) { exitParent(); return; }
      CAP_PLUGINS.App.exitApp();
    });
  }

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
  const had = !!navigator.serviceWorker.controller;
  /* عامل جديد تولّى الصفحة: الكتاب الجديد جاهز، فيُعرض زر تحديث ولا يُعاد التحميل فجأة */
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !S.updateReady) { S.updateReady = true; renderAll(); } });
  navigator.serviceWorker.register('./sw.js', { scope: './' }).then(reg => {
    document.addEventListener('visibilitychange', () => { if (!document.hidden) reg.update().catch(() => {}); });
  }).catch(() => { /* الكتاب يعمل بدونه */ });
}
boot();
