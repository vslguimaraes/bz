'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'
import StepHeader from '../StepHeader'
import Emoji from '../Emoji'

const OPCOES = [
  { valor: 'recreativo',         label: 'Jogo pelo prazer',    desc: 'Partidas sociais, sem compromisso',   illustration: <Emoji e="🎾" /> },
  { valor: 'desenvolvendo',      label: 'Tô evoluindo',        desc: 'Aulas ou treino com objetivo',        illustration: <Emoji e="📈" /> },
  { valor: 'competitivo',        label: 'Compito em torneios', desc: 'Federado ou ligas competitivas',      illustration: <Emoji e="🏆" /> },
  { valor: 'base_forte_retorno', label: 'Voltando ao tênis',   desc: 'Joguei bastante e estou retomando',  illustration: <Emoji e="🔄" /> },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepHistorico({ onNext, valorAtual }: Props) {
  const [s, setS] = useState(valorAtual ?? '')
  function escolher(v: string) { setS(v); setTimeout(() => onNext({ historico: v }), 220) }
  return (
    <div>
      <StepHeader question="Qual das situações mais te representa hoje?" />
      <QuizGrid opcoes={OPCOES} selecionado={s} onEscolher={escolher}
        escapeLabel="Prefiro não dizer" onEscape={() => escolher('recreativo')} />
    </div>
  )
}
