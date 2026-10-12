# Herodotus BigQuery AI/ML Analytics Suite

Welcome to the enterprise analytics and artificial intelligence infrastructure powering **Herodotus — India's Living Heritage Platform**.

This directory contains production-grade Google Cloud BigQuery DDL, BigQuery ML (BQML), and Vertex AI integration pipelines designed to analyze footfall telemetry, execute sub-second natural language semantic searches, forecast crowd surges, and synthesize multilingual historical narratives across India's 3,693 Archaeological Survey of India (ASI) protected monuments.

---

## 1. Architectural Overview & Data Flow

```
                           ┌──────────────────────────────────────────────┐
                           │       Herodotus Client Applications          │
                           │     (Mobile PWA / Web / Admin Portal)        │
                           └──────────────────────┬───────────────────────┘
                                                  │
                                                  ▼ Event Telemetry & Logs
                                   ┌──────────────────────────────┐
                                   │  Pub/Sub & Storage Ingestion │
                                   └──────────────┬───────────────┘
                                                  │
                                                  ▼ Streaming Ingestion / Micro-batch
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Google Cloud BigQuery Data Warehouse: `herodotus_dw` (Region: `asia-south1` Mumbai)        │
│                                                                                             │
│  ┌─────────────────────────┐   ┌───────────────────────────┐   ┌─────────────────────────┐  │
│  │    asi_monuments        │   │ daily_visitor_telemetry   │   │     user_bookmarks      │  │
│  │ (Partition: created_at) │   │ (Partition: visit_date)   │   │ (Partition: date)       │  │
│  │ (Cluster: state, cat)   │   │ (Cluster: monument_id)    │   │ (Cluster: mon_id, usr)  │  │
│  └────────────┬────────────┘   └─────────────┬─────────────┘   └─────────────────────────┘  │
│               │                              │                                              │
│               ▼                              ▼                                              │
│  ┌─────────────────────────┐   ┌───────────────────────────┐   ┌─────────────────────────┐  │
│  │  02_semantic_search     │   │  03_visitor_forecasting   │   │ 04_multilingual_narrative│  │
│  │  - text-embedding-004   │   │  - ARIMA_PLUS Footfall    │   │ - Gemini 1.5 Pro Model  │  │
│  │  - 768-dim Embeddings   │   │  - Indian Holiday Cal (IN)│   │ - Structured JSON Parse │  │
│  │  - IVF Vector Index     │   │  - 30-Day 95% CI Forecast │   │ - Devanagari Hindi      │  │
│  │  - Cosine VECTOR_SEARCH │   │  - Anomaly Detection      │   │ - Fact-Consistency QA  │  │
│  └─────────────────────────┘   └───────────────────────────┘   └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Script Manifest

| Script File | Purpose | Key BQML / Vertex AI Technologies | Output Artifacts |
|---|---|---|---|
| `01_schema_monuments.sql` | Production DDL & Seeding | Partitioning, Clustering, `GEOGRAPHY`, Nested `STRUCT`s | `herodotus_dw.asi_monuments`, `daily_visitor_telemetry`, `user_bookmarks` |
| `02_semantic_search.sql` | Semantic Discovery | `text-embedding-004`, `ML.GENERATE_EMBEDDING`, `VECTOR INDEX`, `VECTOR_SEARCH` | `monument_embeddings`, `monument_vector_idx`, Top-5 Similarity Queries |
| `03_visitor_forecasting.sql` | Crowd Forecasting | `ARIMA_PLUS`, `HOLIDAY_REGION = 'IN'`, `ML.EVALUATE`, `ML.FORECAST`, `ML.DETECT_ANOMALIES` | `visitor_forecasting_model`, `predicted_visitor_footfalls_30d` |
| `04_multilingual_narrative_gen.sql` | Generative Storytelling | `gemini-1.5-pro`, `ML.GENERATE_TEXT`, `SAFE.PARSE_JSON`, Prompt Engineering | `enriched_monument_narratives_raw`, `monument_curated_narratives` |

---

## 3. Schema & Data Lakehouse Specifications

### 3.1 `herodotus_dw.asi_monuments`
- **Description**: Master registry of ASI-protected national heritage monuments.
- **Partitioning**: `PARTITION BY DATE(created_at)` — isolates new ingestion batches and audit sweeps.
- **Clustering**: `CLUSTER BY state, category, unesco_status` — optimizes spatial and thematic filtering queries (e.g., finding all UNESCO Forts in Rajasthan).
- **Key Columns**:
  - `monument_id STRING`: Unique identifier (e.g., `'taj-mahal'`, `'amer-fort'`).
  - `name STRING` & `hindi_name STRING`: Dual-script monument nomenclature.
  - `coordinates GEOGRAPHY`: WGS84 point (`ST_GEOGPOINT(longitude, latitude)`) for native spatial queries, proximity radius calculations (`ST_DWITHIN`), and GeoJSON generation.
  - `category STRING`: Architectural category (`Fort & Palace`, `Temple`, `Stepwell`, etc.).
  - `visiting_hours STRUCT`: Nested operational hours, closed days, and seasonal advice.
  - `tariffs STRUCT`: Domestic, SAARC, and foreign entrance fees in INR.
  - `full_narrative STRING`: 300–500 word comprehensive historical and architectural chronicle.

### 3.2 `herodotus_dw.daily_visitor_telemetry`
- **Description**: High-velocity fact table recording daily ticket sales, turnstile footfalls, and on-site audio guide telemetry.
- **Partitioning**: `PARTITION BY visit_date` — guarantees daily partition pruning for time-series models and reporting queries.
- **Clustering**: `CLUSTER BY monument_id` — colocates historical timelines for individual monuments, speeding up per-site time-series training.
- **Key Columns**:
  - `visit_date DATE`: Footfall date.
  - `monument_id STRING`: Foreign key to `asi_monuments`.
  - `domestic_visitors INT64` & `foreign_visitors INT64`: Footfall demographic breakdown.
  - `total_visitors INT64`: Aggregate footfall (`domestic + foreign`).
  - `revenue_inr NUMERIC`: Gross daily ticketing revenue.
  - `avg_dwell_minutes FLOAT64`: Telemetry-measured on-site dwell duration.
  - `weather_condition STRING` & `temperature_celsius FLOAT64`: Weather context influencing crowds.
  - `audio_guides_started INT64` & `audio_guides_completed INT64`: Herodotus PWA engagement metrics.

### 3.3 `herodotus_dw.user_bookmarks`
- **Description**: Traveler engagement logs capturing saved itineraries, favorite monuments, and audio consumption.
- **Partitioning**: `PARTITION BY created_date`.
- **Clustering**: `CLUSTER BY monument_id, user_id`.

---

## 4. Machine Learning & AI Pipelines

### 4.1 Semantic Search via Dense Vector Embeddings (`02_semantic_search.sql`)
1. **Remote Embedding Model**:
   - Uses Vertex AI's state-of-the-art `text-embedding-004` endpoint.
   - Outputs 768-dimensional normalized dense vectors.
2. **Document Ingestion**:
   - `ML.GENERATE_EMBEDDING` runs over comprehensive synthesized text blocks combining monument name, geographical context, dynasty, architectural classification, full historical narratives, and key masonry/sculpture highlights.
   - Configured with `task_type = 'RETRIEVAL_DOCUMENT'`.
3. **Vector Indexing**:
   - Builds an Inverted File (IVF) index (`monument_vector_idx`) using `COSINE` distance.
   - Accelerated sub-linear search allows low-latency retrieval across thousands of monuments without expensive full table scans.
4. **Vector Search Query**:
   - Natural language queries (e.g., *"Find Mughal stepwells with Persian water engineering and symmetrical arches"*) are embedded using `task_type = 'RETRIEVAL_QUERY'`.
   - `VECTOR_SEARCH` retrieves the top-5 nearest neighbors, computing similarity scores: `similarity_score = 1.0 - cosine_distance`.

### 4.2 Time-Series Footfall Forecasting (`03_visitor_forecasting.sql`)
1. **Multi-Time-Series ARIMA_PLUS Model**:
   - Trains separate automated ARIMA models across each `monument_id` in parallel.
   - `HOLIDAY_REGION = 'IN'`: Automatically incorporates Indian Gazetted national holidays, regional festivals (Diwali, Eid, Republic Day, Independence Day, Holi) to prevent holiday surges from distorting baseline seasonality.
   - `CLEAN_SPIKES_AND_DIPS = TRUE`: Handles outlier closures or maintenance anomalies.
   - `DECOMPOSE_TIME_SERIES = TRUE`: Separates trend, seasonal, and holiday components.
2. **Model Evaluation**:
   - `ML.EVALUATE`: Reports Mean Absolute Percentage Error (MAPE), Root Mean Squared Error (RMSE), and MAE.
   - `ML.ARIMA_EVALUATE`: Discloses the selected ARIMA polynomial orders $(p, d, q)$, drift, variance, and AIC/AICc criteria.
3. **Operational 30-Day Forecast**:
   - `ML.FORECAST` projects forward footfalls with 95% confidence intervals.
   - Dynamic thresholding categorizes dates into operational action tiers (`RED_EXTREME_CAPACITY`, `ORANGE_HIGH_SURGE`, `YELLOW_MODERATE_CROWD`, `GREEN_NORMAL_FLOW`) for proactive ticketing turnstile and security staffing.
4. **Anomaly Detection**:
   - `ML.DETECT_ANOMALIES` flags unscheduled crowd surges or sudden drop-offs with probability thresholds $> 0.95$.

### 4.3 Multilingual Narrative Generation (`04_multilingual_narrative_gen.sql`)
1. **Gemini 1.5 Pro Foundation Model**:
   - Connects to Vertex AI `gemini-1.5-pro` via BigQuery Remote Model Connection.
2. **Prompt Engineering & Schema Enforcement**:
   - Ingests raw archival notes and instructs the model to produce **strict, parseable JSON** adhering to a predefined schema:
     - 2-sentence evocative opening hook
     - 300-word historical narrative
     - Curated architectural highlights list
     - Formal Shuddh Hindi Devanagari translation
3. **BigQuery JSON Extraction**:
   - Uses `SAFE.PARSE_JSON`, `JSON_VALUE`, and `JSON_EXTRACT_STRING_ARRAY` to cleanly transform unstructured LLM output into typed analytical columns.
4. **Semantic Quality Audit**:
   - Verifies character lengths and highlight counts to ensure bilingual fidelity before publication to the Herodotus mobile app.

---

## 5. Deployment Guide & Runbook

### 5.1 Prerequisites & Cloud APIs
Enable the required Google Cloud APIs in your project:
```bash
gcloud services enable \
  bigquery.googleapis.com \
  bigqueryconnection.googleapis.com \
  aiplatform.googleapis.com
