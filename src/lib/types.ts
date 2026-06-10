// Perfil do jogador coletado pelo quiz
export type Historico = 'recreativo' | 'desenvolvendo' | 'competitivo' | 'base_forte_retorno'
export type Tecnico = 'basico' | 'em_construcao' | 'intermediario' | 'completo' | 'avancado'
export type Estilo = 'topspin_pesado' | 'serve_flat_agressivo' | 'all_court' | 'defensivo_contador' | 'net_rusher' | 'topspin_fundo' | 'flat_basico' | 'descobrindo'
export type Mobilidade = 'alta_mobilidade' | 'mobilidade_moderada' | 'mobilidade_reduzida' | 'restricao_fisica'
export type Lesao = 'cotovelo' | 'ombro' | 'punho' | 'nenhuma'

export interface PerfilJogador {
  historico: Historico
  tecnico: Tecnico
  estilo: Estilo
  mobilidade: Mobilidade
  lesao: Lesao
  raquete_atual?: string
  horas_mes?: number
  arquetipo_pro?: string
}

// Raquete do catálogo
export interface Raquete {
  id: string
  pcode_twu: string
  marca: string
  modelo: string
  linha: string
  headsize_sqin: number
  comprimento_in: number
  peso_g: number
  balance_pts_hl: number
  swingweight_kgcm2: number
  twistweight_kgcm2: number
  flex_ra: number
  frequencia_vibracao_hz: number
  padrao_cordas: string
  perfil_ideal: string[]
  estilo_ideal: string[]
  nao_recomendada_para: string[]
  arquetipo_pro: string[]
  nota_especialista: string
  disponivel_br: boolean
  lojas_br: { prospin: string; amazon_br: string; netshoes: string }
  link_tw: string
}

// Resposta da recomendação
export interface OpcaoRecomendada {
  raquete: Raquete
  label: string
  justificativa: string
  corda_sugerida: string
  grip_sugerido: string
  links: { loja: string; url: string }[]
}

export interface RecomendacaoResponse {
  resumo_perfil: string
  opcoes: [OpcaoRecomendada, OpcaoRecomendada, OpcaoRecomendada]
  pergunta_followup: string
}
