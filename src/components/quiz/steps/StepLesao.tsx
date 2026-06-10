'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES = [
  { valor: 'sem_lesao',        emoji: '✅', label: 'Não, estou bem',                   desc: 'Sem dores ou sensibilidades no momento' },
  { valor: 'epicondilite',     emoji: '🦾', label: 'Tenho cotovelo de tenista',        desc: 'Dor lateral no cotovelo ao jogar' },
  { valor: 'ombro',            emoji: '💪', label: 'Tenho problema no ombro',          desc: 'Dor ou limitação no ombro ou manguito' },
  { valor: 'vibracoes_gerais', emoji: '⚡', label: 'Sinto vibração / formigamento',    desc: 'Formigamento ou impacto excessivo no braço' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepLesao({ onNext, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ lesao: valor }), 250)
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.25 }}>
        Você tem alguma lesão ou sensibilidade no braço?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Isso é crítico para a recomendação — uma raquete errada pode agravar lesões.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPCOES.map(o => (
          <QuizOption key={o.valor} {...o} selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
        <button onClick={() => escolher('sem_lesao')} style={{
          background: 'none', border: 'none', color: 'var(--color-cinza-light)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '8px 0', textAlign: 'center',
        }}>
          Prefiro não dizer →
        </button>
      </div>
    </div>
  )
}
