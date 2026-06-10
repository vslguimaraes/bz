# Design System — Especificação de Componentes

Tennis Recommender | Versão 1.0 | Junho 2026

---

## Princípios de design

- **Mobile-first**: quiz projetado para 375px; resultado para até 720px
- **Uma ação por tela**: cada tela do quiz tem um único foco cognitivo
- **Feedback imediato**: toda interação responde em < 150ms
- **Linguagem de quadra**: nunca spec técnico na UI — sempre tradução para o jogador
- **Brasilidade premium**: verde saibro + laranja bola, fundo creme, tipografia com personalidade

---

## 1. QuizCard

### Descrição
Container principal de uma tela do quiz. Ocupa a altura cheia da viewport em mobile.
Sempre exibe: ProgressBar (topo), pergunta (centro), grade de opções (baixo), escape link (rodapé).

### Props
```typescript
interface QuizCardProps {
  step: number          // tela atual (1–7)
  total: number         // total de telas (7)
  question: string      // pergunta em português
  children: ReactNode   // QuizOption cards
  onSkip?: () => void   // callback para "Prefiro não dizer"
  showSkip?: boolean    // default: true
}
```

### Especificação visual

```
┌─────────────────────────────────┐  ← background: var(--color-creme)
│  ProgressBar                    │     padding-top: 16px
│─────────────────────────────────│
│                                 │
│  Pergunta                       │     font: Clash Display 24px/1.35
│  (2–3 linhas máx.)              │     color: var(--color-cinza)
│                                 │     padding: 24px 24px 16px
│─────────────────────────────────│
│  [Grid de QuizOptions]          │     gap: 12px, padding: 0 24px
│                                 │     grid: 2 colunas em mobile
│                                 │          4 colunas se ≤ 4 opções
│                                 │
│─────────────────────────────────│
│  "Prefiro não dizer →"          │     text-sm, color: cinza-medium
│                                 │     padding-bottom: 24px
└─────────────────────────────────┘
```

**Dimensões:**
- Largura máxima: 480px (centralizado em desktop)
- Altura mínima: 100dvh em mobile
- Border-radius: 0 (fullscreen mobile), 20px (desktop modal)
- Sombra em desktop: var(--shadow-lg)

**Animação de entrada:**
- Slide + fade da direita: `translateX(24px) opacity(0)` → `translateX(0) opacity(1)`
- Duração: 300ms, easing: ease-out
- Saída: slide para a esquerda (`translateX(-24px)`)

### Exemplo JSX
```tsx
<QuizCard
  step={2}
  total={7}
  question="Qual é o seu nível de jogo hoje?"
  onSkip={() => handleSkip()}
>
  <QuizOption value="basico" label="Tô começando" image="/images/nivel-basico.jpg" />
  <QuizOption value="intermediario" label="Jogo há alguns anos" image="/images/nivel-inter.jpg" />
  <QuizOption value="competitivo" label="Compito em torneios" image="/images/nivel-comp.jpg" />
</QuizCard>
```

---

## 2. QuizOption

### Descrição
Botão de seleção de opção. Combina imagem evocativa + label curta.
Seleção é imediata — ao tocar, avança para próxima tela após 200ms de feedback visual.

### Props
```typescript
interface QuizOptionProps {
  value: string
  label: string
  description?: string   // sublabel opcional (1 linha)
  image: string          // caminho da imagem (400×300px recomendado)
  selected?: boolean
  disabled?: boolean
  onClick: (value: string) => void
}
```

### Especificação visual

**Estado default:**
```
┌─────────────────┐
│                 │  ← imagem: object-fit cover, altura 120px
│    [imagem]     │     border-radius: 12px 12px 0 0
│                 │
├─────────────────┤
│  Label          │  ← Inter 14px/500, color: cinza
│  (descrição)    │  ← Inter 12px/400, color: cinza-medium (opcional)
└─────────────────┘
```

- Dimensões: min-width 140px, flex 1 (responsivo na grade)
- Background: var(--color-branco)
- Border: 2px solid var(--color-creme-dark)
- Border-radius: var(--radius-md) (12px)
- Padding: 0 0 12px 0 (imagem sem padding, label com 12px horizontal)
- Sombra: var(--shadow-sm)
- Cursor: pointer

