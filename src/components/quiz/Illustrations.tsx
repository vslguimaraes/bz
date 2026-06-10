// Bold shape SVG illustrations para cada opção do quiz
// Paleta: clay #C4622D | grass #3B6E45 | hard #2B5EA7 | dark #1A1A18

type IllustrationProps = { size?: number }

// ── Histórico ──────────────────────────────────────────────────

export function IluRecreativo({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="16" cy="12" r="6" fill="#2B5EA7"/>
      <circle cx="32" cy="12" r="6" fill="#C4622D"/>
      <path d="M8 36c0-8 6-12 8-12s8 4 8 12H8z" fill="#2B5EA7"/>
      <path d="M24 36c0-8 6-12 8-12s8 4 8 12H24z" fill="#C4622D"/>
    </svg>
  )
}

export function IluDesenvolvendo({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="13" r="7" fill="#C4622D"/>
      <path d="M14 40c0-10 5-15 10-15s10 5 10 15H14z" fill="#C4622D" opacity="0.85"/>
      <path d="M32 8l8-6-2 8-6-2z" fill="#3B6E45"/>
      <path d="M36 6l4 10" stroke="#3B6E45" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

export function IluCompetitivo({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 4l5 10h11l-9 7 3 11-10-7-10 7 3-11L8 14h11L24 4z" fill="#C4622D"/>
      <rect x="18" y="40" width="12" height="4" rx="2" fill="#1A1A18"/>
      <rect x="20" y="36" width="8" height="6" rx="1" fill="#9B4520"/>
    </svg>
  )
}

export function IluRetorno({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="16" stroke="#3B6E45" strokeWidth="4" fill="none"/>
      <path d="M24 8 A16 16 0 0 1 40 24" stroke="#3B6E45" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M40 24l-6-6M40 24l-6 6" stroke="#3B6E45" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="24" cy="24" r="5" fill="#3B6E45"/>
    </svg>
  )
}

// ── Técnico ───────────────────────────────────────────────────

export function IluBasico({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <ellipse cx="20" cy="20" rx="12" ry="14" fill="#2B5EA7" opacity="0.15"/>
      <ellipse cx="20" cy="20" rx="12" ry="14" stroke="#2B5EA7" strokeWidth="3.5" fill="none"/>
      <line x1="20" y1="6" x2="20" y2="34" stroke="#2B5EA7" strokeWidth="2.5"/>
      <line x1="8" y1="20" x2="32" y2="20" stroke="#2B5EA7" strokeWidth="2.5"/>
      <rect x="30" y="30" width="4" height="14" rx="2" fill="#2B5EA7"/>
    </svg>
  )
}

export function IluEmConstrucao({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <ellipse cx="20" cy="20" rx="12" ry="14" stroke="#C4622D" strokeWidth="3.5" fill="none"/>
      <rect x="30" y="30" width="4" height="14" rx="2" fill="#C4622D"/>
      <path d="M34 8 Q42 20 34 32" stroke="#C4622D" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M38 28l4 6-6 0z" fill="#C4622D"/>
    </svg>
  )
}

export function IluIntermediario({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <ellipse cx="20" cy="20" rx="12" ry="14" stroke="#3B6E45" strokeWidth="3.5" fill="none"/>
      <line x1="20" y1="6" x2="20" y2="34" stroke="#3B6E45" strokeWidth="2"/>
      <line x1="8" y1="14" x2="32" y2="14" stroke="#3B6E45" strokeWidth="2"/>
      <line x1="8" y1="20" x2="32" y2="20" stroke="#3B6E45" strokeWidth="2"/>
      <line x1="8" y1="26" x2="32" y2="26" stroke="#3B6E45" strokeWidth="2"/>
      <rect x="30" y="30" width="4" height="14" rx="2" fill="#3B6E45"/>
      <circle cx="40" cy="10" r="5" fill="#3B6E45"/>
    </svg>
  )
}

export function IluAvancado({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <ellipse cx="18" cy="18" rx="10" ry="12" stroke="#1A1A18" strokeWidth="3.5" fill="none"/>
      <rect x="26" y="26" width="4" height="14" rx="2" fill="#1A1A18"/>
      <circle cx="10" cy="9" r="5" fill="#C4622D"/>
      <path d="M8 28h32" stroke="#1A1A18" strokeWidth="3" strokeLinecap="round"/>
      <path d="M36 24l6 4-6 4" fill="#1A1A18"/>
    </svg>
  )
}

// ── Estilo ────────────────────────────────────────────────────

export function IluTopspinPesado({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="10" fill="#C4622D"/>
      <path d="M12 36 Q24 10 36 36" stroke="#C4622D" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M30 32l8 2-4-7z" fill="#C4622D"/>
      <circle cx="24" cy="24" r="4" fill="white"/>
    </svg>
  )
}

export function IluFlat({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="36" cy="24" r="8" fill="#2B5EA7"/>
      <path d="M4 24h28" stroke="#2B5EA7" strokeWidth="5" strokeLinecap="round"/>
      <path d="M28 16l12 8-12 8" fill="#2B5EA7"/>
    </svg>
  )
}

export function IluAllCourt({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="8" fill="#3B6E45"/>
      <path d="M24 4v8M24 36v8M4 24h8M36 24h8" stroke="#3B6E45" strokeWidth="4" strokeLinecap="round"/>
      <path d="M10 10l5 5M33 33l5 5M10 38l5-5M33 15l5-5" stroke="#3B6E45" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

export function IluDefensivo({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 4 L40 12 L40 28 Q40 40 24 44 Q8 40 8 28 L8 12 Z" fill="#2B5EA7" opacity="0.9"/>
      <path d="M16 24l6 6 10-12" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

export function IluNetRusher({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M4 38h40" stroke="#1A1A18" strokeWidth="3" strokeLinecap="round"/>
      <path d="M8 20l20-12 16 8" stroke="#C4622D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="34" cy="14" r="7" fill="#C4622D"/>
      <path d="M30 36l8-22" stroke="#C4622D" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

export function IluTopspin({ size = 48 }: IllustrationProps) {
  return <IluTopspinPesado size={size} />
}

export function IluDescoberto({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="20" r="12" stroke="#C4622D" strokeWidth="3.5" fill="none"/>
      <path d="M19 16 Q24 10 29 16 Q34 22 24 26" stroke="#C4622D" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="24" cy="32" r="2.5" fill="#C4622D"/>
    </svg>
  )
}

// ── Mobilidade ────────────────────────────────────────────────

export function IluAltaMobilidade({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="8" r="5" fill="#C4622D"/>
      <path d="M24 13 L18 26 L10 32" stroke="#C4622D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M24 13 L30 20 L38 16" stroke="#C4622D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M18 26 L16 38" stroke="#C4622D" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M28 22 L30 38" stroke="#C4622D" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M4 42 Q12 36 20 40 Q28 36 36 40 Q42 38 46 42" stroke="#9B4520" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export function IluModerada({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="8" r="5" fill="#3B6E45"/>
      <path d="M24 13 L20 28" stroke="#3B6E45" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M20 28 L14 38" stroke="#3B6E45" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M20 28 L28 38" stroke="#3B6E45" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M16 20 L30 18" stroke="#3B6E45" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    </svg>
  )
}

export function IluReduzida({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="8" r="5" fill="#2B5EA7"/>
      <path d="M24 13 L22 28" stroke="#2B5EA7" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M22 28 L16 38" stroke="#2B5EA7" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M22 28 L28 38" stroke="#2B5EA7" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M18 20 L28 20" stroke="#2B5EA7" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <circle cx="24" cy="30" r="10" stroke="#2B5EA7" strokeWidth="2" fill="none" opacity="0.3"/>
      <circle cx="24" cy="30" r="6" stroke="#2B5EA7" strokeWidth="2" fill="none" opacity="0.3"/>
    </svg>
  )
}

// ── Lesão ─────────────────────────────────────────────────────

export function IluSemLesao({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="18" fill="#3B6E45"/>
      <path d="M14 24l8 8 14-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

export function IluCotovelo({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M12 8 Q18 20 26 26 Q34 32 38 42" stroke="#C4622D" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <circle cx="26" cy="26" r="9" fill="#C4622D" opacity="0.25"/>
      <circle cx="26" cy="26" r="5" fill="#C4622D" opacity="0.5"/>
      <path d="M22 22l8 8M30 22l-8 8" stroke="#9B4520" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export function IluVibracao({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M8 24 Q14 14 20 24 Q26 34 32 24 Q38 14 44 24" stroke="#2B5EA7" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M8 34 Q14 24 20 34 Q26 44 32 34 Q38 24 44 34" stroke="#2B5EA7" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M8 14 Q14 4 20 14 Q26 24 32 14 Q38 4 44 14" stroke="#2B5EA7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.3"/>
    </svg>
  )
}

// ── Frequência ────────────────────────────────────────────────

export function IluPoucos({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="16" fill="#2B5EA7" opacity="0.15"/>
      <path d="M24 8 Q8 16 8 28 Q8 40 24 44 Q40 40 40 28 Q40 16 24 8Z" fill="#2B5EA7" opacity="0.9"/>
      <circle cx="18" cy="22" r="2.5" fill="white"/>
      <circle cx="28" cy="18" r="1.5" fill="white" opacity="0.6"/>
      <circle cx="32" cy="28" r="1" fill="white" opacity="0.4"/>
    </svg>
  )
}

export function IluSemanal({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="12" width="36" height="30" rx="4" fill="#3B6E45" opacity="0.15"/>
      <rect x="6" y="12" width="36" height="30" rx="4" stroke="#3B6E45" strokeWidth="3" fill="none"/>
      <rect x="14" y="6" width="4" height="10" rx="2" fill="#3B6E45"/>
      <rect x="30" y="6" width="4" height="10" rx="2" fill="#3B6E45"/>
      <rect x="12" y="26" width="8" height="8" rx="2" fill="#3B6E45"/>
    </svg>
  )
}

export function IluFrequente({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="6" y="12" width="36" height="30" rx="4" fill="#C4622D" opacity="0.15"/>
      <rect x="6" y="12" width="36" height="30" rx="4" stroke="#C4622D" strokeWidth="3" fill="none"/>
      <rect x="14" y="6" width="4" height="10" rx="2" fill="#C4622D"/>
      <rect x="30" y="6" width="4" height="10" rx="2" fill="#C4622D"/>
      <rect x="12" y="26" width="8" height="8" rx="2" fill="#C4622D"/>
      <rect x="26" y="26" width="8" height="8" rx="2" fill="#C4622D"/>
    </svg>
  )
}

export function IluIntenso({ size = 48 }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M24 4 Q30 14 28 20 Q36 12 34 24 Q42 18 38 30 Q36 38 24 44 Q12 38 10 30 Q6 18 14 24 Q12 12 20 20 Q18 14 24 4Z" fill="#9B4520"/>
      <path d="M24 16 Q27 22 26 26 Q30 22 29 28 Q32 24 30 30 Q28 36 24 40 Q20 36 18 30 Q16 24 19 28 Q18 22 22 26 Q21 22 24 16Z" fill="#E8622A"/>
    </svg>
  )
}
