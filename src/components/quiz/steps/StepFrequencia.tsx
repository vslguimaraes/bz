'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'

const OPCOES = [
  { valor: 'poucos_meses', emoji: '🌙', label: '1x por mês',      desc: 'Jogo esporadicamente' },
  { valor: 'semanal',      emoji: '📅', label: '2–5x por mês',    desc: 'Jogo com regularidade' },
  { valor: 'frequente',    emoji: '💪', label: '5–10x por mês',   desc: 'Faz parte da rotina' },
  { valor: 'intenso',      emoji: '🔥', label: 'Quase todo dia',  desc: 'Treino ou competição diária' },
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
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Com que frequência você joga tênis?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Última pergunta! Isso influencia a recomendação de cordas e durabilidade.
      </p>
      <QuizGrid
        opcoes={OPCOES}
        selecionado={selecionado}
        onEscolher={escolher}
        escapeLabel="Prefiro não dizer →"
        onEscape={() => escolher('semanal')}
      />
    </div>
  )
}
