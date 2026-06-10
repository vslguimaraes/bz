'use client'

type Props = {
  emoji: string
  label: string
  selected?: boolean
  onClick: () => void
  large?: boolean  // opção destaque (maior)
}

export default function QuizOption({ emoji, label, selected, onClick, large }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? 'var(--color-saibro)' : 'var(--color-branco)',
        color: selected ? '#fff' : 'var(--color-cinza)',
        border: `2px solid ${selected ? 'var(--color-saibro)' : 'var(--color-creme-dark)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: large ? '28px 16px' : '20px 12px',
        cursor: 'pointer',
        boxShadow: selected ? '0 4px 16px rgba(74,124,89,0.25)' : 'var(--shadow-sm)',
        transform: selected ? 'scale(1.03)' : 'scale(1)',
        transition: 'all 150ms ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        minHeight: large ? '120px' : '90px',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: large ? '2.5rem' : '2rem', lineHeight: 1 }}>{emoji}</span>
      <span style={{ fontWeight: 600, fontSize: large ? '0.9375rem' : '0.875rem', lineHeight: 1.25 }}>{label}</span>
    </button>
  )
}
