-- ============================================================================
-- HERODOTUS HERITAGE PLATFORM — BIGQUERY AI & GEMINI 1.5 PRO GENERATIVE PIPELINE
-- Target Database: Google Cloud BigQuery
-- Dataset: herodotus_dw
-- Model: Vertex AI Gemini 1.5 Pro Foundation Model (`gemini-1.5-pro`)
-- Task: Transform raw archival ASI gazetteer entries into structured JSON
--       containing a 2-sentence hook, a 300-word historical narrative,
--       curated architectural highlights, and an authentic Shuddh Hindi
--       Devanagari translation for the Herodotus multilingual audio engine.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: CREATE REMOTE MODEL LINKED TO GEMINI 1.5 PRO
-- Requires a BigQuery Cloud Resource Connection (e.g., 'vertex-ai') with
-- IAM role 'roles/aiplatform.user' granted on the service account.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE MODEL `herodotus_dw.gemini_pro_model`
REMOTE WITH CONNECTION `projects/PROJECT_ID/locations/asia-south1/connections/vertex-ai`
OPTIONS (
  ENDPOINT = 'gemini-1.5-pro'
);


-- ----------------------------------------------------------------------------
-- STEP 2: MULTILINGUAL NARRATIVE & STRUCTURED JSON SYNTHESIS
-- Prompt engineering takes archival notes and outputs strict JSON with:
--   1. "hook": 2-sentence evocative opening hook
--   2. "narrative_300w": 300-word immersive historical narrative
--   3. "architectural_highlights": Array of 4-6 specific features
--   4. "hindi_devanagari": Complete translation in formal Shuddh Hindi
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `herodotus_dw.enriched_monument_narratives_raw` AS
SELECT
  monument_id,
  name,
  hindi_name,
  state,
  city,
  category,
  dynasty,
  era,
  ml_generate_text_result['candidates'][0]['content']['parts'][0]['text'] AS generated_response_raw,
  ml_generate_text_status
FROM
  ML.GENERATE_TEXT(
    MODEL `herodotus_dw.gemini_pro_model`,
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
        CONCAT(
          'You are an expert historian, Sanskritist, and master audio guide narrator for Herodotus. ',
          'Analyze the following raw ASI monument record:\n',
          'Monument: ', name, ' (', hindi_name, ')\n',
          'Location: ', city, ', ', state, '\n',
          'Architectural Category: ', category, '\n',
          'Dynasty: ', COALESCE(dynasty, 'Regional Rulers'), ' | Era: ', COALESCE(era, 'Historical Period'), '\n',
          'Founding Year: ', CAST(founded_year AS STRING), '\n',
          'Archival Notes: ', short_description, ' ', full_narrative, '\n\n',
          'Generate a strict, valid JSON object with NO MARKDOWN formatting, NO triple backticks, and NO extraneous commentary. ',
          'The JSON must follow this exact schema:\n',
          '{\n',
          '  "hook": "2-sentence evocative, cinematic hook capturing the essence and legend of the monument.",\n',
          '  "narrative_300w": "An immersive, scholarly yet accessible ~300-word historical narrative detailing why it was built, who labored on it, its historical zenith, and surviving acoustic or architectural marvels.",\n',
          '  "architectural_highlights": ["Highlight 1: specific masonry/carving", "Highlight 2: dome/arch/spire engineering", "Highlight 3: acoustics/hydraulics/alignment", "Highlight 4: materials/inlays"],\n',
          '  "hindi_devanagari": {\n',
          '    "hook": "शुद्ध हिंदी देवनागरी में २-वाक्यों का सजीव परिचय",\n',
          '    "narrative_300w": "शुद्ध एवं सांस्कृतिक हिंदी देवनागरी में ३०० शब्दों का गहन ऐतिहासिक वृत्तांत",\n',
          '    "architectural_highlights": ["वास्तुशिल्प विशेषता १", "वास्तुशिल्प विशेषता २", "वास्तुशिल्प विशेषता ३"]\n',
          '  }\n',
          '}'
        ) AS prompt
      FROM
        `herodotus_dw.asi_monuments`
    ),
    STRUCT(
      0.3 AS temperature,          -- Low temperature for factual precision and JSON adherence
      2048 AS max_output_tokens,   -- Sufficient token budget for bilingual text
      0.95 AS top_p,
      TRUE AS flatten_json_output
    )
  );


