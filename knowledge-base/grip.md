# grip.md
# Base de Conhecimento — Grip Size de Raquetes de Tênis
# Versão 1.0 — Para validação com especialista

---

## INSTRUÇÕES PARA O MODELO

Este arquivo define as regras de recomendação de tamanho de grip. É consultado após a raquete e corda serem definidas. O grip correto previne lesão e afeta diretamente o desempenho.

---

## SEÇÃO 1 — TABELA DE TAMANHOS

| Código Europeu | Código US | Circunferência | Descrição |
|---------------|-----------|---------------|-----------|
| L0 | 0 | 4 pol (100–103mm) | Apenas para crianças pequenas |
| L1 | 1 | 4 1/8 pol (103–106mm) | Mãos pequenas, mulheres, topspin extremo |
| L2 | 2 | 4 1/4 pol (106–110mm) | Tamanho padrão feminino, homens com mãos menores |
| L3 | 3 | 4 3/8 pol (110–113mm) | Tamanho padrão masculino — o mais comum |
| L4 | 4 | 4 1/2 pol (113–118mm) | Mãos grandes, dor articular nas mãos |
| L5 | 5 | 4 5/8 pol (118+mm) | Mãos muito grandes — raro |

---

## SEÇÃO 2 — REGRAS DE RECOMENDAÇÃO

### 2.1 — Regra de Ouro

```
Na dúvida entre dois tamanhos → escolher o MENOR
RAZÃO: pode-se aumentar o grip com overgrip (+1 tamanho)
       não se pode diminuir sem trocar o grip base

Overgrip adiciona aproximadamente meio tamanho (1.5mm)
Dois overgrips = aproximadamente um tamanho inteiro
ATENÇÃO: máximo 2 overgrips — mais do que isso achata as quinas do grip
```

### 2.2 — Ponto de Partida por Gênero/Físico

```
SE jogador = mulher
  ENTÃO sugerir L1 ou L2 como default

SE jogador = homem
  ENTÃO sugerir L2 ou L3 como default

SE jogador = homem com mãos muito grandes
  ENTÃO sugerir L3 ou L4
```

### 2.3 — Ajuste por Estilo de Jogo

```
SE estilo = topspin_pesado (qualquer gênero)
  ENTÃO preferir grip MENOR dentro da faixa
  RAZÃO: grip menor = mais liberdade de pulso = facilita pronação no topspin
  EXEMPLO: Nadal usa L1, Świątek usa L1

SE estilo = serve_flat_agressivo OU net_rusher
  ENTÃO pode usar grip MAIOR dentro da faixa
  RAZÃO: grip maior = mais estabilidade em voleios e saques potentes

SE tecnico = basico OU em_construcao
  ENTÃO preferir grip MÉDIO da faixa recomendada
  RAZÃO: evitar extremos enquanto a técnica não está consolidada
```

### 2.4 — Ajuste por Lesão

```
SE lesao = cotovelo OU punho
  ENTÃO NÃO aumentar grip acima do recomendado
  RAZÃO: grip muito pequeno → aperta mais forte → aumenta risco de cotovelo
         grip muito grande → dificulta rotação → também aumenta risco

SE lesao = articulações das mãos / artrite
  ENTÃO sugerir L3 ou L4 (mais espessura = menos pressão nas articulações)
```

---

## SEÇÃO 3 — REFERÊNCIAS DE JOGADORES PRÓ

| Jogador | Grip | Observação |
|---------|------|-----------|
| Rafael Nadal | L1 | Topspin extremo — pulso muito livre |
| Roger Federer | L3 | Jogo clássico e estável |
| Novak Djokovic | L2 | All-court, equilíbrio |
| Carlos Alcaraz | L2 | Topspin + variação |
| Iga Świątek | L1 | Topspin pesado feminino |
| Aryna Sabalenka | L2 | Potência flat |
| Serena Williams | L5 | Mãos grandes + potência máxima |
| Daniil Medvedev | L3 | Flat + controle |

**Nota para o modelo:** usar essas referências apenas para ilustrar ao usuário, nunca para impor. O grip do pró foi calibrado ao longo de anos. O usuário deve testar dentro da faixa recomendada.

---

## SEÇÃO 4 — COMO APRESENTAR AO USUÁRIO

```
Sempre apresentar o grip como sugestão, não como regra absoluta:
"Para o seu perfil, sugerimos começar com grip L[X].
 Se você jogar muito topspin, pode experimentar L[X-1].
 Se preferir mais estabilidade, experimente L[X+1]."

Nunca apresentar mais de dois tamanhos como opção.
Sempre mencionar a possibilidade de overgrip para ajuste fino.
```
