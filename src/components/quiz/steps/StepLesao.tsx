'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES_MENORES = [
  { valor: 'epicondilite',     emoji: '🦾', label: 'Cotovelo de tenista' },
  { valor: 'vibracoes_gerais', emoji: '⚡', label: 'Vibração / formigamento' },
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
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Você tem alguma lesão no braço ou ombro?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Crítico para a recomendação — uma raquete errada pode agravar lesões.
      </p>

      {/* Opção principal — maior */}
      <div style={{ marginBottom: '12px' }}>
        <QuizOption
          emoji="✅"
          label="Estou bem, sem lesões"
          selected={selecionado === 'sem_lesao'}
          onClick={() => escolher('sem_lesao')}
          large
        />
      </div>

      {/* Duas opções menores em grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {OPCOES_MENORES.map(o => (
          <QuizOption key={o.valor} emoji={o.emoji} label={o.label}
            selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
      </div>

      <button onClick={() => escolher('sem_lesao')} style={{
        display: 'block', width: '100%', marginTop: '14px',
        background: 'none', border: 'none', color: 'var(--color-cinza-light)',
        fontSize: '0.875rem', cursor: 'pointer', padding: '6px 0', textAlign: 'center',
      }}>
        Prefiro não dizer →
      </button>
    </div>
  )
}