**Estado hover:**
- Border: 2px solid var(--color-saibro-light)
- Sombra: var(--shadow-md)
- Transform: translateY(-2px)
- Transição: var(--transition-base) (250ms)
- Imagem: leve brightness(1.05)

**Estado selected:**
- Border: 2px solid var(--color-saibro)
- Background: rgba(74, 124, 89, 0.05)
- Label: color: var(--color-saibro), font-weight: 600
- Ícone de check: círculo preenchido saibro no canto superior direito (20px)
  - Posição: absolute top 8px right 8px
  - Background: var(--color-saibro)
  - Ícone: checkmark branco 12px
- Scale: 1.02 (spring transition)

**Estado disabled:**
- Opacity: 0.4
- Pointer-events: none

### Exemplo JSX
```tsx
<QuizOption
  value="desenvolvendo"
  label="Jogo recreativo"
  description="Fins de semana e academia"
  image="/images/recreativo.jpg"
  selected={selectedValue === 'desenvolvendo'}
  onClick={(v) => setSelectedValue(v)}
/>
```

---

## 3. ProgressBar

### Descrição
Indicador de progresso do quiz. Exibe barra de preenchimento + contador textual.
Fica fixo no topo do QuizCard.

### Props
```typescript
interface ProgressBarProps {
  current: number   // tela atual (1-indexed)
  total: number     // total de telas
  label?: boolean   // exibir "Pergunta X de Y" — default: true
}
```

### Especificação visual

```
Pergunta 3 de 7                       ← Inter 12px, cinza-medium, uppercase tracking-wide

[████████████░░░░░░░░░░░░░░░░░░░░░]  ← barra de progresso
```

**Barra:**
- Container: width 100%, height 4px, background: var(--color-creme-dark), border-radius: full
- Fill: background: var(--color-saibro), border-radius: full
- Largura do fill: `(current / total) * 100%`
- Transição do fill: width 400ms ease — animação suave a cada avanço

**Label:**
- Texto: "Pergunta {current} de {total}"
- Font: Inter 12px, font-weight 500
- Color: var(--color-cinza-medium)
- Letter-spacing: 0.05em
- Text-transform: uppercase
- Margin-bottom: 8px

**Container:**
- Padding: 16px 24px 12px
- Background: var(--color-creme) (mesmo do card)

### Exemplo JSX
```tsx
<ProgressBar current={3} total={7} label={true} />
```

---

## 4. RaqueteCard

### Descrição
Card de resultado para uma raquete recomendada. Exibe nome, tag de posição na recomendação,
specs em linguagem de quadra e botões de compra. Variante `principal` tem destaque visual.

### Props
```typescript
interface RaqueteCardProps {
  posicao: 'principal' | 'alternativa' | 'custo-beneficio'
  marca: string
  modelo: string
  imagemUrl: string
  tagline: string            // 1 frase de contexto — ex: "Ideal pra quem quer gerar mais efeito"
  specs: RaqueteSpec[]       // ver tipo abaixo
  links: AfiliateLink[]      // ver tipo abaixo
}

interface RaqueteSpec {
  icone: string              // emoji ou nome de ícone
  label: string              // ex: "Potência", "Controle", "Conforto"
  valor: string              // ex: "Alta", "Média-alta", "Excelente"
  destaque?: boolean         // negrita o valor
}

interface AfiliateLink {
  loja: 'prospin' | 'amazon' | 'tennis-warehouse' | 'netshoes'
  url: string
  preco?: string             // ex: "R$ 1.299"
  disponivel: boolean
}
```

### Especificação visual

**Variante `principal` (recomendação principal):**
```
┌─────────────────────────────────────────┐
│  ★ RECOMENDAÇÃO PRINCIPAL               │  ← badge topo, bg saibro, texto branco
│─────────────────────────────────────────│     12px bold, padding 6px 16px
│  [imagem raquete]         Marca         │
│  400×200px                Modelo        │  ← Clash Display 22px
│  object-fit contain       Tagline       │  ← Inter 14px, cinza-medium, italic
│─────────────────────────────────────────│
│  Potência    ████████░░   Alta          │
│  Controle    ██████████   Excelente     │  ← specs com barra visual
│  Conforto    ███████░░░   Média-alta    │
│─────────────────────────────────────────│
│  [Comprar na Pró Spin  R$1.299 →]       │  ← AffiliateLinkButton primário
│  [Ver na Amazon BR         →]           │  ← AffiliateLinkButton secundário
└─────────────────────────────────────────┘
```

