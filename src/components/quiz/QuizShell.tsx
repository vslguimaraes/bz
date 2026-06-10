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

// Sequência de steps baseada no histórico
function getSteps(historico?: string): string[] {
  if (historico === 'recreativo') {
    return ['historico', 'tecnico', 'mobilidade', 'lesao', 'raquete', 'frequencia']
  }
  return ['historico', 'tecnico', 'estilo', 'mobilidade', 'lesao', 'raquete', 'frequencia']
}

// Número do step visível (sempre "X de 7")
function getStepLabel(step: string, steps: string[]): number {
  const map: Record<string, number> = {
    historico: 1, tecnico: 2, estilo: 3, mobilidade: 4, lesao: 5, raquete: 6, frequencia: 7,
  }
  // recreativo pula estilo, mas ainda mostra "de 6"
  return map[step] ?? steps.indexOf(step) + 1
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
    const novoIndex = stepIndex + 1

    if (novoIndex >= novosSteps.length) {
      // Último step — enviar para API
      enviarPerfil(novoPerfil)
    } else {
      setStepIndex(novoIndex)
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
      // Mapear valores do quiz para o formato da API
      const lesaoMap: Record<string, string> = {
        sem_lesao: 'nenhuma',
        epicondilite: 'cotovelo',
        ombro: 'ombro',
        vibracoes_gerais: 'vibracao',
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

      const data = await res.json()
      setResultado(data)
      setEstado('resultado')
    } catch (e: any) {
      setErro(e.message ?? 'Erro ao buscar recomendação')
      setEstado('quiz')
    }
  }

  if (estado === 'loading') return <TelaLoading />
  if (estado === 'resultado' && resultado) {
    return <TelaResultado resultado={resultado} perfil={perfil} onReiniciar={() => {
      setPerfil({})
      setStepIndex(0)
      setEstado('quiz')
      setResultado(null)
    }} />
  }

  const animClass = direction === 'forward' ? 'animate-slide-in-right' : 'animate-slide-in-left'
  const stepNum = getStepLabel(currentStep, steps)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
         style={{ background: 'var(--color-creme)' }}>

      {/* Header com progresso */}
      <div className="w-full mb-6" style={{ maxWidth: 'var(--max-width-quiz)' }}>
        <div className="flex items-center justify-between mb-3">
          {stepIndex > 0 ? (
            <button onClick={voltar} className="flex items-center gap-1 text-sm"
                    style={{ color: 'var(--color-cinza-medium)', background: 'none', border: 'none', cursor: 'pointer' }}>
              ← Voltar
            </button>
          ) : <div />}
          <span className="text-sm font-medium" style={{ color: 'var(--color-cinza-medium)' }}>
            {stepNum} de {totalVisible}
          </span>
        </div>

        {/* Barra de progresso */}
        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'var(--color-creme-dark)' }}>
          <div className="h-full rounded-full transition-all duration-500"
               style={{
                 background: 'var(--color-saibro)',
                 width: `${(stepNum / totalVisible) * 100}%`,
               }} />
        </div>
      </div>

      {/* Card do quiz */}
      <div key={`${currentStep}-${stepIndex}`} className={`w-full ${animClass}`}
           style={{ maxWidth: 'var(--max-width-quiz)' }}>

        {erro && (
          <div className="mb-4 p-3 rounded-xl text-sm text-center"
               style={{ background: '#FEE2E2', color: '#DC2626', borderRadius: 'var(--radius-md)' }}>
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
  )
}
