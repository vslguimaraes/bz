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
  debug?: { total_catalogo: number; apos_eliminacao: number }
}

type Props = { resultado: Resultado; perfil: Perfil; onReiniciar: () => void }

const LABELS = ['Recomendação principal', 'Segunda opção', 'Terceira opção']
const ACENTS = ['var(--clay)', 'var(--court-mid)', 'var(--hard-blue)']

export default function TelaResultado({ resultado, onReiniciar }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>

      {/* Hero do resultado */}
      <div style={{
        background: 'var(--court-dark)',
        padding: '48px 24px 40px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.75rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--clay-dust)',
          marginBottom: '16px',
        }}>
          Sua recomendação
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
          fontWeight: 700, fontStyle: 'italic',
          color: 'var(--warm-white)', lineHeight: 1.2,
          maxWidth: '520px', margin: '0 auto',
        }}>
          "{resultado.resumo_perfil}"
        </h1>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 20px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {resultado.opcoes.map((opcao, i) => (
            <div key={opcao.posicao} style={{
              background: 'var(--warm-white)',
              border: `1px solid ${i === 0 ? 'var(--clay)' : 'var(--cream)'}`,
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              {/* Acento colorido no topo */}
              <div style={{ height: '3px', background: ACENTS[i] }} />

              <div style={{ padding: '24px' }}>
                {/* Label */}
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 300,
                  fontSize: '0.6875rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', color: '#999',
                  marginBottom: '8px',
                }}>
                  {LABELS[i] ?? `Opção ${opcao.posicao}`}
                </p>

                {/* Raquete */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.375rem', fontWeight: 700,
                  color: 'var(--court-dark)', lineHeight: 1.1,
                  marginBottom: '2px',
                }}>
                  {opcao.raquete.marca}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 400,
                  fontSize: '0.9375rem', color: '#666',
                  marginBottom: '16px',
                }}>
                  {opcao.raquete.modelo}
                </p>

                {/* Justificativa */}
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 300,
                  fontSize: '0.9rem', lineHeight: 1.65,
                  color: 'var(--court-mid)',
                  borderLeft: `2px solid ${ACENTS[i]}`,
                  paddingLeft: '14px',
                  marginBottom: '20px',
                }}>
                  {opcao.justificativa}
                </p>

                {/* Specs */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    background: 'var(--cream)', borderRadius: '2px', padding: '12px',
                  }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>Corda</p>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--court-dark)', lineHeight: 1.3 }}>{opcao.corda_sugerida}</p>
                  </div>
                  <div style={{
                    background: 'var(--cream)', borderRadius: '2px', padding: '12px',
                  }}>
                    <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>Grip</p>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--court-dark)', lineHeight: 1.3 }}>{opcao.grip_sugerido}</p>
                  </div>
                </div>

                {/* CTA */}
                {opcao.raquete.link_tw ? (
                  <a href={opcao.raquete.link_tw} target="_blank" rel="noopener noreferrer"
                     style={{
                       display: 'block', padding: '13px',
                       background: i === 0 ? 'var(--court-dark)' : 'transparent',
                       color: i === 0 ? 'var(--warm-white)' : 'var(--court-dark)',
                       border: `1.5px solid ${i === 0 ? 'var(--court-dark)' : 'var(--cream)'}`,
                       borderRadius: '2px', textAlign: 'center',
                       fontFamily: 'var(--font-body)',
                       fontWeight: 500, fontSize: '0.8125rem',
                       letterSpacing: '0.08em', textTransform: 'uppercase',
                       textDecoration: 'none',
                     }}>
                    Ver no Tennis Warehouse →
                  </a>
                ) : (
                  <div style={{
                    padding: '12px', background: 'var(--cream)',
                    borderRadius: '2px', textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8125rem', color: '#999',
                  }}>
                    Busque "{opcao.raquete.marca} {opcao.raquete.modelo}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          {resultado.debug && (
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 300,
              fontSize: '0.75rem', color: '#bbb',
              marginBottom: '20px', letterSpacing: '0.04em',
            }}>
              {resultado.debug.apos_eliminacao} de {resultado.debug.total_catalogo} raquetes analisadas
            </p>
          )}
          <button onClick={onReiniciar} style={{
            background: 'none', border: '1.5px solid var(--cream)',
            borderRadius: '2px', padding: '12px 32px',
            fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#888', cursor: 'pointer',
          }}>
            Refazer o quiz
          </button>
        </div>
      </div>
    </div>
  )
}
