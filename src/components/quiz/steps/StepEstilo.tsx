'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES_A = [
  { valor: 'topspin_fundo', emoji: '🌀', label: 'Do fundo, girando a bola' },
  { valor: 'flat_basico',   emoji: '➡️', label: 'Bola chapada e direta' },
  { valor: 'descobrindo',   emoji: '🔍', label: 'Ainda estou descobrindo' },
]

const OPCOES_B = [
  { valor: 'topspin_pesado',       emoji: '🌪️', label: 'Topspin pesado' },
  { valor: 'serve_flat_agressivo', emoji: '💥', label: 'Saque e bola plana' },
  { valor: 'all_court',            emoji: '🎭', label: 'Adapto ao momento' },
  { valor: 'defensivo_contador',   emoji: '🛡️', label: 'Defendo e contra-ataco' },
  { valor: 'net_rusher',           emoji: '🚀', label: 'Busco a rede' },
]

type Props = { onNext: (v: any) => void; historico?: string; valorAtual?: string }

export default function StepEstilo({ onNext, historico, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')
  const opcoes = historico === 'desenvolvendo' ? OPCOES_A : OPCOES_B

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ estilo: valor }), 250)
  }

  // Grid 2x2, último item (se ímpar) ocupa linha inteira
  const pares = opcoes.slice(0, opcoes.length % 2 === 0 ? opcoes.length : opcoes.length - 1)
  const ultimo = opcoes.length % 2 !== 0 ? opcoes[opcoes.length - 1] : null

  return (
    <div>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Como você mais gosta de jogar?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Pense no seu golpe favorito e como você constrói os pontos.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {pares.map(o => (
          <QuizOption key={o.valor} emoji={o.emoji} label={o.label}
            selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
      </div>

      {ultimo && (
        <div style={{ marginTop: '12px' }}>
          <QuizOption emoji={ultimo.emoji} label={ultimo.label}
            selected={selecionado === ultimo.valor} onClick={() => escolher(ultimo.valor)} />
        </div>
      )}

      <button onClick={() => escolher('all_court')} style={{
        display: 'block', width: '100%', marginTop: '14px',
        background: 'none', border: 'none', color: 'var(--color-cinza-light)',
        fontSize: '0.875rem', cursor: 'pointer', padding: '6px 0', textAlign: 'center',
      }}>
        Prefiro não dizer →
      </button>
    </div>
  )
}
