'use client'

import { useState, useCallback } from 'react'
import StepHistorico    from './steps/StepHistorico'
import StepTecnico      from './steps/StepTecnico'
import StepEstilo       from './steps/StepEstilo'
import StepMobilidade   from './steps/StepMobilidade'
import StepLesao        from './steps/StepLesao'
import StepRaquete      from './steps/StepRaquete'
import StepFrequencia   from './steps/StepFrequencia'
import TelaResultado    from './TelaResultado'
import TelaLoading      from './TelaLoading'

export type Perfil = {
  historico?: string
  tecnico?: string
  estilo?: string
  mobilidade?: string
  lesao?: string
  raquete_atual?: string
  frequencia?: string
  arquetipo_pro?: string[]
}

type Estado = 'intro' | 'quiz' | 'loading' | 'resultado'

function getSteps(historico?: string): string[] {
  if (historico === 'recreativo')
    return ['historico','tecnico','mobilidade','lesao','raquete','frequencia']
  return ['historico','tecnico','estilo','mobilidade','lesao','raquete','frequencia']
}

function getStepNum(step: string): number {
  return ({ historico:1, tecnico:2, estilo:3, mobilidade:4, lesao:5, raquete:6, frequencia:7 } as any)[step] ?? 1
}

export default function QuizShell() {
  const [perfil, setPerfil]       = useState<Perfil>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<'forward'|'back'>('forward')
  const [estado, setEstado]       = useState<Estado>('intro')
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro]           = useState<string|null>(null)

  const steps       = getSteps(perfil.historico)
  const currentStep = steps[stepIndex]
  const totalVisible = perfil.historico === 'recreativo' ? 6 : 7

  const avancar = useCallback((valor: Partial<Perfil>) => {
    const novo = { ...perfil, ...valor }
    setPerfil(novo)
    setDirection('forward')
    const novosSteps = getSteps(novo.historico)
    if (stepIndex + 1 >= novosSteps.length) enviarPerfil(novo)
    else setStepIndex(i => i + 1)
  }, [perfil, stepIndex])

  const voltar = useCallback(() => {
    if (stepIndex === 0) { setEstado('intro'); return }
    setDirection('back')
    setStepIndex(i => i - 1)
  }, [stepIndex])

  async function enviarPerfil(p: Perfil) {
    setEstado('loading')
    setErro(null)
    try {
      const lesaoMap: Record<string,string> = {
        sem_lesao:'nenhuma', epicondilite:'cotovelo',
        ombro:'ombro', vibracoes_gerais:'vibracao',
      }
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          historico:    p.historico ?? 'recreativo',
          tecnico:      p.tecnico   ?? 'basico',
          estilo:       p.estilo    ?? 'flat_basico',
          mobilidade:   p.mobilidade ?? 'mobilidade_moderada',
          lesao:        lesaoMap[p.lesao ?? 'sem_lesao'] ?? 'nenhuma',
          raquete_atual: (p.raquete_atual && !['nao_tenho','nao_sei'].includes(p.raquete_atual))
            ? p.raquete_atual : undefined,
          arquetipo_pro: p.arquetipo_pro ?? [],
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Erro')
      setResultado(await res.json())
      setEstado('resultado')
    } catch (e: any) {
      setErro(e.message)
      setEstado('quiz')
    }
  }

  /* ── INTRO ─────────────────────────────────── */
  if (estado === 'intro') return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--court-dark)', position: 'relative', overflow: 'hidden',
    }} className="grain">
      {/* Foto de raquete sobre quadra */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1400&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Overlay escuro para legibilidade */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(26,26,24,0.68) 0%, rgba(26,26,24,0.82) 50%, rgba(26,26,24,0.97) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 2,
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 24px', textAlign: 'center',
      }} className="anim-fade-up">
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 400, letterSpacing: '0.22em',
          fontSize: '0.75rem', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)', marginBottom: '24px',
          textShadow: '0 1px 8px rgba(0,0,0,0.6)',
        }}>
          Encontre sua raquete ideal
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 5.5rem)',
          fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em',
          color: '#FFFFFF', marginBottom: '8px',
          textShadow: '0 2px 16px rgba(0,0,0,0.5)',
        }}>
          Qual<br /><em style={{ color: 'rgba(255,255,255,0.75)' }}>raquete</em><br />é a sua?
        </h1>

        <p style={{
          marginTop: '28px', maxWidth: '320px',
          fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.6,
          color: 'rgba(255,255,255,0.85)',
          textShadow: '0 1px 8px rgba(0,0,0,0.5)',
        }}>
          7 perguntas. Recomendação personalizada pelo mesmo motor que analisa specs de torneios como Roland Garros e Wimbledon.
        </p>

        <button
          onClick={() => setEstado('quiz')}
          style={{
            marginTop: '40px',
            padding: '18px 56px',
            background: '#FFFFFF',
            color: '#1A1A18',
            border: '2px solid #FFFFFF',
            borderRadius: '3px',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--clay)'
            e.currentTarget.style.borderColor = 'var(--clay)'
            e.currentTarget.style.color = '#FFFFFF'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#FFFFFF'
            e.currentTarget.style.borderColor = '#FFFFFF'
            e.currentTarget.style.color = '#1A1A18'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Começar →
        </button>

        <p style={{
          marginTop: '16px', fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.55)', fontWeight: 300,
        }}>
          Menos de 2 minutos
        </p>
      </div>

      {/* Bottom label */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '16px 24px', textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
      }}>
        {['Roland Garros','Wimbledon','US Open','Australian Open'].map(t => (
          <span key={t} style={{
            fontSize: '0.6875rem', fontWeight: 300,
            color: 'rgba(247,243,238,0.3)', letterSpacing: '0.08em',
          }}>{t}</span>
        ))}
      </div>
    </div>
  )

  if (estado === 'loading')  return <TelaLoading />
  if (estado === 'resultado' && resultado) return (
    <TelaResultado resultado={resultado} onReiniciar={() => {
      setPerfil({}); setStepIndex(0); setEstado('intro'); setResultado(null)
    }} />
  )

  const animClass = direction === 'forward' ? 'anim-slide-r' : 'anim-slide-l'
  const stepNum   = getStepNum(currentStep)
  const progPct   = (stepNum / totalVisible) * 100

  /* ── QUIZ ──────────────────────────────────── */
  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--cream)',
        background: 'var(--warm-white)',
        flexShrink: 0,
      }}>
        <button onClick={voltar} style={{
          background: 'none', border: 'none',
          fontFamily: 'var(--font-body)', fontSize: '0.8125rem',
          color: stepIndex === 0 ? 'transparent' : '#999',
          cursor: stepIndex === 0 ? 'default' : 'pointer',
          letterSpacing: '0.04em',
          transition: 'color 150ms',
        }}>
          ← voltar
        </button>

        <span style={{
          fontFamily: 'var(--font-display)', fontStyle: 'italic',
          fontSize: '1rem', color: 'var(--court-dark)', fontWeight: 700,
        }}>
          Raquete Ideal
        </span>

        {/* espaçador para centralizar o título */}
        <span style={{ width: '52px' }} />
      </nav>

      {/* Barra de progresso abaixo do nav */}
      <div style={{
        background: 'var(--warm-white)',
        padding: '10px 24px 14px',
        borderBottom: '1px solid var(--cream)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <div style={{
            flex: 1, height: '4px', background: 'var(--cream)',
            borderRadius: '2px', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progPct}%`,
              background: 'var(--clay)',
              borderRadius: '2px',
              transition: 'width 500ms var(--ease-out-expo)',
            }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            color: '#aaa', letterSpacing: '0.08em', flexShrink: 0,
            minWidth: '28px', textAlign: 'right',
          }}>
            {stepNum}/{totalVisible}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '32px 20px 40px',
      }}>
        <div key={`${currentStep}-${stepIndex}`} className={animClass}
             style={{ width: '100%', maxWidth: 'var(--max-quiz)' }}>

          {erro && (
            <div style={{
              marginBottom: '16px', padding: '12px 16px',
              background: '#FEE2E2', color: '#B91C1C',
              borderRadius: '4px', fontSize: '0.875rem',
            }}>
              {erro} — tente novamente.
            </div>
          )}

          {currentStep === 'historico'  && <StepHistorico  onNext={avancar} valorAtual={perfil.historico} />}
          {currentStep === 'tecnico'    && <StepTecnico    onNext={avancar} valorAtual={perfil.tecnico} />}
          {currentStep === 'estilo'     && <StepEstilo     onNext={avancar} historico={perfil.historico} valorAtual={perfil.estilo} />}
          {currentStep === 'mobilidade' && <StepMobilidade onNext={avancar} valorAtual={perfil.mobilidade} />}
          {currentStep === 'lesao'      && <StepLesao      onNext={avancar} valorAtual={perfil.lesao} />}
          {currentStep === 'raquete'    && <StepRaquete    onNext={avancar} valorAtual={perfil.raquete_atual} />}
          {currentStep === 'frequencia' && <StepFrequencia onNext={avancar} valorAtual={perfil.frequencia} />}
        </div>
      </div>
    </div>
  )
}
