/**
 * Motor de recomendação de raquetes.
 *
 * Fluxo:
 * 1. Carrega catálogo (catalogo_completo.json)
 * 2. Aplica regras de eliminação duras (lesão, nível, mobilidade) — puro TypeScript
 * 3. Aplica ranking por estilo + arquétipo — puro TypeScript
 * 4. Passa TOP-N candidatas + knowledge base para Claude formatar as 3 opções
 */

import path from 'path'
import fs from 'fs'
import { PerfilJogador, Raquete } from './types'

// ─── Carrega catálogo uma vez (server-side, build time ou cold start) ───────

let _catalog: Raquete[] | null = null

function getCatalog(): Raquete[] {
  if (_catalog) return _catalog
  const filePath = path.join(process.cwd(), 'knowledge-base', 'catalogo_completo.json')
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  _catalog = raw.raquetes as Raquete[]
  return _catalog
}

function getKnowledgeFile(name: string): string {
  const filePath = path.join(process.cwd(), 'knowledge-base', name)
  return fs.readFileSync(filePath, 'utf-8')
}

// ─── Regras de eliminação (Seção 2 do raquete.md) ───────────────────────────

export function aplicarEliminacoes(raquetes: Raquete[], perfil: PerfilJogador): Raquete[] {
  return raquetes.filter(r => {
    const nao = r.nao_recomendada_para ?? []

    // 2.1 Lesão — veto absoluto
    if (perfil.lesao !== 'nenhuma') {
      if (nao.includes(`lesao_${perfil.lesao}`)) return false
      // Critério direto: flex > 65 ou vibração > 165
      if ((r.flex_ra ?? 0) > 65) return false
      if ((r.frequencia_vibracao_hz ?? 0) > 165) return false
    }

    // 2.2 Nível técnico
    if (nao.includes(perfil.tecnico)) return false

    // 2.3 Mobilidade
    if (nao.includes(perfil.mobilidade)) return false

    // Combinação recreativo + mobilidade_reduzida
    if (perfil.historico === 'recreativo' && perfil.mobilidade === 'mobilidade_reduzida') {
      if ((r.peso_g ?? 0) > 285) return false
      if ((r.headsize_sqin ?? 0) < 102) return false
      if ((r.swingweight_kgcm2 ?? 0) > 300) return false
    }

    return true
  })
}

// ─── Ranking por estilo (Seção 3 do raquete.md) ─────────────────────────────

type ScoredRaquete = { raquete: Raquete; score: number }

