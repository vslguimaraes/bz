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

type Estado = 'quiz' | 'loading' | 'resultado'

const TORNEIOS = ['Roland Garros', 'Wimbledon', 'US Open', 'Australian Open', 'Rio Open']

function getSteps(historico?: string): string[] {
  if (historico === 'recreativo') {
    return ['historico', 'tecnico', 'mobilidade', 'lesao', 'raquete', 'frequencia']
  }
  return ['historico', 'tecnico', 'estilo', 'mobilidade', 'lesao', 'raquete', 'frequencia']
}

function getStepNum(step: string): number {
  const map: Record<string, number> = {
    historico: 1, tecnico: 2, estilo: 3, mobilidade: 4, lesao: 5, raquete: 6, frequencia: 7,
  }
  return map[step] ?? 1
}

export default function QuizShell() {
  const [perfil, setPerfil] = useState<Perfil>({})
  const [stepIndex, setStepIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [estado, setEstado] = useState<Estado>('quiz')
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState<string | null>(null)

  const steps = getSteps(perfil.historico)
  const currentStep = steps[stepIndex]
  const totalVisible = perfil.historico === 'recreativo' ? 6 : 7

  const avancar = useCallback((valor: Partial<Perfil>) => {
    const novoPerfil = { ...perfil, ...valor }
    setPerfil(novoPerfil)
    setDirection('forward')
    const novosSteps = getSteps(novoPerfil.historico)
    if (stepIndex + 1 >= novosSteps.length) {
      enviarPerfil(novoPerfil)
    } else {
      setStepIndex(i => i + 1)
    }
  }, [perfil, stepIndex])

  const voltar = useCallback(() => {
    if (stepIndex === 0) return
    setDirection('back')
    setStepIndex(i => i - 1)
  }, [stepIndex])

  async function enviarPerfil(p: Perfil) {
    setEstado('loading')
    setErro(null)
    try {
      const lesaoMap: Record<string, string> = {
        sem_lesao: 'nenhuma', epicondilite: 'cotovelo',
        ombro: 'ombro', vibracoes_gerais: 'vibracao',
      }
      const payload = {
        historico: p.historico ?? 'recreativo',
        tecnico: p.tecnico ?? 'basico',
        estilo: p.estilo ?? 'flat_basico',
        mobilidade: p.mobilidade ?? 'mobilidade_moderada',
        lesao: lesaoMap[p.lesao ?? 'sem_lesao'] ?? 'nenhuma',
        raquete_atual: (p.raquete_atual && p.raquete_atual !== 'nao_tenho' && p.raquete_atual !== 'nao_sei')
          ? p.raquete_atual : undefined,
        arquetipo_pro: p.arquetipo_pro ?? [],
      }
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erro desconhecido')
      }
      setResultado(await res.json())
      setEstado('resultado')
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao buscar recomendação')
      setEstado('quiz')
    }
  }

  if (estado === 'loading') return <TelaLoading />
  if (estado === 'resultado' && resultado) {
    return <TelaResultado resultado={resultado} perfil={perfil} onReiniciar={() => {
      setPerfil({}); setStepIndex(0); setEstado('quiz'); setResultado(null)
    }} />
  }

  const animClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
  const stepNum = getStepNum(currentStep)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-creme)', display: 'flex', flexDirection: 'column' }}>

      {/* Header premium com referências de torneios */}
      <header style={{
        borderBottom: '1px solid var(--color-creme-dark)',
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--color-branco)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>🎾</span>
          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-cinza)' }}>
            Raquete Ideal
          </span>
        </div>
        {/* Torneios como badges sutis */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {TORNEIOS.map((t, i) => (
            <span key={t} style={{
              fontSize: '0.6875rem', fontWeight: 500,
              padding: '3px 8px', borderRadius: 'var(--radius-full)',
              background: i === 0 ? '#E8622A22' : i === 1 ? '#4A7C5922' : '#2C2C2C11',
              color: i === 0 ? 'var(--color-laranja-dark)' : i === 1 ? 'var(--color-saibro-dark)' : 'var(--color-cinza-medium)',
            }}>
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* Conteúdo do quiz */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 16px 24px' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Progresso */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            {stepIndex > 0 ? (
              <button onClick={voltar} style={{
                background: 'none', border: 'none', color: 'var(--color-cinza-medium)',
                fontSize: '0.875rem', cursor: 'pointer', padding: '4px 0',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                ← Voltar
              </button>
            ) : <div />}
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-cinza-medium)' }}>
              {stepNum} de {totalVisible}
            </span>
          </div>

          {/* Barra de progresso */}
          <div style={{ height: '3px', width: '100%', borderRadius: '99px', background: 'var(--color-creme-dark)', marginBottom: '20px' }}>
            <div style={{
              height: '100%', borderRadius: '99px',
              background: 'linear-gradient(90deg, var(--color-saibro), var(--color-saibro-light))',
              width: `${(stepNum / totalVisible) * 100}%`,
              transition: 'width 400ms ease',
            }} />
          </div>

          {/* Erro */}
          {erro && (
            <div style={{
              marginBottom: '12px', padding: '10px 14px', borderRadius: 'var(--radius-md)',
              background: '#FEE2E2', color: '#DC2626', fontSize: '0.875rem',
            }}>
              {erro} — tente novamente.
            </div>
          )}

          {/* Step atual */}
          <div key={`${currentStep}-${stepIndex}`} className={animClass}>
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

      {/* Footer com decoração de quadra */}
      <footer style={{
        borderTop: '1px solid var(--color-creme-dark)',
        padding: '10px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
        background: 'var(--color-branco)',
      }}>
        {[
          { cor: '#C84B2F', label: 'Saibro' },
          { cor: '#3E7D4E', label: 'Grama' },
          { cor: '#3A6B9E', label: 'Piso duro' },
        ].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: s.cor }} />
            <span style={{ fontSize: '0.6875rem', color: 'var(--color-cinza-light)', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </footer>
    </div>
  )
}