- Background: var(--color-branco)
- Border: 2px solid var(--color-saibro)
- Border-radius: var(--radius-lg) (20px)
- Sombra: var(--shadow-lg)
- Padding: 0 (imagem flush) → 20px nos conteúdos internos

**Variante `alternativa` e `custo-beneficio`:**
- Border: 2px solid var(--color-creme-dark) (sem verde)
- Sombra: var(--shadow-sm)
- Badge: "ALTERNATIVA" ou "CUSTO-BENEFÍCIO" em background: cinza-light

**Badge de posição:**
```
posicao            | texto                  | bg              | texto color
principal          | ★ RECOMENDAÇÃO PRINCIPAL | saibro         | branco
alternativa        | ALTERNATIVA            | creme-dark      | cinza-medium
custo-beneficio    | MELHOR CUSTO-BENEFÍCIO | laranja-light   | laranja-dark
```

**Barra de specs:**
- Container: grid 3 colunas (label | barra | valor), gap 8px, padding 16px 20px
- Barra: height 6px, border-radius full
  - Background track: creme-dark
  - Fill: saibro-light
  - Largura: mapeada de "Baixa" (20%) → "Alta" (90%)
- Label: Inter 13px, cinza-medium
- Valor: Inter 13px, cinza (bold se destaque)

### Exemplo JSX
```tsx
<RaqueteCard
  posicao="principal"
  marca="Babolat"
  modelo="Pure Aero 2026"
  imagemUrl="/images/raquetes/babolat-pure-aero-2026.png"
  tagline="Feita pra quem gosta de girar a bola e dominar do fundo"
  specs={[
    { icone: '⚡', label: 'Potência', valor: 'Alta', destaque: true },
    { icone: '🎯', label: 'Controle', valor: 'Média-alta' },
    { icone: '🌿', label: 'Conforto', valor: 'Médio' },
  ]}
  links={[
    { loja: 'prospin', url: 'https://prospin.com.br/...', preco: 'R$ 1.299', disponivel: true },
    { loja: 'amazon', url: 'https://amzn.to/...', disponivel: true },
  ]}
/>
```

---

## 5. CTAButton

### Descrição
Botão de ação primária do sistema. Usado para "Ver minha recomendação", "Começar",
"Refazer quiz", etc. Verde saibro com hover laranja — ação principal e confiante.

### Props
```typescript
interface CTAButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string              // se link, usa <a> ou Next Link
  size?: 'sm' | 'md' | 'lg' // default: 'md'
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean        // default: false
  loading?: boolean
  disabled?: boolean
  icon?: ReactNode           // ícone à direita
}
```

### Especificação visual

**Variante `primary` (default):**
- Background: var(--color-saibro)
- Color: var(--color-branco)
- Border: none
- Border-radius: var(--radius-full) (pílula)
- Font: Inter 16px, font-weight 600
- Letter-spacing: 0.01em
- Padding (md): 14px 32px
- Sombra: var(--shadow-md)

**Hover primary:**
- Background: var(--color-laranja) ← troca para laranja (surpresa deliciosa)
- Transform: translateY(-1px)
- Sombra: var(--shadow-lg)
- Transição: var(--transition-base) 250ms

**Active primary:**
- Background: var(--color-laranja-dark)
- Transform: translateY(0)

**Variante `secondary`:**
- Background: transparent
- Border: 2px solid var(--color-saibro)
- Color: var(--color-saibro)
- Hover: background: rgba(74, 124, 89, 0.08)

**Variante `ghost`:**
- Background: transparent
- Color: var(--color-cinza-medium)
- Underline on hover

**Sizes:**
```
sm: padding 10px 20px, font 14px
md: padding 14px 32px, font 16px
lg: padding 18px 40px, font 18px
```

