/* =====================================================================
 * المشاهد الإضافية: مشهد ثانٍ لكل صفحة قصة (اسمه <المشهد الأول>2)، ورسوم صفحات المحطات (act_*).
 * المعيار: لا ذوات أرواح؛ أماكن وأشياء ورموز فقط. الحركة بأصناف CSS: tw drift sway flag glow rise.
 * ===================================================================== */
Object.assign(ILLUSTRATIONS, {
  /* ١. مكة عند الفجر: الوادي والجبال والبيت */
  makkahNight2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="mk2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C98B"/><stop offset="1" stop-color="#FCE9C8"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#mk2sky)"/>
      <circle cx="300" cy="150" r="34" fill="#FFF3D6" class="glow"/>
      <path d="M0 175 L60 110 L120 160 L175 95 L240 160 L300 120 L360 150 L400 125 L400 300 L0 300 Z" fill="#B9774A"/>
      <path d="M0 200 L80 160 L150 195 L230 150 L320 190 L400 165 L400 300 L0 300 Z" fill="#8E5634"/>
      <rect x="0" y="232" width="400" height="68" fill="#E8C99A"/>
      <rect x="168" y="168" width="64" height="66" fill="#1F1A17"/>
      <rect x="168" y="184" width="64" height="8" fill="#D99B26"/>
      <rect x="196" y="204" width="10" height="30" fill="#D99B26" opacity="0.8"/>
      <rect x="60" y="206" width="38" height="28" fill="#D7B07C"/><rect x="70" y="214" width="8" height="10" fill="#7A4E2D"/>
      <rect x="300" y="200" width="44" height="34" fill="#CFA36E"/><rect x="314" y="210" width="8" height="12" fill="#7A4E2D"/>
      <rect x="110" y="214" width="30" height="20" fill="#E0BE8D"/><rect x="258" y="212" width="30" height="22" fill="#E0BE8D"/>
      <path d="M40 120 q20 -8 40 0" stroke="#FFFDF8" stroke-width="3" fill="none" class="drift" opacity="0.7"/>
    </svg>`,

  /* ٢. البحر إلى الحبشة: سفينة شراعية تحت القمر */
  hijrahDunes2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="hj2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D3557"/><stop offset="1" stop-color="#3B5B7E"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#hj2sky)"/>
      <circle cx="320" cy="70" r="24" fill="#FCECC9" class="glow"/><circle cx="330" cy="64" r="22" fill="#1D3557"/>
      <circle cx="60" cy="50" r="2" fill="#FCECC9" class="tw"/><circle cx="130" cy="80" r="2.5" fill="#FCECC9" class="tw"/><circle cx="220" cy="40" r="2" fill="#FCECC9" class="tw"/><circle cx="260" cy="100" r="1.8" fill="#FCECC9" class="tw"/>
      <rect x="0" y="190" width="400" height="110" fill="#24507A"/>
      <path d="M0 205 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#7FB3D5" stroke-width="3" fill="none" class="drift"/>
      <path d="M0 240 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" stroke="#5E93BC" stroke-width="3" fill="none"/>
      <g class="sway">
        <path d="M140 190 L270 190 L250 222 L160 222 Z" fill="#7A3E1D"/>
        <rect x="202" y="92" width="6" height="100" fill="#5A3A22"/>
        <path d="M208 98 L262 176 L208 176 Z" fill="#FFFDF8"/>
        <path d="M202 108 L162 176 L202 176 Z" fill="#F3E9D2"/>
        <path d="M208 92 L232 98 L208 104 Z" fill="#C25934" class="flag"/>
      </g>
    </svg>`,

  /* ٣. لافتة في طريق المدينة تشير إلى السوق */
  madinahPalm2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#DDEFE3"/>
      <circle cx="80" cy="70" r="30" fill="#FFF3D6"/>
      <rect x="0" y="210" width="400" height="90" fill="#E6CFA1"/>
      <path d="M150 300 Q190 240 230 210 L260 210 Q230 245 220 300 Z" fill="#F5E3BE"/>
      <g class="sway"><rect x="58" y="120" width="10" height="95" fill="#7A4E2D"/><path d="M63 120 q-40 -10 -55 10 M63 120 q40 -14 55 6 M63 120 q-20 -30 -45 -28 M63 120 q24 -32 48 -26" stroke="#1E5631" stroke-width="10" fill="none" stroke-linecap="round"/></g>
      <g class="sway"><rect x="330" y="130" width="10" height="85" fill="#7A4E2D"/><path d="M335 130 q-38 -8 -52 10 M335 130 q38 -12 52 6 M335 130 q-18 -28 -42 -26 M335 130 q22 -30 44 -24" stroke="#2E6B41" stroke-width="9" fill="none" stroke-linecap="round"/></g>
      <rect x="236" y="130" width="7" height="86" fill="#6E4726"/>
      <path d="M150 128 L236 128 L236 158 L150 158 L134 143 Z" fill="#C25934"/>
      <text x="190" y="149" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="18" font-weight="700" fill="#FFFDF8">السوق</text>
      <rect x="275" y="186" width="70" height="26" fill="#D99B26"/><path d="M270 186 L350 186 L340 170 L280 170 Z" fill="#9B4121"/>
    </svg>`,

  /* ٤. السمن والأقط على بساط في السوق */
  marketStall2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F7E7C6"/>
      <path d="M0 0 H400 V40 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 q-25 22 -50 0 Z" fill="#C25934"/>
      <rect x="30" y="190" width="340" height="80" rx="10" fill="#9B4121"/>
      <rect x="40" y="198" width="320" height="64" rx="8" fill="#D99B26" opacity="0.35"/>
      <path d="M90 140 q-18 0 -20 30 l4 30 h52 l4 -30 q-2 -30 -20 -30 Z" fill="#D9A15A"/>
      <ellipse cx="105" cy="140" rx="18" ry="6" fill="#B87F3A"/>
      <path d="M150 150 q-14 0 -16 24 l3 26 h42 l3 -26 q-2 -24 -16 -24 Z" fill="#E2B76E"/>
      <ellipse cx="162" cy="150" rx="14" ry="5" fill="#B87F3A"/>
      <path d="M100 136 q0 -14 10 -16" stroke="#FFFDF8" stroke-width="3" fill="none" class="rise"/>
      <g fill="#FFF8E7" stroke="#D8C9A8" stroke-width="2">
        <rect x="230" y="176" width="22" height="18" rx="4"/><rect x="256" y="176" width="22" height="18" rx="4"/><rect x="282" y="176" width="22" height="18" rx="4"/>
        <rect x="243" y="160" width="22" height="18" rx="4"/><rect x="269" y="160" width="22" height="18" rx="4"/>
        <rect x="256" y="144" width="22" height="18" rx="4"/>
      </g>
      <circle cx="330" cy="236" r="9" fill="#F4C97B" stroke="#C68617" stroke-width="2"/><circle cx="348" cy="242" r="7" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
    </svg>`,

  /* ٥. «لو رفعتُ حجرًا…»: حجر مرفوع وتحته بريق ذهب، وميزان */
  tradeBlessing2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#FBEFD6"/>
      <rect x="0" y="220" width="400" height="80" fill="#E2C38F"/>
      <path d="M70 218 q10 -50 60 -54 q48 4 58 54 Z" fill="#8C7B6B" transform="rotate(-14 130 200)"/>
      <ellipse cx="140" cy="226" rx="56" ry="10" fill="#C9A86A"/>
      <circle cx="122" cy="222" r="9" fill="#F4C97B" stroke="#C68617" stroke-width="2"/><circle cx="146" cy="226" r="9" fill="#F4C97B" stroke="#C68617" stroke-width="2"/><circle cx="166" cy="221" r="8" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
      <path d="M118 200 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4 Z" fill="#FFF3B0" class="tw"/>
      <path d="M170 192 l3 -9 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 Z" fill="#FFF3B0" class="tw"/>
      <rect x="285" y="110" width="8" height="110" fill="#6E4726"/>
      <rect x="240" y="110" width="98" height="6" rx="3" fill="#7A4E2D"/>
      <path d="M250 116 L234 160 H266 Z M328 116 L312 160 H344 Z" fill="none" stroke="#7A4E2D" stroke-width="2"/>
      <path d="M230 160 H270 q-20 16 -40 0 Z M308 160 H348 q-20 16 -40 0 Z" fill="#D99B26"/>
      <rect x="262" y="214" width="54" height="10" rx="4" fill="#7A4E2D"/>
    </svg>`,

  /* ٦. جبل أحد وجبل الرماة، وترس ورمح على الأرض */
  uhudSteadfast2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F6D9B4"/>
      <path d="M90 60 q-20 -10 -40 0" stroke="#FFFDF8" stroke-width="5" fill="none" class="drift" opacity="0.7"/>
      <path d="M0 210 L70 120 L130 150 L200 80 L280 140 L340 110 L400 160 L400 300 L0 300 Z" fill="#9B4121"/>
      <path d="M200 80 L230 115 L210 112 L190 125 Z" fill="#7A3E1D"/>
      <ellipse cx="300" cy="230" rx="60" ry="22" fill="#B05A33"/>
      <rect x="0" y="238" width="400" height="62" fill="#E4C08E"/>
      <ellipse cx="120" cy="252" rx="34" ry="14" fill="#7A4E2D"/><ellipse cx="120" cy="250" rx="24" ry="9" fill="#A36A3D"/><circle cx="120" cy="250" r="4" fill="#D99B26"/>
      <rect x="150" y="262" width="150" height="5" rx="2" fill="#6E4726" transform="rotate(-6 225 264)"/>
      <path d="M298 248 l16 4 l-14 8 Z" fill="#9CA3AF"/>
    </svg>`,

  /* ٧. حصن دومة الجندل وعمامة الإمارة */
  dumatAlJandal2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F3DDB5"/>
      <circle cx="320" cy="70" r="28" fill="#FFF3D6"/>
      <rect x="0" y="220" width="400" height="80" fill="#D9B27C"/>
      <path d="M70 220 V120 h20 v-14 h14 v14 h20 v-14 h14 v14 h20 v114 Z" fill="#B88A5A"/>
      <path d="M160 220 V150 h120 v70 Z" fill="#A87A4C"/>
      <path d="M270 220 V100 h18 v-12 h12 v12 h18 v-12 h12 v12 h18 v120 Z" fill="#B88A5A"/>
      <rect x="205" y="180" width="30" height="40" rx="15" fill="#5A3A22"/>
      <rect x="96" y="150" width="10" height="16" fill="#5A3A22"/><rect x="300" y="130" width="10" height="16" fill="#5A3A22"/>
      <rect x="306" y="40" width="4" height="50" fill="#5A3A22"/><path d="M310 42 L346 52 L310 62 Z" fill="#1E5631" class="flag"/>
      <ellipse cx="200" cy="258" rx="54" ry="16" fill="#FFFDF8"/>
      <path d="M150 256 q50 -30 100 0" stroke="#F3E9D2" stroke-width="10" fill="none"/>
      <path d="M200 244 q30 4 40 22" stroke="#1F1A17" stroke-width="5" fill="none"/>
    </svg>`,

  /* ٨. فجر تبوك: صفوف المصلّى وإبريق الوضوء */
  tabukPrayer2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="tb2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B4F7A"/><stop offset="0.6" stop-color="#E9A86A"/><stop offset="1" stop-color="#F6D7A7"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#tb2sky)"/>
      <circle cx="80" cy="40" r="2" fill="#FCECC9" class="tw"/><circle cx="150" cy="30" r="2" fill="#FCECC9" class="tw"/><circle cx="330" cy="36" r="2.4" fill="#FCECC9" class="tw"/>
      <path d="M0 170 L80 140 L160 165 L250 130 L330 160 L400 140 V300 H0 Z" fill="#8E5634"/>
      <rect x="0" y="200" width="400" height="100" fill="#E4C08E"/>
      <g fill="#1E5631"><rect x="60" y="214" width="46" height="70" rx="6"/><rect x="130" y="214" width="46" height="70" rx="6"/><rect x="200" y="214" width="46" height="70" rx="6"/></g>
      <g fill="#D99B26"><path d="M70 226 h26 l-13 -10 Z"/><path d="M140 226 h26 l-13 -10 Z"/><path d="M210 226 h26 l-13 -10 Z"/></g>
      <path d="M300 250 q-16 0 -16 20 v14 h40 v-14 q0 -20 -16 -20 Z" fill="#B87F3A"/>
      <path d="M314 254 q22 -6 26 10" stroke="#B87F3A" stroke-width="5" fill="none"/><rect x="298" y="240" width="20" height="10" rx="3" fill="#9B6A2E"/>
    </svg>`,

  /* ٩. إفطار بسيط: تمر وماء وبردة مطويّة وسراج */
  iftarTears2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#3E2A1E"/>
      <rect x="0" y="200" width="400" height="100" fill="#5C3D28"/>
      <ellipse cx="200" cy="240" rx="150" ry="30" fill="#C9A86A"/>
      <ellipse cx="150" cy="236" rx="40" ry="12" fill="#8C5A2B"/>
      <g fill="#5A2E14"><ellipse cx="138" cy="230" rx="8" ry="5"/><ellipse cx="152" cy="228" rx="8" ry="5"/><ellipse cx="164" cy="232" rx="8" ry="5"/><ellipse cx="146" cy="236" rx="8" ry="5"/></g>
      <path d="M220 214 h30 l-4 30 h-22 Z" fill="#B87F3A"/><ellipse cx="235" cy="214" rx="15" ry="4" fill="#7FB3D5"/>
      <rect x="270" y="222" width="70" height="18" rx="4" fill="#E8DCC2"/><rect x="274" y="214" width="62" height="10" rx="4" fill="#F3E9D2"/>
      <circle cx="90" cy="150" r="40" fill="#FFD27A" opacity="0.25" class="glow"/>
      <path d="M78 196 h24 l-4 -30 h-16 Z" fill="#D99B26"/><path d="M90 166 q-8 -12 0 -24 q8 12 0 24 Z" fill="#FFB347" class="glow"/>
      <circle cx="320" cy="70" r="20" fill="#FCECC9"/><circle cx="328" cy="64" r="18" fill="#3E2A1E"/>
    </svg>`,

  /* ١٠. مال يُنفَق: كيس كبير تخرج منه أكياس صغيرة إلى أبواب كثيرة */
  ummSalamahAdvice2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#FBEFD6"/>
      <rect x="0" y="230" width="400" height="70" fill="#E2C38F"/>
      <g fill="#C7A06A"><rect x="250" y="120" width="44" height="110"/><rect x="300" y="100" width="44" height="130"/><rect x="350" y="130" width="50" height="100"/></g>
      <g fill="#7A4E2D"><rect x="262" y="180" width="20" height="50" rx="10"/><rect x="312" y="170" width="20" height="60" rx="10"/><rect x="364" y="185" width="20" height="45" rx="10"/></g>
      <path d="M70 230 q-30 0 -30 -50 q0 -40 50 -50 q50 10 50 50 q0 50 -30 50 Z" fill="#B87F3A"/>
      <path d="M70 132 q20 -12 40 0" stroke="#7A4E2D" stroke-width="6" fill="none"/>
      <path d="M120 170 q60 -60 140 -10" stroke="#D99B26" stroke-width="3" stroke-dasharray="6 6" fill="none" class="drift"/>
      <g fill="#E2B76E" stroke="#9B6A2E" stroke-width="2"><path d="M170 120 q-10 0 -10 14 q0 10 10 10 h10 q10 0 10 -10 q0 -14 -10 -14 Z"/><path d="M220 112 q-10 0 -10 14 q0 10 10 10 h10 q10 0 10 -10 q0 -14 -10 -14 Z"/></g>
      <circle cx="85" cy="200" r="9" fill="#F4C97B" stroke="#C68617" stroke-width="2"/><circle cx="62" cy="196" r="8" fill="#F4C97B" stroke="#C68617" stroke-width="2"/>
    </svg>`,

  /* ١١. مدينة على الطريق بابها مغلق وفوقها غيمة الوباء، والطريق يعود */
  sarghRoad2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#E9DCC3"/>
      <ellipse cx="270" cy="70" rx="90" ry="34" fill="#8D8A86" opacity="0.75" class="drift"/>
      <ellipse cx="210" cy="86" rx="60" ry="24" fill="#A3A09B" opacity="0.7"/>
      <path d="M180 200 V120 h20 v-12 h14 v12 h28 v-12 h14 v12 h28 v-12 h14 v12 h20 v80 Z" fill="#8F8578"/>
      <rect x="250" y="160" width="36" height="40" rx="18" fill="#4A3B2E"/><rect x="250" y="176" width="36" height="6" fill="#7A6A58"/>
      <rect x="0" y="200" width="400" height="100" fill="#D9B27C"/>
      <path d="M268 200 Q200 240 120 250 Q60 256 20 290" stroke="#F5E3BE" stroke-width="20" fill="none" stroke-linecap="round"/>
      <path d="M120 236 l-24 14 l24 14" stroke="#1E5631" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="80" cy="140" r="26" fill="#FFF3D6"/>
    </svg>`,

  /* ١٢. ثلاث حصّالات وأبواب أهل المدينة */
  threeThirds2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F7EBD3"/>
      <g fill="#D7B07C"><rect x="10" y="40" width="70" height="120"/><rect x="90" y="60" width="70" height="100"/><rect x="170" y="30" width="70" height="130"/><rect x="250" y="55" width="70" height="105"/><rect x="330" y="45" width="70" height="115"/></g>
      <g fill="#7A4E2D"><rect x="32" y="110" width="24" height="50" rx="12"/><rect x="112" y="115" width="24" height="45" rx="12"/><rect x="192" y="105" width="24" height="55" rx="12"/><rect x="272" y="112" width="24" height="48" rx="12"/><rect x="352" y="108" width="24" height="52" rx="12"/></g>
      <rect x="0" y="160" width="400" height="140" fill="#E2C38F"/>
      <g><path d="M70 270 q-30 0 -30 -40 q0 -26 30 -30 q30 4 30 30 q0 40 -30 40 Z" fill="#1D3557"/><rect x="58" y="196" width="24" height="8" fill="#FCECC9"/></g>
      <g><path d="M200 270 q-30 0 -30 -40 q0 -26 30 -30 q30 4 30 30 q0 40 -30 40 Z" fill="#1E5631"/><rect x="188" y="196" width="24" height="8" fill="#FCECC9"/></g>
      <g><path d="M330 270 q-30 0 -30 -40 q0 -26 30 -30 q30 4 30 30 q0 40 -30 40 Z" fill="#C25934"/><rect x="318" y="196" width="24" height="8" fill="#FCECC9"/></g>
      <circle cx="70" cy="184" r="7" fill="#F4C97B" class="tw"/><circle cx="200" cy="182" r="7" fill="#F4C97B" class="tw"/><circle cx="330" cy="184" r="7" fill="#F4C97B" class="tw"/>
    </svg>`,

  /* ١٣. الحديقة الموصى بها: سور وبوّابة ونخيل */
  orchardGift2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#E2F1E7"/>
      <circle cx="330" cy="60" r="26" fill="#FFF3D6"/>
      <g class="sway"><rect x="80" y="90" width="9" height="110" fill="#7A4E2D"/><path d="M84 90 q-36 -8 -50 10 M84 90 q36 -12 50 6 M84 90 q-18 -28 -42 -26 M84 90 q22 -30 44 -24" stroke="#1E5631" stroke-width="9" fill="none" stroke-linecap="round"/></g>
      <g class="sway"><rect x="160" y="70" width="9" height="130" fill="#7A4E2D"/><path d="M164 70 q-36 -8 -50 10 M164 70 q36 -12 50 6 M164 70 q-18 -28 -42 -26 M164 70 q22 -30 44 -24" stroke="#2E6B41" stroke-width="9" fill="none" stroke-linecap="round"/></g>
      <g class="sway"><rect x="300" y="95" width="9" height="105" fill="#7A4E2D"/><path d="M304 95 q-36 -8 -50 10 M304 95 q36 -12 50 6 M304 95 q-18 -28 -42 -26 M304 95 q22 -30 44 -24" stroke="#1E5631" stroke-width="9" fill="none" stroke-linecap="round"/></g>
      <rect x="0" y="190" width="400" height="40" fill="#C7A06A"/>
      <rect x="170" y="160" width="60" height="70" rx="30" fill="#9B4121"/><rect x="180" y="176" width="40" height="54" rx="20" fill="#5A3A22"/>
      <rect x="0" y="230" width="400" height="70" fill="#9DBF8A"/>
      <g fill="#7A3E1D"><circle cx="70" cy="122" r="5"/><circle cx="96" cy="118" r="5"/><circle cx="152" cy="100" r="5"/><circle cx="292" cy="126" r="5"/></g>
    </svg>`,

  /* ١٤. ثياب متشابهة على المشجب، وقلم وصحيفة */
  humbleKnowledge2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#F3E9D2"/>
      <rect x="40" y="60" width="320" height="10" rx="5" fill="#7A4E2D"/>
      <g fill="#E8DCC2" stroke="#BFA97F" stroke-width="2">
        <path d="M70 70 l-20 20 l12 10 v118 h60 v-118 l12 -10 l-20 -20 q-22 14 -44 0 Z"/>
        <path d="M170 70 l-20 20 l12 10 v118 h60 v-118 l12 -10 l-20 -20 q-22 14 -44 0 Z"/>
        <path d="M270 70 l-20 20 l12 10 v118 h60 v-118 l12 -10 l-20 -20 q-22 14 -44 0 Z"/>
      </g>
      <rect x="0" y="226" width="400" height="74" fill="#C9A86A"/>
      <rect x="90" y="240" width="140" height="44" rx="6" fill="#FFFDF8"/>
      <g stroke="#9B4121" stroke-width="3"><line x1="104" y1="250" x2="214" y2="250"/><line x1="104" y1="262" x2="200" y2="262"/></g>
      <rect x="250" y="250" width="90" height="8" rx="4" fill="#1D3557" transform="rotate(-20 295 254)"/>
    </svg>`,

  /* ١٥. ليالي الشورى الثلاث: ستة مساند حول سراج، وهلال من النافذة */
  shuraCouncil2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#2E2219"/>
      <rect x="150" y="30" width="100" height="80" rx="50" fill="#1D3557"/>
      <circle cx="210" cy="64" r="16" fill="#FCECC9"/><circle cx="218" cy="58" r="14" fill="#1D3557"/>
      <circle cx="180" cy="50" r="1.8" fill="#FCECC9" class="tw"/><circle cx="232" cy="90" r="1.8" fill="#FCECC9" class="tw"/>
      <rect x="0" y="190" width="400" height="110" fill="#5C3D28"/>
      <ellipse cx="200" cy="232" rx="150" ry="44" fill="#9B4121"/>
      <g fill="#D99B26"><rect x="80" y="200" width="44" height="22" rx="10"/><rect x="178" y="186" width="44" height="22" rx="10"/><rect x="276" y="200" width="44" height="22" rx="10"/><rect x="80" y="248" width="44" height="22" rx="10"/><rect x="178" y="262" width="44" height="22" rx="10"/><rect x="276" y="248" width="44" height="22" rx="10"/></g>
      <circle cx="200" cy="232" r="40" fill="#FFD27A" opacity="0.25" class="glow"/>
      <path d="M186 240 h28 l-6 -12 h-16 Z" fill="#B87F3A"/><path d="M200 228 q-7 -10 0 -20 q7 10 0 20 Z" fill="#FFB347" class="glow"/>
    </svg>`,

  /* ١٦. سلسبيل: عين ماء تجري في بستان عند الفجر */
  eternalLegacy2: `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="el2sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0F0"/><stop offset="1" stop-color="#F6EFD9"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#el2sky)"/>
      <path d="M60 60 q20 -10 40 0 q20 -10 40 0" stroke="#FFFDF8" stroke-width="6" fill="none" class="drift"/>
      <rect x="0" y="180" width="400" height="120" fill="#9DBF8A"/>
      <path d="M170 180 q-10 -40 30 -60 q40 20 30 60 Z" fill="#B9B2A3"/>
      <path d="M200 140 q-2 30 -10 46 q30 30 -10 60 q-40 30 20 54" stroke="#7FB3D5" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M200 150 q-2 26 -8 40" stroke="#E7F4FB" stroke-width="4" fill="none" class="glow"/>
      <g class="sway"><rect x="70" y="120" width="9" height="80" fill="#7A4E2D"/><path d="M74 120 q-30 -8 -42 8 M74 120 q30 -10 42 4 M74 120 q-14 -24 -34 -22 M74 120 q18 -26 36 -20" stroke="#1E5631" stroke-width="8" fill="none" stroke-linecap="round"/></g>
      <g class="sway"><rect x="320" y="115" width="9" height="85" fill="#7A4E2D"/><path d="M324 115 q-30 -8 -42 8 M324 115 q30 -10 42 4 M324 115 q-14 -24 -34 -22 M324 115 q18 -26 36 -20" stroke="#2E6B41" stroke-width="8" fill="none" stroke-linecap="round"/></g>
    </svg>`,

  /* ---------- رسوم صفحات المحطات (أقصر ارتفاعًا) ---------- */
  act_values: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="180" rx="16" fill="#FCECC9"/>
      <g transform="rotate(-14 200 150)"><rect x="110" y="40" width="70" height="100" rx="10" fill="#1D3557"/><path d="M145 70 l14 14 l-14 24 l-14 -24 Z" fill="#9FD3F5"/></g>
      <g transform="rotate(-4 200 150)"><rect x="150" y="34" width="70" height="100" rx="10" fill="#1E5631"/><path d="M185 64 v40 M175 84 q10 -14 20 0" stroke="#BDE8C9" stroke-width="5" fill="none"/></g>
      <g transform="rotate(6 200 150)"><rect x="190" y="34" width="70" height="100" rx="10" fill="#C25934"/><circle cx="214" cy="84" r="8" fill="#FCECC9"/><circle cx="236" cy="84" r="8" fill="#FCECC9"/></g>
      <g transform="rotate(16 200 150)"><rect x="230" y="40" width="70" height="100" rx="10" fill="#D99B26"/><rect x="250" y="72" width="30" height="24" rx="4" fill="#FFFDF8"/><rect x="246" y="66" width="38" height="8" fill="#9B4121"/></g>
      <circle cx="60" cy="40" r="4" fill="#D99B26" class="tw"/><circle cx="340" cy="34" r="4" fill="#D99B26" class="tw"/>
    </svg>`,
  act_quiz: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="180" rx="16" fill="#E2F1E7"/>
      <rect x="196" y="40" width="8" height="110" fill="#6E4726"/>
      <rect x="110" y="40" width="180" height="8" rx="4" fill="#7A4E2D" class="sway"/>
      <path d="M126 48 L108 96 H144 Z M274 48 L256 96 H292 Z" fill="none" stroke="#7A4E2D" stroke-width="2"/>
      <path d="M104 96 H148 q-22 18 -44 0 Z M252 96 H296 q-22 18 -44 0 Z" fill="#D99B26"/>
      <circle cx="126" cy="90" r="7" fill="#F4C97B" stroke="#C68617" stroke-width="2"/><circle cx="274" cy="90" r="7" fill="#F4C97B" stroke="#C68617" stroke-width="2"/>
      <rect x="168" y="146" width="64" height="12" rx="5" fill="#7A4E2D"/>
      <circle cx="60" cy="60" r="22" fill="#1E5631"/><path d="M50 60 l7 8 l14 -16" stroke="#FFFDF8" stroke-width="5" fill="none" stroke-linecap="round"/>
    </svg>`,
  act_timeline: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="180" rx="16" fill="#F3E9D2"/>
      <path d="M30 130 Q120 60 200 110 T370 70" stroke="#C99E67" stroke-width="10" fill="none" stroke-linecap="round"/>
      <g fill="#C25934"><circle cx="50" cy="118" r="10"/><circle cx="120" cy="88" r="10"/><circle cx="200" cy="110" r="10"/><circle cx="280" cy="96" r="10"/><circle cx="350" cy="74" r="10"/></g>
      <g transform="translate(330 110)"><rect x="-22" y="0" width="44" height="6" rx="3" fill="#7A4E2D"/><rect x="-22" y="54" width="44" height="6" rx="3" fill="#7A4E2D"/><path d="M-16 6 h32 q0 18 -16 24 q16 6 16 24 h-32 q0 -18 16 -24 q-16 -6 -16 -24 Z" fill="#FCECC9" stroke="#7A4E2D" stroke-width="2"/><path d="M-8 46 h16 l-8 -10 Z" fill="#D99B26" class="glow"/></g>
    </svg>`,
  act_market: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="180" rx="16" fill="#FBEFD6"/>
      <path d="M20 20 H380 V50 q-22.5 20 -45 0 q-22.5 20 -45 0 q-22.5 20 -45 0 q-22.5 20 -45 0 q-22.5 20 -45 0 q-22.5 20 -45 0 q-22.5 20 -45 0 q-22.5 20 -45 0 Z" fill="#C25934"/>
      <rect x="20" y="140" width="360" height="16" rx="6" fill="#9B4121"/>
      <g><path d="M100 140 q-34 0 -34 -40 q0 -26 34 -30 q34 4 34 30 q0 40 -34 40 Z" fill="#C25934"/><rect x="88" y="66" width="24" height="8" fill="#FCECC9"/></g>
      <g><path d="M200 140 q-34 0 -34 -40 q0 -26 34 -30 q34 4 34 30 q0 40 -34 40 Z" fill="#1D3557"/><rect x="188" y="66" width="24" height="8" fill="#FCECC9"/></g>
      <g><path d="M300 140 q-34 0 -34 -40 q0 -26 34 -30 q34 4 34 30 q0 40 -34 40 Z" fill="#1E5631"/><rect x="288" y="66" width="24" height="8" fill="#FCECC9"/></g>
      <g fill="#F4C97B" stroke="#C68617" stroke-width="2"><circle cx="100" cy="104" r="8" class="tw"/><circle cx="200" cy="104" r="8" class="tw"/><circle cx="300" cy="104" r="8" class="tw"/></g>
    </svg>`,
  act_flashcards: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="180" rx="16" fill="#E3ECF7"/>
      <rect x="120" y="50" width="150" height="100" rx="12" fill="#C99E67" transform="rotate(-8 195 100)"/>
      <rect x="130" y="40" width="150" height="100" rx="12" fill="#FFFDF8" stroke="#1D3557" stroke-width="3"/>
      <text x="205" y="108" text-anchor="middle" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="52" font-weight="700" fill="#C25934">؟</text>
      <circle cx="320" cy="50" r="5" fill="#D99B26" class="tw"/><circle cx="80" cy="130" r="5" fill="#D99B26" class="tw"/>
    </svg>`,
  act_certificate: `
    <svg viewBox="0 0 400 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="180" rx="16" fill="#FCECC9"/>
      <path d="M180 100 L160 170 L182 156 L194 176 L200 104 Z" fill="#C25934"/><path d="M220 100 L240 170 L218 156 L206 176 L200 104 Z" fill="#9B4121"/>
      <circle cx="200" cy="80" r="50" fill="#D99B26"/><circle cx="200" cy="80" r="38" fill="#F4C97B"/>
      <path d="M200 52 l8 18 l20 2 l-15 13 l5 20 l-18 -10 l-18 10 l5 -20 l-15 -13 l20 -2 Z" fill="#FFFDF8" class="glow"/>
      <circle cx="90" cy="50" r="5" fill="#D99B26" class="tw"/><circle cx="320" cy="44" r="6" fill="#D99B26" class="tw"/><circle cx="330" cy="130" r="4" fill="#D99B26" class="tw"/>
    </svg>`
});
