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
    platform: 'Smriti Sathi Cloud Testing Server',
    version: '1.0.0',
    recordsStored: telemetryDatabase.sessions.length,
    lastSync: telemetryDatabase.lastSyncedAt,
  });
});

// 2. Cloud REST Sync endpoint (called from CaregiverDash)
app.post('/api/sync', (req, res) => {
  const { deviceId, patientId, sessions, reminderLogs, timestamp } = req.body;

  if (Array.isArray(sessions)) {
    telemetryDatabase.sessions.push(...sessions);
  }
  if (Array.isArray(reminderLogs)) {
    telemetryDatabase.reminders.push(...reminderLogs);
  }

  telemetryDatabase.lastSyncedAt = new Date().toISOString();

  console.log(`[SYNC SUCCESS] Received ${sessions?.length || 0} sessions from device: ${deviceId || 'Bedside Tablet'}`);

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
    id: Date.now(),
    deviceId: deviceId || 'Bedside Tablet SM-T290',
    coordinates: coordinates || { lat: 26.1445, lng: 91.7362 },
    timestamp: timestamp || new Date().toISOString(),
    status: 'DISPATCHED_TO_ASHA',
  };

  telemetryDatabase.sosAlerts.push(alert);
  console.warn(`[EMERGENCY SOS ALERT] Bedside beacon triggered! Dispatching SMS to Son & ASHA...`);

  res.status(200).json({
    dispatched: true,
    alert,
    contactsNotified: ['Son (+91 98765 43210)', 'ASHA Worker (+91 98765 11223)'],
  });
});

// 5. Host the compiled Android/PWA web assets for tablet testing
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` Smriti Sathi Testing & Sync Server listening on port ${PORT}`);
  console.log(` Endpoint: http://localhost:${PORT}`);
  console.log(` Health:   http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});
