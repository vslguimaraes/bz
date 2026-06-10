-- =============================================================================
-- Tennis Recommender — Schema completo do Supabase
-- Colar no SQL Editor do Supabase e executar em uma única vez.
-- =============================================================================


-- ---------------------------------------------------------------------------
-- Extensões necessárias
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
-- pg_cron é habilitado no Dashboard > Database > Extensions (não via SQL)


-- ---------------------------------------------------------------------------
-- Função auxiliar: atualiza updated_at automaticamente
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- =============================================================================
-- Tabela: racquetes
-- Catálogo central de raquetes. Populado pelo script migrate_catalog.py e
-- mantido em sincronia semanal com os dados do TWU via pg_cron.
-- =============================================================================
CREATE TABLE IF NOT EXISTS racquetes (
  -- Identificação
  id                      TEXT        PRIMARY KEY,          -- slug ex: "babolat_pure_aero_2026"
  pcode_twu               TEXT        UNIQUE,               -- código interno do TWU ex: "BPAR26"
  marca                   TEXT        NOT NULL,             -- ex: "Babolat"
  modelo                  TEXT        NOT NULL,             -- ex: "Pure Aero 2026"
  linha                   TEXT,                             -- ex: "Pure Aero"
  geracao                 INTEGER,                          -- ano do modelo ex: 2026

  -- Specs físicos (extraídos do TWU)
  headsize_sqin           NUMERIC(5,1),                     -- tamanho da cabeça em pol²
  comprimento_in          NUMERIC(4,1),                     -- comprimento em polegadas (padrão 27)
  peso_g                  NUMERIC(5,1),                     -- peso sem corda em gramas
  balance_pts_hl          NUMERIC(4,1),                     -- balanço: positivo = head-light, negativo = head-heavy
  swingweight_kgcm2       NUMERIC(5,1),                     -- resistência ao swing em kg.cm²
  twistweight_kgcm2       NUMERIC(4,1),                     -- resistência à torção em kg.cm²
  flex_ra                 INTEGER,                          -- rigidez RA (quanto maior, mais rígido)
  frequencia_vibracao_hz  INTEGER,                          -- frequência de vibração em Hz
  padrao_cordas           TEXT,                             -- ex: "16x19", "18x20"

  -- Perfil de recomendação (arrays de tags)
  perfil_ideal            TEXT[],                           -- ex: ["avancado", "intermediario"]
  historico_ideal         TEXT[],                           -- ex: ["competitivo", "desenvolvendo"]
  estilo_ideal            TEXT[],                           -- ex: ["topspin_pesado", "all_court"]
  nao_recomendada_para    TEXT[],                           -- perfis que devem evitar esta raquete
  arquetipo_pro           TEXT[],                           -- ex: ["nadal", "alcaraz"]
  mobilidade_minima       TEXT,                             -- ex: "alta_mobilidade", "mobilidade_moderada"
  nota_especialista       TEXT,                             -- observação livre sobre a raquete

  -- Disponibilidade e links de compra
  disponivel_br           BOOLEAN     DEFAULT FALSE,        -- se está disponível nas lojas BR
  lojas_br                JSONB,                            -- {"prospin": "", "amazon_br": "", "netshoes": ""}
  link_tw                 TEXT,                             -- link Tennis Warehouse (fallback internacional)

  -- Auditoria
  created_at              TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at              TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE racquetes IS
  'Catálogo central de raquetes de tênis. Fonte primária: TWU (specs). Enriquecido com perfis de recomendação e links afiliados.';

COMMENT ON COLUMN racquetes.id               IS 'Slug único, ex: babolat_pure_aero_2026';
COMMENT ON COLUMN racquetes.pcode_twu        IS 'Código interno do Tennis Warehouse University';
COMMENT ON COLUMN racquetes.balance_pts_hl   IS 'Positivo = head-light, negativo = head-heavy';
COMMENT ON COLUMN racquetes.flex_ra          IS 'Escala RA: <60 flexível, 60-67 médio, >67 rígido';
COMMENT ON COLUMN racquetes.lojas_br         IS 'JSON com links afiliados por loja: prospin, amazon_br, netshoes';

-- Trigger updated_at
CREATE TRIGGER trg_racquetes_updated_at
  BEFORE UPDATE ON racquetes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Índices
CREATE INDEX IF NOT EXISTS idx_racquetes_marca   ON racquetes (marca);
CREATE INDEX IF NOT EXISTS idx_racquetes_linha   ON racquetes (linha);
CREATE INDEX IF NOT EXISTS idx_racquetes_geracao ON racquetes (geracao);
CREATE INDEX IF NOT EXISTS idx_racquetes_disponivel_br ON racquetes (disponivel_br);


-- =============================================================================
-- Tabela: sessoes
-- Uma sessão por conversa de quiz (site ou WhatsApp). Guarda o perfil coletado
-- e as recomendações geradas pela IA.
-- =============================================================================
CREATE TABLE IF NOT EXISTS sessoes (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  canal             TEXT        NOT NULL CHECK (canal IN ('site', 'whatsapp')),  -- canal de origem
  perfil_jogador    JSONB,                    -- respostas do quiz (perfil completo)
  recomendacoes     JSONB,                    -- as 3 opções retornadas pela IA
  completed         BOOLEAN     DEFAULT FALSE, -- true quando o quiz foi concluído
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE sessoes IS
  'Cada sessão de quiz — site ou WhatsApp. Contém o perfil coletado e as recomendações da IA.';

COMMENT ON COLUMN sessoes.canal           IS 'Canal de origem: site ou whatsapp';
COMMENT ON COLUMN sessoes.perfil_jogador  IS 'JSON com todas as respostas do quiz (nível, estilo, físico, lesões, raquete atual)';
COMMENT ON COLUMN sessoes.recomendacoes   IS 'JSON com as 3 opções recomendadas, incluindo justificativas e links';
COMMENT ON COLUMN sessoes.completed       IS 'true = usuário chegou até a tela de recomendação';

-- Trigger updated_at
CREATE TRIGGER trg_sessoes_updated_at
  BEFORE UPDATE ON sessoes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Índices
CREATE INDEX IF NOT EXISTS idx_sessoes_canal      ON sessoes (canal);
CREATE INDEX IF NOT EXISTS idx_sessoes_created_at ON sessoes (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessoes_completed  ON sessoes (completed);


-- =============================================================================
-- Tabela: eventos
-- Analytics de cada ação do usuário durante o quiz e na tela de resultado.
-- Serve como backup local dos eventos do PostHog.
-- =============================================================================
CREATE TABLE IF NOT EXISTS eventos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id   UUID        REFERENCES sessoes (id) ON DELETE SET NULL,
  tipo        TEXT        NOT NULL,   -- 'quiz_step', 'recommendation_viewed', 'affiliate_click', etc.
  payload     JSONB,                  -- dados específicos do evento (step, raquete_id, loja, etc.)
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE eventos IS
  'Registro de analytics por sessão. Espelha os eventos do PostHog para consulta offline e auditoria.';

COMMENT ON COLUMN eventos.tipo    IS 'Tipos válidos: quiz_step | recommendation_viewed | affiliate_click | quiz_abandoned | quiz_restarted';
COMMENT ON COLUMN eventos.payload IS 'Dados do evento, ex: {"step": 3, "pergunta": "nivel", "resposta": "intermediario"}';

-- Índices
CREATE INDEX IF NOT EXISTS idx_eventos_sessao_id ON eventos (sessao_id);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo       ON eventos (tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_created_at ON eventos (created_at DESC);


-- =============================================================================
-- Tabela: racquetes_changelog
-- Audit trail de mudanças de spec detectadas nas sincronizações semanais com o TWU.
-- Permite rastrear se uma raquete foi respecificada (variações de lote, etc.).
-- =============================================================================
CREATE TABLE IF NOT EXISTS racquetes_changelog (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  pcode_twu       TEXT        NOT NULL,           -- código TWU da raquete
  campo           TEXT        NOT NULL,           -- qual campo mudou ex: "flex_ra"
  valor_anterior  TEXT,                           -- valor antes da mudança (como texto)
  valor_novo      TEXT,                           -- novo valor detectado (como texto)
  fonte           TEXT        DEFAULT 'twu_sync', -- origem da mudança: twu_sync | manual | migrate_script
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE racquetes_changelog IS
  'Histórico de alterações nos specs de raquetes. Populado automaticamente na sincronização semanal com o TWU.';

COMMENT ON COLUMN racquetes_changelog.pcode_twu      IS 'Código TWU da raquete alterada';
COMMENT ON COLUMN racquetes_changelog.campo          IS 'Nome do campo que sofreu alteração, ex: flex_ra, swingweight_kgcm2';
COMMENT ON COLUMN racquetes_changelog.valor_anterior IS 'Valor anterior serializado como texto';
COMMENT ON COLUMN racquetes_changelog.valor_novo     IS 'Novo valor serializado como texto';
COMMENT ON COLUMN racquetes_changelog.fonte          IS 'Origem: twu_sync (job semanal), manual, migrate_script';

-- Índice
CREATE INDEX IF NOT EXISTS idx_changelog_pcode_twu  ON racquetes_changelog (pcode_twu);
CREATE INDEX IF NOT EXISTS idx_changelog_created_at ON racquetes_changelog (created_at DESC);


-- =============================================================================
-- Row Level Security (RLS)
-- =============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE racquetes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos            ENABLE ROW LEVEL SECURITY;
ALTER TABLE racquetes_changelog ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- racquetes: leitura pública (catálogo é público)
-- Escrita somente via service_role (scripts de migração e sync)
-- ---------------------------------------------------------------------------
CREATE POLICY "racquetes_public_read"
  ON racquetes FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- sessoes: qualquer visitante pode criar sua própria sessão (INSERT público)
-- Leitura restrita à própria sessão via UUID (difícil de adivinhar)
-- ---------------------------------------------------------------------------
CREATE POLICY "sessoes_public_insert"
  ON sessoes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "sessoes_public_update"
  ON sessoes FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Leitura pública por id (UUID como token de acesso)
CREATE POLICY "sessoes_select_by_id"
  ON sessoes FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- eventos: qualquer visitante pode registrar eventos de sua sessão
-- ---------------------------------------------------------------------------
CREATE POLICY "eventos_public_insert"
  ON eventos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "eventos_select_by_sessao"
  ON eventos FOR SELECT
  TO anon, authenticated
  USING (true);

-- ---------------------------------------------------------------------------
-- racquetes_changelog: somente leitura para autenticados, escrita via service_role
-- ---------------------------------------------------------------------------
CREATE POLICY "changelog_authenticated_read"
  ON racquetes_changelog FOR SELECT
  TO authenticated
  USING (true);


-- =============================================================================
-- pg_cron: sincronização semanal com o TWU
--
-- COMO HABILITAR:
--   1. Acesse o Dashboard do Supabase > Database > Extensions
--   2. Habilite a extensão "pg_cron"
--   3. Descomente o bloco abaixo e execute no SQL Editor
--
-- O job chama um endpoint do seu backend que executa o script de sync.
-- Ajuste a URL para o endpoint real após o deploy na Vercel.
-- =============================================================================

/*
SELECT cron.schedule(
  'sync-twu-catalog',          -- nome do job
  '0 3 * * 0',                 -- domingo às 03:00 UTC
  $$
    SELECT net.http_post(
      url     := 'https://SEU_PROJETO.vercel.app/api/sync-twu',
      headers := '{"Authorization": "Bearer SEU_CRON_SECRET", "Content-Type": "application/json"}'::jsonb,
      body    := '{}'::jsonb
    );
  $$
);

-- Para listar jobs agendados:
-- SELECT * FROM cron.job;

-- Para remover o job:
-- SELECT cron.unschedule('sync-twu-catalog');
*/
