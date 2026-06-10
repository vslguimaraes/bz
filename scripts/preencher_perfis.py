"""
preencher_perfis.py
Infere os campos de perfil (perfil_ideal, estilo_ideal, nao_recomendada_para, etc.)
para cada raquete do catalogo_completo.json com base nas regras do raquete.md.

Lógica: as regras de eliminação do raquete.md definem quais perfis UMA RAQUETE
não serve. O inverso disso define para quem ela serve.

Regras base (extraídas do raquete.md, Seção 2):

HEADSIZE:
  < 97      → avancado only; elimina basico, em_construcao, intermediario
  97–99     → intermediario+; elimina basico, em_construcao
  100–102   → todos (ponto neutro)
  103–107   → inclui basico, reduzida mobilidade, recreativo
  > 107     → recreativo, basico, mobilidade_reduzida

PESO (g):
  > 310     → avancado, alta_mobilidade
  300–310   → completo/avancado, mobilidade_moderada+
  285–299   → intermediario+, mobilidade_moderada+
  < 285     → todos incluindo mobilidade_reduzida e basico

SWINGWEIGHT:
  > 330     → avancado, alta_mobilidade
  321–330   → completo/avancado
  311–320   → intermediario+
  <= 310    → todos incluindo basico

FLEX RA:
  > 68      → elimina lesao_cotovelo, lesao_ombro, lesao_punho
  63–68     → neutro
  < 63      → conforto, recomendável para lesão

VIBRAÇÃO (Hz):
  > 170     → elimina lesao
  155–170   → neutro
  < 155     → conforto, lesão OK

ESTILO (inferido por specs combinados):
  Aero frames (Pure Aero, VCORE, Extreme, Speed) + 16x19 + swingweight médio-alto
    → topspin_pesado, all_court
  Padrão fechado 18x20 + peso alto → serve_flat_agressivo, all_court
  Twistweight alto (>14) + headsize < 100 → net_rusher, serve_flat_agressivo
  Headsize 100+ + swingweight baixo → defensivo_contador, flat_basico
  Frame versátil (Speed, Gravity, Radical, Boom, Pure Strike) → all_court
"""

import json
import re
from pathlib import Path

CATALOG_PATH = Path(__file__).parent.parent / "knowledge-base" / "catalogo_completo.json"
OUTPUT_PATH = Path(__file__).parent.parent / "knowledge-base" / "catalogo_completo.json"

# ── Helpers ──────────────────────────────────────────────────────────────────

def get(r, field, default=0):
    v = r.get(field)
    return v if v is not None else default


def infer_linha(marca: str, modelo: str) -> str:
    """Identifica a linha da raquete pelo nome do modelo."""
    m = modelo.lower()
    if "pure aero" in m:       return "Pure Aero"
    if "pure drive" in m:      return "Pure Drive"
    if "pure strike" in m:     return "Pure Strike"
    if "speed" in m:           return "Speed"
    if "radical" in m:         return "Radical"
    if "prestige" in m:        return "Prestige"
    if "gravity" in m:         return "Gravity"
    if "boom" in m:            return "Boom"
    if "extreme" in m:         return "Extreme"
    if "blade" in m:           return "Blade"
    if "clash" in m:           return "Clash"
    if "pro staff" in m:       return "Pro Staff"
    if "ultra" in m:           return "Ultra"
    if "shift" in m:           return "Shift"
    if "rf 01" in m:           return "RF 01"
    if "ezone" in m:           return "EZONE"
    if "vcore" in m:           return "VCORE"
    if "percept" in m:         return "Percept"
    if "muse" in m:            return "Muse"
    if "astrel" in m:          return "Astrel"
    if "tfight" in m:          return "TFight"
    if "tf40" in m:            return "TF40"
    if "phantom" in m:         return "Phantom"
    if "tour 1" in m:          return "Tour"
    if "cx 200" in m:          return "CX 200"
    if "cx 400" in m:          return "CX 400"
    if "fx 500" in m:          return "FX 500"
    if "sx 300" in m:          return "SX 300"
    if "acrospeed" in m:       return "Acrospeed"
    if "acrostrike" in m:      return "Acrostrike"
    if "phantom" in m:         return "Phantom"
    if "ripstick" in m:        return "RipStick"
    if "ripcord" in m:         return "Ripcord"
    if "twistpower" in m:      return "Twistpower"
    if "vortex" in m:          return "Vortex"
    return modelo.split(" ")[0]


