'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'

const OPCOES = [
  { valor: 'poucos_meses', emoji: '🌙', label: 'Menos de 1x por mês' },
  { valor: 'semanal',      emoji: '📅', label: '1 a 2x por mês' },
  { valor: 'frequente',    emoji: '💪', label: '1 a 2x por semana' },
  { valor: 'intenso',      emoji: '🔥', label: 'Quase todo dia' },
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
