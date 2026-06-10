'use client'
import QuizOption from './QuizOption'

type Opcao = { valor: string; emoji: string; label: string; desc?: string; large?: boolean }

type Props = {
  opcoes: Opcao[]
  selecionado: string
  onEscolher: (valor: string) => void
  escapeLabel?: string
  onEscape?: () => void
  cols?: number  // colunas do grid (default 2)
}

export default function QuizGrid({ opcoes, selecionado, onEscolher, escapeLabel, onEscape, cols = 2 }: Props) {
  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '10px',
      }}>
        {opcoes.map(o => (
          <QuizOption
            key={o.valor}
            emoji={o.emoji}
            label={o.label}
            desc={o.desc}
            large={o.large}
            selected={selecionado === o.valor}
            onClick={() => onEscolher(o.valor)}
          />
        ))}
      </div>
      {escapeLabel && (
        <button onClick={onEscape} style={{
          display: 'block', width: '100%', marginTop: '12px',
          background: 'none', border: 'none',
          color: 'var(--color-cinza-light)',
          fontSize: '0.8125rem', cursor: 'pointer',
          padding: '4px 0', textAlign: 'center',
        }}>
          {escapeLabel}
        </button>
      )}
    </div>
  )
}
