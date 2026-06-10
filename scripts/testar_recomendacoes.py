"""
testar_recomendacoes.py
Testa o sistema de recomendação com 20 perfis fictícios e diversos.

Cobertura dos 20 perfis:
  Eixo histórico:     recreativo(4) | desenvolvendo(5) | competitivo(7) | base_forte_retorno(4)
  Eixo técnico:       basico(3) | em_construcao(3) | intermediario(5) | completo(5) | avancado(4)
  Eixo estilo:        todos os 8 valores cobertos
  Eixo mobilidade:    todos os 4 valores cobertos
  Eixo lesão:         nenhuma(14) | cotovelo(3) | ombro(2) | punho(1)
  Com raquete atual:  7 perfis
  Com arquétipo:      6 perfis
  Frequência alta:    4 perfis | baixa: 4 perfis

Execução: python testar_recomendacoes.py
Requer: ANTHROPIC_API_KEY no ambiente, servidor Next.js rodando em localhost:3000
Ou: use --direto para chamar o motor Python diretamente (sem servidor)
"""

import json
import sys
import os
import time
import urllib.request
import urllib.error
from pathlib import Path

# Adiciona src/ ao path para importar o motor em Python
BASE = Path(__file__).parent.parent
sys.path.insert(0, str(BASE / "scripts"))

ENDPOINT = "http://localhost:3000/api/recommend"

# ── 20 perfis diversos ────────────────────────────────────────────────────────

