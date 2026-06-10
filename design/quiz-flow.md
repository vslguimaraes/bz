# Quiz Flow — Especificação das 7 Telas

Tennis Recommender | Versão 1.0 | Junho 2026

---

## Princípios do quiz

- **1 pergunta por tela** — sem sobrecarga cognitiva
- **Imagem + label** — nenhum campo de texto aberto (exceto raquete atual, com opções de escape)
- **Máximo 4 opções** + escape ("Prefiro não dizer" / "Pular")
- **Contador visível** — "Pergunta X de 7" no topo
- **Ramificação silenciosa** — o usuário não sente que o quiz muda, mas a tela de estilo se adapta
- **Linguagem de vestiário** — direta, sem jargão técnico

---

## Tela 1 — Histórico

**Pergunta:**
> "Qual das situações mais te representa hoje?"

**Por que essa pergunta vem primeiro:** define o contexto emocional e nível de engajamento antes de qualquer julgamento técnico. A pessoa se identifica sem se sentir avaliada.

| # | Valor | Label | Descrição da imagem |
|---|-------|-------|---------------------|
| 1 | `recreativo` | **Jogo pelo prazer** | Dois amigos na quadra, sorrindo, roupas descontraídas, fim de tarde |
| 2 | `desenvolvendo` | **Tô me desenvolvendo** | Aluno com professor em quadra, postura de foco, bola no ar |
| 3 | `competitivo` | **Compito em torneios** | Jogador em posição de golpe, fundo preto dramático, expressão concentrada |
| 4 | `base_forte_retorno` | **Voltando ao tênis** | Pessoa adulta em quadra vazia segurando a raquete com nostalgia |
| — | (escape) | *Prefiro não dizer* | — |

**Lógica de ramificação:** o valor selecionado aqui determina as opções exibidas na Tela 3 (estilo de jogo).
- `recreativo` → Tela 3 é **pulada** automaticamente (aplicar `flat_basico` como default silencioso)
- demais → Tela 3 exibe opções correspondentes ao grupo

---

## Tela 2 — Nível técnico

**Pergunta:**
> "Como você descreveria seu jogo hoje?"

**Por que aqui:** logo após o histórico, ainda na fase de autoavaliação. Perguntamos sobre o que o jogador *faz*, não o que ele *é*.

| # | Valor | Label | Descrição da imagem |
|---|-------|-------|---------------------|
| 1 | `basico` | **Forehand e backhand diretos** | Sequência de fotos mostrando um golpe limpo mas sem spin visível |
| 2 | `em_construcao` | **Começo a usar efeito no forehand** | Raquete em ângulo de topspin no momento do impacto |
| 3 | `intermediario` | **Topspin consistente, slice funcional** | Jogador em quadra de saibro em posição de slide com bola alta |
| 4 | `avancado` | **Vario ritmo e altura intencionalmente** | Jogador em rede com voleio, postura agressiva |
| — | (escape) | *Não sei classificar* | — |

**Nota de UX:** as labels usam linguagem de ação ("começo a", "vario") — o jogador reconhece o que *faz*, não precisa se rotular.

---

## Tela 3 — Estilo de jogo

*Esta tela é pulada automaticamente se Tela 1 = `recreativo`.*

**Pergunta:**
> "Como você mais gosta de jogar?"

### Versão A — Para `desenvolvendo` (3 opções)

| # | Valor | Label | Descrição da imagem |
|---|-------|-------|---------------------|
| 1 | `topspin_fundo` | **Do fundo, girando a bola** | Visão de quadra de saibro, jogador em pose de forehand alto |
| 2 | `flat_basico` | **Bola chapada, direto ao ponto** | Quadra dura, jogador com raquete horizontal, golpe limpo |
| 3 | `descobrindo` | **Ainda estou descobrindo** | Ponto de interrogação estilizado sobre quadra — ilustração divertida |
| — | (escape) | *Pular* | — |

### Versão B — Para `competitivo` e `base_forte_retorno` (5 opções)

*Grid de 5 opções: linha de 3 + linha de 2 centralizados.*

| # | Valor | Label | Descrição da imagem |
|---|-------|-------|---------------------|
| 1 | `topspin_pesado` | **Topspin pesado, crio ângulos** | Bola com rastro de spin exagerado (ilustração), jogador em Roland Garros |
| 2 | `serve_flat_agressivo` | **Saque e bola chapada agressiva** | Silhueta de saque contra o sol, bola rasgando o ar |
| 3 | `all_court` | **Adapto meu jogo à situação** | Jogador que acabou de dar uma volta olímpica em quadra de grama |
| 4 | `defensivo_contador` | **Defendo e espero o erro** | Jogador em posição defensiva, braços abertos, em recuperação |
| 5 | `net_rusher` | **Busco a rede sempre que posso** | Voleio vencedor, bola na faixa, net rusher em ação |
| — | (escape) | *Prefiro não dizer* | — |

---

## Tela 4 — Físico e mobilidade

**Pergunta:**
> "Como você descreveria sua movimentação em quadra?"

| # | Valor | Label | Descrição da imagem |
|---|-------|-------|---------------------|
| 1 | `alta_mobilidade` | **Me movo bem, deslizo e corro** | Jogador em sprint lateral em quadra de saibro, terra ao redor |
| 2 | `mobilidade_moderada` | **Razoável — cobro bem sem explosão** | Jogador se movendo de forma constante, posição sólida de espera |
| 3 | `mobilidade_reduzida` | **Economizo movimento, prefiro posição** | Jogador em posição central confortável, quadra de piso duro |
| — | (escape) | *Prefiro não dizer* | — |

