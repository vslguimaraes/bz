'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useIsMobile } from '@/hooks/useIsMobile'

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

type Props = { resultado: Resultado; onReiniciar: () => void; sessaoId?: string }

// Extrai nome da corda (antes do primeiro "—" ou "·")
function extrairNomeCorda(corda: string): string {
  const semHybrid = corda.replace(/^hybrid:\s*/i, '')
  const partes = semHybrid.split(/\s*[—–-]{1,2}\s*/)
  return partes[0].trim().slice(0, 30)
}

// Extrai tensão
function extrairTensao(corda: string): string {
  const match = corda.match(/\d{2}[-–\/]\d{2}\s*lbs/i) ?? corda.match(/\d{2}\s*lbs/i)
  return match ? match[0] : ''
}

// Extrai grip size
function extrairGrip(grip: string): string {
  const match = grip.match(/L[1-5]/i)
  return match ? match[0].toUpperCase() : grip.split('.')[0].trim().slice(0, 10)
}

// UTM helper
function addUtm(url: string, raqueteId: string): string {
  if (!url) return url
  try {
    const u = new URL(url)
    u.searchParams.set('utm_source', 'raquete-ideal')
    u.searchParams.set('utm_medium', 'recommendation')
    u.searchParams.set('utm_campaign', 'quiz')
    u.searchParams.set('utm_content', raqueteId)
    return u.toString()
  } catch { return url }
}

// Loja ProSpin — primário para todas as marcas
const PROSPIN_URL = 'https://www.prospin.com.br/raquetes/tenis?product_list_limit=72'

// Fallback por marca: loja oficial BR ou site global da marca
const MARCA_FALLBACK: Record<string, string> = {
  Babolat:    'https://www.babolat.com/pt/tenis/raquetes/adultos.html',
  Wilson:     'https://www.wilsonloja.com.br/collections/raquetes-tenis-esportes',
  Head:       'https://www.head.com/en/shop-tennis/racquets',
  Prince:     'https://princetennis.com/',
  Tecnifibre: 'https://tecnifibre.com/pt-br/',
  Dunlop:     'https://dunlopsport.com.br/categoria/tenis/',
  Mizuno:     'https://www.mizuno.com.br/tenis',
  // Yonex: sem loja BR → usa link_tw diretamente
}

const BADGE = [
  { label: '#1 para você', bg: '#C4622D' },
  { label: 'Alternativa',  bg: '#3B6E45' },
  { label: 'Alternativa',  bg: '#2B5EA7' },
]

function CardRaquete({
  opcao,
  index,
  sessaoId,
}: {
  opcao: Opcao
  index: number
  sessaoId?: string
}) {
  const isPrimary = index === 0
  const badge = BADGE[index] ?? { label: 'Opção', bg: '#888' }
  const nomeCorda = extrairNomeCorda(opcao.corda_sugerida)
  const tensao   = extrairTensao(opcao.corda_sugerida)
  const grip     = extrairGrip(opcao.grip_sugerido)
  const raqueteId = opcao.raquete.modelo.toLowerCase().replace(/\s+/g, '-')

  // Links por prioridade
  const hrefProspin    = addUtm(PROSPIN_URL, raqueteId)
  const hrefMarcaBr    = MARCA_FALLBACK[opcao.raquete.marca]
  const hrefTw         = opcao.raquete.link_tw ? addUtm(opcao.raquete.link_tw, raqueteId) : null
  const hrefSecundario = hrefMarcaBr ?? hrefTw ?? null

  function handleAffiliateClick(loja: string) {
    void (async () => {
      try {
        await supabase.from('eventos').insert({
          tipo: 'affiliate_click',
          sessao_id: sessaoId ?? null,
          payload: {
            marca: opcao.raquete.marca,
            modelo: opcao.raquete.modelo,
            posicao: index + 1,
            loja,
          },
        })
      } catch { /* fire-and-forget */ }
    })()
  }

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
        ? '0 6px 32px rgba(196,98,45,0.16)'
        : '0 2px 12px rgba(0,0,0,0.07)',
      border: isPrimary ? '2px solid #C4622D' : '1.5px solid #E8E4DF',
    }}>

      {/* Zona imagem */}
      <div style={{
        background: 'linear-gradient(135deg, #F0EBE5 0%, #E8E3DD 100%)',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: '10px', left: '10px',
          background: badge.bg,
          color: '#FFFFFF',
          fontSize: '0.5625rem',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '4px 10px',
          borderRadius: '20px',
        }}>
          {badge.label}
        </div>
        <span style={{ fontSize: '44px', opacity: 0.28 }}>🎾</span>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Marca */}
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 400,
          fontSize: '0.625rem', letterSpacing: '0.16em',
          textTransform: 'uppercase', color: '#999',
          marginBottom: '2px',
        }}>
          {opcao.raquete.marca}
        </p>

        {/* Modelo */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: isPrimary ? '1.25rem' : '1.0625rem',
          fontWeight: 800,
          color: '#1A1A18',
          lineHeight: 1.1,
          marginBottom: '10px',
        }}>
          {opcao.raquete.modelo}
        </h3>

        {/* Justificativa — 3 linhas fixas */}
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          fontWeight: 400,
          lineHeight: 1.55,
          color: '#555',
          marginBottom: '12px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        } as React.CSSProperties}>
          {opcao.justificativa}
        </p>

        {/* Spec: corda + tensão + grip numa linha */}
        <div style={{
          background: '#F5F1ED',
          borderRadius: '8px',
          padding: '10px 12px',
          marginBottom: '14px',
          display: 'grid',
          gridTemplateColumns: '1fr auto auto',
          gap: '8px',
          alignItems: 'start',
        }}>
          {/* Corda */}
          <div>
            <p style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>Corda</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333', lineHeight: 1.2 }}>{nomeCorda}</p>
          </div>
          {/* Tensão */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>Tensão</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333' }}>{tensao}</p>
          </div>
          {/* Grip */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#999', marginBottom: '2px' }}>Grip</p>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#333' }}>{grip}</p>
          </div>
        </div>

        {/* CTA primário — ProSpin */}
        <a
          href={hrefProspin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAffiliateClick('prospin')}
          style={{
            display: 'block',
            padding: isPrimary ? '13px' : '11px',
            background: isPrimary ? '#C4622D' : '#1A1A18',
            color: '#FFFFFF',
            borderRadius: '6px',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            letterSpacing: '0.07em',
            textDecoration: 'none',
            textTransform: 'uppercase',
            marginBottom: hrefSecundario ? '8px' : 0,
          }}
        >
          Buscar na ProSpin →
        </a>

        {/* Link secundário — marca BR ou TW */}
        {hrefSecundario && (
          <a
            href={hrefSecundario}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick(hrefMarcaBr ? `marca_${opcao.raquete.marca.toLowerCase()}` : 'tennis_warehouse')}
            style={{
              display: 'block',
              padding: '8px',
              background: 'transparent',
              color: '#999',
              borderRadius: '6px',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '0.6875rem',
              letterSpacing: '0.05em',
              textDecoration: 'none',
              border: '1px solid #E8E4DF',
            }}
          >
            {hrefMarcaBr
              ? `Ver em ${opcao.raquete.marca} →`
              : 'Ver no Tennis Warehouse →'}
          </a>
        )}
      </div>
    </div>
  )
}

