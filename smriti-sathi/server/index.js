const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory telemetry cache for testing & demonstration
const telemetryDatabase = {
  sessions: [],
  reminders: [],
  sosAlerts: [],
  lastSyncedAt: null,
};

// 1. Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    platform: 'Smriti Sathi Cloud Production Platform',
    version: '3.0.0',
    recordsStored: telemetryDatabase.sessions.length,
    lastSync: telemetryDatabase.lastSyncedAt,
  });
});

// 2. Cloud REST Sync endpoint (called from CaregiverDash)
app.post('/api/sync', (req, res) => {
  const { deviceId, patientId, sessions, reminderLogs, events, timestamp } = req.body;

  if (Array.isArray(sessions)) {
    telemetryDatabase.sessions.push(...sessions);
  }
  if (Array.isArray(reminderLogs)) {
    telemetryDatabase.reminders.push(...reminderLogs);
  }
  if (Array.isArray(events)) {
    telemetryDatabase.sessions.push(...events);
  }

  telemetryDatabase.lastSyncedAt = new Date().toISOString();

  console.log(`[SYNC SUCCESS] Received payload from device: ${deviceId || 'Patient Tablet'}`);

  res.json({
    success: true,
    message: 'Telemetry synchronized successfully',
    syncedAt: telemetryDatabase.lastSyncedAt,
    totalSessionsRecorded: telemetryDatabase.sessions.length,
  });
});

// 3. Telemetry summary endpoint (for remote ASHA or doctor web view)
app.get('/api/telemetry', (req, res) => {
  const totalReminders = telemetryDatabase.reminders.length;
  const completedReminders = telemetryDatabase.reminders.filter((r) => r.status === 'completed').length;
  const adherence = totalReminders > 0 ? `${Math.round((completedReminders / totalReminders) * 100)}%` : null;

  res.json({
    totalSessions: telemetryDatabase.sessions.length,
    recentSessions: telemetryDatabase.sessions.slice(-20),
    medicationAdherenceRate: adherence,
    lastSync: telemetryDatabase.lastSyncedAt,
    activeAlerts: telemetryDatabase.sosAlerts.filter((a) => a.status === 'DISPATCHED_TO_ASHA_WORKER').length,
  });
});

// 4. Emergency SOS Webhook
app.post('/api/sos', (req, res) => {
  const { deviceId, coordinates, timestamp } = req.body;
  const alert = {
    id: `sos_${Date.now()}`,
    deviceId: deviceId || 'Elder-Tablet',
    coordinates: coordinates || { latitude: 26.1445, longitude: 91.7362 },
    timestamp: timestamp || new Date().toISOString(),
    status: 'DISPATCHED_TO_ASHA_WORKER',
  };
  telemetryDatabase.sosAlerts.push(alert);
  res.json({ success: true, alertId: alert.id, message: 'Emergency response alert dispatched' });
});

// 5. In-App Auto-Update & Version Authority (Render Cloud Backend)
app.get('/api/version', (req, res) => {
  res.json({
    latestVersion: 'v3.0.0',
    versionCode: 300,
    downloadUrl: 'https://github.com/yoursexybhavya/smriti-sathi/releases/download/v3.0.0/SmritiSathi-v3.0.0.apk',
    releaseNotes: 'Smriti Sathi v3.0.0: Warm Heritage Care complete UI/UX overhaul, 52/60/72px touch targets, errorless learning cognitive games, offline fonts, and safe return rescue tools.',
    publishedAt: new Date().toISOString(),
  });
});

// 6. Host the compiled Android/PWA web assets for PC, tablet and phone testing
const candidateDistPaths = [
  path.resolve(__dirname, '../dist'),
  path.resolve(__dirname, '../../smriti-sathi/dist'),
  path.resolve(process.cwd(), 'smriti-sathi/dist'),
  path.resolve(process.cwd(), 'dist'),
];

let validDistPath = candidateDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));

// Automatic fallback: build dist if missing
if (!validDistPath) {
  try {
    const { execSync } = require('child_process');
    console.log('[AUTO-BUILD] No dist found. Building web app assets via Vite...');
    const buildCwd = fs.existsSync(path.resolve(__dirname, '../package.json'))
      ? path.resolve(__dirname, '..')
      : process.cwd();
    execSync('npm run build', { cwd: buildCwd, stdio: 'inherit' });
    validDistPath = candidateDistPaths.find((p) => fs.existsSync(path.join(p, 'index.html')));
  } catch (err) {
    console.error('[AUTO-BUILD FAILED]', err);
  }
}

if (validDistPath) {
  console.log(`[STATIC ASSETS] Serving Smriti Sathi Web App from: ${validDistPath}`);
  app.use(express.static(validDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') return next();
    res.sendFile(path.join(validDistPath, 'index.html'));
  });
} else {
  console.warn('[STATIC ASSETS] Warning: Could not locate built web app assets.');
  app.get('/', (req, res) => {
    res.json({
      status: 'ONLINE',
      message: 'Smriti Sathi Cloud Production Server is live & healthy!',
      platform: 'Smriti Sathi Cloud Platform',
      endpoints: {
        health: '/health',
        sync: 'POST /api/sync',
        telemetry: 'GET /api/telemetry',
        sos: 'POST /api/sos',
        version: 'GET /api/version'
      }
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` Smriti Sathi Testing & Sync Server listening on port ${PORT}`);
  console.log(` Endpoint: http://localhost:${PORT}`);
  console.log(` Health:   http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