# Linhas de raquete por arquétipo (do raquete.md)
LINHA_ARQUETIPO = {
    "alcaraz":   ("Pure Aero",    ["alcaraz", "nadal"]),
    "nadal":     ("Pure Aero",    ["alcaraz", "nadal"]),
    "sinner":    ("Speed",        ["sinner", "djokovic"]),
    "djokovic":  ("Speed",        ["sinner", "djokovic"]),
    "fonseca":   ("EZONE",        ["fonseca", "shelton"]),
    "shelton":   ("EZONE",        ["fonseca", "shelton"]),
    "medvedev":  ("TFight",       ["medvedev", "swiatek"]),
    "swiatek":   ("TFight",       ["medvedev", "swiatek"]),
    "fritz":     ("Radical",      ["fritz"]),
    "zverev":    ("Gravity",      ["zverev"]),
    "gauff":     ("Boom",         ["gauff"]),
    "sabalenka": ("Blade",        ["sabalenka", "keys"]),
    "keys":      ("Blade",        ["sabalenka", "keys"]),
    "ostapenko": ("Pure Drive",   ["ostapenko"]),
}

LINHA_TO_ARQUETIPOS: dict[str, list[str]] = {}
for arq, (linha, arquetipos) in LINHA_ARQUETIPO.items():
    LINHA_TO_ARQUETIPOS.setdefault(linha, [])
    for a in arquetipos:
        if a not in LINHA_TO_ARQUETIPOS[linha]:
            LINHA_TO_ARQUETIPOS[linha].append(a)


# Linhas "aero" que favorecem topspin
LINHAS_AERO = {"Pure Aero", "VCORE", "Extreme", "Speed", "Boom", "EZONE"}
# Linhas "controle" que favorecem flat/precisão
LINHAS_CONTROLE = {"Blade", "Pro Staff", "Prestige", "TFight", "TF40", "Phantom", "RF 01",
                   "CX 200", "Percept", "Acrostrike", "Shift"}
# Linhas versáteis / all-court
LINHAS_VERSATEIS = {"Speed", "Gravity", "Radical", "Boom", "Pure Strike", "Pure Drive",
                    "Clash", "FX 500", "CX 400", "Acrospeed", "Tour", "Ripcord", "RipStick"}


def infer_padrao_cordas(r: dict) -> str | None:
    """Infere padrão de cordas se não foi detectado pelo nome."""
    existing = r.get("padrao_cordas")
    if existing:
        return existing
    sw = get(r, "swingweight_kgcm2")
    headsize = get(r, "headsize_sqin")
    # Raquetes de controle/pesadas tendem a ser 18x20
    if headsize <= 98 and sw >= 320:
        return "18x20"
    return "16x19"


def infer_geracao(modelo: str) -> int | None:
    """Extrai ano de geração do nome do modelo."""
    m = re.search(r"\b(20\d{2})\b", modelo)
    if m:
        return int(m.group(1))
    for suffix, year in [("v10", 2024), ("v9", 2022), ("v8", 2020),
                          ("v3", 2024), ("v2", 2022), ("v4", 2024),
                          ("8th gen", 2024), ("8th", 2024)]:
        if suffix in modelo.lower():
            return year
    return None


# ── Lógica principal de inferência ───────────────────────────────────────────