export default function TelaResultado({ resultado, onReiniciar, sessaoId }: Props) {
  const [feedback, setFeedback] = useState<1 | -1 | null>(null)
  const isMobile = useIsMobile()

  function handleFeedback(rating: 1 | -1) {
    if (feedback !== null) return
    setFeedback(rating)
    void (async () => {
      try {
        await supabase.from('eventos').insert({
          tipo: 'feedback',
          sessao_id: sessaoId ?? null,
          payload: {
            rating,
            opcoes_apresentadas: resultado.opcoes.map(op => ({
              marca: op.raquete.marca,
              modelo: op.raquete.modelo,
              posicao: op.posicao,
            })),
          },
        })
      } catch { /* fire-and-forget */ }
    })()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EDE9E4' }}>

      <div style={{ height: '3px', background: '#C4622D' }} />

      {/* Nav */}
      <nav style={{
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#FFFFFF', borderBottom: '1px solid #E8E4DF',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9375rem', color: '#1A1A18', fontWeight: 700,
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

      {/* Perfil — positivo, sem itálico */}
      <div style={{ padding: '16px 24px 4px', maxWidth: '960px', margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          fontWeight: 500,
          color: '#555',
          lineHeight: 1.5,
        }}>
          Selecionamos as melhores opções para o seu perfil —{' '}
          <span style={{ color: '#C4622D', fontWeight: 600 }}>
            {resultado.resumo_perfil}
          </span>
        </p>
      </div>

      {/* Cards */}
      <div style={{
        padding: isMobile ? '12px 14px 24px' : '14px 20px 32px',
        maxWidth: '960px', margin: '0 auto',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '12px',
        alignItems: 'stretch',
      }}>
        {resultado.opcoes.map((op, i) => (
          <CardRaquete key={op.posicao} opcao={op} index={i} sessaoId={sessaoId} />
        ))}
      </div>

      {/* Feedback */}
      <div style={{
        maxWidth: '960px', margin: '0 auto',
        padding: '0 20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}>
        {feedback === null ? (
          <>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: '#888',
            }}>
              Essa recomendação foi útil?
            </span>
            <button
              onClick={() => handleFeedback(1)}
              style={{
                background: 'none',
                border: '1.5px solid #E8E4DF',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '1.125rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Sim, foi útil"
            >
              👍
            </button>
            <button
              onClick={() => handleFeedback(-1)}
              style={{
                background: 'none',
                border: '1.5px solid #E8E4DF',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '1.125rem',
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Não foi útil"
            >
              👎
            </button>
          </>
        ) : (
          <>
            <button
              disabled
              style={{
                background: 'none',
                border: `1.5px solid ${feedback === 1 ? '#C4622D' : '#E8E4DF'}`,
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '1.125rem',
                cursor: 'default',
                lineHeight: 1,
                opacity: feedback === 1 ? 1 : 0.35,
              }}
            >
              👍
            </button>
            <button
              disabled
              style={{
                background: 'none',
                border: `1.5px solid ${feedback === -1 ? '#666' : '#E8E4DF'}`,
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '1.125rem',
                cursor: 'default',
                lineHeight: 1,
                opacity: feedback === -1 ? 1 : 0.35,
              }}
            >
              👎
            </button>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              color: '#888',
            }}>
              Obrigado!
            </span>
          </>
        )}
      </div>

      {resultado.debug && (
        <p style={{
          textAlign: 'center', paddingBottom: '20px',
          fontFamily: 'var(--font-body)', fontWeight: 300,
          fontSize: '0.6875rem', color: '#BBB', letterSpacing: '0.04em',
        }}>
          {resultado.debug.apos_eliminacao}/{resultado.debug.total_catalogo} raquetes analisadas
        </p>
      )}
    </div>
  )
}
