"""
extrair_specs_twu.py
Extrai specs de todas as raquetes do TWU (Tennis Warehouse University).

Abordagem: A página racquetanalyzerTWU.php usa um endpoint AJAX
  racquetanalyzerdata.php?code=PCODE&location=0&swingtype=0
que retorna JSON com todos os specs de cada raquete.

Os pcodes (códigos internos do TWU) são extraídos do dropdown da página principal.

Saída: scripts/specs_raw.json
"""

import re
import json
import time
import urllib.request
from pathlib import Path

BASE_URL = "https://twu.tennis-warehouse.com/learning_center"
OUTPUT_PATH = Path(__file__).parent / "specs_raw.json"


def get_racquet_codes() -> list[str]:
    """Extrai todos os pcodes do dropdown da página principal."""
    url = f"{BASE_URL}/racquetanalyzerTWU.php"
    with urllib.request.urlopen(url) as resp:
        html = resp.read().decode("utf-8", errors="replace")

    codes = re.findall(r"value=([A-Z][A-Z0-9]+)", html)
    # Remove duplicatas mantendo ordem
    seen = set()
    unique = []
    for c in codes:
        if c not in seen:
            seen.add(c)
            unique.append(c)
    return unique


def fetch_specs(pcode: str) -> dict | None:
    """Busca specs JSON de uma raquete pelo pcode."""
    url = f"{BASE_URL}/racquetanalyzerdata.php?code={pcode}&location=0&swingtype=0"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = resp.read().decode("utf-8")
        if not data.strip():
            return None
        return json.loads(data)
    except Exception as e:
        print(f"  ERRO {pcode}: {e}")
        return None


def main():
    print("Buscando lista de raquetes do TWU...")
    codes = get_racquet_codes()
    print(f"  {len(codes)} codes encontrados")

    specs = []
    errors = []

    for i, code in enumerate(codes, 1):
        print(f"  [{i:3d}/{len(codes)}] {code}", end=" ")
        result = fetch_specs(code)
        if result and result.get("pcode"):
            specs.append(result)
            print(f"-> {result.get('mfg', '?')} {result.get('racquet', '?')}")
        else:
            errors.append(code)
            print("-> sem dados")
        # Pausa curta para não sobrecarregar o servidor
        time.sleep(0.1)

    OUTPUT_PATH.write_text(json.dumps(specs, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n{len(specs)} raquetes salvas em {OUTPUT_PATH}")
    if errors:
        print(f"Sem dados: {errors}")


if __name__ == "__main__":
    main()
