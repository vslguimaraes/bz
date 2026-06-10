'use client'
import QuizOption from './QuizOption'

type Opcao = { valor: string; emoji: string; label: string; large?: boolean }

type Props = {
  opcoes: Opcao[]
  selecionado: string
  onEscolher: (valor: string) => void
  escapeLabel?: string
  onEscape?: () => void
  /** forçar 1 coluna (lista vertical) */
  lista?: boolean
}

export default function QuizGrid({ opcoes, selecionado, onEscolher, escapeLabel, onEscape, lista }: Props) {
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: lista ? '1fr' : 'repeat(2, 1fr)',
        gap: '12px',
      }}>
        {opcoes.map(o => (
          <QuizOption
            key={o.valor}
            emoji={o.emoji}
            label={o.label}
            large={o.large}
            selected={selecionado === o.valor}
            onClick={() => onEscolher(o.valor)}
          />
        ))}
      </div>

      {escapeLabel && (
        <button onClick={onEscape} style={{
          display: 'block', width: '100%', marginTop: '14px',
          background: 'none', border: 'none',
          color: 'var(--color-cinza-light)',
          fontSize: '0.875rem', cursor: 'pointer',
          padding: '6px 0', textAlign: 'center',
        }}>
          {escapeLabel}
        </button>
      )}
    </div>
  )
}
