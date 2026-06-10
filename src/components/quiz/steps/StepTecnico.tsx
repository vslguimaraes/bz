'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'

const OPCOES = [
  { valor: 'basico',        emoji: '🎯', label: 'Forehand e backhand diretos' },
  { valor: 'em_construcao', emoji: '🌀', label: 'Começo a usar efeito' },
  { valor: 'intermediario', emoji: '⚡', label: 'Topspin consistente' },
  { valor: 'avancado',      emoji: '🎪', label: 'Vario ritmo e altura' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepTecnico({ onNext, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ tecnico: valor }), 250)
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Como você descreveria seu jogo hoje?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Foque no que você faz com mais frequência em quadra.
      </p>
      <QuizGrid
        opcoes={OPCOES}
        selecionado={selecionado}
        onEscolher={escolher}
        escapeLabel="Não sei classificar →"
        onEscape={() => escolher('basico')}
      />
    </div>
  )
}