```

### 5.2 Create Cloud Resource Connection
Create a Vertex AI connection in the target region (`asia-south1` or `us-central1`):
```bash
bq mk --connection \
  --location=asia-south1 \
  --project_id=YOUR_PROJECT_ID \
  --connection_type=CLOUD_RESOURCE \
  vertex-ai
```

Retrieve the connection's service account ID:
```bash
bq show --connection YOUR_PROJECT_ID.asia-south1.vertex-ai
# Note the serviceAccountId output (e.g., bqcx-1234567890-abcd@gcp-sa-bigquery-condel.iam.gserviceaccount.com)
```

Grant the required IAM permissions to allow BigQuery to invoke Vertex AI models:
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member='serviceAccount:SERVICE_ACCOUNT_EMAIL' \
  --role='roles/aiplatform.user'
```

### 5.3 Execution Sequence
Execute the scripts in numerical order using `bq query` or BigQuery Studio:

```bash
# 1. Provision Dataset, Tables, and Seed Initial Data
bq query --use_legacy_sql=false < herodotus/bigquery/01_schema_monuments.sql

# 2. Deploy Embedding Model & Build Vector Search Index
bq query --use_legacy_sql=false < herodotus/bigquery/02_semantic_search.sql

# 3. Train ARIMA_PLUS Forecasting Model & Generate 30-Day Projections
bq query --use_legacy_sql=false < herodotus/bigquery/03_visitor_forecasting.sql

# 4. Run Gemini 1.5 Pro Narrative Synthesis & JSON Parsing
bq query --use_legacy_sql=false < herodotus/bigquery/04_multilingual_narrative_gen.sql
```

---

## 6. Performance & Cost Optimization Best Practices

1. **Partition Filtering**:
   - Always include a partition predicate (e.g., `WHERE visit_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)`) in telemetry queries to prevent full table scans.
2. **Vector Index Acceleration**:
   - Tuning `fraction_lists_to_search` (default 0.20) in `VECTOR_SEARCH` balances sub-50ms query latency against recall accuracy.
3. **Batch Embedding Generation**:
   - When updating embeddings for all 3,693 monuments, run `ML.GENERATE_EMBEDDING` in micro-batches or off-peak hours to manage Vertex AI quota limits.
4. **ARIMA_PLUS Horizon**:
   - Limit `horizon` to 30–90 days for operational reliability. Retrain models weekly or monthly as new telemetry arrives.
5. **Gemini Temperature Calibration**:
   - Maintain `temperature = 0.3` for historical factual accuracy and strict adherence to JSON output schemas.
