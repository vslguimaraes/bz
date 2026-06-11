import { supabase } from './supabase'

export async function criarSessao(): Promise<string> {
  const { data, error } = await supabase
    .from('sessoes')
    .insert({ canal: 'site', completed: false })
    .select('id')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Falha ao criar sessão')
  return data.id as string
}

export async function registrarEvento(
  sessaoId: string,
  tipo: string,
  payload: object,
): Promise<void> {
  try {
    await supabase.from('eventos').insert({ sessao_id: sessaoId, tipo, payload })
  } catch {
    // fire-and-forget — never block UI
  }
}

export async function completarSessao(
  sessaoId: string,
  perfilJogador: object,
  recomendacoes: object,
): Promise<void> {
  try {
    await supabase
      .from('sessoes')
      .update({ perfil_jogador: perfilJogador, recomendacoes, completed: true })
      .eq('id', sessaoId)
  } catch {
    // fire-and-forget — never block UI
  }
}
