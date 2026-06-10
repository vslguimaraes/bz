'use client'
import { useState } from 'react'
import QuizGrid from '../QuizGrid'

const OPCOES = [
  { valor: 'alta_mobilidade',     emoji: '⚡', label: 'Me movo bem e deslizo' },
  { valor: 'mobilidade_moderada', emoji: '🚶', label: 'Cubro bem sem explosão' },
  { valor: 'mobilidade_reduzida', emoji: '🎯', label: 'Prefiro posição central' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepMobilidade({ onNext, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ mobilidade: valor }), 250)
  }

  const pares = OPCOES.slice(0, 2)
  const ultimo = OPCOES[2]

  return (
    <div>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Como é sua movimentação em quadra?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Isso define o peso e balanço ideal da raquete para você.
      </p>
      <QuizGrid opcoes={pares} selecionado={selecionado} onEscolher={escolher} />
      <div style={{ marginTop: '12px' }}>
        <QuizGrid opcoes={[ultimo]} selecionado={selecionado} onEscolher={escolher}
          escapeLabel="Prefiro não dizer →" onEscape={() => escolher('mobilidade_moderada')} />
      </div>
    </div>
  )
}
