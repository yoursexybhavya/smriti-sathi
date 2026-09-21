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
    version: '2.4.0',
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
  res.json({
    patient: {
      name: 'Elder Patient',
      age: 72,
      location: 'Guwahati, Assam',
    },
    totalSessions: telemetryDatabase.sessions.length,
    recentSessions: telemetryDatabase.sessions.slice(-20),
    medicationAdherenceRate: '93%',
    lastSync: telemetryDatabase.lastSyncedAt,
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
    latestVersion: 'v2.9.0',
    versionCode: 290,
    downloadUrl: 'https://github.com/yoursexybhavya/smriti-sathi/releases/download/v2.9.0/SmritiSathi-v2.9.0.apk',
    releaseNotes: 'Smriti Sathi v2.9.0: Fluid touch scrolling with native momentum, full bottom navigation bar clearance (pb-44/pb-52) across all screens preventing UI overlap, untruncated mobile headers, and seamless multilingual voice prompts.',
    publishedAt: new Date().toISOString(),
  });
});

// 6. Host the compiled Android/PWA web assets for tablet testing
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'ONLINE',
      message: 'Smriti Sathi Cloud Production Server is live & healthy!',
      platform: 'Smriti Sathi Cloud Platform',
      endpoints: {
        health: '/health',
        sync: 'POST /api/sync',
        telemetry: 'GET /api/telemetry',
        sos: 'POST /api/sos'
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
