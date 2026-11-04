import { useId } from 'react';
import { getArchetype } from '../data/lore.js';

export default function Companion({ profile, level = 1, className = '' }) {
  const hero = getArchetype(profile);
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '') || 'lore';

  const hasGear = level >= 3;
  const hasCape = level >= 5;
  const hasCrown = level >= 7;

  return (
    <div
      className={`companion-art ${className}`}
      style={{
        '--hero-accent': hero.accent,
        '--hero-secondary': hero.secondary
      }}
    >
      <svg
        className="companion-svg"
        viewBox="0 0 320 390"
        role="img"
        aria-label={`${hero.name}, ${hero.title}, level ${level}`}
      >
        <defs>
          <radialGradient id={`${id}-halo`} cx="50%" cy="43%" r="60%">
            <stop offset="0%" stopColor={hero.accent} stopOpacity="0.42" />
            <stop offset="55%" stopColor={hero.secondary} stopOpacity="0.14" />
            <stop offset="100%" stopColor={hero.secondary} stopOpacity="0" />
          </radialGradient>

          <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={hero.outfit} />
            <stop offset="100%" stopColor={hero.deepOutfit} />
          </linearGradient>

          <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#ffdbc2" />
            <stop offset="100%" stopColor="#d9978d" />
          </linearGradient>

          <linearGradient id={`${id}-cape`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={hero.secondary} />
            <stop offset="100%" stopColor={hero.deepOutfit} />
          </linearGradient>

          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <ellipse cx="160" cy="184" rx="132" ry="146" fill={`url(#${id}-halo)`} />

        <g className="companion-starfield" fill={hero.accent}>
          <path d="M54 103l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" opacity=".8" />
          <path d="M259 76l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" opacity=".6" />
          <path d="M273 206l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" opacity=".55" />
          <circle cx="79" cy="198" r="2" opacity=".7" />
          <circle cx="243" cy="137" r="2" opacity=".65" />
          <circle cx="78" cy="271" r="1.7" opacity=".55" />
        </g>

        {hasCape && (
          <g className="companion-aura">
            <circle
              cx="160"
              cy="169"
              r="111"
              fill="none"
              stroke={hero.accent}
              strokeWidth="1.7"
              strokeDasharray="3 9"
              opacity=".8"
            />
            <circle
              cx="160"
              cy="169"
              r="123"
              fill="none"
              stroke={hero.secondary}
              strokeWidth="2"
              opacity=".32"
            />
            <path
              d="M160 31V15 M272 95l13-8 M48 95 35 87 M282 171h17 M38 171H21"
              stroke={hero.accent}
              strokeWidth="2"
              strokeLinecap="round"
              opacity=".8"
            />
          </g>
        )}

        <ellipse cx="160" cy="356" rx="76" ry="12" fill="#02040d" opacity=".48" />

        {hasCape && (
          <path
            d="M94 226Q160 254 226 226L279 353Q160 318 41 353Z"
            fill={`url(#${id}-cape)`}
            stroke={hero.accent}
            strokeWidth="1.5"
            opacity=".92"
          />
        )}

        <path
          d="M101 241Q112 215 137 213H183Q209 215 220 241L243 338Q160 366 77 338Z"
          fill={`url(#${id}-coat)`}
          stroke="#111629"
          strokeWidth="4"
        />

        <path
          d="M102 248Q78 253 71 282L63 318Q77 330 94 320L115 265Z"
          fill={hero.deepOutfit}
          stroke="#111629"
          strokeWidth="4"
        />
        <path
          d="M218 248Q242 253 249 282L257 318Q243 330 226 320L205 265Z"
          fill={hero.deepOutfit}
          stroke="#111629"
          strokeWidth="4"
        />

        <path d="M137 207V237Q160 260 183 237V207" fill="#e6a995" stroke="#182033" strokeWidth="3" />
        <path d="M119 240L160 274 201 240" fill="none" stroke={hero.accent} strokeWidth="4" />
        <path d="M107 293Q160 318 213 293" fill="none" stroke="#f0dcaa" strokeWidth="2" opacity=".65" />

        <path
          d="M105 118Q91 64 127 40Q160 17 197 40Q232 64 215 126L205 196Q188 171 185 147H133Q129 179 110 198Z"
          fill={hero.hair}
          stroke="#101628"
          strokeWidth="4"
        />

        <circle cx="112" cy="151" r="13" fill="#e8ad97" />
        <circle cx="208" cy="151" r="13" fill="#e8ad97" />
        <ellipse cx="160" cy="146" rx="51" ry="66" fill={`url(#${id}-face)`} stroke="#182033" strokeWidth="3" />

        <path
          d={
            hero.hairStyle === 'spike'
              ? 'M108 119Q108 58 157 43L145 78 166 55 165 81 185 56 184 91 207 75 213 126Q198 112 187 100 171 119 157 105 138 125 124 108Z'
              : hero.hairStyle === 'long'
                ? 'M108 120Q105 57 158 42Q211 47 214 118Q204 100 193 91L201 181Q185 171 180 143H136Q132 172 115 184L119 103Z'
                : hero.hairStyle === 'sweep'
                  ? 'M107 120Q108 58 157 43Q205 41 215 113Q195 94 179 89 160 111 145 101 127 119 108 136Z'
                  : hero.hairStyle === 'twin'
                    ? 'M109 112Q105 56 158 42Q212 47 214 118L229 209 203 189 197 111Q179 118 165 101 143 124 127 105Z'
                    : hero.hairStyle === 'wild'
                      ? 'M106 121Q103 58 157 41L143 77 164 53 166 78 186 52 184 88 213 67 207 125Q192 111 182 101 164 119 150 104 128 126 106 121Z'
                      : 'M108 121Q106 58 158 42Q210 45 214 121Q193 103 178 98 162 116 146 103 126 120 108 121Z'
          }
          fill={hero.hair}
          stroke="#101628"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {hero.hairStyle === 'twin' && (
          <g fill={hero.hair} stroke="#101628" strokeWidth="3">
            <path d="M111 97Q93 127 99 198Q113 190 120 165L122 112Z" />
            <path d="M209 97Q227 127 221 198Q207 190 200 165L198 112Z" />
          </g>
        )}

        <path d="M128 149Q141 139 151 147" fill="none" stroke={hero.hair} strokeWidth="4" strokeLinecap="round" />
        <path d="M169 147Q180 139 192 149" fill="none" stroke={hero.hair} strokeWidth="4" strokeLinecap="round" />

        <ellipse cx="140" cy="160" rx="12" ry="15" fill="#fff8ed" />
        <ellipse cx="181" cy="160" rx="12" ry="15" fill="#fff8ed" />
        <ellipse cx="142" cy="162" rx="6" ry="10" fill={hero.secondary} />
        <ellipse cx="179" cy="162" rx="6" ry="10" fill={hero.secondary} />
        <circle cx="143" cy="163" r="3.5" fill="#12182c" />
        <circle cx="180" cy="163" r="3.5" fill="#12182c" />
        <circle cx="145" cy="158" r="2.5" fill="#fff" />
        <circle cx="182" cy="158" r="2.5" fill="#fff" />

        <path d="M160 164L157 176" stroke="#bb7775" strokeWidth="2" strokeLinecap="round" />
        <path d="M150 187Q160 195 170 187" fill="none" stroke="#a44f65" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="125" cy="179" rx="9" ry="4" fill="#f1828d" opacity=".22" />
        <ellipse cx="195" cy="179" rx="9" ry="4" fill="#f1828d" opacity=".22" />

        <path d="M119 244L160 276 201 244" fill="none" stroke={hero.accent} strokeWidth="3" opacity=".9" />
        <circle cx="160" cy="276" r="7" fill={hero.accent} />

        {hasGear && (
          <g className="companion-gear">
            <path d="M98 244Q112 229 130 238L121 267Q105 271 90 258Z" fill="#d5bc80" stroke="#fff0bc" strokeWidth="2" />
            <path d="M222 244Q208 229 190 238L199 267Q215 271 230 258Z" fill="#d5bc80" stroke="#fff0bc" strokeWidth="2" />
            <path d="M113 252L160 281 207 252" fill="none" stroke="#fff0bc" strokeWidth="4" strokeLinecap="round" />
            <circle cx="160" cy="281" r="8" fill={hero.accent} stroke="#fff0bc" strokeWidth="2" />
          </g>
        )}

        {hasCrown && (
          <g className="companion-crown">
            <path d="M128 79L132 59 148 72 160 48 172 72 188 59 192 80Z" fill="#f5d47e" stroke="#fff1b5" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M131 82H189" stroke="#fff1b5" strokeWidth="3" strokeLinecap="round" />
            <circle cx="160" cy="66" r="4" fill={hero.secondary} />
          </g>
        )}
      </svg>
    </div>
  );
}
