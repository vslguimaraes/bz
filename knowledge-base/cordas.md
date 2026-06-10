# cordas.md
# Base de Conhecimento — Cordas de Tênis
# Versão 1.0 — Para validação com especialista

---

## INSTRUÇÕES PARA O MODELO

Este arquivo define as regras de recomendação de cordas. É consultado após a raquete ser selecionada. A corda complementa a raquete — nunca recomendá-las de forma independente.

---

## SEÇÃO 1 — MATERIAIS

### 1.1 — Synthetic Gut / Nylon Multifilamento

**Para quem:** recreativo, desenvolvendo, qualquer nível com braço sensível
**Características:** confortável, potente, boa durabilidade para o preço
**Tensão recomendada:** 50–60 lbs

| Referência | Destaque |
|-----------|----------|
| Wilson Synthetic Gut | custo-benefício clássico |
| Tecnifibre X-One Biphase | melhor multifilamento do mercado, conforto premium |
| Wilson NXT | multifilamento premium, muito confortável |
| Babolat Origin | alternativa ao X-One, boa potência |
| Prince Premier Control | opção com mais controle no multifilamento |

**Regra:** Se jogador tem lesão no cotovelo, ombro ou punho → sempre multifilamento ou gut natural. Nunca polyester full bed.

---

### 1.2 — Polyester (Monofilamento)

**Para quem:** competitivo com técnica consolidada, quebra strings com frequência
**Características:** controle, spin, durabilidade. Mais rígido, menos confortável
**Tensão recomendada:** 44–52 lbs (SEMPRE abaixo do nylon — rigidez maior exige tensão menor para proteger o braço)

```
REGRA CRÍTICA: Poly nunca acima de 54 lbs.
Poly morto = principal causa de lesão em tenistas amadores.
Recomendar reencordamento a cada 20–30h de jogo, mesmo sem quebrar.
```

| Referência | Destaque |
|-----------|----------|
| Luxilon ALU Power 16L | referência do mercado, usado por Sinner |
| Babolat RPM Blast 16L | spin máximo, usado por Nadal e Alcaraz |
| Solinco Hyper-G 16L | spin + controle, muito popular no circuito |
| Tecnifibre Black Code | controle + conforto para poly |
| Wilson Revolve | poly mais confortável para iniciantes no poly |
| Kirschbaum Max Power | custo-benefício no poly |

---

### 1.3 — Hybrid (Gut/Poly ou Nylon/Poly)

**Para quem:** intermediário avançado, quer controle do poly com conforto do gut
**Configuração padrão:** Mains (principais) → gut ou multifilamento / Crosses (cruzadas) → polyester
**Tensão:** mains 3–5 lbs acima das crosses

| Referência Main | Referência Cross | Perfil |
|-----------------|-----------------|--------|
| Babolat VS Touch | Babolat RPM Blast | máximo de tudo — caro |
| Tecnifibre X-One | Luxilon ALU Power | conforto + controle |
| Wilson NXT | Solinco Hyper-G | equilibrado |

---

### 1.4 — Natural Gut

**Para quem:** braço sensível em qualquer nível, jogador que prioriza conforto e tensão estável
**Características:** melhor sensação, melhor manutenção de tensão, mais caro, sensível a umidade
**Tensão recomendada:** 50–60 lbs

| Referência | Destaque |
|-----------|----------|
| Babolat VS Touch | referência máxima do mercado |
| Wilson Natural Gut | alternativa confiável |
| Luxilon Natural Gut | menos popular mas boa qualidade |

**Nota:** não recomendado para quem joga ao ar livre com chuva ou em regiões muito úmidas.

---

## SEÇÃO 2 — GAUGE (ESPESSURA)

| Gauge | Espessura | Para quem |
|-------|-----------|-----------|
| 15 (1.40mm) | Mais grossa | Quebra muito strings, quer máxima durabilidade |
| 16 (1.30mm) | Média-grossa | A maioria dos jogadores — equilíbrio geral |
| 16L (1.25mm) | Média | Competitivo, quer mais spin e sensação |
| 17 (1.20mm) | Fina | Avançado, máximo feel e spin, quebra mais rápido |

**Regra geral:** começar em 16. Só subir para 16L ou 17 quando o nível técnico justificar.

---

## SEÇÃO 3 — TENSÃO POR PERFIL

```
Regra base: string mais elástica (gut/nylon) → tensão mais alta
            string mais rígida (poly) → tensão mais baixa

SE material = nylon/multifilamento
  ENTÃO tensão recomendada: 52–58 lbs

SE material = polyester
  ENTÃO tensão recomendada: 44–52 lbs
  NUNCA acima de 54 lbs

SE braço_sensivel = sim (qualquer material)
  ENTÃO reduzir 3–5 lbs da tensão base recomendada

SE estilo = topspin_pesado E material = poly
  ENTÃO tensão na faixa baixa do poly (44–48 lbs)
  RAZÃO: tensão baixa = mais movimento das cordas = mais spin

SE frequencia_jogo = mais_de_20h_mes E material = poly
  ENTÃO recomendar reencordamento a cada 20h
  RAZÃO: poly perde tensão sem quebrar — "corda morta" causa lesão
```

---

## SEÇÃO 4 — RECOMENDAÇÃO POR PERFIL CRUZADO

| Perfil | Material | Gauge | Tensão | Referências |
|--------|----------|-------|--------|-------------|
| Recreativo / Estreante | Nylon / Synthetic Gut | 16 | 54–58 lbs | Wilson Synthetic Gut, Tecnifibre X-One |
| Desenvolvendo sem lesão | Nylon / Multifilamento | 16 | 52–56 lbs | Tecnifibre X-One, Wilson NXT |
| Desenvolvendo com braço sensível | Natural Gut ou Multifilamento soft | 16 | 50–54 lbs | Babolat VS Touch, Wilson NXT |
| Competitivo intermediário | Hybrid ou Poly suave | 16L | 48–52 lbs | Wilson NXT + Solinco Hyper-G, Wilson Revolve |
| Competitivo avançado (topspin) | Poly | 16L | 44–50 lbs | Babolat RPM Blast, Solinco Hyper-G |
| Competitivo avançado (flat) | Poly ou Hybrid | 16 ou 16L | 48–52 lbs | Luxilon ALU Power, Tecnifibre Black Code |
| Qualquer nível com lesão | Multifilamento ou Natural Gut | 16 | 50–54 lbs | Tecnifibre X-One, Babolat VS Touch |
| Base forte / Retorno | Hybrid ou Multifilamento | 16 | 50–56 lbs | Tecnifibre X-One, Wilson NXT |
