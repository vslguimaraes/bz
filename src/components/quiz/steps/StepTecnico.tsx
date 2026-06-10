'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES = [
  { valor: 'basico',         emoji: '🎯', label: 'Forehand e backhand diretos',           desc: 'Bola limpa, sem efeito, foco em colocar na quadra' },
  { valor: 'em_construcao',  emoji: '🌀', label: 'Começo a usar efeito no forehand',      desc: 'Já sinto o topspin mas ainda não é consistente' },
  { valor: 'intermediario',  emoji: '⚡', label: 'Topspin consistente, slice funcional',  desc: 'Consigo abrir o jogo e trocar no saibro' },
  { valor: 'avancado',       emoji: '🎪', label: 'Vario ritmo e altura intencionalmente', desc: 'Rede, defesa, drop shot — uso todos os golpes' },
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepTecnico({ onNext, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ tecnico: valor }), 250)
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.25 }}>
        Como você descreveria seu jogo hoje?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Foque no que você faz com mais frequência em quadra.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {OPCOES.map(o => (
          <QuizOption key={o.valor} {...o} selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
        <button onClick={() => escolher('basico')} style={{
          background: 'none', border: 'none', color: 'var(--color-cinza-light)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '8px 0', textAlign: 'center',
        }}>
          Não sei classificar →
        </button>
      </div>
    </div>
  )
}
