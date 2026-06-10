'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'

const OPCOES = [
  { valor: 'recreativo',         emoji: '😄', label: 'Jogo pelo prazer',      desc: 'Bater uma bolinha, sem compromisso' },
  { valor: 'desenvolvendo',      emoji: '📈', label: 'Tô me desenvolvendo',   desc: 'Tenho aulas ou treino com objetivo' },
  { valor: 'competitivo',        emoji: '🏆', label: 'Compito em torneios',   desc: 'Federado ou ligas competitivas' },
  { valor: 'base_forte_retorno', emoji: '🔄', label: 'Voltando ao tênis',     desc: 'Joguei bastante e estou retomando' },
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
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Qual das situações mais te representa hoje?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Sem julgamento — escolha o que mais combina com você agora.
      </p>
      <QuizGrid opcoes={OPCOES} selecionado={selecionado} onEscolher={escolher}
        escapeLabel="Prefiro não dizer →" onEscape={() => escolher('recreativo')} />
    </div>
  )
}
