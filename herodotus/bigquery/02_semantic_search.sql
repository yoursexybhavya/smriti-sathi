-- ============================================================================
-- HERODOTUS HERITAGE PLATFORM — BIGQUERY ML VECTOR SEARCH & EMBEDDINGS
-- Target Database: Google Cloud BigQuery
-- Dataset: herodotus_dw
-- Architecture: Vertex AI text-embedding-004 + Approximate Nearest Neighbor (ANN)
--               Vector Indexing over 3,693 National Monument Chronicles.
-- Use Case: Natural language semantic discovery, cross-lingual discovery, and
--           intent-based historical query answering (e.g., "Find Mughal stepwells
--           with Persian water engineering and symmetrical arches").
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: CREATE REMOTE MODEL LINKED TO VERTEX AI TEXT-EMBEDDING-004
-- Note: Requires a Cloud Resource Connection in Vertex AI (e.g. 'vertex-ai')
-- with IAM role 'Vertex AI User' (roles/aiplatform.user) granted to the
-- connection service account.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE MODEL `herodotus_dw.text_embed_model`
REMOTE WITH CONNECTION `projects/PROJECT_ID/locations/asia-south1/connections/vertex-ai`
OPTIONS (
  ENDPOINT = 'text-embedding-004'
);


-- ----------------------------------------------------------------------------
-- STEP 2: GENERATE EMBEDDINGS PIPELINE FOR ALL MONUMENTS
-- Combines monument identification, geographical context, dynastic period,
-- full historical narrative, and architectural highlights into rich text documents.
-- task_type = 'RETRIEVAL_DOCUMENT' optimizes dense representations for search.
-- Dimensionality: 768 (standard dense vector for text-embedding-004).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `herodotus_dw.monument_embeddings` AS
SELECT
  monument_id,
  name,
  hindi_name,
  state,
  city,
  category,
  dynasty,
  era,
  unesco_status,
  content_raw,
  ml_generate_embedding_result,
  ml_generate_embedding_statistics
FROM
  ML.GENERATE_EMBEDDING(
    MODEL `herodotus_dw.text_embed_model`,
    (
      SELECT
        monument_id,
        name,
        hindi_name,
        state,
        city,
        category,
        dynasty,
        era,
        unesco_status,
        CONCAT(
          'Monument: ', name, ' (', hindi_name, '). ',
          'Location: ', city, ', ', state, ', India. ',
          'Category: ', category, '. ',
          'Dynasty & Era: Built during the ', era, ' under ', COALESCE(dynasty, 'indigenous patrons'), '. ',
          'UNESCO World Heritage: ', IF(unesco_status, 'Yes', 'No'), '. ',
          'Overview: ', short_description, ' ',
          'Historical Narrative: ', full_narrative, ' ',
          'Architectural Highlights: ', ARRAY_TO_STRING(architectural_highlights, '; ')
        ) AS content,
        CONCAT(name, ' — ', category, ' in ', city) AS content_raw
      FROM
        `herodotus_dw.asi_monuments`
    ),
    STRUCT(
      'RETRIEVAL_DOCUMENT' AS task_type,
      768 AS output_dimensionality
    )
  );


-- ----------------------------------------------------------------------------
-- STEP 3: CREATE VECTOR SEARCH INDEX (IVF WITH COSINE DISTANCE)
-- Builds an Inverted File (IVF) index over the 768-dimensional dense vector column.
-- Enables sub-50ms Approximate Nearest Neighbor (ANN) retrieval across thousands
-- of monument records without performing brute-force full table scans.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VECTOR INDEX `monument_vector_idx`
ON `herodotus_dw.monument_embeddings`(ml_generate_embedding_result)
OPTIONS (
  index_type = 'IVF',
  distance_type = 'COSINE',
  ivf_options = '{"num_lists": 100}'
);


-- ----------------------------------------------------------------------------
-- STEP 4: PRODUCTION VECTOR SEARCH QUERY
-- Matches natural language travel queries returning top-5 ranked monuments.
-- Task type 'RETRIEVAL_QUERY' matches queries to 'RETRIEVAL_DOCUMENT' representations.
-- Distance metric: COSINE. Similarity score = 1.0 - distance.
-- ----------------------------------------------------------------------------
WITH travel_query AS (
  SELECT
    'Find Mughal stepwells with Persian water engineering and symmetrical arches' AS query_text
),
query_embedding AS (
  SELECT
    travel_query.query_text,
    ml_generate_embedding_result AS query_vector
  FROM
    travel_query,
    ML.GENERATE_EMBEDDING(
      MODEL `herodotus_dw.text_embed_model`,
      (SELECT travel_query.query_text AS content FROM travel_query),
      STRUCT(
        'RETRIEVAL_QUERY' AS task_type,
        768 AS output_dimensionality
      )
    )
)
SELECT
  query.query_text AS search_query,
  base.monument_id,
  base.name,
  base.hindi_name,
  base.city,
  base.state,
  base.category,
  base.dynasty,
  base.unesco_status,
  ROUND(distance, 4) AS cosine_distance,
  ROUND(1.0 - distance, 4) AS similarity_score
FROM
  VECTOR_SEARCH(
    TABLE `herodotus_dw.monument_embeddings`,
    'ml_generate_embedding_result',
    TABLE query_embedding,
    'query_vector',
    top_k => 5,
    distance_type => 'COSINE',
    options => '{"fraction_lists_to_search": 0.20}'
  )
ORDER BY
  distance ASC;


-- ----------------------------------------------------------------------------
-- STEP 5: MODERN TVF ALTERNATIVE (AI.SEARCH SYNTAX PATTERN)
-- Demonstrates BigQuery modern AI Table-Valued Function (TVF) workflow
-- for ad-hoc semantic similarity ranking without explicit index references.
-- ----------------------------------------------------------------------------
SELECT
  m.monument_id,
  m.name,
  m.category,
  m.city,
  m.state,
  sim.cosine_distance,
  ROUND(1.0 - sim.cosine_distance, 4) AS similarity_score
FROM
  `herodotus_dw.monument_embeddings` AS m,
  (
    SELECT
      query_vector
    FROM
      ML.GENERATE_EMBEDDING(
        MODEL `herodotus_dw.text_embed_model`,
        (SELECT 'Rock-cut caves with ancient Buddhist frescoes and monolithic carvings' AS content),
        STRUCT('RETRIEVAL_QUERY' AS task_type, 768 AS output_dimensionality)
      ) AS t(ml_generate_embedding_result, ml_generate_embedding_statistics, query_vector)
  ) AS q
JOIN (
  SELECT
    base.monument_id,
    distance AS cosine_distance
  FROM
    VECTOR_SEARCH(
      TABLE `herodotus_dw.monument_embeddings`,
      'ml_generate_embedding_result',
      (
        SELECT ml_generate_embedding_result AS query_embedding
        FROM ML.GENERATE_EMBEDDING(
          MODEL `herodotus_dw.text_embed_model`,
          (SELECT 'Rock-cut caves with ancient Buddhist frescoes and monolithic carvings' AS content),
          STRUCT('RETRIEVAL_QUERY' AS task_type, 768 AS output_dimensionality)
        )
      ),
      'query_embedding',
      top_k => 5,
      distance_type => 'COSINE'
    )
) AS sim
ON m.monument_id = sim.monument_id
ORDER BY sim.cosine_distance ASC;