export function rankearPorPerfil(candidatas: Raquete[], perfil: PerfilJogador): Raquete[] {
  const scored: ScoredRaquete[] = candidatas.map(r => {
    let score = 0
    const sw     = r.swingweight_kgcm2 ?? 0
    const peso   = r.peso_g ?? 0
    const flex   = r.flex_ra ?? 0
    const hs     = r.headsize_sqin ?? 0
    const twt    = r.twistweight_kgcm2 ?? 0
    const padrao = r.padrao_cordas ?? ''

    // Match de perfil
    if (r.estilo_ideal?.includes(perfil.estilo)) score += 30
    if (r.perfil_ideal?.includes(perfil.tecnico)) score += 20
    if (perfil.arquetipo_pro && r.arquetipo_pro?.includes(perfil.arquetipo_pro)) score += 15

    // Bônus por specs alinhados ao estilo
    if (perfil.estilo === 'topspin_pesado') {
      if (padrao === '16x19')      score += 8
      if (hs >= 98 && hs <= 102)  score += 5
      if (sw >= 315)               score += 5
    } else if (perfil.estilo === 'serve_flat_agressivo') {
      if (padrao === '18x20')      score += 10
      if (peso >= 300)             score += 5
    } else if (perfil.estilo === 'net_rusher') {
      if (twt >= 14)               score += 10
      if (peso >= 305)             score += 5
    } else if (perfil.estilo === 'defensivo_contador') {
      if (flex <= 63)              score += 8
      if (hs >= 100)               score += 4
    } else if (perfil.estilo === 'flat_basico' || perfil.estilo === 'descobrindo') {
      if (hs >= 100)               score += 6
      if (sw <= 315)               score += 4
    } else if (perfil.estilo === 'all_court') {
      if (hs >= 98 && hs <= 102)  score += 5
      if (sw >= 310 && sw <= 325) score += 5
    }

    // Frequência de jogo
    const horas = perfil.horas_mes ?? 0
    if (horas >= 20 && peso >= 295 && sw >= 310) score += 8
    if (horas <= 6 && peso <= 290)               score += 6

    // Mobilidade
    if (perfil.mobilidade === 'mobilidade_reduzida' && peso <= 280) score += 10
    if (perfil.mobilidade === 'alta_mobilidade' && sw >= 320)       score += 4

    return { raquete: r, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.raquete)
}

// ─── Diversificação das 3 opções ─────────────────────────────────────────────
// Garante que as 3 opções não sejam da mesma linha/marca

export function selecionarTresOpcoes(ranked: Raquete[]): [Raquete, Raquete, Raquete] | null {
  if (ranked.length < 3) return null

  const opcoes: Raquete[] = []
  const linhasUsadas = new Set<string>()
  const marcasUsadas = new Set<string>()

  for (const r of ranked) {
    if (opcoes.length === 0) {
      // Opção 1: melhor match absoluto
      opcoes.push(r)
      linhasUsadas.add(r.linha ?? '')
      marcasUsadas.add(r.marca)
      continue
    }

    if (opcoes.length === 1) {
      // Opção 2: diferente linha (alternativa com mais potência ou perfil diferente)
      if (!linhasUsadas.has(r.linha ?? '')) {
        opcoes.push(r)
        linhasUsadas.add(r.linha ?? '')
        marcasUsadas.add(r.marca)
      }
      continue
    }

    if (opcoes.length === 2) {
      // Opção 3: diferente linha E preferencialmente diferente marca
      if (!linhasUsadas.has(r.linha ?? '')) {
        opcoes.push(r)
        break
      }
    }
  }

  // Fallback: tenta diversificar por marca se não teve linhas suficientes
  if (opcoes.length < 3) {
    const marcasFb = new Set<string>()
    const opcoesFb: Raquete[] = []
    for (const r of ranked) {
      if (opcoesFb.length === 3) break
      if (!marcasFb.has(r.marca)) {
        opcoesFb.push(r)
        marcasFb.add(r.marca)
      }
    }
    if (opcoesFb.length === 3) return [opcoesFb[0], opcoesFb[1], opcoesFb[2]]
    return [ranked[0], ranked[1], ranked[2]]
  }

  return [opcoes[0], opcoes[1], opcoes[2]]
}

// ─── Monta contexto compacto das candidatas para o Claude ────────────────────

function raqueteParaContexto(r: Raquete): string {
  return [
    `${r.marca} ${r.modelo}`,
    `  headsize: ${r.headsize_sqin} sq in | peso: ${r.peso_g}g | swingweight: ${r.swingweight_kgcm2}`,
    `  flex: ${r.flex_ra} RA | twistweight: ${r.twistweight_kgcm2} | vibração: ${r.frequencia_vibracao_hz} Hz`,
    `  cordas: ${r.padrao_cordas ?? 'n/a'} | estilo_ideal: ${r.estilo_ideal?.join(', ')}`,
    r.nota_especialista ? `  nota: ${r.nota_especialista}` : '',
    `  link_tw: ${r.link_tw ?? ''}`,
  ].filter(Boolean).join('\n')
}

// ─── Função principal ────────────────────────────────────────────────────────

export interface RecomendacaoInput {
  perfil: PerfilJogador
}

export interface RecomendacaoResult {
  resumo_perfil: string
  opcoes: Array<{
    posicao: 1 | 2 | 3
    label: string
    raquete: { marca: string; modelo: string; link_tw: string }
    justificativa: string
    corda_sugerida: string
    grip_sugerido: string
  }>
  pergunta_followup: string
  debug: {
    total_catalogo: number
    apos_eliminacao: number
    candidatas_enviadas: number
  }
}

export async function recomendar(
  perfil: PerfilJogador,
  claudeClient: import('@anthropic-ai/sdk').default
): Promise<RecomendacaoResult> {
  const catalogo = getCatalog()

  // 1. Eliminação
  const aposEliminacao = aplicarEliminacoes(catalogo, perfil)

  // 2. Ranking
  const ranked = rankearPorPerfil(aposEliminacao, perfil)

  // 3. Seleciona top 3 diversificadas (passa top 12 para o Claude escolher)
  const top12 = ranked.slice(0, 12)
  const selecao = selecionarTresOpcoes(ranked)

  if (!selecao || ranked.length < 3) {
    throw new Error(`Catálogo insuficiente após eliminações: ${aposEliminacao.length} raquetes`)
  }

  // 4. Monta system prompt com knowledge base
  const raqueteMd = getKnowledgeFile('raquete.md')
  const cordasMd = getKnowledgeFile('cordas.md')
  const gripMd = getKnowledgeFile('grip.md')
  const apresentacaoMd = getKnowledgeFile('apresentacao.md')

  const systemPrompt = `Você é um consultor especialista em equipamentos de tênis.
Siga estritamente as regras dos arquivos de conhecimento abaixo para formatar sua resposta.

${raqueteMd}

---

${cordasMd}

---

${gripMd}

---

${apresentacaoMd}`

  // 5. Monta prompt do usuário
  const candidatasTexto = selecao.map((r, i) =>
    `OPÇÃO ${i + 1}:\n${raqueteParaContexto(r)}`
  ).join('\n\n')

  const perfilTexto = JSON.stringify(perfil, null, 2)

  const userPrompt = `Perfil do jogador:
${perfilTexto}

As 3 raquetes pré-selecionadas pelo motor de recomendação para este perfil são:

${candidatasTexto}

Com base no perfil e nas regras dos arquivos de conhecimento, gere a recomendação final em JSON com esta estrutura exata:
{
  "resumo_perfil": "string — 1 frase resumindo o perfil em linguagem de quadra",
  "opcoes": [
    {
      "posicao": 1,
      "label": "Nossa principal recomendação",
      "raquete": { "marca": "...", "modelo": "...", "link_tw": "..." },
      "justificativa": "string — 2 linhas máximo, linguagem de quadra, sem jargão técnico",
      "corda_sugerida": "string — nome da corda + tensão + 1 linha de benefício",
      "grip_sugerido": "string — L[X], com dica de overgrip se relevante"
    },
    { "posicao": 2, "label": "...", ... },
    { "posicao": 3, "label": "...", ... }
  ],
  "pergunta_followup": "string — 1 pergunta para abrir conversa sobre as opções"
}

Responda APENAS com o JSON, sem markdown, sem explicação.`

  // 6. Chama Claude
  const message = await claudeClient.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt,
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
  // Claude às vezes envolve o JSON em markdown code fences — remover antes de parsear
  const cleaned = responseText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  const result = JSON.parse(cleaned) as RecomendacaoResult

  return {
    ...result,
    debug: {
      total_catalogo: catalogo.length,
      apos_eliminacao: aposEliminacao.length,
      candidatas_enviadas: selecao.length,
    },
  }
}
