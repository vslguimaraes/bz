'use client'
import { useState } from 'react'
import QuizOption from '../QuizOption'
import QuizGrid from '../QuizGrid'
import StepHeader from '../StepHeader'

const OPCOES_A = [
  { valor: 'topspin_fundo', label: 'Topspin do fundo',  desc: 'Bola alta e pesada no saibro' },
  { valor: 'flat_basico',   label: 'Bola chapada',      desc: 'Direto ao ponto, sem efeito' },
  { valor: 'descobrindo',   label: 'Ainda descobrindo', desc: 'Experimento estilos variados' },
]

const OPCOES_B = [
  { valor: 'topspin_pesado',       label: 'Topspin pesado',     desc: 'Muita rotação, cria ângulos' },
  { valor: 'serve_flat_agressivo', label: 'Saque agressivo',    desc: 'Pontos rápidos, bola plana' },
  { valor: 'all_court',            label: 'All court',          desc: 'Versátil em qualquer situação' },
  { valor: 'defensivo_contador',   label: 'Defesa e paciência', desc: 'Consistência, espero o erro' },
  { valor: 'net_rusher',           label: 'Ataque na rede',     desc: 'Voleios e smashes' },
]

type Props = { onNext: (v: any) => void; historico?: string; valorAtual?: string }

export default function StepEstilo({ onNext, historico, valorAtual }: Props) {
  const [s, setS] = useState(valorAtual ?? '')
  const opcoes = historico === 'desenvolvendo' ? OPCOES_A : OPCOES_B
  function escolher(v: string) { setS(v); setTimeout(() => onNext({ estilo: v }), 220) }

  const pares = opcoes.length % 2 === 0 ? opcoes : opcoes.slice(0, -1)
  const ultimo = opcoes.length % 2 !== 0 ? opcoes[opcoes.length - 1] : null

  return (
    <div>
      <StepHeader question="Como você mais gosta de jogar?" hint="Pense no seu golpe favorito." />
      <QuizGrid opcoes={pares} selecionado={s} onEscolher={escolher} />
      {ultimo && (
        <div style={{ marginTop: '8px' }}>
          <QuizOption label={ultimo.label} desc={ultimo.desc}
            selected={s === ultimo.valor} onClick={() => escolher(ultimo.valor)} />
        </div>
      )}
      <button onClick={() => escolher('all_court')} style={{
        display: 'block', width: '100%', marginTop: '14px',
        background: 'none', border: 'none', color: '#bbb',
        fontSize: '0.8125rem', cursor: 'pointer', padding: '4px 0', textAlign: 'center',
        fontFamily: 'var(--font-body)',
      }}>
        Prefiro não dizer
      </button>
    </div>
  )
}
