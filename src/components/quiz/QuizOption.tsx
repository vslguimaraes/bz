'use client'

type Props = {
  label: string
  desc?: string
  selected?: boolean
  onClick: () => void
  large?: boolean
}

export default function QuizOption({ label, desc, selected, onClick, large }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'var(--court-dark)' : 'var(--warm-white)',
        color: selected ? 'var(--warm-white)' : 'var(--court-dark)',
        border: `1.5px solid ${selected ? 'var(--court-dark)' : 'var(--cream)'}`,
        borderRadius: '4px',
        padding: large ? '22px 20px' : '16px 14px',
        cursor: 'pointer',
        transition: 'all 180ms ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        gap: '4px',
        width: '100%',
        minHeight: large ? '110px' : '88px',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--clay)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--cream)'
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }
      }}
    >
      {/* Acento clay no canto superior quando selecionado */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '3px', background: 'var(--clay)',
        }} />
      )}

      <span style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: large ? '0.9375rem' : '0.875rem',
        lineHeight: 1.2,
        letterSpacing: '0.01em',
      }}>
        {label}
      </span>

      {desc && (
        <span style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontSize: '0.75rem',
          lineHeight: 1.3,
          color: selected ? 'rgba(247,243,238,0.6)' : '#999',
          letterSpacing: '0.01em',
        }}>
          {desc}
        </span>
      )}
    </button>
  )
}
