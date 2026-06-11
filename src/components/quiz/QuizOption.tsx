'use client'
import { ReactNode } from 'react'

type Props = {
  label: string
  desc?: string
  illustration?: ReactNode
  selected?: boolean
  onClick: () => void
  large?: boolean
}

export default function QuizOption({ label, desc, illustration, selected, onClick, large }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'var(--court-dark)' : '#FDFAF7',
        color: selected ? 'var(--warm-white)' : 'var(--court-dark)',
        border: `2px solid ${selected ? 'var(--clay)' : 'transparent'}`,
        borderRadius: '8px',
        padding: 0,
        cursor: 'pointer',
        transition: 'all 180ms ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: selected
          ? '0 4px 20px rgba(196,98,45,0.25)'
          : '0 1px 4px rgba(0,0,0,0.07)',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.12)'
          e.currentTarget.style.borderColor = 'var(--clay)'
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'
          e.currentTarget.style.borderColor = 'transparent'
        }
      }}
    >
      {/* Zona da ilustração */}
      {illustration && (
        <div style={{
          background: selected
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(196,98,45,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: large ? '22px 16px' : '18px 12px',
          minHeight: large ? '96px' : '76px',
          transition: 'background 180ms',
        }}>
          <div style={{
            opacity: selected ? 0.5 : 1,
            transform: selected ? 'scale(0.92)' : 'scale(1)',
            transition: 'all 180ms ease',
          }}>
            {illustration}
          </div>
        </div>
      )}

      {/* Linha divisória */}
      <div style={{
        height: '1px',
        background: selected ? 'rgba(255,255,255,0.1)' : 'rgba(196,98,45,0.12)',
      }} />

      {/* Texto */}
      <div style={{
        padding: large ? '14px 16px' : '10px 12px',
      }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontStyle: 'normal',
          fontSize: '1.125rem',
          lineHeight: 1.2,
          letterSpacing: '-0.01em',
          marginBottom: desc ? '4px' : 0,
          color: selected ? '#FFFFFF' : 'var(--court-dark)',
        }}>
          {label}
        </span>
        {desc && (
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '0.875rem',
            lineHeight: 1.4,
            color: selected ? 'rgba(247,243,238,0.65)' : '#777',
          }}>
            {desc}
          </span>
        )}
      </div>

      {/* Acento clay na base quando selecionado */}
      {selected && (
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '3px',
          background: 'var(--clay)',
        }} />
      )}
    </button>
  )
}
