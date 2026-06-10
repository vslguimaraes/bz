'use client'

type Props = {
  emoji: string
  label: string
  desc?: string
  selected?: boolean
  onClick: () => void
  large?: boolean
}

export default function QuizOption({ emoji, label, desc, selected, onClick, large }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'var(--color-saibro)' : 'var(--color-branco)',
        color: selected ? '#fff' : 'var(--color-cinza)',
        border: `2px solid ${selected ? 'var(--color-saibro)' : 'var(--color-creme-dark)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: large ? '20px 16px' : '14px 12px',
        cursor: 'pointer',
        boxShadow: selected ? '0 4px 16px rgba(74,124,89,0.25)' : 'var(--shadow-sm)',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 150ms ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        minHeight: large ? '100px' : '80px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: large ? '2.25rem' : '1.75rem', lineHeight: 1 }}>{emoji}</span>
      <span style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.2 }}>{label}</span>
      {desc && (
        <span style={{
          fontSize: '0.75rem', lineHeight: 1.3,
          color: selected ? 'rgba(255,255,255,0.8)' : 'var(--color-cinza-medium)',
          fontWeight: 400,
        }}>{desc}</span>
      )}
    </button>
  )
}
