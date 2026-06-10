import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { PerfilJogador } from '@/lib/types'
import { recomendar } from '@/lib/recommender'

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const perfil: PerfilJogador = await req.json()

    // Validação mínima
    const required: (keyof PerfilJogador)[] = ['historico', 'tecnico', 'estilo', 'mobilidade', 'lesao']
    for (const field of required) {
      if (!perfil[field]) {
        return NextResponse.json({ error: `Campo obrigatório: ${field}` }, { status: 400 })
      }
    }

    const resultado = await recomendar(perfil, claude)
    return NextResponse.json(resultado)
  } catch (err) {
    console.error('Erro na recomendação:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