**Nota:** a opção `restricao_fisica` não aparece aqui — será capturada na Tela 5 (lesão). Isso evita que o jogador responda duas vezes sobre o mesmo problema.

---

## Tela 5 — Lesão ou sensibilidade

**Pergunta:**
> "Você tem alguma lesão ou sensibilidade no braço ou ombro?"

**Por que separada:** lesão tem **veto absoluto** no algoritmo. Merece tela própria para dar peso ao dado.

| # | Valor | Label | Descrição da imagem |
|---|-------|-------|---------------------|
| 1 | `sem_lesao` | **Não, estou bem** | Silhueta de braço saudável, sinal de check verde suave |
| 2 | `epicondilite` | **Tenho cotovelo de tenista** | Ilustração anatômica simplificada do cotovelo com destaque leve |
| 3 | `ombro` | **Tenho problema no ombro** | Silhueta com destaque no ombro |
| 4 | `vibracoes_gerais` | **Sinto vibração / formigamento** | Raquete vibrando (ilustração), mão em desconforto |
| — | (escape) | *Prefiro não dizer* | — |

**Lógica silenciosa:** qualquer valor diferente de `sem_lesao` ativa a restrição dura de flexibilidade mínima (`flex_ra <= 65`) no algoritmo de recomendação.

---

## Tela 6 — Raquete atual

**Pergunta:**
> "Qual raquete você usa hoje?"

**Por que aqui:** com o perfil quase completo, a raquete atual serve de âncora para a explicação da recomendação ("essa raquete é mais leve que a sua atual", etc.)

**Esta é a única tela com input textual**, mas oferece saídas rápidas para quem não sabe ou não tem.

**Opções primárias (chips clicáveis):**

| # | Valor | Label |
|---|-------|-------|
| 1 | `nao_tenho` | **Não tenho raquete** |
| 2 | `nao_sei` | **Tenho mas não sei o modelo** |

**Input secundário:**
- Campo de texto livre: placeholder "Ex: Wilson Blade 98, Babolat Pure Drive..."
- Autocomplete básico com os 170 modelos do catálogo
- Ao digitar 3+ caracteres, mostrar até 4 sugestões dropdown
- Border: 2px solid creme-dark → saibro no focus
- Border-radius: var(--radius-md)

**Escape:**
- Link abaixo do input: "Pular esta pergunta →" (cinza-medium, sem destaque)

**UX note:** se usuário seleciona chip ("Não tenho" / "Não sei"), ocultar input via animation e avançar automaticamente após 200ms.

---

## Tela 7 — Frequência de jogo

**Pergunta:**
> "Com que frequência você joga tênis?"

**Por que a última:** fecha o perfil com dado de intensidade. Influencia recomendação de durabilidade e cordas.

| # | Valor | Label | Descrição da imagem |
|---|-------|-------|---------------------|
| 1 | `poucos_meses` | **Vez ou outra, menos de 1x/semana** | Calendário com poucas marcações, raquete encostada na parede |
| 2 | `semanal` | **1 a 2x por semana** | Calendário com 1–2 dias marcados, quadra ao fundo |
| 3 | `frequente` | **3 a 4x por semana** | Bolsa de tênis aberta com raquete e latas de bola |
| 4 | `intenso` | **Quase todo dia** | Raquete com cordas desgastadas visíveis, sinal de uso intenso |
| — | (escape) | *Prefiro não dizer* | — |

**Após esta tela:** botão "Ver minha recomendação →" (CTAButton lg, full-width, verde saibro).

---

## Fluxo completo

```
Tela 1: Histórico
    │
    ├── recreativo ──────────────────────────► Tela 4 (pula estilo)
    │
    ├── desenvolvendo ──► Tela 2 ──► Tela 3A ──► Tela 4
    │
    ├── competitivo ────► Tela 2 ──► Tela 3B ──► Tela 4
    │
    └── base_forte_retorno ─► Tela 2 ──► Tela 3B ──► (sub-pergunta mudança?) ──► Tela 4
                                                              │
                                                         sim_mudou: captura novo estilo
                                                         nao_mesmo: mantém selecionado

Tela 4: Mobilidade
    │
    └──► Tela 5: Lesão
              │
              └──► Tela 6: Raquete atual
                        │
                        └──► Tela 7: Frequência
                                  │
                                  └──► "Ver minha recomendação →"
```

**Número real de telas:**
- `recreativo`: 6 telas (pula Tela 3)
- `desenvolvendo`: 7 telas
- `competitivo`: 7 telas
- `base_forte_retorno` com mudança de estilo: 8 telas (sub-pergunta adicional)

O contador exibe sempre "X de 7" — a sub-pergunta de `base_forte_retorno` não incrementa o contador para não confundir.

---

## Estados de transição entre telas

**Animação padrão:**
- Saída: `translateX(-24px) + opacity(0)`, 200ms ease-in
- Entrada próxima tela: `translateX(24px) → 0 + opacity(0 → 1)`, 300ms ease-out
- Overlap: entrada começa 50ms depois da saída

**Voltar (botão back discreto, canto superior esquerdo):**
- Seta ← + "Voltar", cinza-medium, 14px
- Animação invertida (slide da esquerda)
- Estado do formulário preservado — seleção anterior mantida

**Seleção automática de avanço:**
- Ao tocar em QuizOption (exceto Tela 6): destaque visual imediato (150ms), avanço automático após 250ms
- Isso evita botão "Próxima" desnecessário em telas de seleção única
- Exceção: Tela 6 (input de texto) — avançar apenas por botão explícito "Confirmar"
