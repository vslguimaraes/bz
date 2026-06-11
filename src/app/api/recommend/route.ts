import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { PerfilJogador } from '@/lib/types'
import { recomendar } from '@/lib/recommender'

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Rate limiter: 5 recomendações por IP a cada 60 minutos
// Configurado apenas se as env vars do Upstash existirem
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, '60 m'),
        analytics: true,
        prefix: 'raquete_ideal',
      })
    : null

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'
  )
}

export async function POST(req: NextRequest) {
  // Rate limiting
  if (ratelimit) {
    const ip = getIp(req)
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      const retryAfterSec = Math.ceil((reset - Date.now()) / 1000)
      return NextResponse.json(
        {
          error: `Muitas tentativas. Aguarde ${Math.ceil(retryAfterSec / 60)} minuto(s) e tente novamente.`,
          retryAfter: retryAfterSec,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSec),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': String(remaining),
            'X-RateLimit-Reset': String(reset),
          },
        }
      )
    }
  }

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