def infer_profile(r: dict) -> dict:
    headsize  = get(r, "headsize_sqin", 100)
    peso      = get(r, "peso_g", 295)
    sw        = get(r, "swingweight_kgcm2", 315)
    flex      = get(r, "flex_ra", 65)
    vib       = get(r, "frequencia_vibracao_hz", 160)
    twt       = get(r, "twistweight_kgcm2", 13)
    comp      = get(r, "comprimento_in", 27.0)
    marca     = r.get("marca", "")
    modelo    = r.get("modelo", "")
    linha     = infer_linha(marca, modelo)
    padrao    = infer_padrao_cordas(r)

    nao_rec: set[str] = set()
    perfil:  set[str] = set()
    historico: set[str] = set()
    estilo:  set[str] = set()
    mobilidade_min = "mobilidade_moderada"

    # ── NÍVEL TÉCNICO ──────────────────────────────────────────────────────

    # Frame exigente (pequeno + pesado + alto swingweight)
    exigente = (headsize <= 97 or peso >= 308 or sw >= 328)
    muito_exigente = (headsize <= 95 or peso >= 320 or sw >= 335)

    if muito_exigente:
        nao_rec.update(["basico", "em_construcao", "intermediario"])
        perfil.update(["completo", "avancado"])
        historico.update(["competitivo"])
        mobilidade_min = "alta_mobilidade"
    elif exigente and (peso >= 310 or sw >= 328):
        nao_rec.update(["basico", "em_construcao"])
        perfil.update(["intermediario", "completo", "avancado"])
        historico.update(["desenvolvendo", "competitivo", "base_forte_retorno"])
        mobilidade_min = "mobilidade_moderada"
    elif headsize >= 105 or (peso <= 278 and sw <= 305):
        # Frame permissivo / leve
        perfil.update(["recreativo", "basico", "em_construcao", "intermediario"])
        historico.update(["recreativo", "desenvolvendo"])
        mobilidade_min = "mobilidade_reduzida"
    elif headsize >= 102 or (peso <= 285 and sw <= 310):
        # Frame equilibrado para todos
        perfil.update(["basico", "em_construcao", "intermediario", "completo"])
        historico.update(["recreativo", "desenvolvendo", "competitivo"])
        mobilidade_min = "mobilidade_moderada"
    else:
        # Frame médio (100sq, 295-305g, sw 310-325)
        perfil.update(["intermediario", "completo", "avancado"])
        historico.update(["desenvolvendo", "competitivo", "base_forte_retorno"])
        mobilidade_min = "mobilidade_moderada"

    # ── LESÃO ──────────────────────────────────────────────────────────────

    lesao_ok = (flex <= 65 and vib <= 165)
    lesao_muito_ok = (flex <= 62 and vib <= 155)

    if flex > 68 or vib > 170:
        nao_rec.update(["lesao_cotovelo", "lesao_ombro", "lesao_punho"])
    elif lesao_muito_ok:
        pass  # frame confortável, não exclui nada

    # ── MOBILIDADE ─────────────────────────────────────────────────────────

    if peso >= 308 or sw >= 328:
        nao_rec.update(["mobilidade_reduzida"])
        mobilidade_min = "mobilidade_moderada"
    if peso >= 315 or sw >= 335:
        nao_rec.update(["mobilidade_reduzida", "mobilidade_moderada"])
        mobilidade_min = "alta_mobilidade"

    # Frame muito leve = OK para mobilidade reduzida
    if peso <= 275 and sw <= 300:
        mobilidade_min = "mobilidade_reduzida"

    # ── ESTILO ─────────────────────────────────────────────────────────────

    is_aero    = linha in LINHAS_AERO
    is_ctrl    = linha in LINHAS_CONTROLE
    is_vers    = linha in LINHAS_VERSATEIS
    is_open    = (padrao == "16x19" or padrao is None)
    is_closed  = (padrao == "18x20")
    heavy_racq = (peso >= 300 and sw >= 315)
    manobravel = (sw <= 310 and peso <= 290)

    if is_aero and is_open and sw >= 310:
        estilo.add("topspin_pesado")
        estilo.add("all_court")
    if is_ctrl and heavy_racq:
        estilo.add("serve_flat_agressivo")
        estilo.add("all_court")
    if is_ctrl and is_closed:
        estilo.add("serve_flat_agressivo")
    if twt >= 14 and headsize <= 100 and heavy_racq:
        estilo.add("net_rusher")
    if is_vers:
        estilo.add("all_court")
    if headsize >= 100 and manobravel:
        estilo.add("defensivo_contador")
        estilo.add("flat_basico")
    # Frame muito confortável (flex baixo) mas headsize 100 → flat_basico também
    if flex <= 58 and headsize >= 100:
        estilo.add("flat_basico")
    if headsize >= 100 and not is_aero and not is_ctrl:
        estilo.add("all_court")

    # Frame muito leve/grande → estilo básico
    if "recreativo" in perfil or "basico" in perfil:
        estilo.add("flat_basico")
        estilo.add("descobrindo")

    # Garante pelo menos um estilo
    if not estilo:
        estilo.add("all_court")

    # ── ARQUÉTIPO PRÓ ──────────────────────────────────────────────────────

    arquetipos = LINHA_TO_ARQUETIPOS.get(linha, [])

    return {
        "linha": linha,
        "padrao_cordas": padrao,
        "geracao": infer_geracao(modelo),
        "perfil_ideal": sorted(perfil) if perfil else ["intermediario", "completo"],
        "historico_ideal": sorted(historico) if historico else ["desenvolvendo", "competitivo"],
        "estilo_ideal": sorted(estilo),
        "mobilidade_minima": mobilidade_min,
        "nao_recomendada_para": sorted(nao_rec),
        "arquetipo_pro": arquetipos,
    }


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    with open(CATALOG_PATH, encoding="utf-8") as f:
        data = json.load(f)

    raquetes = data["raquetes"]
    print(f"Total raquetes: {len(raquetes)}")

    filled = 0
    kept_curated = 0

    for r in raquetes:
        # "Curado" = tem nota_especialista preenchida (17 originais do catalogo.json)
        has_curated = bool(r.get("nota_especialista", "").strip())

        inferred = infer_profile(r)

        if has_curated:
            # Preserva campos curados, só atualiza linha/padrao/geracao se vazios
            if not r.get("linha"):
                r["linha"] = inferred["linha"]
            if not r.get("padrao_cordas"):
                r["padrao_cordas"] = inferred["padrao_cordas"]
            if not r.get("geracao"):
                r["geracao"] = inferred["geracao"]
            # Enriquece arquetipo se vazio
            if not r.get("arquetipo_pro"):
                r["arquetipo_pro"] = inferred["arquetipo_pro"]
            kept_curated += 1
        else:
            # Preenche tudo com inferência
            for key, val in inferred.items():
                r[key] = val
            filled += 1

    data["_metadata"]["total_raquetes"] = len(raquetes)
    data["_metadata"]["perfis_inferidos"] = filled
    data["_metadata"]["perfis_curados"] = kept_curated

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"  Perfis inferidos (novas raquetes): {filled}")
    print(f"  Perfis curados preservados: {kept_curated}")
    print(f"  Salvo em: {OUTPUT_PATH}")

    # ── Validação rápida ──────────────────────────────────────────────────
    print("\n── Validação de 6 raquetes ──────────────────────")
    checks = ["BPAR26", "WB9810", "CL103V", "HSPMP6", "EZ10BB", "WB98R"]
    for pcode in checks:
        r = next((x for x in raquetes if x.get("pcode_twu") == pcode), None)
        if r:
            print(f"\n{r['modelo']} ({pcode})")
            print(f"  perfil:     {r['perfil_ideal']}")
            print(f"  estilo:     {r['estilo_ideal']}")
            print(f"  nao_rec:    {r['nao_recomendada_para']}")
            print(f"  mob_min:    {r['mobilidade_minima']}")
            print(f"  arquetipos: {r['arquetipo_pro']}")


if __name__ == "__main__":
    main()
