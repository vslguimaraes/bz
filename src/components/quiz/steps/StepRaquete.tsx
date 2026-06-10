'use client'
import { useState, useRef } from 'react'

// Sample das marcas mais comuns para autocomplete
const SUGESTOES_BASE = [
  'Babolat Pure Aero 2023', 'Babolat Pure Drive 2021', 'Babolat Pure Strike 2024',
  'Wilson Blade 98 v8', 'Wilson Pro Staff 97 v14', 'Wilson Clash 100',
  'Head Speed MP 2024', 'Head Radical MP 2023', 'Head Extreme MP 2022',
  'Yonex EZONE 98', 'Yonex VCORE 98', 'Yonex Percept 97',
  'Tecnifibre TFight 305', 'Tecnifibre TF-X1 305',
  'Dunlop CX 200', 'Dunlop FX 500',
  'Prince Phantom 100P', 'Prince Textreme Tour 95',
]

type Props = { onNext: (v: any) => void; valorAtual?: string }

export default function StepRaquete({ onNext, valorAtual }: Props) {
  const textoInicial = (valorAtual && valorAtual !== 'nao_tenho' && valorAtual !== 'nao_sei') ? valorAtual : ''
  const [texto, setTexto] = useState(textoInicial)
  const [sugestoes, setSugestoes] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(val: string) {
    setTexto(val)
    if (val.length >= 3) {
      const filtradas = SUGESTOES_BASE.filter(s => s.toLowerCase().includes(val.toLowerCase())).slice(0, 4)
      setSugestoes(filtradas)
    } else {
      setSugestoes([])
    }
  }

  function confirmar(valor?: string) {
    onNext({ raquete_atual: valor ?? (texto || 'nao_sei') })
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.25 }}>
        Qual raquete você usa hoje?
      </h2>
      <p style={{ color: 'var(--color-cinza-medium)', marginBottom: '24px', fontSize: '0.9375rem' }}>
        Isso ajuda a anchorar a recomendação — "mais leve que a sua atual", etc.
      </p>

      {/* Chips de escape */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {[
          { valor: 'nao_tenho', label: '🎾 Não tenho raquete' },
          { valor: 'nao_sei',   label: '🤷 Não sei o modelo' },
        ].map(c => (
          <button key={c.valor} onClick={() => confirmar(c.valor)}
                  style={{
                    flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--color-creme-dark)',
                    background: 'var(--color-branco)',
                    cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
                    color: 'var(--color-cinza)',
                  }}>
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={texto}
          onChange={e => handleChange(e.target.value)}
          placeholder="Ex: Wilson Blade 98, Babolat Pure Drive..."
          style={{
            width: '100%', padding: '14px 16px', fontSize: '1rem',
            border: '2px solid var(--color-creme-dark)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-branco)',
            color: 'var(--color-cinza)',
            outline: 'none',
            transition: 'border-color 200ms',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--color-saibro)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-creme-dark)'}
        />

        {sugestoes.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
            background: 'var(--color-branco)',
            border: '1px solid var(--color-creme-dark)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            marginTop: '4px', overflow: 'hidden',
          }}>
            {sugestoes.map(s => (
              <button key={s} onClick={() => { setTexto(s); setSugestoes([]) }}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '12px 16px', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: '0.9375rem', color: 'var(--color-cinza)',
                        borderBottom: '1px solid var(--color-creme-dark)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-creme)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => confirmar()}
              style={{
                marginTop: '16px', width: '100%', padding: '16px',
                background: texto ? 'var(--color-saibro)' : 'var(--color-creme-dark)',
                color: texto ? '#fff' : 'var(--color-cinza-light)',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: '1rem', cursor: texto ? 'pointer' : 'default',
                transition: 'all 200ms',
              }}>
        Confirmar →
      </button>

      <button onClick={() => confirmar('nao_sei')} style={{
        display: 'block', width: '100%', marginTop: '12px',
        background: 'none', border: 'none', color: 'var(--color-cinza-light)',
        fontSize: '0.875rem', cursor: 'pointer', padding: '4px 0', textAlign: 'center',
      }}>
        Pular esta pergunta →
      </button>
    </div>
  )
}
