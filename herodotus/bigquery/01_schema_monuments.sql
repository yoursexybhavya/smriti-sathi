-- ============================================================================
-- HERODOTUS HERITAGE PLATFORM — BIGQUERY ENTERPRISE WAREHOUSE SCHEMA
-- Target Database: Google Cloud BigQuery Data Warehouse
-- Dataset: herodotus_dw
-- Description: Production DDL establishing partitioned and clustered analytical
--              tables for 3,693 ASI Monuments, Geolocation coordinates,
--              Daily Visitor Telemetry & Ticketing, and User Bookmarks.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: CREATE DATASET
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `herodotus_dw`
OPTIONS (
  location = 'asia-south1', -- Primary region: Mumbai (GCP India)
  description = 'Herodotus National Monument Intelligence & Footfall Analytics Platform'
);

-- ----------------------------------------------------------------------------
-- STEP 2: ASI MONUMENTS MASTER TABLE
-- Partitioned by: DATE(created_at)
-- Clustered by: state, category, unesco_status
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `herodotus_dw.asi_monuments` (
  monument_id STRING OPTIONS(description = 'Unique ASI identifier, e.g., IN-UP-001 or kebab-case slug'),
  name STRING NOT NULL OPTIONS(description = 'Official English name of the monument'),
  hindi_name STRING NOT NULL OPTIONS(description = 'Official Hindi name in Devanagari script'),
  alternate_names ARRAY<STRING> OPTIONS(description = 'Historical, colloquial, or regional alternative names'),
  category STRING NOT NULL OPTIONS(description = 'Architectural classification: Fort & Palace, Temple, Tomb & Mausoleum, Mosque, Stepwell, Caves & Rock-cut, Memorial & Gate, Ancient University'),
  coordinates GEOGRAPHY NOT NULL OPTIONS(description = 'WGS84 point: ST_GEOGPOINT(longitude, latitude)'),
  state STRING NOT NULL OPTIONS(description = 'Indian State or Union Territory'),
  city STRING NOT NULL OPTIONS(description = 'Nearest prominent city or metropolitan area'),
  district STRING OPTIONS(description = 'Administrative district'),
  asi_circle STRING OPTIONS(description = 'ASI Administrative Circle, e.g., Agra Circle, Delhi Circle'),
  unesco_status BOOLEAN NOT NULL OPTIONS(description = 'True if inscribed as a UNESCO World Heritage Site'),
  unesco_site_name STRING OPTIONS(description = 'Official UNESCO World Heritage inscription title'),
  dynasty STRING OPTIONS(description = 'Ruling dynasty or patronage under which the monument was erected'),
  era STRING OPTIONS(description = 'Historical period, e.g., 17th Century Mughal, 10th Century Chola'),
  founded_year INT64 OPTIONS(description = 'Founding year CE (negative for BCE)'),
  short_description STRING OPTIONS(description = 'Curated 2-sentence hook for mobile previews and cards'),
  full_narrative STRING OPTIONS(description = 'Comprehensive 300-500 word historical and cultural narrative'),
  architectural_highlights ARRAY<STRING> OPTIONS(description = 'Key architectural features, e.g., Pietra Dura, Jali screens, Corbelled arches'),
  visiting_hours STRUCT<
    open_time STRING,
    close_time STRING,
    closed_days ARRAY<STRING>,
    best_time_to_visit STRING
  > OPTIONS(description = 'Official visiting hours and seasonal recommendations'),
  tariffs STRUCT<
    domestic_fee_inr NUMERIC,
    saarc_fee_inr NUMERIC,
    foreign_fee_inr NUMERIC,
    entry_free_under_15 BOOLEAN
  > OPTIONS(description = 'Structured tariff breakdown in Indian Rupees (INR)'),
  domestic_fee_inr NUMERIC OPTIONS(description = 'Standard domestic Indian visitor fee in INR'),
  foreign_fee_inr NUMERIC OPTIONS(description = 'Standard non-SAARC foreign tourist fee in INR'),
  ticket_booking_url STRING OPTIONS(description = 'Direct link to ASI official e-ticket booking portal'),
  hero_image_url STRING OPTIONS(description = 'CDN URL for high-resolution hero photo'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() OPTIONS(description = 'Timestamp when record was ingested into warehouse'),
  last_audited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() OPTIONS(description = 'Timestamp of last administrative or field audit')
)
PARTITION BY DATE(created_at)
CLUSTER BY state, category, unesco_status
OPTIONS (
  description = 'National Master Registry of Archaeological Survey of India (ASI) protected monuments'
);

-- Backward compatibility view for legacy analytics queries
CREATE OR REPLACE VIEW `herodotus_dw.monuments_master` AS
SELECT * FROM `herodotus_dw.asi_monuments`;


-- ----------------------------------------------------------------------------
-- STEP 3: DAILY VISITOR TELEMETRY & TICKETING FACT TABLE
-- Partitioned by: visit_date
-- Clustered by: monument_id
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `herodotus_dw.daily_visitor_telemetry` (
  telemetry_id STRING NOT NULL OPTIONS(description = 'Unique telemetry record identifier, e.g., TEL-20260925-INUP001'),
  visit_date DATE NOT NULL OPTIONS(description = 'Calendar date of visitor footfall (Partition key)'),
  monument_id STRING NOT NULL OPTIONS(description = 'Foreign key referencing asi_monuments.monument_id (Cluster key)'),
  state STRING OPTIONS(description = 'State where the monument resides'),
  domestic_visitors INT64 NOT NULL OPTIONS(description = 'Total count of domestic Indian visitors recorded at turnstiles'),
  foreign_visitors INT64 NOT NULL OPTIONS(description = 'Total count of international and SAARC visitors'),
  total_visitors INT64 NOT NULL OPTIONS(description = 'Combined total footfall: domestic + foreign'),
  revenue_inr NUMERIC NOT NULL OPTIONS(description = 'Gross daily ticketing and concessions revenue in INR'),
  avg_dwell_minutes FLOAT64 OPTIONS(description = 'Average on-site dwell time in minutes recorded by beacon/Wi-Fi telemetry'),
  weather_condition STRING OPTIONS(description = 'Dominant weather: Clear, Sunny, Overcast, Rain, Extreme Heat, Fog'),
  temperature_celsius FLOAT64 OPTIONS(description = 'Average daytime temperature in Celsius'),
  peak_crowd_hour INT64 OPTIONS(description = 'Hour of maximum footfall density (0-23 in 24-hour format)'),
  audio_guides_started INT64 DEFAULT 0 OPTIONS(description = 'Count of Herodotus audio guide playback sessions initiated'),
  audio_guides_completed INT64 DEFAULT 0 OPTIONS(description = 'Count of Herodotus audio sessions listened to completion'),
  avg_listen_duration_seconds FLOAT64 DEFAULT 0.0 OPTIONS(description = 'Average audio listening duration per visitor'),
  is_national_holiday BOOLEAN DEFAULT FALSE OPTIONS(description = 'True if date coincides with Gazetted Indian national holiday'),
  is_weekend BOOLEAN DEFAULT FALSE OPTIONS(description = 'True if Saturday or Sunday'),
  ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY visit_date
CLUSTER BY monument_id
OPTIONS (
  description = 'Daily footfall, revenue, environmental telemetry, and audio engagement per monument'
);

-- Backward compatibility view
CREATE OR REPLACE VIEW `herodotus_dw.visitor_telemetry_daily` AS
SELECT * FROM `herodotus_dw.daily_visitor_telemetry`;


-- ----------------------------------------------------------------------------
-- STEP 4: USER BOOKMARKS & ENGAGEMENT TABLE
-- Partitioned by: created_date
-- Clustered by: monument_id, user_id
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `herodotus_dw.user_bookmarks` (
  bookmark_id STRING NOT NULL OPTIONS(description = 'Unique bookmark identifier'),
  user_id STRING NOT NULL OPTIONS(description = 'Anonymized user identifier (Cluster key)'),
  monument_id STRING NOT NULL OPTIONS(description = 'Monuments foreign key (Cluster key)'),
  created_date DATE NOT NULL OPTIONS(description = 'Date of bookmark creation (Partition key)'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() OPTIONS(description = 'Exact timestamp of bookmark creation'),
  device_platform STRING OPTIONS(description = 'Platform: iOS_PWA, Android_PWA, Desktop_Chrome, Mobile_Safari'),
  audio_listened_seconds INT64 DEFAULT 0 OPTIONS(description = 'Total seconds of audio guide consumed by user for this site'),
  interaction_type STRING OPTIONS(description = 'save_favorite, plan_visit, route_added, audio_completed'),
  notes STRING OPTIONS(description = 'Optional user personal travel notes')
)
PARTITION BY created_date
CLUSTER BY monument_id, user_id
OPTIONS (
  description = 'User bookmarking, trip planning, and saved monument interactions from Herodotus PWA'
);


-- ----------------------------------------------------------------------------
-- STEP 5: SAMPLE DATA SEEDING (DML)
-- Seeds marquee monuments and realistic historical telemetry
-- ----------------------------------------------------------------------------

-- 5.1 Seed Marquee Monuments into `asi_monuments`
INSERT INTO `herodotus_dw.asi_monuments` (
  monument_id, name, hindi_name, alternate_names, category, coordinates,
  state, city, district, asi_circle, unesco_status, unesco_site_name,
  dynasty, era, founded_year, short_description, full_narrative,
  architectural_highlights, visiting_hours, tariffs, domestic_fee_inr, foreign_fee_inr,
  ticket_booking_url, hero_image_url, created_at, last_audited_at
)
VALUES
(
  'taj-mahal',
  'Taj Mahal',
  'ताज महल',
  ['Tāj Mahal', 'Rauza-i-Munawwara', 'Crown of the Palace'],
  'Tomb & Mausoleum',
  ST_GEOGPOINT(78.0421, 27.1751),
  'Uttar Pradesh',
  'Agra',
  'Agra',
  'Agra Circle',
  TRUE,
  'Taj Mahal',
  'Mughal Empire',
  '17th Century Mughal (Shah Jahan)',
  1632,
  'An immense mausoleum of white marble built in Agra by Mughal emperor Shah Jahan in memory of his favourite wife. The jewel of Muslim art in India and one of the universally admired masterpieces of the world heritage.',
  'Standing gracefully on the south bank of the Yamuna River in Agra, the Taj Mahal represents the architectural pinnacle of Mughal artistic genius. Commissioned in 1632 CE by the fifth Mughal Emperor Shah Jahan to enshrine the remains of his beloved empress Arjumand Banu Begum (Mumtaz Mahal), the complex required over twenty years and twenty thousand artisans to complete. Built from pristine translucent white Makrana marble quarried in Rajasthan, the mausoleum is celebrated for its perfect bilateral symmetry, central bulbous onion dome reaching a height of 73 meters, and four freestanding 40-meter minarets tilted slightly outward to protect the tomb in case of earthquakes. Its surfaces are adorned with intricate Pietra Dura (parchin kari) stone inlays featuring twenty-eight varieties of semi-precious gems including lapis lazuli, jade, crystal, and carnelian arranged into flowing botanical vines and delicate floral arabesques. Surrounding the mausoleum is a classic Charbagh four-quartered Persian paradise garden bisected by reflective watercourses that mirror the changing light from rosy dawn to luminous pearl beneath the full moon.',
  ['Translucent Makrana marble central dome with lotus motif finial', 'Intricate Pietra Dura floral inlays using 28 semi-precious stone varieties', 'Four freestanding three-story minarets with outward seismic safety tilt', 'Charbagh paradise garden with central marble lotus reflecting pool'],
  STRUCT('06:00', '18:30', ['Friday'], 'October to March during sunrise or sunset'),
  STRUCT(50.0, 540.0, 1100.0, TRUE),
  50.0,
  1100.0,
  'https://asi.payumoney.com/quick/taj',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Taj_Mahal_%28Edited%29.jpeg/960px-Taj_Mahal_%28Edited%29.jpeg',
  TIMESTAMP('2026-01-01 00:00:00 UTC'),
  TIMESTAMP('2026-09-01 00:00:00 UTC')
),
(
  'amer-fort',
  'Amer Fort & Palace',
  'आमेर का किला',
  ['Amber Fort', 'Amer Palace', 'Amer Durg'],
  'Fort & Palace',
  ST_GEOGPOINT(75.8513, 26.9855),
  'Rajasthan',
  'Jaipur',
  'Jaipur',
  'Jaipur Circle',
  TRUE,
  'Hill Forts of Rajasthan',
  'Kachhwaha Rajputs',
  '16th Century Rajputana (Raja Man Singh I)',
  1592,
  'Perched dramatically on the rugged Cheel ka Teela above Maota Lake, Amer Fort is a spellbinding fusion of Rajput martial audacity and opulent Mughal court aesthetics. Celebrated for the Sheesh Mahal (Hall of Mirrors) and ancient subterranean passage networks.',
  'Dominating the crest of Cheel ka Teela (Hill of Eagles) overlooking the tranquil waters of Maota Lake, Amer Fort served as the fortified seat of the Kachhwaha Rajput rulers before the founding of Jaipur. Commenced in 1592 CE by Raja Man Singh I—a trusted general of Mughal Emperor Akbar—and subsequently expanded by Mirza Raja Jai Singh and Sawai Jai Singh II, the palace complex is constructed from rich red sandstone and gleaming pale yellow marble. The fort is organized into four sequential courtyards, progressing from the public parade grounds of Jaleb Chowk to the private royal chambers. Its most famous interior sanctuary is the legendary Sheesh Mahal (Mirror Palace), whose walls and ceilings are covered in thousands of concave imported Belgian glass mirror fragments arranged into blooming floral patterns, designed so that a single oil lamp would illuminate the entire chamber with the brilliance of a starlit galaxy. Above the palace, fortified ramparts ascend the Aravalli ridges to link directly with Jaigarh Fort through a 2-kilometer underground escape tunnel designed to safeguard the royal lineage during prolonged sieges.',
  ['Sheesh Mahal mirror mosaics reflecting candle flames across concave glass', 'Suraj Pol (Sun Gate) monumental portal leading to expansive Jaleb Chowk', 'Ganesh Pol multi-storied gateway painted with natural vegetable dyes', 'Underground escape tunnel connecting Amer to the mountaintop Jaigarh Fort'],
  STRUCT('08:00', '18:00', [], 'October to March; morning light on Maota Lake'),
  STRUCT(100.0, 100.0, 500.0, TRUE),
  100.0,
  500.0,
  'https://asi.payumoney.com/quick/amer',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Amer_Fort%2C_Jaipur.jpg/960px-Amer_Fort%2C_Jaipur.jpg',
  TIMESTAMP('2026-01-01 00:00:00 UTC'),
  TIMESTAMP('2026-09-01 00:00:00 UTC')
),
(
  'qutub-minar',
  'Qutub Minar & Complex',
  'क़ुतुब मीनार',
  ['Qutb Minar', 'Qutb Complex', 'Tower of Victory'],
  'Memorial & Gate',
  ST_GEOGPOINT(77.1855, 28.5245),
  'Delhi',
  'New Delhi',
  'South Delhi',
  'Delhi Circle',
  TRUE,
  'Qutb Minar and its Monuments, Delhi',
  'Mamluk (Slave) Dynasty',
  '12th-13th Century Delhi Sultanate (Qutb ud-Din Aibak)',
  1199,
  'Soaring 72.5 meters into the Delhi sky, Qutub Minar is the tallest brick minaret in the world, marking the triumphant establishment of Islamic rule in Northern India. The surrounding complex houses the 1,600-year-old rust-resistant Gupta Iron Pillar and Quwwat-ul-Islam Mosque.',
  'Standing as an indelible landmark of medieval Delhi, the Qutub Minar is an imposing 72.5-meter five-storied red and buff sandstone minaret tapering from a base diameter of 14.3 meters to just 2.7 meters at its summit. Initiated in 1199 CE by Qutb ud-Din Aibak following the defeat of Delhi last Hindu kingdom and completed by his successor Shams ud-Din Iltutmish and later repaired by Firoz Shah Tughlaq, the minaret exemplifies early Indo-Islamic engineering. The first three storeys feature fluted columns composed of alternating angular and rounded sandstone pilasters, wrapped in calligraphic bands inscribed with verses from the Holy Quran and eulogies to its patrons. The balconies projecting from each storey are supported by elaborate clustered stalactite corbels (muqarnas). Within the tranquil precinct lies the Quwwat-ul-Islam Mosque, built from the structural elements of twenty-seven spoliated ancient temples, and the legendary 4th-century CE Gupta Iron Pillar, which stands 7.2 meters tall and has defied atmospheric corrosion for over sixteen centuries.',
  ['World tallest brick minaret standing 72.5 meters with five tapering tiers', 'Elaborate muqarnas stalactite corbelling supporting projecting balconies', 'Kufic and Naskh calligraphic Quranic bands carved into fluted sandstone', 'Metallurgical marvel 1,600-year-old rust-resistant Gupta Iron Pillar'],
  STRUCT('07:00', '19:00', [], 'November to February; early morning or sunset'),
  STRUCT(40.0, 40.0, 600.0, TRUE),
  40.0,
  600.0,
  'https://asi.payumoney.com/quick/qutub',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Qutub_Minar_Delhi.jpg/960px-Qutub_Minar_Delhi.jpg',
  TIMESTAMP('2026-01-01 00:00:00 UTC'),
  TIMESTAMP('2026-09-01 00:00:00 UTC')
);

-- 5.2 Seed Daily Telemetry into `daily_visitor_telemetry`
INSERT INTO `herodotus_dw.daily_visitor_telemetry` (
  telemetry_id, visit_date, monument_id, state, domestic_visitors, foreign_visitors,
  total_visitors, revenue_inr, avg_dwell_minutes, weather_condition,
  temperature_celsius, peak_crowd_hour, audio_guides_started, audio_guides_completed,
  avg_listen_duration_seconds, is_national_holiday, is_weekend, ingested_at
)
VALUES
  ('TEL-20260901-TM', DATE('2026-09-01'), 'taj-mahal', 'Uttar Pradesh', 18400, 2600, 21000, 3780000.0, 115.0, 'Clear', 32.5, 10, 3120, 2480, 520.0, FALSE, FALSE, CURRENT_TIMESTAMP()),
  ('TEL-20260902-TM', DATE('2026-09-02'), 'taj-mahal', 'Uttar Pradesh', 19200, 2800, 22000, 4040000.0, 118.0, 'Clear', 33.0, 11, 3350, 2700, 540.0, FALSE, FALSE, CURRENT_TIMESTAMP()),
  ('TEL-20260903-TM', DATE('2026-09-03'), 'taj-mahal', 'Uttar Pradesh', 24100, 3400, 27500, 4945000.0, 125.0, 'Clear', 31.8, 11, 4100, 3320, 560.0, FALSE, TRUE, CURRENT_TIMESTAMP()),
  ('TEL-20260901-AF', DATE('2026-09-01'), 'amer-fort', 'Rajasthan', 7800, 1400, 9200, 1480000.0, 140.0, 'Sunny', 34.2, 11, 1420, 1120, 480.0, FALSE, FALSE, CURRENT_TIMESTAMP()),
  ('TEL-20260902-AF', DATE('2026-09-02'), 'amer-fort', 'Rajasthan', 8200, 1550, 9750, 1595000.0, 142.0, 'Sunny', 34.0, 12, 1510, 1190, 495.0, FALSE, FALSE, CURRENT_TIMESTAMP()),
  ('TEL-20260903-AF', DATE('2026-09-03'), 'amer-fort', 'Rajasthan', 11500, 2100, 13600, 2200000.0, 155.0, 'Sunny', 33.5, 11, 2150, 1780, 530.0, FALSE, TRUE, CURRENT_TIMESTAMP()),
  ('TEL-20260901-QM', DATE('2026-09-01'), 'qutub-minar', 'Delhi', 6200, 950, 7150, 818000.0, 95.0, 'Clear', 31.0, 16, 920, 710, 410.0, FALSE, FALSE, CURRENT_TIMESTAMP()),
  ('TEL-20260902-QM', DATE('2026-09-02'), 'qutub-minar', 'Delhi', 6450, 1020, 7470, 870000.0, 98.0, 'Clear', 31.5, 15, 960, 740, 425.0, FALSE, FALSE, CURRENT_TIMESTAMP()),
  ('TEL-20260903-QM', DATE('2026-09-03'), 'qutub-minar', 'Delhi', 8900, 1450, 10350, 1226000.0, 110.0, 'Clear', 30.5, 16, 1380, 1090, 460.0, FALSE, TRUE, CURRENT_TIMESTAMP());

-- 5.3 Seed User Bookmarks into `user_bookmarks`
INSERT INTO `herodotus_dw.user_bookmarks` (
  bookmark_id, user_id, monument_id, created_date, created_at, device_platform,
  audio_listened_seconds, interaction_type, notes
)
VALUES
  ('BMK-001', 'usr-traveler-delhi-01', 'taj-mahal', DATE('2026-09-01'), TIMESTAMP('2026-09-01 09:15:00 UTC'), 'Android_PWA', 480, 'plan_visit', 'Sunrise visit booked on Friday morning replacement'),
  ('BMK-002', 'usr-traveler-mumbai-04', 'amer-fort', DATE('2026-09-02'), TIMESTAMP('2026-09-02 14:30:00 UTC'), 'iOS_PWA', 620, 'audio_completed', 'Loved the Sheesh Mahal mirror acoustical story'),
  ('BMK-003', 'usr-traveler-bangalore-09', 'qutub-minar', DATE('2026-09-03'), TIMESTAMP('2026-09-03 17:45:00 UTC'), 'Android_PWA', 390, 'save_favorite', 'Plan to see the Gupta Iron pillar at sunset');
