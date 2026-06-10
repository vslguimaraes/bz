'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES = [
  { valor: 'recreativo',          emoji: '😄', label: 'Jogo pelo prazer',       desc: 'Bater uma bolinha com amigos, sem compromisso' },
  { valor: 'desenvolvendo',       emoji: '📈', label: 'Tô me desenvolvendo',    desc: 'Tenho aulas ou treino com objetivo de melhorar' },
  { valor: 'competitivo',         emoji: '🏆', label: 'Compito em torneios',    desc: 'Jogo federado ou em ligas competitivas' },
  { valor: 'base_forte_retorno',  emoji: '🔄', label: 'Voltando ao tênis',      desc: 'Joguei bastante antes e estou retomando' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepHistorico({ onNext, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ historico: valor }), 250)
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.25 }}>
        Qual das situações mais te representa hoje?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Sem julgamento — escolha o que mais combina com você agora.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPCOES.map(o => (
          <QuizOption key={o.valor} {...o} selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
        <button onClick={() => escolher('recreativo')} style={{
          background: 'none', border: 'none', color: 'var(--color-cinza-light)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '8px 0', textAlign: 'center',
        }}>
          Prefiro não dizer →
        </button>
      </div>
    </div>
  )
}
