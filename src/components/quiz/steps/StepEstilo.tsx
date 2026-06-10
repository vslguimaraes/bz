'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'
import QuizGrid from '../QuizGrid'

const OPCOES_A = [
  { valor: 'topspin_fundo', emoji: '🌀', label: 'Topspin do fundo',  desc: 'Bola alta e pesada no saibro' },
  { valor: 'flat_basico',   emoji: '➡️', label: 'Bola chapada',      desc: 'Direto ao ponto, sem efeito' },
  { valor: 'descobrindo',   emoji: '🔍', label: 'Estou descobrindo', desc: 'Experimenta estilos variados' },
]

const OPCOES_B = [
  { valor: 'topspin_pesado',       emoji: '🌪️', label: 'Topspin pesado',     desc: 'Bola com muita rotação' },
  { valor: 'serve_flat_agressivo', emoji: '💥', label: 'Saque agressivo',    desc: 'Pontos rápidos, bola plana' },
  { valor: 'all_court',            emoji: '🎭', label: 'Adapto ao momento',  desc: 'Versátil em qualquer quadra' },
  { valor: 'defensivo_contador',   emoji: '🛡️', label: 'Defesa e paciência', desc: 'Consistência, espero o erro' },
  { valor: 'net_rusher',           emoji: '🚀', label: 'Busco a rede',       desc: 'Voleios e smashes' },
]

type Props = { onNext: (v: any) => void; historico?: string; valorAtual?: string }

export default function StepEstilo({ onNext, historico, valorAtual }: Props) {
  const [selecionado, setSelecionado] = useState(valorAtual ?? '')
  const opcoes = historico === 'desenvolvendo' ? OPCOES_A : OPCOES_B

  function escolher(valor: string) {
    setSelecionado(valor)
    setTimeout(() => onNext({ estilo: valor }), 250)
  }

  const pares = opcoes.length % 2 === 0 ? opcoes : opcoes.slice(0, opcoes.length - 1)
  const ultimo = opcoes.length % 2 !== 0 ? opcoes[opcoes.length - 1] : null

  return (
    <div>
      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.25 }}>
        Como você mais gosta de jogar?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '20px', fontSize: '0.9rem' }}>
        Pense no seu golpe favorito e como você constrói os pontos.
      </p>

      <QuizGrid opcoes={pares} selecionado={selecionado} onEscolher={escolher} />

      {ultimo && (
        <div style={{ marginTop: '10px' }}>
          <QuizOption emoji={ultimo.emoji} label={ultimo.label} desc={ultimo.desc}
            selected={selecionado === ultimo.valor} onClick={() => escolher(ultimo.valor)} />
        </div>
      )}

      <button onClick={() => escolher('all_court')} style={{
        display: 'block', width: '100%', marginTop: '12px',
        background: 'none', border: 'none', color: 'var(--color-cinza-light)',
        fontSize: '0.8125rem', cursor: 'pointer', padding: '4px 0', textAlign: 'center',
      }}>
        Prefiro não dizer →
      </button>
    </div>
  )
}
