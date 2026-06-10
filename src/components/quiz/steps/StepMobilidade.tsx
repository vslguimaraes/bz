'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'

const OPCOES = [
  { valor: 'alta_mobilidade',     emoji: '⚡', label: 'Me movo bem', desc: 'Deslizo e corro de ponta a ponta' },
  { valor: 'mobilidade_moderada', emoji: '🚶', label: 'Razoável',    desc: 'Cubro a quadra sem explosão' },
  { valor: 'mobilidade_reduzida', emoji: '🎯', label: 'Prefiro posição', desc: 'Fico no centro e antecipo' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepMobilidade({ onNext, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ mobilidade: valor }), 250)
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Como é sua movimentação em quadra?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Isso define o peso e balanço ideal da raquete para você.
      </p>
      <QuizGrid
        opcoes={OPCOES}
        selecionado={selecionado}
        onEscolher={escolher}
        cols={3}
        escapeLabel="Prefiro não dizer →"
        onEscape={() => escolher('mobilidade_moderada')}
      />
    </div>
  )
}
