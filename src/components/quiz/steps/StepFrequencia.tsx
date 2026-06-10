'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES = [
  { valor: 'poucos_meses', emoji: '🌙', label: 'Vez ou outra, menos de 1x/semana', desc: 'Jogo esporadicamente quando dá' },
  { valor: 'semanal',      emoji: '📅', label: '1 a 2x por semana',               desc: 'Partida consistente, mas não todo dia' },
  { valor: 'frequente',    emoji: '💪', label: '3 a 4x por semana',               desc: 'Jogo é parte da minha rotina' },
  { valor: 'intenso',      emoji: '🔥', label: 'Quase todo dia',                  desc: 'Treino diário ou competição regular' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepFrequencia({ onNext, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ frequencia: valor }), 250)
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.25 }}>
        Com que frequência você joga tênis?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Última pergunta! Isso influencia a recomendação de cordas e durabilidade.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPCOES.map(o => (
          <QuizOption key={o.valor} {...o} selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
        <button onClick={() => escolher('semanal')} style={{
          background: 'none', border: 'none', color: 'var(--color-cinza-light)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '8px 0', textAlign: 'center',
        }}>
          Prefiro não dizer →
        </button>
      </div>
    </div>
  )
}
