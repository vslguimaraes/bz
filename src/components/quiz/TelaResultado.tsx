'use client'
import { Perfil } from './QuizShell'

type Opcao = {
  posicao: number
  label: string
  raquete: { marca: string; modelo: string; link_tw: string }
  justificativa: string
  corda_sugerida: string
  grip_sugerido: string
}

type Resultado = {
  resumo_perfil: string
  opcoes: Opcao[]
  pergunta_followup: string
  debug?: { total_catalogo: number; apos_eliminacao: number }
}

type Props = {
  resultado: Resultado
  perfil: Perfil
  onReiniciar: () => void
}

const POSICAO_COLORS = ['var(--color-saibro)', '#6B6B6B', '#C94E1E']
const POSICAO_LABELS = ['🥇', '🥈', '🥉']

export default function TelaResultado({ resultado, perfil, onReiniciar }: Props) {
  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in"
         style={{ background: 'var(--color-creme)' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div className="text-center mb-8">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎾</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-cinza)' }}>
            Sua recomendação está pronta
          </h1>
          <p style={{
            fontSize: '1rem', color: 'var(--color-cinza-medium)',
            background: 'var(--color-branco)',
            padding: '12px 20px', borderRadius: 'var(--radius-lg)',
            display: 'inline-block', boxShadow: 'var(--shadow-sm)',
          }}>
            "{resultado.resumo_perfil}"
          </p>
        </div>

        {/* Opções */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {resultado.opcoes.map((opcao, i) => (
            <div key={opcao.posicao} style={{
              background: 'var(--color-branco)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: i === 0 ? '0 4px 24px rgba(74,124,89,0.15)' : 'var(--shadow-sm)',
              border: i === 0 ? '2px solid var(--color-saibro)' : '1px solid var(--color-creme-dark)',
            }}>
              {/* Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.25rem' }}>{POSICAO_LABELS[i]}</span>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em',
                  color: POSICAO_COLORS[i], textTransform: 'uppercase',
                }}>
                  {opcao.label}
                </span>
              </div>

              {/* Raquete */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px', color: 'var(--color-cinza)' }}>
                {opcao.raquete.marca}
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-cinza-medium)', marginBottom: '16px', fontWeight: 500 }}>
                {opcao.raquete.modelo}
              </p>

              {/* Justificativa */}
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--color-cinza)', marginBottom: '16px' }}>
                {opcao.justificativa}
              </p>

              {/* Corda e grip */}
              <div style={{
                background: 'var(--color-creme)', borderRadius: 'var(--radius-md)',
                padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px',
              }}>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-cinza-medium)' }}>
                  <strong style={{ color: 'var(--color-cinza)' }}>🪢 Corda:</strong> {opcao.corda_sugerida}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-cinza-medium)' }}>
                  <strong style={{ color: 'var(--color-cinza)' }}>✋ Grip:</strong> {opcao.grip_sugerido}
                </div>
              </div>

              {/* CTA de compra */}
              {opcao.raquete.link_tw ? (
                <a href={opcao.raquete.link_tw} target="_blank" rel="noopener noreferrer"
                   style={{
                     display: 'block', marginTop: '16px', padding: '14px',
                     background: i === 0 ? 'var(--color-saibro)' : 'var(--color-creme-dark)',
                     color: i === 0 ? '#fff' : 'var(--color-cinza)',
                     borderRadius: 'var(--radius-md)', textAlign: 'center',
                     fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem',
                   }}>
                  Ver no Tennis Warehouse →
                </a>
              ) : (
                <div style={{
                  marginTop: '16px', padding: '12px',
                  background: 'var(--color-creme-dark)',
                  borderRadius: 'var(--radius-md)', textAlign: 'center',
                  fontSize: '0.875rem', color: 'var(--color-cinza-medium)',
                }}>
                  🔍 Busque "{opcao.raquete.marca} {opcao.raquete.modelo}" na sua loja favorita
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Follow-up */}
        {resultado.pergunta_followup && (
          <div style={{
            background: 'var(--color-branco)',
            border: '1px solid var(--color-creme-dark)',
            borderRadius: 'var(--radius-lg)', padding: '20px',
            marginBottom: '24px', textAlign: 'center',
          }}>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-cinza-medium)', marginBottom: '4px' }}>
              💬 Dúvida do especialista:
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-cinza)' }}>
              {resultado.pergunta_followup}
            </p>
          </div>
        )}

        {/* Reiniciar */}
        <button onClick={onReiniciar} style={{
          width: '100%', padding: '16px',
          background: 'none', border: '2px solid var(--color-creme-dark)',
          borderRadius: 'var(--radius-md)', cursor: 'pointer',
          fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-cinza-medium)',
        }}>
          ↩ Refazer o quiz
        </button>

        {resultado.debug && (
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'var(--color-cinza-light)' }}>
            {resultado.debug.apos_eliminacao} de {resultado.debug.total_catalogo} raquetes analisadas
          </p>
        )}
      </div>
    </div>
  )
}
