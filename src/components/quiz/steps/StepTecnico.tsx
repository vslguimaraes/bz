'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'
import StepHeader from '../StepHeader'
import { IluBasico, IluEmConstrucao, IluIntermediario, IluAvancado } from '../Illustrations'

const OPCOES = [
  { valor: 'basico',        label: 'Forehand e backhand',  desc: 'Bola limpa, sem efeito',           illustration: <IluBasico /> },
  { valor: 'em_construcao', label: 'Começo a usar efeito', desc: 'Topspin inconsistente ainda',      illustration: <IluEmConstrucao /> },
  { valor: 'intermediario', label: 'Topspin consistente',  desc: 'Slice funcional, abro o jogo',     illustration: <IluIntermediario /> },
  { valor: 'avancado',      label: 'Jogo completo',        desc: 'Rede, drop shot, todos os golpes', illustration: <IluAvancado /> },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepTecnico({ onNext, valorAtual }: Props) {
  const [s, setS] = useState(valorAtual ?? '')
  function escolher(v: string) { setS(v); setTimeout(() => onNext({ tecnico: v }), 220) }
  return (
    <div>
      <StepHeader question="Como você descreveria seu jogo hoje?" hint="Foque no que você faz com mais frequência." />
      <QuizGrid opcoes={OPCOES} selecionado={s} onEscolher={escolher}
        escapeLabel="Não sei classificar" onEscape={() => escolher('basico')} />
    </div>
  )
}
