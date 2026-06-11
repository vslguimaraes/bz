# Regras de Negócio — Links de Recomendação

## Prioridade de links por recomendação

Cada raquete recomendada deve ter um link de compra seguindo esta ordem de prioridade:

### 1º — ProSpin Brasil (sempre primário)
URL única de catálogo: https://www.prospin.com.br/raquetes/tenis?product_list_limit=72

O usuário é direcionado para navegar e buscar o modelo no catálogo da ProSpin.
Usar para **todas** as marcas como primeiro CTA.

### 2º — Loja oficial da marca no Brasil (fallback 1)
Usar quando o modelo não estiver disponível na ProSpin.

| Marca       | URL oficial BR                                                        | Observação              |
|-------------|-----------------------------------------------------------------------|-------------------------|
| Babolat     | https://www.babolat.com/pt/tenis/raquetes/adultos.html                | Loja oficial BR         |
| Wilson      | https://www.wilsonloja.com.br/collections/raquetes-tenis-esportes     | Loja oficial BR         |
| Head        | https://www.head.com/en/shop-tennis/racquets                          | Sem loja BR, site global|
| Yonex       | *(sem loja BR)* — ir direto ao fallback Tennis Warehouse              | Sem presença BR         |
| Prince      | https://princetennis.com/                                             | Sem loja BR, site global|
| Tecnifibre  | https://tecnifibre.com/pt-br/                                         | Site em português       |
| Dunlop      | https://dunlopsport.com.br/categoria/tenis/                           | Loja oficial BR         |
| Mizuno      | https://www.mizuno.com.br/tenis                                       | Loja oficial BR         |

### 3º — Tennis Warehouse EUA (fallback final)
Usar o campo `link_tw` da tabela `racquetes` quando as opções acima não estiverem disponíveis.
Exemplo: https://www.tennis-warehouse.com/...

---

## Comportamento no frontend (TelaResultado)

- **Botão principal** → sempre ProSpin (mesma URL para todos)
- **Link secundário** → site da marca BR (ou TW se sem loja BR)
- UTM params mantidos em todos os links: `utm_source=raquete-ideal&utm_medium=recommendation&utm_campaign=quiz`

---

## Remoção de afiliação Tennis Warehouse
A conta de afiliado TW foi descartada. Não usar parâmetros de afiliado TW.
UTM parameters são suficientes para rastreamento de cliques.
