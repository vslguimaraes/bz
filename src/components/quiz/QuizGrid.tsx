'use client'
import { ReactNode } from 'react'
import QuizOption from './QuizOption'

type Opcao = {
  valor: string
  label: string
  desc?: string
  illustration?: ReactNode
  large?: boolean
}

type Props = {
  opcoes: Opcao[]
  selecionado: string
  onEscolher: (valor: string) => void
  escapeLabel?: string
  onEscape?: () => void
  cols?: number
}

export default function QuizGrid({ opcoes, selecionado, onEscolher, escapeLabel, onEscape, cols = 2 }: Props) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '8px' }}>
        {opcoes.map(o => (
          <QuizOption
            key={o.valor}
            label={o.label}
            desc={o.desc}
            illustration={o.illustration}
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
          color: '#bbb', fontSize: '0.8125rem',
          cursor: 'pointer', padding: '4px 0', textAlign: 'center',
          fontFamily: 'var(--font-body)', letterSpacing: '0.04em',
        }}>
          {escapeLabel}
        </button>
      )}
    </div>
  )
}
