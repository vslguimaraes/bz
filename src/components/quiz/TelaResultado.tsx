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

// Extrai só a tensão da string de corda (ex: "46-48 lbs" de um texto longo)
function extrairTensao(corda: string): string {
  const match = corda.match(/\d{2}[-–]\d{2}\s*lbs/i) ?? corda.match(/\d{2}\s*lbs/i)
  return match ? match[0] : corda.split('—')[0].split('.')[0].trim().slice(0, 20)
}

// Extrai só o tamanho de grip (ex: "L3" ou "L2")
function extrairGrip(grip: string): string {
  const match = grip.match(/L[1-5]/i)
  return match ? match[0].toUpperCase() : grip.split('.')[0].trim().slice(0, 12)
}

const BADGE_LABEL = ['#1 para você', 'Alternativa', 'Alternativa']
const BADGE_COLOR = ['var(--clay)', 'var(--grass)', 'var(--hard-blue)']

function CardRaquete({ opcao, index }: { opcao: Opcao; index: number }) {
  const isPrimary = index === 0

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '12px',
      overflow: 'hidden',
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: isPrimary
        ? '0 8px 40px rgba(196,98,45,0.18)'
        : '0 2px 16px rgba(0,0,0,0.08)',
      border: isPrimary ? '2px solid var(--clay)' : '1.5px solid #EBEBEB',
      transition: 'transform 200ms, box-shadow 200ms',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = isPrimary
          ? '0 16px 48px rgba(196,98,45,0.25)'
          : '0 12px 32px rgba(0,0,0,0.13)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = isPrimary
          ? '0 8px 40px rgba(196,98,45,0.18)'
          : '0 2px 16px rgba(0,0,0,0.08)'
      }}
    >
      {/* Imagem / placeholder da raquete */}
      <div style={{
        background: 'linear-gradient(135deg, #F5F0EB 0%, #EDE8E3 100%)',
        height: isPrimary ? '180px' : '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* Badge de posição */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: BADGE_COLOR[index],
          color: '#FFFFFF',
          fontSize: '0.625rem',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '20px',
        }}>
          {BADGE_LABEL[index]}
        </div>

        {/* Placeholder — troca por <img> quando tiver foto */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '52px', opacity: 0.35 }}>🎾</span>
          <p style={{
            fontSize: '0.625rem', color: '#bbb', marginTop: '6px',
            fontFamily: 'var(--font-body)', letterSpacing: '0.08em',
          }}>foto em breve</p>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Marca */}
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.6875rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', color: '#AAA',
          marginBottom: '2px',
        }}>
          {opcao.raquete.marca}
        </p>

        {/* Modelo */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isPrimary ? '1.375rem' : '1.125rem',
          fontWeight: 800,
          color: 'var(--court-dark)',
          lineHeight: 1.1,
          marginBottom: '12px',
        }}>
          {opcao.raquete.modelo}
        </h3>

        {/* Justificativa — 3 linhas max */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          fontWeight: 400,
          lineHeight: 1.6,
          color: '#666',
          marginBottom: '16px',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {opcao.justificativa}
        </p>

        {/* Specs — só tensão e grip */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div style={{
            flex: 1, background: '#F7F3EE', borderRadius: '6px',
            padding: '8px 10px',
          }}>
            <p style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CCC', marginBottom: '2px' }}>Tensão</p>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--court-dark)' }}>
              {extrairTensao(opcao.corda_sugerida)}
            </p>
          </div>
          <div style={{
            flex: 1, background: '#F7F3EE', borderRadius: '6px',
            padding: '8px 10px',
          }}>
            <p style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CCC', marginBottom: '2px' }}>Grip</p>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--court-dark)' }}>
              {extrairGrip(opcao.grip_sugerido)}
            </p>
          </div>
        </div>

        {/* CTA */}
        {opcao.raquete.link_tw ? (
          <a
            href={opcao.raquete.link_tw}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: isPrimary ? '14px' : '12px',
              background: isPrimary ? 'var(--clay)' : 'var(--court-dark)',
              color: '#FFFFFF',
              borderRadius: '6px',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: isPrimary ? '0.9375rem' : '0.8125rem',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Ver no Tennis Warehouse →
          </a>
        ) : (
          <div style={{
            padding: '12px', background: '#F0EDEA', borderRadius: '6px',
            textAlign: 'center', fontSize: '0.75rem', color: '#BBB',
            fontFamily: 'var(--font-body)',
          }}>
            Busque na sua loja local
          </div>
        )}
      </div>
    </div>
  )
}

export default function TelaResultado({ resultado, onReiniciar }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: '#F2EDE8' }}>

      {/* Barra clay cheia */}
      <div style={{ height: '3px', background: 'var(--clay)' }} />

      {/* Nav */}
      <nav style={{
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#FFFFFF', borderBottom: '1px solid #EBEBEB',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: '0.9375rem', color: 'var(--court-dark)', fontWeight: 700,
        }}>
          Raquete Ideal
        </span>
        <button onClick={onReiniciar} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '0.75rem',
          letterSpacing: '0.06em', color: '#AAA',
        }}>
          Refazer ↩
        </button>
      </nav>

      {/* Subtítulo perfil */}
      <div style={{ padding: '20px 24px 0', maxWidth: '960px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: '1rem', color: 'var(--court-mid)',
          fontWeight: 400, lineHeight: 1.4,
        }}>
          "{resultado.resumo_perfil}"
        </p>
      </div>

      {/* Cards */}
      <div style={{
        padding: '20px 20px 40px',
        maxWidth: '960px', margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        gap: '14px',
        alignItems: 'stretch',
      }}>
        {resultado.opcoes.map((op, i) => (
          <CardRaquete key={op.posicao} opcao={op} index={i} />
        ))}
      </div>

      {resultado.debug && (
        <p style={{
          textAlign: 'center', paddingBottom: '24px',
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.6875rem', color: '#CCC', letterSpacing: '0.04em',
        }}>
          {resultado.debug.apos_eliminacao}/{resultado.debug.total_catalogo} raquetes analisadas
        </p>
      )}
    </div>
  )
}
