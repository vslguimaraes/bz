"""
preencher_catalogo.py
Cruza specs_raw.json (dados TWU) com o catálogo existente e gera
knowledge-base/catalogo_completo.json com todas as raquetes das marcas incluídas.

Lógica:
1. Lê specs_raw.json (extraído pelo extrair_specs_twu.py ou via curl)
2. Filtra pelas marcas incluídas e exclui gerações antigas (mantém 2022+
   ou única versão disponível por linha)
3. Para cada raquete no catalogo.json existente, enriquece com specs do TWU
4. Adiciona raquetes do TWU que não estão no catálogo (das marcas incluídas)
5. Salva como knowledge-base/catalogo_completo.json
"""

import json
import re
import unicodedata
from pathlib import Path

BASE = Path(__file__).parent.parent / "knowledge-base"
SPECS_PATH = Path(__file__).parent / "specs_raw.json"
CATALOG_PATH = BASE / "catalogo.json"
OUTPUT_PATH = BASE / "catalogo_completo.json"

MARCAS_INCLUIDAS = {
    "Babolat", "Dunlop", "Head", "Mizuno",
    "Prince", "Tecnifibre", "Wilson", "Yonex"
}

# Modelos a excluir (headsize extremo ou linhas fora do escopo competitivo)
HEADSIZE_MIN = 93
HEADSIZE_MAX = 110

# Mapeamento de marca TWU -> marca normalizada
MARCA_MAP = {
    "Babolat": "Babolat",
    "Dunlop": "Dunlop",
    "Head": "Head",
    "Mizuno": "Mizuno",
    "Prince": "Prince",
    "Tecnifibre": "Tecnifibre",
    "Wilson": "Wilson",
    "Yonex": "Yonex",
    "Yonex ": "Yonex",  # trim
}