**Estado loading:**
- Spinner de 16px à esquerda do texto (cor branco)
- Texto: "Carregando..."
- Disabled + opacity 0.8

**Estado disabled:**
- Opacity: 0.45
- Cursor: not-allowed

### Exemplo JSX
```tsx
<CTAButton
  size="lg"
  fullWidth
  onClick={handleSubmit}
  icon={<ArrowRightIcon />}
>
  Ver minha recomendação
</CTAButton>
```

---

## 6. AffiliateLinkButton

### Descrição
Botão de link de compra afiliado. Exibe logo da loja, nome, preço (opcional) e seta.
Hierarquia: Pró Spin (primário) → Amazon BR (secundário) → Tennis Warehouse (terciário, importação).

### Props
```typescript
interface AffiliateLinkButtonProps {
  loja: 'prospin' | 'amazon' | 'netshoes' | 'tennis-warehouse'
  url: string
  preco?: string             // "R$ 1.299" — exibir se disponível
  disponivel: boolean        // se false, mostra estado esgotado
  primario?: boolean         // destaque visual — default: false (apenas o primeiro link)
  onClick?: () => void       // callback para analytics PostHog
}
```

### Especificação visual

**Variante primária (primeiro link disponível):**
```
┌────────────────────────────────────────┐
│  [logo Pró Spin]  Comprar na Pró Spin  │  R$ 1.299  →
└────────────────────────────────────────┘
```
- Background: var(--color-saibro)
- Color: branco
- Border-radius: var(--radius-md) 12px
- Padding: 14px 20px
- Font: Inter 15px, 600
- Logo: 24px × 24px, filtro branco (invert se necessário)
- Preço: Inter 15px, 700, float right
- Seta: → 16px, right

**Variante secundária:**
- Background: var(--color-branco)
- Border: 1.5px solid var(--color-creme-dark)
- Color: var(--color-cinza)
- Logo: cor original
- Hover: border-color: var(--color-saibro-light), background: rgba(74,124,89,0.04)

**Estado indisponível:**
- Opacity: 0.5
- Texto: "Esgotado" no lugar do preço
- Cor da seta: cinza-light
- Pointer-events: none

**Hierarquia de exibição:**
1. Pró Spin (sempre mostrar se disponível — foco BR)
2. Amazon BR (segundo link)
3. Netshoes (opcional)
4. Tennis Warehouse (fallback importação — label "Importar dos EUA")

**Label de aviso importação:**
- Quando exibir TW: mostrar tag "Importação — verifique frete/impostos"
- Tag: background laranja-light, color laranja-dark, 11px, border-radius sm

### Exemplo JSX
```tsx
<AffiliateLinkButton
  loja="prospin"
  url="https://prospin.com.br/babolat-pure-aero-2026?ref=tennis-rec-site"
  preco="R$ 1.299"
  disponivel={true}
  primario={true}
  onClick={() => posthog.capture('affiliate_click', { loja: 'prospin', raquete: 'pure-aero-2026' })}
/>

<AffiliateLinkButton
  loja="amazon"
  url="https://amzn.to/xxxxx"
  disponivel={true}
  onClick={() => posthog.capture('affiliate_click', { loja: 'amazon', raquete: 'pure-aero-2026' })}
/>
```

---

## Notas de acessibilidade

- Todos os botões interativos: `focus-visible` com `box-shadow: var(--shadow-focus)` (nunca `outline: none` sem substituto)
- QuizOption: `role="radio"` dentro de `role="radiogroup"`
- ProgressBar: `role="progressbar"` com `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- CTAButton loading: `aria-busy="true"`, `aria-label` descritivo
- Imagens das opções: `alt` descritivo do que representam (não da opção em si)
- RaqueteCard: `<article>` com `aria-label="Recomendação: {modelo}"`
- Contraste mínimo: 4.5:1 em todos os textos sobre background creme

---

## Breakpoints

```
mobile:  < 640px   (quiz fullscreen, 1 coluna)
tablet:  640–1024px (quiz centrado 480px, resultado 2 colunas)
desktop: > 1024px  (quiz modal centrado, resultado 3 cards lado a lado)
```
