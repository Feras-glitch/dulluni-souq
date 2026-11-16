const ILLUSTRATIONS = {
      cover: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#FCECC9"/>
              <stop offset="100%" stop-color="#F4C97B"/>
            </linearGradient>
            <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#2B2118" flood-opacity="0.22"/>
            </filter>
          </defs>
          <rect width="400" height="300" fill="url(#skyGrad)"/>
          <circle cx="200" cy="125" r="56" fill="#FFF8E7" opacity="0.85"/>
          <path d="M0 190 Q110 155 220 185 T400 175 L400 300 L0 300 Z" fill="#E3B363" filter="url(#paperShadow)"/>
          <path d="M0 220 Q150 195 290 225 T400 215 L400 300 L0 300 Z" fill="#C98A3A" filter="url(#paperShadow)"/>
          <path d="M0 0 L400 0 L400 300 L355 300 L355 120 Q355 45 200 45 Q45 45 45 120 L45 300 L0 300 Z" fill="#C25934" filter="url(#paperShadow)"/>
          <path d="M35 300 L35 120 Q35 35 200 35 Q365 35 365 120 L365 300 L350 300 L350 122 Q350 50 200 50 Q50 50 50 122 L50 300 Z" fill="#D99B26"/>
          <g transform="translate(200, 185)" filter="url(#paperShadow)">
            <rect x="-4" y="-45" width="8" height="75" rx="3" fill="#8C5A2B"/>
            <rect x="-25" y="26" width="50" height="8" rx="4" fill="#8C5A2B"/>
            <line x1="-55" y1="-35" x2="55" y2="-35" stroke="#D99B26" stroke-width="5" stroke-linecap="round"/>
            <path d="M-72 -5 Q-55 12 -38 -5 Z" fill="#E5A933"/>
            <path d="M38 -5 Q55 12 72 -5 Z" fill="#E5A933"/>
            <line x1="-55" y1="-35" x2="-68" y2="-5" stroke="#9B4121" stroke-width="1.5"/>
            <line x1="-55" y1="-35" x2="-42" y2="-5" stroke="#9B4121" stroke-width="1.5"/>
            <line x1="55" y1="-35" x2="42" y2="-5" stroke="#9B4121" stroke-width="1.5"/>
            <line x1="55" y1="-35" x2="68" y2="-5" stroke="#9B4121" stroke-width="1.5"/>
          </g>
          <ellipse cx="105" cy="240" rx="18" ry="24" fill="#9B4121" filter="url(#paperShadow)"/>
          <rect x="97" y="212" width="16" height="8" rx="3" fill="#C25934"/>
          <ellipse cx="300" cy="242" rx="16" ry="20" fill="#1E5631" filter="url(#paperShadow)"/>
          <rect x="293" y="218" width="14" height="7" rx="3" fill="#587246"/>
        </svg>`,

      makkahNight: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#1D3557"/>
          <circle cx="80" cy="55" r="2.5" fill="#FCECC9"/><circle cx="150" cy="40" r="2" fill="#FCECC9"/>
          <circle cx="310" cy="50" r="3" fill="#FCECC9"/><circle cx="345" cy="95" r="2" fill="#FCECC9"/>
          <path d="M265 45 A28 28 0 1 0 295 82 A22 22 0 1 1 265 45 Z" fill="#F4C97B"/>
          <path d="M0 175 L75 115 L155 165 L245 105 L335 160 L400 130 L400 300 L0 300 Z" fill="#3D2C22"/>
          <path d="M0 215 L110 175 L220 210 L320 170 L400 205 L400 300 L0 300 Z" fill="#5C4030"/>
          <rect x="65" y="185" width="75" height="65" rx="4" fill="#C99E67"/>
          <rect x="85" y="205" width="16" height="22" rx="8" fill="#2B2118"/>
          <rect x="240" y="178" width="85" height="72" rx="4" fill="#B58952"/>
          <rect x="265" y="200" width="18" height="24" rx="9" fill="#2B2118"/>
          <rect x="135" y="225" width="130" height="36" rx="8" fill="#FFF8E7" stroke="#D99B26" stroke-width="3"/>
          <circle cx="135" cy="243" r="10" fill="#E5A933"/><circle cx="265" cy="243" r="10" fill="#E5A933"/>
          <line x1="160" y1="238" x2="240" y2="238" stroke="#9B4121" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="170" y1="248" x2="230" y2="248" stroke="#1E5631" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,

      hijrahDunes: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dawnGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F6D399"/>
              <stop offset="100%" stop-color="#FBE8C6"/>
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#dawnGrad)"/>
          <circle cx="315" cy="115" r="36" fill="#FFFDF8" opacity="0.9"/>
          <path d="M0 165 Q120 130 250 165 T400 155 L400 300 L0 300 Z" fill="#E2AE5C"/>
          <path d="M0 205 Q170 175 310 215 L400 200 L400 300 L0 300 Z" fill="#CC8E3B"/>
          <g transform="translate(310, 148)">
            <rect x="-3" y="-32" width="6" height="36" fill="#6E4726"/>
            <path d="M0 -32 Q-22 -42 -28 -24" stroke="#1E5631" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M0 -32 Q22 -42 28 -24" stroke="#1E5631" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M0 -32 Q-14 -50 -22 -38" stroke="#587246" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M0 -32 Q14 -50 22 -38" stroke="#587246" stroke-width="4" fill="none" stroke-linecap="round"/>
          </g>
          <ellipse cx="75" cy="255" rx="7" ry="4" fill="#8C5A2B" opacity="0.65"/>
          <ellipse cx="105" cy="242" rx="7" ry="4" fill="#8C5A2B" opacity="0.65"/>
          <ellipse cx="138" cy="232" rx="6" ry="3.5" fill="#8C5A2B" opacity="0.65"/>
          <ellipse cx="172" cy="222" rx="6" ry="3.5" fill="#8C5A2B" opacity="0.65"/>
          <ellipse cx="208" cy="212" rx="5" ry="3" fill="#8C5A2B" opacity="0.65"/>
        </svg>`,

      madinahPalm: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#E3F2E8"/>
          <rect x="0" y="210" width="400" height="90" fill="#D5B887"/>
          <rect x="92" y="95" width="14" height="125" rx="4" fill="#7A4E2D"/>
          <path d="M99 95 Q45 75 30 115" stroke="#1E5631" stroke-width="9" fill="none" stroke-linecap="round"/>
          <path d="M99 95 Q155 75 170 115" stroke="#1E5631" stroke-width="9" fill="none" stroke-linecap="round"/>
          <path d="M99 95 Q55 50 38 75" stroke="#587246" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M99 95 Q145 50 162 75" stroke="#587246" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M165 235 L175 200 L225 200 L235 235 Z" fill="#B87A3D"/>
          <circle cx="190" cy="198" r="7" fill="#7A3E1D"/><circle cx="202" cy="196" r="7" fill="#9B4121"/><circle cx="212" cy="199" r="7" fill="#7A3E1D"/>
          <g transform="translate(295, 165)">
            <rect x="-4" y="0" width="8" height="65" fill="#6E4726"/>
            <path d="M-38 5 L28 5 L42 18 L28 31 L-38 31 Z" fill="#C25934"/>
            <line x1="-24" y1="18" x2="20" y2="18" stroke="#FFFDF8" stroke-width="3" stroke-linecap="round"/>
          </g>
        </svg>`,

      marketStall: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#F9E7C4"/>
          <path d="M35 75 L365 75 L385 115 L15 115 Z" fill="#C25934"/>
          <path d="M55 75 L95 75 L95 115 L45 115 Z" fill="#FFFDF8"/>
          <path d="M145 75 L185 75 L185 115 L145 115 Z" fill="#FFFDF8"/>
          <path d="M235 75 L275 75 L275 115 L235 115 Z" fill="#FFFDF8"/>
          <path d="M315 75 L355 75 L365 115 L315 115 Z" fill="#FFFDF8"/>
          <rect x="45" y="195" width="310" height="75" rx="6" fill="#8C5A2B"/>
          <rect x="35" y="185" width="330" height="14" rx="4" fill="#A86E38"/>
          <ellipse cx="105" cy="162" rx="24" ry="26" fill="#D97736"/>
          <rect x="93" y="132" width="24" height="8" rx="3" fill="#9B4121"/>
          <ellipse cx="165" cy="166" rx="20" ry="22" fill="#E5A933"/>
          <path d="M210 185 L218 158 L272 158 L280 185 Z" fill="#C99E67"/>
          <circle cx="232" cy="156" r="8" fill="#FFFDF8"/><circle cx="246" cy="153" r="8" fill="#F5EFE2"/><circle cx="260" cy="156" r="8" fill="#FFFDF8"/>
          <rect x="312" y="142" width="6" height="43" fill="#D99B26"/>
          <line x1="292" y1="148" x2="338" y2="148" stroke="#D99B26" stroke-width="3"/>
          <circle cx="294" cy="163" r="8" fill="#E5A933"/><circle cx="336" cy="163" r="8" fill="#E5A933"/>
        </svg>`,

      tradeBlessing: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#FCECC9"/>
          <circle cx="200" cy="95" r="45" fill="#FFFDF8" opacity="0.8"/>
          <path d="M0 195 Q130 165 260 195 T400 185 L400 300 L0 300 Z" fill="#D9A441"/>
          <rect x="75" y="160" width="75" height="52" rx="8" fill="#1D3557"/>
          <rect x="85" y="150" width="55" height="14" rx="4" fill="#C25934"/>
          <rect x="165" y="155" width="75" height="57" rx="8" fill="#1E5631"/>
          <rect x="175" y="144" width="55" height="14" rx="4" fill="#D99B26"/>
          <rect x="255" y="162" width="75" height="50" rx="8" fill="#9B4121"/>
          <circle cx="115" cy="245" r="14" fill="#F4C97B" stroke="#C68617" stroke-width="2.5"/>
          <circle cx="152" cy="252" r="14" fill="#F4C97B" stroke="#C68617" stroke-width="2.5"/>
          <circle cx="248" cy="248" r="14" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2.5"/>
          <circle cx="285" cy="242" r="14" fill="#F4C97B" stroke="#C68617" stroke-width="2.5"/>
        </svg>`,

      uhudSteadfast: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#F7D6B5"/>
          <path d="M0 210 L85 95 L165 155 L235 80 L325 150 L400 115 L400 300 L0 300 Z" fill="#9B4121"/>
          <path d="M0 230 L120 165 L230 205 L340 155 L400 185 L400 300 L0 300 Z" fill="#C25934"/>
          <circle cx="165" cy="215" r="44" fill="#D99B26" stroke="#7A4E2D" stroke-width="6"/>
          <circle cx="165" cy="215" r="24" fill="#F4C97B"/>
          <circle cx="165" cy="215" r="8" fill="#9B4121"/>
          <line x1="215" y1="245" x2="295" y2="175" stroke="#5C4030" stroke-width="9" stroke-linecap="round"/>
          <line x1="228" y1="215" x2="252" y2="242" stroke="#D99B26" stroke-width="6" stroke-linecap="round"/>
          <path d="M85 255 Q110 225 135 215" stroke="#1E5631" stroke-width="4" fill="none"/>
          <ellipse cx="105" cy="233" rx="8" ry="4" fill="#587246" transform="rotate(-30 105 233)"/>
          <ellipse cx="122" cy="222" rx="8" ry="4" fill="#587246" transform="rotate(-30 122 222)"/>
        </svg>`,

      dumatAlJandal: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#DFF0F5"/>
          <path d="M0 215 Q200 185 400 215 L400 300 L0 300 Z" fill="#E3C38B"/>
          <rect x="135" y="65" width="7" height="175" rx="3" fill="#6E4726"/>
          <path d="M142 72 Q195 62 245 80 Q195 105 142 108 Z" fill="#1E5631"/>
          <path d="M142 108 Q195 102 240 118 Q195 138 142 138 Z" fill="#FFFDF8"/>
          <ellipse cx="275" cy="215" rx="38" ry="22" fill="#F5EFE2" stroke="#D99B26" stroke-width="3"/>
          <path d="M242 215 Q275 198 308 215" stroke="#1E5631" stroke-width="5" fill="none"/>
          <path d="M298 222 L314 252" stroke="#F5EFE2" stroke-width="10" stroke-linecap="round"/>
        </svg>`,

      tabukPrayer: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fajrGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2A4B7C"/>
              <stop offset="55%" stop-color="#D98A6C"/>
              <stop offset="100%" stop-color="#FCECC9"/>
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#fajrGrad)"/>
          <circle cx="200" cy="175" r="48" fill="#FFFDF8" opacity="0.85"/>
          <path d="M0 190 Q200 165 400 190 L400 300 L0 300 Z" fill="#D5B278"/>
          <path d="M125 255 L125 205 Q125 170 200 170 Q275 170 275 205 L275 255" fill="none" stroke="#FFFDF8" stroke-width="10" stroke-linecap="round"/>
          <rect x="145" y="210" width="110" height="48" rx="6" fill="#1E5631" opacity="0.85"/>
          <rect x="155" y="218" width="90" height="32" rx="4" fill="none" stroke="#F4C97B" stroke-width="2"/>
        </svg>`,

      iftarTears: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#2B3A55"/>
          <rect x="265" y="45" width="75" height="95" rx="37" fill="#FCECC9" opacity="0.85"/>
          <line x1="302" y1="45" x2="302" y2="140" stroke="#2B3A55" stroke-width="4"/>
          <line x1="265" y1="95" x2="340" y2="95" stroke="#2B3A55" stroke-width="4"/>
          <rect x="65" y="205" width="270" height="16" rx="5" fill="#7A4E2D"/>
          <rect x="95" y="221" width="16" height="55" fill="#5C3A21"/>
          <rect x="289" y="221" width="16" height="55" fill="#5C3A21"/>
          <path d="M120 185 L180 185 L170 205 L130 205 Z" fill="#C25934"/>
          <ellipse cx="220" cy="198" rx="28" ry="7" fill="#E6C280"/>
          <path d="M268 182 L288 182 L284 205 L272 205 Z" fill="#D99B26"/>
        </svg>`,

      ummSalamahAdvice: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#F8F1E3"/>
          <path d="M85 210 Q65 160 110 145 L145 145 Q185 165 165 215 Q125 235 85 210 Z" fill="#8C5A2B"/>
          <rect x="108" y="138" width="38" height="10" rx="4" fill="#D99B26"/>
          <circle cx="175" cy="175" r="10" fill="#F4C97B" stroke="#C68617" stroke-width="2"/>
          <circle cx="205" cy="188" r="10" fill="#F4C97B" stroke="#C68617" stroke-width="2"/>
          <circle cx="235" cy="202" r="10" fill="#F4C97B" stroke="#C68617" stroke-width="2"/>
          <path d="M210 245 Q265 230 325 245 L325 270 L210 270 Z" fill="#7A4E2D"/>
          <rect x="266" y="155" width="10" height="85" fill="#6E4726"/>
          <circle cx="271" cy="145" r="42" fill="#1E5631"/>
          <circle cx="245" cy="160" r="28" fill="#587246"/>
          <circle cx="298" cy="158" r="28" fill="#587246"/>
        </svg>`,

      sarghRoad: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="طريق يتفرع: فرع نحو الشام عليه علامة توقف، وفرع عائد">
          <defs>
            <linearGradient id="sarghSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F6D399"/>
              <stop offset="100%" stop-color="#FBE8C6"/>
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#sarghSky)"/>
          <circle cx="80" cy="68" r="30" fill="#FFFDF8" opacity="0.85"/>
          <path d="M0 170 Q120 140 250 170 T400 160 L400 300 L0 300 Z" fill="#E2AE5C"/>
          <path d="M0 215 Q170 185 310 220 L400 205 L400 300 L0 300 Z" fill="#CC8E3B"/>
          <path d="M200 300 L200 222" stroke="#F5E3BE" stroke-width="22" stroke-linecap="round"/>
          <path d="M200 224 Q172 188 118 150" stroke="#F5E3BE" stroke-width="15" fill="none" stroke-linecap="round"/>
          <path d="M200 224 Q245 200 318 206" stroke="#F5E3BE" stroke-width="15" fill="none" stroke-linecap="round"/>
          <rect x="132" y="118" width="5" height="46" rx="2" fill="#6E4726"/>
          <circle cx="134.5" cy="112" r="17" fill="#C25934" stroke="#FFFDF8" stroke-width="3"/>
          <rect x="124" y="109" width="21" height="6" rx="2" fill="#FFFDF8"/>
          <rect x="296" y="168" width="5" height="40" rx="2" fill="#6E4726"/>
          <path d="M278 160 L316 160 L328 171 L316 182 L278 182 Z" fill="#1E5631"/>
          <ellipse cx="228" cy="214" rx="5" ry="3" fill="#8C5A2B" opacity="0.6"/>
          <ellipse cx="246" cy="208" rx="5" ry="3" fill="#8C5A2B" opacity="0.6"/>
          <ellipse cx="264" cy="207" rx="5" ry="3" fill="#8C5A2B" opacity="0.6"/>
          <ellipse cx="282" cy="206" rx="5" ry="3" fill="#8C5A2B" opacity="0.6"/>
          <path d="M34 250 L66 234 L98 250 Z" fill="#9B4121"/>
          <rect x="44" y="249" width="44" height="5" rx="2" fill="#7A3E1D"/>
          <path d="M318 256 L344 243 L370 256 Z" fill="#9B4121"/>
          <rect x="326" y="255" width="36" height="5" rx="2" fill="#7A3E1D"/>
        </svg>`,

      threeThirds: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#F6EFE0"/>
          <rect x="190" y="165" width="20" height="95" rx="6" fill="#7A4E2D"/>
          <path d="M195 175 Q125 145 85 110" stroke="#7A4E2D" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M200 168 Q200 120 200 80" stroke="#7A4E2D" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M205 175 Q275 145 315 110" stroke="#7A4E2D" stroke-width="10" fill="none" stroke-linecap="round"/>
          <circle cx="85" cy="95" r="42" fill="#1D3557"/>
          <text x="85" y="92" text-anchor="middle" fill="#FCECC9" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="14" font-weight="bold">ثُلُثٌ</text>
          <text x="85" y="110" text-anchor="middle" fill="#fff" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="11">قَرْضٌ حَسَنٌ</text>
          <circle cx="200" cy="65" r="44" fill="#1E5631"/>
          <text x="200" y="62" text-anchor="middle" fill="#FCECC9" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="14" font-weight="bold">ثُلُثٌ</text>
          <text x="200" y="80" text-anchor="middle" fill="#fff" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="11">قَضَاءُ دَيْنٍ</text>
          <circle cx="315" cy="95" r="42" fill="#C25934"/>
          <text x="315" y="92" text-anchor="middle" fill="#FCECC9" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="14" font-weight="bold">ثُلُثٌ</text>
          <text x="315" y="110" text-anchor="middle" fill="#fff" font-family="system-ui, -apple-system, Segoe UI, Tahoma, sans-serif" font-size="11">صِلَةٌ وَعَطَاءٌ</text>
        </svg>`,

      orchardGift: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#E1F4F3"/>
          <rect x="20" y="185" width="360" height="95" rx="10" fill="#C99E67"/>
          <rect x="35" y="198" width="330" height="72" rx="6" fill="#587246"/>
          <path d="M185 198 L175 270 L225 270 L215 198 Z" fill="#4EA8DE"/>
          <rect x="92" y="105" width="12" height="95" fill="#6E4726"/>
          <path d="M98 105 Q55 85 45 120" stroke="#1E5631" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M98 105 Q140 85 150 120" stroke="#1E5631" stroke-width="8" fill="none" stroke-linecap="round"/>
          <rect x="292" y="105" width="12" height="95" fill="#6E4726"/>
          <path d="M298 105 Q255 85 245 120" stroke="#1E5631" stroke-width="8" fill="none" stroke-linecap="round"/>
          <path d="M298 105 Q340 85 350 120" stroke="#1E5631" stroke-width="8" fill="none" stroke-linecap="round"/>
        </svg>`,

      humbleKnowledge: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#F5ECD9"/>
          <rect x="55" y="175" width="290" height="80" rx="12" fill="#D5B278" stroke="#9B4121" stroke-width="3"/>
          <line x1="55" y1="195" x2="345" y2="195" stroke="#1E5631" stroke-width="4"/>
          <line x1="55" y1="235" x2="345" y2="235" stroke="#1E5631" stroke-width="4"/>
          <path d="M120 140 Q160 130 200 145 Q240 130 280 140 L280 190 Q240 180 200 195 Q160 180 120 190 Z" fill="#FFFDF8" stroke="#D99B26" stroke-width="2.5"/>
          <line x1="200" y1="145" x2="200" y2="195" stroke="#D99B26" stroke-width="2"/>
          <rect x="295" y="165" width="22" height="24" rx="4" fill="#1D3557"/>
          <path d="M306 165 L330 125" stroke="#C25934" stroke-width="4" stroke-linecap="round"/>
        </svg>`,

      shuraCouncil: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="300" fill="#E6EFE9"/>
          <ellipse cx="200" cy="230" rx="145" ry="42" fill="#D5B887"/>
          <rect x="75" y="105" width="18" height="105" rx="4" fill="#FFFDF8" stroke="#1E5631" stroke-width="2"/>
          <rect x="120" y="85" width="18" height="105" rx="4" fill="#FFFDF8" stroke="#1E5631" stroke-width="2"/>
          <rect x="165" y="75" width="18" height="105" rx="4" fill="#FFFDF8" stroke="#1E5631" stroke-width="2"/>
          <rect x="217" y="75" width="18" height="105" rx="4" fill="#FFFDF8" stroke="#1E5631" stroke-width="2"/>
          <rect x="262" y="85" width="18" height="105" rx="4" fill="#FFFDF8" stroke="#1E5631" stroke-width="2"/>
          <rect x="307" y="105" width="18" height="105" rx="4" fill="#FFFDF8" stroke="#1E5631" stroke-width="2"/>
          <circle cx="200" cy="195" r="24" fill="#FCECC9" opacity="0.9"/>
          <rect x="190" y="182" width="20" height="26" rx="4" fill="#D99B26"/>
          <path d="M186 182 L200 170 L214 182 Z" fill="#9B4121"/>
        </svg>`,

      eternalLegacy: `
        <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sunsetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3D348B"/>
              <stop offset="50%" stop-color="#E07A5F"/>
              <stop offset="100%" stop-color="#F2CC8F"/>
            </linearGradient>
          </defs>
          <rect width="400" height="300" fill="url(#sunsetGrad)"/>
          <circle cx="200" cy="185" r="55" fill="#FFFDF8" opacity="0.85"/>
          <path d="M0 215 Q110 185 220 210 T400 195 L400 300 L0 300 Z" fill="#3D5A45"/>
          <path d="M150 85 L152.24 89.76 L157 92 L152.24 94.24 L150 99 L147.76 94.24 L143 92 L147.76 89.76 Z" fill="#FFFDF8"/>
          <path d="M232 61 L234.88 67.12 L241 70 L234.88 72.88 L232 79 L229.12 72.88 L223 70 L229.12 67.12 Z" fill="#FFFDF8"/>
          <path d="M190 48 L191.92 52.08 L196 54 L191.92 55.92 L190 60 L188.08 55.92 L184 54 L188.08 52.08 Z" fill="#FFFDF8"/>
          <path d="M300 104 L301.92 108.08 L306 110 L301.92 111.92 L300 116 L298.08 111.92 L294 110 L298.08 108.08 Z" fill="#FFFDF8"/>
          <path d="M96 115 L97.6 118.4 L101 120 L97.6 121.6 L96 125 L94.4 121.6 L91 120 L94.4 118.4 Z" fill="#FFFDF8"/>
          <path d="M268 35 L269.6 38.4 L273 40 L269.6 41.6 L268 45 L266.4 41.6 L263 40 L266.4 38.4 Z" fill="#FFFDF8"/>
        </svg>`
    };
