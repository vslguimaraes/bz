"""
migrate_catalog.py
Importa knowledge-base/catalogo_completo.json para a tabela racquetes do Supabase.

Uso rápido (variáveis de ambiente):
  SUPABASE_URL=https://xxxx.supabase.co SUPABASE_KEY=eyJ... python3 supabase/migrate_catalog.py

Ou apontando para um arquivo .env:
  python3 supabase/migrate_catalog.py --env .env.local

O script usa apenas a biblioteca padrão do Python (urllib.request).
Nenhuma instalação adicional necessária.
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


# ---------------------------------------------------------------------------
# Configuração
# ---------------------------------------------------------------------------

BATCH_SIZE = 50  # raquetes por requisição
CATALOG_PATH = Path(__file__).parent.parent / "knowledge-base" / "catalogo_completo.json"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_env_file(path: str) -> None:
    """Lê um arquivo .env / .env.local e injeta as variáveis no os.environ."""
    env_path = Path(path)
    if not env_path.exists():
        print(f"[ERRO] Arquivo de ambiente não encontrado: {path}", file=sys.stderr)
        sys.exit(1)

    with open(env_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            # Remove aspas opcionais ao redor do valor
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key.strip(), value)


def get_required_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        print(
            f"[ERRO] Variável de ambiente obrigatória não definida: {name}\n"
            f"       Defina via export ou use --env <arquivo>",
            file=sys.stderr,
        )
        sys.exit(1)
    return value


def normalize_record(raquete: dict) -> dict:
    """
    Garante que o registro está no formato esperado pelo schema do Supabase.
    Remove campos desconhecidos, converte tipos conforme necessário.
    """
    # Campos que o schema aceita (snake_case, igual ao JSON)
    ALLOWED = {
        "id", "pcode_twu", "marca", "modelo", "linha", "geracao",
        "headsize_sqin", "comprimento_in", "peso_g",
        "balance_pts_hl", "swingweight_kgcm2", "twistweight_kgcm2",
        "flex_ra", "frequencia_vibracao_hz", "padrao_cordas",
        "perfil_ideal", "historico_ideal", "estilo_ideal",
        "nao_recomendada_para", "arquetipo_pro",
        "mobilidade_minima", "nota_especialista",
        "disponivel_br", "lojas_br", "link_tw",
    }
    return {k: v for k, v in raquete.items() if k in ALLOWED}


def upsert_batch(
    url: str,
    headers: dict,
    batch: list[dict],
) -> tuple[int, int, list[dict]]:
    """
    Faz upsert de um lote de raquetes via POST /rest/v1/racquetes.

    Retorna (inseridas, atualizadas, erros).
    Como o Supabase não distingue insert/update na resposta do upsert,
    contamos tudo como "inseridas" e erros separadamente.
    """
    body = json.dumps(batch).encode("utf-8")
    req = urllib.request.Request(
        url=f"{url}/rest/v1/racquetes?on_conflict=id",
        data=body,
        headers={
            **headers,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            # 200 ou 201 = sucesso; com return=minimal o body é vazio
            if status in (200, 201):
                return len(batch), 0, []
            # Resposta inesperada mas sem exceção
            raw = resp.read().decode("utf-8")
            return 0, 0, [{"status": status, "body": raw, "batch_size": len(batch)}]
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8")
        return 0, 0, [
            {
                "status": exc.code,
                "reason": exc.reason,
                "body": raw,
                "ids": [r.get("id") for r in batch],
            }
        ]
    except urllib.error.URLError as exc:
        return 0, 0, [{"reason": str(exc.reason), "ids": [r.get("id") for r in batch]}]


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Importa catalogo_completo.json para a tabela racquetes do Supabase."
    )
    parser.add_argument(
        "--env",
        metavar="ARQUIVO",
        help="Caminho para arquivo .env (ex: .env.local). "
             "Alternativa a definir SUPABASE_URL e SUPABASE_KEY via export.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Apenas valida o JSON e imprime estatísticas, sem enviar ao Supabase.",
    )
    args = parser.parse_args()

    # 1. Carregar variáveis de ambiente
    if args.env:
        load_env_file(args.env)

    if not args.dry_run:
        # Aceita tanto SUPABASE_URL quanto NEXT_PUBLIC_SUPABASE_URL
        supabase_url = (os.environ.get("SUPABASE_URL") or os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")).strip().rstrip("/")
        if not supabase_url:
            print("[ERRO] Defina SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL", file=sys.stderr)
            sys.exit(1)
        # Aceita SUPABASE_KEY, SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY
        supabase_key = (os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")).strip()
        if not supabase_key:
            print("[ERRO] Defina SUPABASE_KEY ou SUPABASE_SERVICE_ROLE_KEY", file=sys.stderr)
            sys.exit(1)
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
        }
    else:
        supabase_url = "http://dry-run"
        headers = {}

    # 2. Ler catálogo
    if not CATALOG_PATH.exists():
        print(f"[ERRO] Catálogo não encontrado: {CATALOG_PATH}", file=sys.stderr)
        sys.exit(1)

    print(f"[INFO] Lendo catálogo: {CATALOG_PATH}")
    with open(CATALOG_PATH, encoding="utf-8") as f:
        data = json.load(f)

    raquetes_raw: list[dict] = data.get("raquetes", [])
    total = len(raquetes_raw)

    if total == 0:
        print("[AVISO] Nenhuma raquete encontrada no catálogo. Encerrando.")
        sys.exit(0)

    print(f"[INFO] {total} raquetes encontradas no catálogo.")

    # 3. Normalizar registros
    raquetes = [normalize_record(r) for r in raquetes_raw]

    # Validação básica: todo registro deve ter id
    sem_id = [r for r in raquetes if not r.get("id")]
    if sem_id:
        print(
            f"[AVISO] {len(sem_id)} registros sem campo 'id' — serão ignorados.",
            file=sys.stderr,
        )
        raquetes = [r for r in raquetes if r.get("id")]

    if args.dry_run:
        print(f"\n[DRY-RUN] {len(raquetes)} registros válidos prontos para envio.")
        print(f"[DRY-RUN] Seriam enviados em {-(-len(raquetes) // BATCH_SIZE)} lotes de até {BATCH_SIZE}.")
        print("[DRY-RUN] Nenhum dado foi enviado ao Supabase.")
        sys.exit(0)

    # 4. Enviar em lotes
    total_validos = len(raquetes)
    total_ok = 0
    all_errors: list[dict] = []

    print(f"\n[INFO] Iniciando upsert em lotes de {BATCH_SIZE}...\n")

    for start in range(0, total_validos, BATCH_SIZE):
        batch = raquetes[start : start + BATCH_SIZE]
        end = min(start + BATCH_SIZE, total_validos)

        # Label do lote para o log
        primeira = batch[0].get("marca", "?") + " " + batch[0].get("modelo", "?")
        ultima = batch[-1].get("marca", "?") + " " + batch[-1].get("modelo", "?")
        label = primeira if len(batch) == 1 else f"{primeira} … {ultima}"

        ok, _, errors = upsert_batch(supabase_url, headers, batch)

        if errors:
            print(f"  [ERRO] [{end}/{total_validos}] Lote falhou — {label}")
            all_errors.extend(errors)
        else:
            total_ok += ok
            print(f"  [OK]   [{end}/{total_validos}] {label}")

    # 5. Relatório final
    total_erros = total_validos - total_ok
    print("\n" + "=" * 60)
    print("RELATÓRIO FINAL")
    print("=" * 60)
    print(f"  Total no catálogo  : {total}")
    print(f"  Registros válidos  : {total_validos}")
    print(f"  Upserts com sucesso: {total_ok}")
    print(f"  Com erro           : {total_erros}")

    if all_errors:
        print("\nDETALHE DOS ERROS:")
        for i, err in enumerate(all_errors, 1):
            print(f"\n  [{i}] {err}")

    if total_erros > 0:
        sys.exit(1)
    else:
        print("\n[OK] Migração concluída com sucesso.")


if __name__ == "__main__":
    main()
