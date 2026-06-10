'use client'

type Props = {
  emoji: string
  label: string
  desc?: string
  selected?: boolean
  onClick: () => void
}

export default function QuizOption({ emoji, label, desc, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-all duration-150"
      style={{
        background: selected ? 'var(--color-saibro)' : 'var(--color-branco)',
        color: selected ? '#fff' : 'var(--color-cinza)',
        border: `2px solid ${selected ? 'var(--color-saibro)' : 'var(--color-creme-dark)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        cursor: 'pointer',
        boxShadow: selected ? '0 4px 16px rgba(74,124,89,0.25)' : 'var(--shadow-sm)',
        transform: selected ? 'scale(1.01)' : 'scale(1)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{emoji}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3 }}>{label}</div>
        {desc && (
          <div style={{
            fontSize: '0.8125rem',
            marginTop: '2px',
            color: selected ? 'rgba(255,255,255,0.8)' : 'var(--color-cinza-medium)',
          }}>{desc}</div>
        )}
      </div>
    </button>
  )
}
