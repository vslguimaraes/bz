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

function CardPrincipal({ opcao }: { opcao: Opcao }) {
  return (
    <div style={{
      background: 'var(--warm-white)',
      border: '1.5px solid var(--cream)',
      borderRadius: '6px',
      overflow: 'hidden',
      marginBottom: '12px',
    }}>
      <div style={{ height: '4px', background: 'var(--clay)' }} />
      <div style={{ padding: '28px 24px' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.6875rem', letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--clay)',
          marginBottom: '10px',
        }}>
          {opcao.label}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          fontWeight: 900, color: 'var(--court-dark)',
          lineHeight: 1.05, marginBottom: '4px',
        }}>
          {opcao.raquete.marca}
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '1rem',
          color: '#777', marginBottom: '20px', fontWeight: 400,
        }}>
          {opcao.raquete.modelo}
        </p>

        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.9375rem', lineHeight: 1.7,
          color: 'var(--court-mid)',
          borderLeft: '3px solid var(--clay)',
          paddingLeft: '16px',
          marginBottom: '24px',
        }}>
          {opcao.justificativa}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
          {[
            { label: 'Corda recomendada', value: opcao.corda_sugerida },
            { label: 'Grip', value: opcao.grip_sugerido },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--cream)', borderRadius: '4px', padding: '14px' }}>
              <p style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#aaa', marginBottom: '4px' }}>{s.label}</p>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--court-dark)', lineHeight: 1.4 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {opcao.raquete.link_tw ? (
          <a href={opcao.raquete.link_tw} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', padding: '15px',
            background: 'var(--court-dark)', color: 'var(--warm-white)',
            borderRadius: '4px', textAlign: 'center',
            fontFamily: 'var(--font-body)', fontWeight: 600,
            fontSize: '0.875rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', textDecoration: 'none',
          }}>
            Ver no Tennis Warehouse →
          </a>
        ) : (
          <div style={{
            padding: '13px', background: 'var(--cream)', borderRadius: '4px',
            textAlign: 'center', fontSize: '0.8125rem', color: '#999',
            fontFamily: 'var(--font-body)',
          }}>
            Busque "{opcao.raquete.marca} {opcao.raquete.modelo}" na sua loja
          </div>
        )}
      </div>
    </div>
  )
}

function CardSecundario({ opcao, acento }: { opcao: Opcao; acento: string }) {
  return (
    <div style={{
      background: 'var(--warm-white)',
      border: '1.5px solid var(--cream)',
      borderRadius: '6px', overflow: 'hidden',
    }}>
      <div style={{ height: '3px', background: acento }} />
      <div style={{ padding: '20px 18px' }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.625rem', letterSpacing: '0.14em',
          textTransform: 'uppercase', color: acento, marginBottom: '8px',
        }}>
          {opcao.label}
        </p>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem', fontWeight: 700,
          color: 'var(--court-dark)', lineHeight: 1.1, marginBottom: '2px',
        }}>
          {opcao.raquete.marca}
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#777', marginBottom: '12px' }}>
          {opcao.raquete.modelo}
        </p>
        <p style={{
          fontSize: '0.8125rem', lineHeight: 1.6,
          color: '#666', fontWeight: 300, marginBottom: '14px',
        }}>
          {opcao.justificativa}
        </p>
        {opcao.raquete.link_tw ? (
          <a href={opcao.raquete.link_tw} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', padding: '11px',
            border: '1.5px solid var(--cream)',
            borderRadius: '4px', textAlign: 'center',
            fontFamily: 'var(--font-body)', fontWeight: 500,
            fontSize: '0.75rem', letterSpacing: '0.06em',
            textTransform: 'uppercase', textDecoration: 'none',
            color: 'var(--court-dark)',
          }}>
            Ver →
          </a>
        ) : (
          <p style={{ fontSize: '0.75rem', color: '#bbb', textAlign: 'center' }}>
            "{opcao.raquete.marca} {opcao.raquete.modelo}"
          </p>
        )}
      </div>
    </div>
  )
}

export default function TelaResultado({ resultado, onReiniciar }: Props) {
  const [principal, ...alternativas] = resultado.opcoes
  const ACENTS = ['var(--grass)', 'var(--hard-blue)']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>

      {/* Hero */}
      <div style={{
        background: 'var(--court-dark)', padding: '40px 24px 36px',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 300, letterSpacing: '0.2em',
          fontSize: '0.6875rem', textTransform: 'uppercase',
          color: 'var(--clay-dust)', marginBottom: '14px',
        }}>
          Sua recomendação personalizada
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 700, fontStyle: 'italic',
          color: 'var(--warm-white)', lineHeight: 1.25,
          maxWidth: '500px', margin: '0 auto',
        }}>
          "{resultado.resumo_perfil}"
        </h1>
      </div>

      {/* Barra de progresso cheia */}
      <div style={{ height: '3px', background: 'var(--clay)' }} />

      {/* Conteúdo */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 20px 48px' }}>

        {/* Card principal */}
        {principal && <CardPrincipal opcao={principal} />}

        {/* Alternativas em grid */}
        {alternativas.length > 0 && (
          <>
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 300,
              fontSize: '0.6875rem', letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#bbb',
              margin: '20px 0 10px',
            }}>
              Outras opções
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: alternativas.length >= 2 ? 'repeat(2, 1fr)' : '1fr',
              gap: '10px',
            }}>
              {alternativas.map((op, i) => (
                <CardSecundario key={op.posicao} opcao={op} acento={ACENTS[i] ?? '#999'} />
              ))}
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          {resultado.debug && (
            <p style={{
              fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.75rem',
              color: '#ccc', marginBottom: '20px', letterSpacing: '0.04em',
            }}>
              {resultado.debug.apos_eliminacao} de {resultado.debug.total_catalogo} raquetes analisadas
            </p>
          )}
          <button onClick={onReiniciar} style={{
            background: 'none', border: '1.5px solid var(--cream)', borderRadius: '3px',
            padding: '12px 32px', fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#999', cursor: 'pointer',
          }}>
            Refazer o quiz
          </button>
        </div>
      </div>
    </div>
  )
}
