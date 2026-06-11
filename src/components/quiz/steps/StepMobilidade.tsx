'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'
import StepHeader from '../StepHeader'
import Emoji from '../Emoji'

const OPCOES = [
  { valor: 'alta_mobilidade',     label: 'Me movo bem',     desc: 'Deslizo, corro de ponta a ponta', illustration: <Emoji e="🏃" /> },
  { valor: 'mobilidade_moderada', label: 'Razoável',        desc: 'Cubro sem explosão',              illustration: <Emoji e="🚶" /> },
  { valor: 'mobilidade_reduzida', label: 'Prefiro posição', desc: 'Centro da quadra, antecipação',   illustration: <Emoji e="🧘" /> },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepMobilidade({ onNext, valorAtual }: Props) {
  const [s, setS] = useState(valorAtual ?? '')
  function escolher(v: string) { setS(v); setTimeout(() => onNext({ mobilidade: v }), 220) }
  return (
    <div>
      <StepHeader question="Como é sua movimentação em quadra?" hint="Define o peso e balanço ideal da raquete." />
      <QuizGrid opcoes={OPCOES} selecionado={s} onEscolher={escolher} cols={3}
        escapeLabel="Prefiro não dizer" onEscape={() => escolher('mobilidade_moderada')} />
    </div>
  )
}
