'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'
import QuizGrid from '../QuizGrid'
import StepHeader from '../StepHeader'

const OPCOES_MENORES = [
  { valor: 'epicondilite',     label: 'Cotovelo de tenista', desc: 'Dor lateral ao jogar' },
  { valor: 'vibracoes_gerais', label: 'Vibração no braço',   desc: 'Formigamento, impacto excessivo' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepLesao({ onNext, valorAtual }: Props) {
  const [s, setS] = useState(valorAtual ?? '')
  function escolher(v: string) { setS(v); setTimeout(() => onNext({ lesao: v }), 220) }
  return (
    <div>
      <StepHeader question="Você tem alguma lesão no braço?" hint="Crítico — uma raquete errada pode agravar lesões." />
      <div style={{ marginBottom: '8px' }}>
        <QuizOption label="Estou bem, sem lesões" large
          selected={s === 'sem_lesao'} onClick={() => escolher('sem_lesao')} />
      </div>
      <QuizGrid opcoes={OPCOES_MENORES} selecionado={s} onEscolher={escolher}
        escapeLabel="Prefiro não dizer" onEscape={() => escolher('sem_lesao')} />
    </div>
  )
}
