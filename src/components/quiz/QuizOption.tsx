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
        background: selected ? 'var(--court-dark)' : 'var(--warm-white)',
        color: selected ? 'var(--warm-white)' : 'var(--court-dark)',
        border: `1.5px solid ${selected ? 'var(--court-dark)' : 'var(--cream)'}`,
        borderRadius: '6px',
        padding: large ? '20px 18px' : '14px 14px',
        cursor: 'pointer',
        transition: 'all 180ms ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '10px',
        width: '100%',
        minHeight: large ? '120px' : '96px',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = 'var(--clay)'
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'
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
      {/* Acento clay no topo quando selecionado */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '3px', background: 'var(--clay)',
        }} />
      )}

      {/* Ilustração no canto superior direito */}
      {illustration && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          opacity: selected ? 0.25 : 0.9,
          transition: 'opacity 180ms',
        }}>
          {illustration}
        </div>
      )}

      {/* Texto */}
      <div style={{ marginTop: 'auto' }}>
        <span style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: large ? '1rem' : '0.875rem',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          marginBottom: desc ? '4px' : 0,
        }}>
          {label}
        </span>
        {desc && (
          <span style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '0.75rem',
            lineHeight: 1.3,
            color: selected ? 'rgba(247,243,238,0.55)' : '#999',
          }}>
            {desc}
          </span>
        )}
      </div>
    </button>
  )
}
