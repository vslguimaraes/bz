'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'

const OPCOES_A = [
  { valor: 'topspin_fundo',  emoji: '🌀', label: 'Do fundo, girando a bola',  desc: 'Topspin do fundo, bola alta e pesada' },
  { valor: 'flat_basico',    emoji: '➡️', label: 'Bola chapada, direto ao ponto', desc: 'Sem muito efeito, foco em velocidade' },
  { valor: 'descobrindo',    emoji: '🔍', label: 'Ainda estou descobrindo',    desc: 'Experimenta vários estilos' },
]

const OPCOES_B = [
  { valor: 'topspin_pesado',        emoji: '🌪️', label: 'Topspin pesado, crio ângulos',    desc: 'Bola com muita rotação, Roland Garros' },
  { valor: 'serve_flat_agressivo',  emoji: '💥', label: 'Saque e bola chapada agressiva', desc: 'Pontos rápidos, primeiro serviço dominante' },
  { valor: 'all_court',             emoji: '🎭', label: 'Adapto meu jogo à situação',      desc: 'Confortável em qualquer parte da quadra' },
  { valor: 'defensivo_contador',    emoji: '🛡️', label: 'Defendo e espero o erro',         desc: 'Consistência acima de tudo, jogo longo' },
  { valor: 'net_rusher',            emoji: '🚀', label: 'Busco a rede sempre que posso',   desc: 'Voleios, smashes, jogo de ataque na rede' },
]

type Props = { onNext: (v: any) => void; historico?: string; valorAtual?: string }

export default function StepEstilo({ onNext, historico, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')
  const opcoes = historico === 'desenvolvendo' ? OPCOES_A : OPCOES_B

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ estilo: valor }), 250)
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.25 }}>
        Como você mais gosta de jogar?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Pense no seu golpe favorito e como você constrói os pontos.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {opcoes.map(o => (
          <QuizOption key={o.valor} {...o} selected={selecionado === o.valor} onClick={() => escolher(o.valor)} />
        ))}
        <button onClick={() => escolher('all_court')} style={{
          background: 'none', border: 'none', color: 'var(--color-cinza-light)',
          fontSize: '0.875rem', cursor: 'pointer', padding: '8px 0', textAlign: 'center',
        }}>
          Prefiro não dizer →
        </button>
      </div>
    </div>
  )
}
