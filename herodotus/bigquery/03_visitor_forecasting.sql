-- ============================================================================
-- HERODOTUS HERITAGE PLATFORM — BIGQUERY ML TIME-SERIES VISITOR FORECASTING
-- Target Database: Google Cloud BigQuery
-- Dataset: herodotus_dw
-- Model: ARIMA_PLUS Multi-Time-Series Predictive Engine
-- Use Case: Forecast daily monument visitor volumes for queue wait optimization,
--           ASI ticketing staff allocation, security deployments, and crowd control.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: TRAIN MULTI-TIME-SERIES ARIMA_PLUS MODEL
-- Trains independent ARIMA models per monument_id simultaneously using BQML.
-- Incorporates the official Indian Gazetted Holiday Calendar ('IN') to accurately
-- capture Diwali, Eid, Republic Day, Independence Day, and Holi surge spikes.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE MODEL `herodotus_dw.visitor_forecasting_model`
OPTIONS (
  MODEL_TYPE = 'ARIMA_PLUS',
  TIME_SERIES_TIMESTAMP_COL = 'visit_date',
  TIME_SERIES_DATA_COL = 'total_visitors',
  TIME_SERIES_ID_COL = 'monument_id',
  HOLIDAY_REGION = 'IN',
  AUTO_ARIMA = TRUE,
  DATA_FREQUENCY = 'DAILY',
  CLEAN_SPIKES_AND_DIPS = TRUE,
  DECOMPOSE_TIME_SERIES = TRUE
) AS
SELECT
  visit_date,
  monument_id,
  total_visitors
FROM
  `herodotus_dw.daily_visitor_telemetry`
WHERE
  visit_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 730 DAY) AND CURRENT_DATE();


-- ----------------------------------------------------------------------------
-- STEP 2: MODEL EVALUATION (METRICS: MAPE, MAE, MSE)
-- Computes statistical error metrics across all trained monument time series.
-- Mean Absolute Percentage Error (MAPE) assesses percentage accuracy.
-- ----------------------------------------------------------------------------
SELECT
  monument_id,
  mean_absolute_error,
  mean_squared_error,
  root_mean_squared_error,
  mean_absolute_percentage_error AS mape,
  symmetric_mean_absolute_percentage_error AS smape
FROM
  ML.EVALUATE(
    MODEL `herodotus_dw.visitor_forecasting_model`
  )
ORDER BY
  mape ASC;


-- ----------------------------------------------------------------------------
-- STEP 3: ARIMA MODEL COEFFICIENT & AIC/AICC INSPECTION
-- Inspects selected ARIMA orders (p, d, q), seasonal components, drift,
-- and Akaike Information Criterion (AIC / AICc) discovered by Auto-ARIMA.
-- ----------------------------------------------------------------------------
SELECT
  monument_id,
  non_seasonal_p,
  non_seasonal_d,
  non_seasonal_q,
  has_drift,
  log_likelihood,
  AIC,
  AICc,
  variance,
  seasonal_periods
FROM
  ML.ARIMA_EVALUATE(
    MODEL `herodotus_dw.visitor_forecasting_model`,
    STRUCT(TRUE AS show_all_candidate_models)
  )
WHERE
  rank = 1 -- Select best-fitting candidate per monument
ORDER BY
  monument_id ASC;


-- ----------------------------------------------------------------------------
-- STEP 4: 30-DAY OPERATIONAL FORECAST WITH 95% CONFIDENCE INTERVALS
-- Projects daily visitor volumes for the upcoming 30 days.
-- Flags high-capacity surge days for proactive ASI gate turnstile staffing.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE TABLE `herodotus_dw.predicted_visitor_footfalls_30d` AS
SELECT
  monument_id,
  CAST(forecast_timestamp AS DATE) AS forecast_date,
  ROUND(forecast_value) AS predicted_total_visitors,
  ROUND(prediction_interval_lower_bound) AS lower_bound_95ci,
  ROUND(prediction_interval_upper_bound) AS upper_bound_95ci,
  standard_error,
  CASE
    WHEN forecast_value >= 25000 THEN 'RED_EXTREME_CAPACITY'
    WHEN forecast_value >= 15000 THEN 'ORANGE_HIGH_SURGE'
    WHEN forecast_value >= 6000  THEN 'YELLOW_MODERATE_CROWD'
    ELSE 'GREEN_NORMAL_FLOW'
  END AS operational_alert_tier
FROM
  ML.FORECAST(
    MODEL `herodotus_dw.visitor_forecasting_model`,
    STRUCT(
      30 AS horizon,
      0.95 AS confidence_level
    )
  )
ORDER BY
  monument_id,
  forecast_date ASC;


-- ----------------------------------------------------------------------------
-- STEP 5: HISTORICAL ANOMALY DETECTION ON VISITATION SPIKES
-- Detects anomalous crowd surges, unexpected local VIP events, or sudden dips.
-- ----------------------------------------------------------------------------
SELECT
  visit_date,
  monument_id,
  total_visitors,
  is_anomaly,
  lower_bound,
  upper_bound,
  anomaly_probability
FROM
  ML.DETECT_ANOMALIES(
    MODEL `herodotus_dw.visitor_forecasting_model`,
    STRUCT(0.95 AS anomaly_prob_threshold),
    (
      SELECT
        visit_date,
        monument_id,
        total_visitors
      FROM
        `herodotus_dw.daily_visitor_telemetry`
      WHERE
        visit_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
    )
  )
WHERE
  is_anomaly = TRUE
ORDER BY
  anomaly_probability DESC;


-- ----------------------------------------------------------------------------
-- STEP 6: ADVANCED AI.FORECAST (TIMESFM FOUNDATION MODEL ALTERNATIVE)
-- Demonstrates BigQuery modern zero-shot Time-Series Foundation Model (TimesFM)
-- syntax for rapid multi-step forecasting without explicit parameter tuning.
-- ----------------------------------------------------------------------------
-- SELECT *
-- FROM AI.FORECAST(
--   TABLE `herodotus_dw.daily_visitor_telemetry`,
--   time_series_timestamp_col => 'visit_date',
--   time_series_data_col => 'total_visitors',
--   time_series_id_col => 'monument_id',
--   horizon => 30,
--   confidence_level => 0.95
-- );
