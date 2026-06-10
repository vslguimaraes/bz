'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'
import StepHeader from '../StepHeader'

const OPCOES = [
  { valor: 'poucos_meses', label: '1x por mês',     desc: 'Jogo esporadicamente' },
  { valor: 'semanal',      label: '2–5x por mês',   desc: 'Jogo com regularidade' },
  { valor: 'frequente',    label: '5–10x por mês',  desc: 'Faz parte da rotina' },
  { valor: 'intenso',      label: 'Quase todo dia', desc: 'Treino ou competição diária' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepFrequencia({ onNext, valorAtual }: Props) {
  const [s, setS] = useState(valorAtual ?? '')
  function escolher(v: string) { setS(v); setTimeout(() => onNext({ frequencia: v }), 220) }
  return (
    <div>
      <StepHeader question="Com que frequência você joga?" hint="Última pergunta — influencia cordas e durabilidade." />
      <QuizGrid opcoes={OPCOES} selecionado={s} onEscolher={escolher}
        escapeLabel="Prefiro não dizer" onEscape={() => escolher('semanal')} />
    </div>
  )
}