def slugify(text: str) -> str:
    """Converte texto em slug snake_case."""
    text = unicodedata.normalize("NFD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    text = re.sub(r"[\s-]+", "_", text)
    return text


def balance_pts_hl(balance_cm: float, length_in: float) -> float:
    """
    Converte balance em cm para pts HL (head light).
    pts HL = (length_in * 2.54 / 2 - balance_cm) / 0.635
    Positivo = head light, negativo = head heavy.
    """
    midpoint_cm = (length_in * 2.54) / 2
    pts = (midpoint_cm - balance_cm) / 0.635
    return round(pts, 1)


def twu_to_catalog_entry(twu: dict, existing: dict | None = None) -> dict:
    """
    Converte um objeto TWU em entrada do catálogo.
    Se existing for fornecido, preserva campos curados (nota, perfis, links).
    """
    marca = MARCA_MAP.get(twu.get("mfg", "").strip(), twu.get("mfg", "").strip())
    modelo = twu.get("racquet", "")
    pcode = twu.get("pcode", "")

    headsize = int(twu.get("headsize") or 0)
    peso_g = int(twu.get("weight") or 0)
    length_in = float(twu.get("length") or 27.0)
    balance_cm = float(twu.get("balance") or 0)
    swingweight = int(twu.get("swingweight") or 0)
    flex = int(twu.get("flex") or 0)
    twistweight = float(twu.get("twistweight") or 0)
    vibration = int(twu.get("vibration") or 0)

    bal_pts = balance_pts_hl(balance_cm, length_in) if balance_cm and length_in else None

    # Inferir padrão de cordas do nome (heurística)
    padrao = None
    if "18x20" in modelo:
        padrao = "18x20"
    elif "16x19" in modelo:
        padrao = "16x19"
    elif "16x20" in modelo:
        padrao = "16x20"

    entry_id = existing["id"] if existing else f"{slugify(marca)}_{slugify(modelo)}"

    entry = {
        "id": entry_id,
        "pcode_twu": pcode,
        "marca": marca,
        "modelo": modelo,
        "linha": existing.get("linha", modelo.split(" ")[0]) if existing else "",
        "geracao": existing.get("geracao") if existing else None,
        # Specs do TWU
        "headsize_sqin": headsize or None,
        "comprimento_in": round(length_in, 2),
        "peso_g": peso_g or None,
        "balance_pts_hl": bal_pts,
        "swingweight_kgcm2": swingweight or None,
        "twistweight_kgcm2": twistweight or None,
        "flex_ra": flex or None,
        "frequencia_vibracao_hz": vibration or None,
        "padrao_cordas": padrao,
        # Campos curados (preservados do catálogo existente, ou vazios)
        "perfil_ideal": existing.get("perfil_ideal", []) if existing else [],
        "historico_ideal": existing.get("historico_ideal", []) if existing else [],
        "estilo_ideal": existing.get("estilo_ideal", []) if existing else [],
        "mobilidade_minima": existing.get("mobilidade_minima", "") if existing else "",
        "nao_recomendada_para": existing.get("nao_recomendada_para", []) if existing else [],
        "arquetipo_pro": existing.get("arquetipo_pro", []) if existing else [],
        "nota_especialista": existing.get("nota_especialista", "") if existing else "",
        "disponivel_br": existing.get("disponivel_br", False) if existing else False,
        "lojas_br": existing.get("lojas_br", {"prospin": "", "amazon_br": "", "netshoes": ""}) if existing else {
            "prospin": "", "amazon_br": "", "netshoes": ""
        },
        "link_tw": existing.get("link_tw", "") if existing else "",
    }
    return entry


def main():
    # --- Carregar specs TWU ---
    if not SPECS_PATH.exists():
        print(f"ERRO: {SPECS_PATH} não encontrado. Execute extrair_specs_twu.py primeiro.")
        return

    with open(SPECS_PATH, encoding="utf-8") as f:
        twu_specs: list[dict] = json.load(f)
    print(f"TWU specs carregados: {len(twu_specs)} raquetes")

    # Indexar TWU por pcode
    twu_by_pcode: dict[str, dict] = {r["pcode"]: r for r in twu_specs}

    # --- Filtrar marcas incluídas ---
    twu_incluidas = [
        r for r in twu_specs
        if MARCA_MAP.get(r.get("mfg", "").strip(), "") in MARCAS_INCLUIDAS
        and HEADSIZE_MIN <= int(r.get("headsize") or 0) <= HEADSIZE_MAX
    ]
    print(f"Raquetes das marcas incluídas (headsize {HEADSIZE_MIN}-{HEADSIZE_MAX}): {len(twu_incluidas)}")

    # Indexar TWU incluídas por (marca, modelo) normalizado para matching
    def norm_key(mfg: str, racquet: str) -> str:
        return slugify(f"{MARCA_MAP.get(mfg.strip(), mfg.strip())} {racquet}")

    twu_norm: dict[str, dict] = {norm_key(r["mfg"], r["racquet"]): r for r in twu_incluidas}

    # --- Carregar catálogo existente ---
    with open(CATALOG_PATH, encoding="utf-8") as f:
        catalog_raw = json.load(f)
    existing_raquetes: list[dict] = catalog_raw.get("raquetes", [])
    print(f"Catálogo existente: {len(existing_raquetes)} entradas")

    # --- Cruzar catálogo existente com TWU ---
    output_entries: list[dict] = []
    matched_pcodes: set[str] = set()
    unmatched_existing: list[str] = []

    for existing in existing_raquetes:
        marca = existing.get("marca", "")
        modelo = existing.get("modelo", "")
        key = norm_key(marca, modelo)

        if key in twu_norm:
            twu = twu_norm[key]
            entry = twu_to_catalog_entry(twu, existing)
            output_entries.append(entry)
            matched_pcodes.add(twu["pcode"])
        else:
            # Tenta match parcial por slug
            partial = [k for k in twu_norm if slugify(modelo) in k or k in slugify(modelo)]
            if partial:
                twu = twu_norm[partial[0]]
                entry = twu_to_catalog_entry(twu, existing)
                output_entries.append(entry)
                matched_pcodes.add(twu["pcode"])
                print(f"  Match parcial: '{modelo}' -> '{twu['racquet']}'")
            else:
                # Preserva entrada sem specs TWU (mantém campos curados)
                entry = dict(existing)
                entry.setdefault("pcode_twu", None)
                output_entries.append(entry)
                unmatched_existing.append(modelo)

    # --- Adicionar raquetes TWU não presentes no catálogo ---
    added = 0
    for r in twu_incluidas:
        if r["pcode"] not in matched_pcodes:
            entry = twu_to_catalog_entry(r)
            output_entries.append(entry)
            added += 1

    # --- Ordenar: marcas, depois modelo ---
    output_entries.sort(key=lambda x: (x.get("marca", ""), x.get("modelo", "")))

    # --- Montar output final ---
    output = {
        "_metadata": {
            **catalog_raw.get("_metadata", {}),
            "versao": "2.0",
            "total_raquetes": len(output_entries),
            "fonte_specs": "Tennis Warehouse University (TWU) - extraído via racquetanalyzerdata.php",
            "notas": [
                "pcode_twu: código interno do TWU para cada raquete",
                "balance_pts_hl: positivo = head light, negativo = head heavy",
                "Campos de perfil/estilo/links requerem curação manual",
            ]
        },
        "raquetes": output_entries
    }

    OUTPUT_PATH.write_text(json.dumps(output, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nResultado:")
    print(f"  Entradas cruzadas do catálogo existente: {len(existing_raquetes) - len(unmatched_existing)}")
    print(f"  Entradas sem match TWU: {unmatched_existing}")
    print(f"  Novas raquetes adicionadas do TWU: {added}")
    print(f"  Total: {len(output_entries)} raquetes")
    print(f"  Salvo em: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
