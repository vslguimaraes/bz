'use client'

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

type Props = { resultado: Resultado; onReiniciar: () => void }

const LABELS_POSICAO = ['Ideal para você', 'Alternativa A', 'Alternativa B']
const ACENT_TOP = ['var(--clay)', 'var(--grass)', 'var(--hard-blue)']

function CardRaquete({
  opcao,
  index,
}: {
  opcao: Opcao
  index: number
}) {
  const isPrincipal = index === 0
  return (
    <div style={{
      background: isPrincipal ? 'var(--court-dark)' : 'var(--warm-white)',
      border: isPrincipal ? 'none' : '1.5px solid var(--cream)',
      borderRadius: '8px',
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Barra de acento no topo */}
      <div style={{ height: '3px', background: ACENT_TOP[index] ?? '#999', flexShrink: 0 }} />

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Badge de posição */}
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.625rem', letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: isPrincipal ? 'rgba(247,243,238,0.5)' : '#aaa',
          marginBottom: '8px',
        }}>
          {LABELS_POSICAO[index] ?? opcao.label}
        </p>

        {/* Marca + modelo */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isPrincipal ? '1.375rem' : '1.125rem',
          fontWeight: 800,
          color: isPrincipal ? '#FFFFFF' : 'var(--court-dark)',
          lineHeight: 1.05,
          marginBottom: '2px',
        }}>
          {opcao.raquete.marca}
        </h3>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: isPrincipal ? 'rgba(247,243,238,0.55)' : '#888',
          marginBottom: '12px',
          fontWeight: 400,
        }}>
          {opcao.raquete.modelo}
        </p>

        {/* Justificativa */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 300,
          lineHeight: 1.6,
          color: isPrincipal ? 'rgba(247,243,238,0.7)' : '#666',
          borderLeft: `2px solid ${ACENT_TOP[index] ?? '#ccc'}`,
          paddingLeft: '10px',
          marginBottom: '14px',
          flex: 1,
        }}>
          {opcao.justificativa}
        </p>

        {/* Specs: corda + grip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '12px' }}>
          {[
            { l: 'Corda', v: opcao.corda_sugerida },
            { l: 'Grip', v: opcao.grip_sugerido },
          ].map(s => (
            <div key={s.l} style={{
              background: isPrincipal ? 'rgba(255,255,255,0.07)' : 'var(--cream)',
              borderRadius: '4px', padding: '8px 10px',
            }}>
              <p style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: isPrincipal ? 'rgba(247,243,238,0.4)' : '#bbb', marginBottom: '2px' }}>{s.l}</p>
              <p style={{ fontSize: '0.6875rem', fontWeight: 500, color: isPrincipal ? 'rgba(247,243,238,0.85)' : 'var(--court-dark)', lineHeight: 1.3 }}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        {opcao.raquete.link_tw ? (
          <a href={opcao.raquete.link_tw} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', padding: '10px',
            background: isPrincipal ? 'var(--clay)' : 'var(--court-dark)',
            color: '#FFFFFF',
            borderRadius: '4px', textAlign: 'center',
            fontFamily: 'var(--font-body)', fontWeight: 600,
            fontSize: '0.6875rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', textDecoration: 'none',
          }}>
            Ver →
          </a>
        ) : (
          <div style={{
            padding: '9px', background: isPrincipal ? 'rgba(255,255,255,0.07)' : 'var(--cream)',
            borderRadius: '4px', textAlign: 'center',
            fontSize: '0.6875rem', color: isPrincipal ? 'rgba(247,243,238,0.4)' : '#bbb',
          }}>
            {opcao.raquete.marca} {opcao.raquete.modelo}
          </div>
        )}
      </div>
    </div>
  )
}

export default function TelaResultado({ resultado, onReiniciar }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>

      {/* Barra de progresso cheia */}
      <div style={{ height: '3px', background: 'var(--clay)' }} />

      {/* Nav minimalista */}
      <nav style={{
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--cream)',
        background: 'var(--warm-white)',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: '0.9375rem', color: 'var(--court-dark)', fontWeight: 700,
        }}>
          Raquete Ideal
        </span>
        <span style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.6875rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'var(--clay)',
        }}>
          Sua recomendação
        </span>
      </nav>

      {/* Perfil — linha discreta */}
      <div style={{
        background: 'var(--court-dark)',
        padding: '14px 20px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '0.9375rem',
          fontWeight: 400,
          color: 'rgba(247,243,238,0.55)',
          maxWidth: '480px',
          margin: '0 auto',
          lineHeight: 1.4,
        }}>
          "{resultado.resumo_perfil}"
        </p>
      </div>

      {/* Cards — 3 juntos */}
      <div style={{ padding: '16px 16px 32px' }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'row',
          gap: '10px',
          alignItems: 'stretch',
        }}>
          {resultado.opcoes.map((op, i) => (
            <CardRaquete key={op.posicao} opcao={op} index={i} />
          ))}
        </div>

        {/* Rodapé */}
        <div style={{ maxWidth: '960px', margin: '20px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {resultado.debug ? (
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 300,
              fontSize: '0.6875rem', color: '#ccc', letterSpacing: '0.04em',
            }}>
              {resultado.debug.apos_eliminacao}/{resultado.debug.total_catalogo} raquetes analisadas
            </p>
          ) : <span />}
          <button onClick={onReiniciar} style={{
            background: 'none', border: '1px solid var(--cream)',
            borderRadius: '3px', padding: '9px 24px',
            fontFamily: 'var(--font-body)', fontSize: '0.75rem',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: '#aaa', cursor: 'pointer',
          }}>
            Refazer
          </button>
        </div>
      </div>
    </div>
  )
}