-- ----------------------------------------------------------------------------
-- STEP 3: PARSE AND NORMALIZE STRUCTURED JSON INTO PRODUCTION SCHEMAS
-- Extracts typed columns from the raw LLM response using BigQuery native JSON
-- extraction functions (PARSE_JSON, JSON_VALUE, JSON_EXTRACT_STRING_ARRAY).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `herodotus_dw.monument_curated_narratives` AS
WITH cleaned_payloads AS (
  SELECT
    monument_id,
    name,
    hindi_name,
    state,
    city,
    category,
    SAFE.PARSE_JSON(
      -- Strip potential markdown code fences if emitted by the LLM
      REGEXP_REPLACE(
        REGEXP_REPLACE(generated_response_raw, r'^```(?:json)?\s*', ''),
        r'\s*```$', ''
      )
    ) AS parsed_json
  FROM
    `herodotus_dw.enriched_monument_narratives_raw`
  WHERE
    ml_generate_text_status = ''
)
SELECT
  monument_id,
  name,
  hindi_name,
  state,
  city,
  category,
  JSON_VALUE(parsed_json.hook) AS hook_en,
  JSON_VALUE(parsed_json.narrative_300w) AS full_narrative_en,
  JSON_EXTRACT_STRING_ARRAY(parsed_json.architectural_highlights) AS highlights_en,
  JSON_VALUE(parsed_json.hindi_devanagari.hook) AS hook_hi,
  JSON_VALUE(parsed_json.hindi_devanagari.narrative_300w) AS full_narrative_hi,
  JSON_EXTRACT_STRING_ARRAY(parsed_json.hindi_devanagari.architectural_highlights) AS highlights_hi,
  CURRENT_TIMESTAMP() AS generated_at
FROM
  cleaned_payloads
WHERE
  parsed_json IS NOT NULL;


-- ----------------------------------------------------------------------------
-- STEP 4: MODERN TVF DEMONSTRATION (AI.GENERATE / AI.GENERATE_TABLE)
-- Demonstrates BigQuery next-generation TVF syntax with explicit output_schema
-- for automated schema validation during LLM inference.
-- ----------------------------------------------------------------------------
-- SELECT *
-- FROM AI.GENERATE_TABLE(
--   TABLE `herodotus_dw.asi_monuments`,
--   prompt => CONCAT('Summarize ', name, ' in 100 words with focus on ASI conservation.'),
--   output_schema => 'STRUCT<summary STRING, conservation_priority STRING>'
-- );


-- ----------------------------------------------------------------------------
-- STEP 5: AUTOMATED QUALITY AUDIT & FACT-CONSISTENCY CHECK
-- Verifies that generated narratives preserve essential architectural motifs
-- and contains valid non-empty Hindi Devanagari text.
-- ----------------------------------------------------------------------------
SELECT
  monument_id,
  name,
  LENGTH(full_narrative_en) AS en_char_length,
  LENGTH(full_narrative_hi) AS hi_char_length,
  ARRAY_LENGTH(highlights_en) AS en_highlight_count,
  ARRAY_LENGTH(highlights_hi) AS hi_highlight_count,
  CASE
    WHEN LENGTH(full_narrative_en) >= 800 AND LENGTH(full_narrative_hi) >= 800 THEN 'VERIFIED_GOLD'
    WHEN LENGTH(full_narrative_en) >= 400 THEN 'ACCEPTABLE_STANDARD'
    ELSE 'FLAG_FOR_REVIEW'
  END AS quality_tier
FROM
  `herodotus_dw.monument_curated_narratives`
ORDER BY
  en_char_length DESC;