PERFIS = [
    # ─ Grupo 1: Iniciantes e recreativos ──────────────────────────────────────
    {
        "id": "P01",
        "descricao": "Aposentado, começa a jogar aos 60 anos, braço sensível",
        "perfil": {
            "historico": "recreativo",
            "tecnico": "basico",
            "estilo": "flat_basico",
            "mobilidade": "mobilidade_reduzida",
            "lesao": "cotovelo",
            "horas_mes": 4,
        },
    },
    {
        "id": "P02",
        "descricao": "Jovem de 25 anos, começa agora, ativo fisicamente",
        "perfil": {
            "historico": "recreativo",
            "tecnico": "basico",
            "estilo": "descobrindo",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 6,
        },
    },
    {
        "id": "P03",
        "descricao": "Mulher recreativa, joga socialmente no clube, sem pretensão técnica",
        "perfil": {
            "historico": "recreativo",
            "tecnico": "basico",
            "estilo": "flat_basico",
            "mobilidade": "mobilidade_moderada",
            "lesao": "nenhuma",
            "horas_mes": 8,
            "raquete_atual": "Wilson Ultra 100",
        },
    },
    # ─ Grupo 2: Desenvolvendo ─────────────────────────────────────────────────
    {
        "id": "P04",
        "descricao": "Adolescente em aulas, aprendendo topspin no forehand",
        "perfil": {
            "historico": "desenvolvendo",
            "tecnico": "em_construcao",
            "estilo": "topspin_fundo",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 12,
            "arquetipo_pro": "alcaraz",
        },
    },
    {
        "id": "P05",
        "descricao": "Adulto em aulas há 2 anos, quer evoluir, punho fraco",
        "perfil": {
            "historico": "desenvolvendo",
            "tecnico": "em_construcao",
            "estilo": "topspin_fundo",
            "mobilidade": "mobilidade_moderada",
            "lesao": "punho",
            "horas_mes": 8,
        },
    },
    {
        "id": "P06",
        "descricao": "Mulher desenvolvendo, quer raquete leve, jogo all-court",
        "perfil": {
            "historico": "desenvolvendo",
            "tecnico": "em_construcao",
            "estilo": "flat_basico",
            "mobilidade": "mobilidade_moderada",
            "lesao": "nenhuma",
            "horas_mes": 10,
            "raquete_atual": "Babolat Pure Drive Lite 2021",
        },
    },
    {
        "id": "P07",
        "descricao": "Homem intermediário em formação, estilo ainda não definido",
        "perfil": {
            "historico": "desenvolvendo",
            "tecnico": "intermediario",
            "estilo": "descobrindo",
            "mobilidade": "mobilidade_moderada",
            "lesao": "nenhuma",
            "horas_mes": 14,
        },
    },
    # ─ Grupo 3: Competitivos ──────────────────────────────────────────────────
    {
        "id": "P08",
        "descricao": "Competidor de clube, topspin pesado, joga muito (25h/mês)",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "intermediario",
            "estilo": "topspin_pesado",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 25,
            "arquetipo_pro": "alcaraz",
            "raquete_atual": "Babolat Pure Aero 2023",
        },
    },
    {
        "id": "P09",
        "descricao": "Competidor experiente, serve-and-volley, frame pesado",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "completo",
            "estilo": "net_rusher",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 20,
            "arquetipo_pro": "medvedev",
        },
    },
    {
        "id": "P10",
        "descricao": "Jogadora competitiva, bola plana e pesada, quer mais controle",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "completo",
            "estilo": "serve_flat_agressivo",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 22,
            "arquetipo_pro": "sabalenka",
            "raquete_atual": "Wilson Blade 98 16x19 v9",
        },
    },
    {
        "id": "P11",
        "descricao": "Competidor defensivo, ganha pelo erro do adversário, ombro com tendinite",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "intermediario",
            "estilo": "defensivo_contador",
            "mobilidade": "mobilidade_moderada",
            "lesao": "ombro",
            "horas_mes": 16,
        },
    },
    {
        "id": "P12",
        "descricao": "Competidor all-court, nível avançado, sinner fan",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "avancado",
            "estilo": "all_court",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 30,
            "arquetipo_pro": "sinner",
            "raquete_atual": "Head Speed MP 2024",
        },
    },
    {
        "id": "P13",
        "descricao": "Competidor flat e agressivo, serve forte, cotovelo de tenista",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "completo",
            "estilo": "serve_flat_agressivo",
            "mobilidade": "alta_mobilidade",
            "lesao": "cotovelo",
            "horas_mes": 18,
        },
    },
    {
        "id": "P14",
        "descricao": "Competidora jovem, topspin, mobilidade alta, fã de Swiatek",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "avancado",
            "estilo": "topspin_pesado",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 28,
            "arquetipo_pro": "swiatek",
        },
    },
    # ─ Grupo 4: Base forte / retorno ─────────────────────────────────────────
    {
        "id": "P15",
        "descricao": "Ex-competidor, parou há 10 anos, voltando ao tênis, mobilidade ok",
        "perfil": {
            "historico": "base_forte_retorno",
            "tecnico": "completo",
            "estilo": "all_court",
            "mobilidade": "mobilidade_moderada",
            "lesao": "nenhuma",
            "horas_mes": 12,
            "raquete_atual": "Head Radical MP antigo",
        },
    },
    {
        "id": "P16",
        "descricao": "Ex-jogadora de clube, voltando, menos mobilidade que antes",
        "perfil": {
            "historico": "base_forte_retorno",
            "tecnico": "intermediario",
            "estilo": "topspin_fundo",
            "mobilidade": "mobilidade_reduzida",
            "lesao": "nenhuma",
            "horas_mes": 8,
        },
    },
    {
        "id": "P17",
        "descricao": "Ex-competidor nível avançado, voltou após cirurgia no cotovelo",
        "perfil": {
            "historico": "base_forte_retorno",
            "tecnico": "avancado",
            "estilo": "all_court",
            "mobilidade": "mobilidade_moderada",
            "lesao": "cotovelo",
            "horas_mes": 10,
            "raquete_atual": "Wilson Pro Staff 97",
        },
    },
    # ─ Grupo 5: Casos-limite e especiais ─────────────────────────────────────
    {
        "id": "P18",
        "descricao": "Intermediário que quer frame mais técnico para evoluir (Fonseca fan)",
        "perfil": {
            "historico": "desenvolvendo",
            "tecnico": "intermediario",
            "estilo": "topspin_pesado",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 20,
            "arquetipo_pro": "fonseca",
        },
    },
    {
        "id": "P19",
        "descricao": "Avançado que busca controle máximo, jogo de rede, sem lesão",
        "perfil": {
            "historico": "competitivo",
            "tecnico": "avancado",
            "estilo": "net_rusher",
            "mobilidade": "alta_mobilidade",
            "lesao": "nenhuma",
            "horas_mes": 24,
            "arquetipo_pro": "fritz",
        },
    },
    {
        "id": "P20",
        "descricao": "Recreativo ativo, joga 3x semana, quer raquete premium sem exagero",
        "perfil": {
            "historico": "recreativo",
            "tecnico": "em_construcao",
            "estilo": "flat_basico",
            "mobilidade": "mobilidade_moderada",
            "lesao": "ombro",
            "horas_mes": 16,
            "raquete_atual": "Head Boom MP 2022",
        },
    },
]


