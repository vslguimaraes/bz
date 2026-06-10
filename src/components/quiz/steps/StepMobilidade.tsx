'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES = [
  { valor: 'alta_mobilidade',    emoji: '⚡', label: 'Me movo bem, deslizo e corro',       desc: 'Sprint lateral, recupero posição rápido' },
  { valor: 'mobilidade_moderada',emoji: '🚶', label: 'Razoável — cubro bem sem explosão',  desc: 'Eficiente, não perco muita bola por movimento' },
  { valor: 'mobilidade_reduzida',emoji: '🎯', label: 'Economizo movimento, prefiro posição', desc: 'Prefiro posição central e antecipação' },
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
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.25 }}>
        Como você descreveria sua movimentação em quadra?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Seja honesto — isso influencia diretamente o peso e balanço ideal da raquete.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPCOES.map(o => (
          <QuizOption key={o.valor} {...o} selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
        <button onClick={() => escolher('mobilidade_moderada')} style={{
          background: 'none', border: 'none', color: 'var(--color-cinza-light)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '8px 0', textAlign: 'center',
        }}>
          Prefiro não dizer →
        </button>
      </div>
    </div>
  )
}