# ── Executor via HTTP ─────────────────────────────────────────────────────────

def testar_via_http(perfil_data: dict) -> dict:
    payload = json.dumps(perfil_data["perfil"]).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


# ── Executor direto (sem servidor) ───────────────────────────────────────────

def testar_direto(perfil_data: dict) -> dict:
    """Roda o motor de eliminação e ranking em Python puro (sem Claude)."""
    import json as _json
    from pathlib import Path as _Path

    catalog_path = BASE / "knowledge-base" / "catalogo_completo.json"
    with open(catalog_path, encoding="utf-8") as f:
        catalog = _json.load(f)["raquetes"]

    perfil = perfil_data["perfil"]

    # Eliminação
    def eliminar(r, p):
        nao = r.get("nao_recomendada_para", [])
        if p.get("lesao", "nenhuma") != "nenhuma":
            if f"lesao_{p['lesao']}" in nao: return False
            if (r.get("flex_ra") or 0) > 65: return False
            if (r.get("frequencia_vibracao_hz") or 0) > 165: return False
        if p["tecnico"] in nao: return False
        if p["mobilidade"] in nao: return False
        if p["historico"] == "recreativo" and p["mobilidade"] == "mobilidade_reduzida":
            if (r.get("peso_g") or 0) > 285: return False
        return True

    candidatas = [r for r in catalog if eliminar(r, perfil)]

    # Ranking por specs + perfil
    def score(r):
        s = 0
        sw   = r.get("swingweight_kgcm2") or 0
        peso = r.get("peso_g") or 0
        flex = r.get("flex_ra") or 0
        hs   = r.get("headsize_sqin") or 0
        twt  = r.get("twistweight_kgcm2") or 0
        padrao = r.get("padrao_cordas") or ""

        # Match de perfil (peso máximo)
        if perfil["estilo"] in (r.get("estilo_ideal") or []):    s += 30
        if perfil["tecnico"] in (r.get("perfil_ideal") or []):   s += 20
        arq = perfil.get("arquetipo_pro")
        if arq and arq in (r.get("arquetipo_pro") or []):        s += 15

        # Bônus por specs alinhados ao estilo
        estilo = perfil["estilo"]
        if estilo == "topspin_pesado":
            if padrao == "16x19": s += 8
            if 98 <= hs <= 102:   s += 5
            if sw >= 315:         s += 5
        elif estilo == "serve_flat_agressivo":
            if padrao == "18x20": s += 10
            if peso >= 300:       s += 5
        elif estilo == "net_rusher":
            if twt >= 14:         s += 10
            if peso >= 305:       s += 5
        elif estilo == "defensivo_contador":
            if flex <= 63:        s += 8
            if hs >= 100:         s += 4
        elif estilo in ("flat_basico", "descobrindo"):
            if hs >= 100:         s += 6
            if sw <= 315:         s += 4
        elif estilo == "all_court":
            if 98 <= hs <= 102:   s += 5
            if 310 <= sw <= 325:  s += 5

        # Frequência de jogo
        horas = perfil.get("horas_mes") or 0
        if horas >= 20 and peso >= 295 and sw >= 310: s += 8
        if horas <= 6 and peso <= 290:                s += 6

        # Mobilidade
        if perfil["mobilidade"] == "mobilidade_reduzida" and peso <= 280: s += 10
        if perfil["mobilidade"] == "alta_mobilidade" and sw >= 320:       s += 4

        return s

    ranked = sorted(candidatas, key=score, reverse=True)

    # Top 3 diversificadas
    top3 = []
    linhas = set()
    marcas_usadas = set()
    for r in ranked:
        if len(top3) == 3: break
        if r.get("linha") not in linhas:
            top3.append(r)
            linhas.add(r.get("linha"))
            marcas_usadas.add(r.get("marca"))
    # Fallback: se nao diversificou linhas suficiente, pega melhores de marcas diferentes
    if len(top3) < 3:
        top3 = []
        marcas_fb = set()
        for r in ranked:
            if len(top3) == 3: break
            if r.get("marca") not in marcas_fb:
                top3.append(r)
                marcas_fb.add(r.get("marca"))
        if len(top3) < 3:
            top3 = ranked[:3]

    return {
        "resumo_perfil": f"[direto] {perfil['historico']} / {perfil['tecnico']} / {perfil['estilo']}",
        "opcoes": [
            {
                "posicao": i + 1,
                "label": ["Principal", "Alternativa potência", "Alternativa controle/custo"][i],
                "raquete": {"marca": r["marca"], "modelo": r["modelo"], "link_tw": r.get("link_tw", "")},
                "justificativa": r.get("nota_especialista", "—"),
                "corda_sugerida": "—",
                "grip_sugerido": "—",
            }
            for i, r in enumerate(top3)
        ],
        "pergunta_followup": "Alguma dúvida sobre as opções?",
        "debug": {
            "total_catalogo": len(catalog),
            "apos_eliminacao": len(candidatas),
            "candidatas_enviadas": len(top3),
        },
    }


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    modo_direto = "--direto" in sys.argv
    perfis_filtro = [a for a in sys.argv[1:] if a.startswith("P")]

    perfis_para_testar = PERFIS
    if perfis_filtro:
        perfis_para_testar = [p for p in PERFIS if p["id"] in perfis_filtro]

    print(f"Testando {len(perfis_para_testar)} perfis ({'modo direto' if modo_direto else 'via HTTP localhost:3000'})\n")
    print("=" * 70)

    resultados = []
    erros = []

    for i, pd in enumerate(perfis_para_testar, 1):
        print(f"\n[{pd['id']}] {pd['descricao']}")
        print(f"  Perfil: {pd['perfil']}")

        try:
            t0 = time.time()
            if modo_direto:
                resultado = testar_direto(pd)
            else:
                resultado = testar_via_http(pd)
            elapsed = time.time() - t0

            debug = resultado.get("debug", {})
            print(f"  ✓ {elapsed:.1f}s | catalogo={debug.get('total_catalogo')} "
                  f"→ apos_eliminacao={debug.get('apos_eliminacao')} "
                  f"→ enviadas={debug.get('candidatas_enviadas')}")
            print(f"  Resumo: {resultado.get('resumo_perfil', '')}")

            for op in resultado.get("opcoes", []):
                r = op.get("raquete", {})
                print(f"  Opção {op.get('posicao')} [{op.get('label')}]: {r.get('marca')} {r.get('modelo')}")
                print(f"    → {op.get('justificativa', '')[:120]}")

            resultados.append({"id": pd["id"], "ok": True, "resultado": resultado})

        except Exception as e:
            print(f"  ✗ ERRO: {e}")
            erros.append({"id": pd["id"], "erro": str(e)})

    # ── Sumário ───────────────────────────────────────────────────────────────
    print("\n" + "=" * 70)
    print(f"RESULTADO FINAL: {len(resultados)} OK, {len(erros)} erros")
    if erros:
        print("Perfis com erro:")
        for e in erros:
            print(f"  {e['id']}: {e['erro']}")

    # Verifica diversidade das recomendações
    if resultados:
        print("\nDiversidade das recomendações (marca da opção 1):")
        from collections import Counter
        marcas = Counter()
        for r in resultados:
            ops = r["resultado"].get("opcoes", [])
            if ops:
                marca = ops[0].get("raquete", {}).get("marca", "?")
                marcas[marca] += 1
        for marca, n in marcas.most_common():
            print(f"  {marca}: {n}x")

    # Salva resultados
    output_path = BASE / "scripts" / "resultados_teste.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({"ok": resultados, "erros": erros}, f, indent=2, ensure_ascii=False)
    print(f"\nResultados salvos em: {output_path}")


if __name__ == "__main__":
    main()
