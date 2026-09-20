import { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Bluetooth, 
  Share2, 
  Cloud, 
  ShieldCheck, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  HardDrive, 
  Activity, 
  Users, 
  Radio
} from 'lucide-react';

export default function OfflineSyncDemo() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pendingRecords, setPendingRecords] = useState(14);
  const [syncedRecords, setSyncedRecords] = useState(86);
  const [isSimulating, setIsSimulating] = useState(false);
  const [connectionMode, setConnectionMode] = useState<'ble' | 'hotspot'>('ble');
  const [logs, setLogs] = useState<string[]>([
    'System initialized in North East Offline Store-and-Forward mode.',
    'Local IndexedDB active: 14 offline cognitive sessions queued.',
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 7)]);
  };

  const handleSimulateElderPlay = () => {
    setPendingRecords(prev => prev + 1);
    addLog('🎮 Elder completed Memory Quiz offline. Saved to local IndexedDB (Zero internet required).');
  };

  const handleSimulateAshaHandshake = () => {
    setIsSimulating(true);
    setStep(2);
    addLog(`🤝 ASHA Worker device detected via ${connectionMode.toUpperCase()}. Initiating encrypted P2P handshake...`);
    setTimeout(() => {
      addLog('🔐 Patient pairing key verified. Transferred encrypted SPI records to ASHA tablet.');
      setIsSimulating(false);
    }, 1200);
  };

  const handleSimulateCloudUpload = () => {
    setIsSimulating(true);
    setStep(3);
    addLog('🚗 ASHA worker arrived at Primary Health Centre (PHC). Cellular network detected.');
    setTimeout(() => {
      setSyncedRecords(prev => prev + pendingRecords);
      setPendingRecords(0);
      addLog(`☁️ Successfully opportunistic-synced ${pendingRecords} pending records to hospital database!`);
      setIsSimulating(false);
    }, 1500);
  };

  const handleResetSimulation = () => {
    setStep(1);
    setPendingRecords(14);
    setSyncedRecords(86);
    setLogs([
      'Simulation reset.',
      'Local IndexedDB active: 14 offline cognitive sessions queued.',
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 p-4 sm:p-5 rounded-3xl border-2 border-sky-200 dark:border-sky-800 shadow-xs">
        <div className="flex items-center gap-2.5 text-sky-800 dark:text-sky-200 font-extrabold text-sm mb-1">
          <Radio size={20} className="animate-pulse text-sky-600 dark:text-sky-400" />
          <span>North East Offline Store-and-Forward Mesh Architecture</span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          In remote areas with zero cellular connectivity, elders record cognitive SPI telemetry and daily medication logs completely offline. A visiting ASHA worker or family guardian syncs data peer-to-peer via Bluetooth Low Energy (BLE) or local Wi-Fi Hotspot, forward-batching to the cloud whenever internet becomes available.
        </p>
      </div>

      {/* 3-Stage Visual Pipeline Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Stage 1 */}
        <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all relative ${
          step === 1 
            ? 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-400 shadow-sm ring-2 ring-indigo-500/20' 
            : 'bg-[var(--color-card)] border-[var(--color-border)]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Stage 1: Elder Home
            </span>
            <WifiOff size={18} className="text-rose-500" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-2xl shadow-xs">
              👵
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--color-text)]">Local IndexedDB</h4>
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Zero Internet Needed</span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-snug">
            Games, routine progress, and care alarms work 100% locally.
          </p>
          <div className="mt-3.5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-extrabold">
            <span className="text-[var(--color-text-secondary)]">Queue:</span>
            <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-800">
              {pendingRecords} Pending Records
            </span>
          </div>
        </div>

        {/* Stage 2 */}
        <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all relative ${
          step === 2 
            ? 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-400 shadow-sm ring-2 ring-indigo-500/20' 
            : 'bg-[var(--color-card)] border-[var(--color-border)]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Stage 2: P2P Handshake
            </span>
            {connectionMode === 'ble' ? <Bluetooth size={18} className="text-indigo-600" /> : <Share2 size={18} className="text-indigo-600" />}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-2xl shadow-xs">
              🩺
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--color-text)]">ASHA / Son Tablet</h4>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Bluetooth / Hotspot</span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-snug">
            Direct peer sync with cryptographic pairing. No data leaks.
          </p>
          <div className="mt-3.5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-extrabold">
            <span className="text-[var(--color-text-secondary)]">Pairing Status:</span>
            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck size={13} /> Authenticated
            </span>
          </div>
        </div>

        {/* Stage 3 */}
        <div className={`p-4 sm:p-5 rounded-3xl border-2 transition-all relative ${
          step === 3 
            ? 'bg-indigo-50/70 dark:bg-indigo-950/60 border-indigo-600 dark:border-indigo-400 shadow-sm ring-2 ring-indigo-500/20' 
            : 'bg-[var(--color-card)] border-[var(--color-border)]'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Stage 3: PHC Sub-Centre
            </span>
            <Wifi size={18} className="text-emerald-600" />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-2xl shadow-xs">
              ☁️
            </div>
            <div>
              <h4 className="text-base font-bold text-[var(--color-text)]">Hospital Cloud</h4>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Opportunistic Sync</span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2 leading-snug">
            Automatic batch upload triggers clinical SPI doctor warnings.
          </p>
          <div className="mt-3.5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-extrabold">
            <span className="text-[var(--color-text-secondary)]">Cloud Synced:</span>
            <span className="text-emerald-700 dark:text-emerald-300">
              {syncedRecords} Records Saved
            </span>
          </div>
        </div>
      </div>

      {/* Protocol Toggle (BLE vs Wi-Fi Direct Hotspot) */}
      <div className="flex items-center justify-between bg-[var(--color-bg-subtle)] p-3 rounded-2xl border border-[var(--color-border)]">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text)]">
          <span>P2P Protocol:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setConnectionMode('ble')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              connectionMode === 'ble' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-[var(--color-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}
          >
            Bluetooth Low Energy (BLE)
          </button>
          <button
            type="button"
            onClick={() => setConnectionMode('hotspot')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              connectionMode === 'hotspot' 
                ? 'bg-indigo-600 text-white shadow-xs' 
                : 'bg-[var(--color-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)]'
            }`}
          >
            Wi-Fi Direct / Local Hotspot
          </button>
        </div>
      </div>

      {/* Interactive Simulation Controls for Judges */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Live Interactive Demonstration (Click to show Judges):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleSimulateElderPlay}
            disabled={isSimulating}
            className="p-3.5 rounded-2xl bg-[var(--color-card)] border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 font-bold text-xs sm:text-sm text-[var(--color-text)] text-left flex flex-col justify-between min-h-[88px] cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <span className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <span>🎮 1. Elder Plays Offline</span>
            </span>
            <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">
              +1 Offline SPI session queued
            </span>
          </button>

          <button
            type="button"
            onClick={handleSimulateAshaHandshake}
            disabled={isSimulating}
            className="p-3.5 rounded-2xl bg-[var(--color-card)] border-2 border-purple-200 dark:border-purple-800 hover:border-purple-500 font-bold text-xs sm:text-sm text-[var(--color-text)] text-left flex flex-col justify-between min-h-[88px] cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <span>🤝 2. ASHA Bluetooth Visit</span>
            </span>
            <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">
              Local peer handshake transfer
            </span>
          </button>

          <button
            type="button"
            onClick={handleSimulateCloudUpload}
            disabled={isSimulating || pendingRecords === 0}
            className="p-3.5 rounded-2xl bg-[var(--color-card)] border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 font-bold text-xs sm:text-sm text-[var(--color-text)] text-left flex flex-col justify-between min-h-[88px] cursor-pointer shadow-xs active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <span>☁️ 3. Reach Health Centre</span>
            </span>
            <span className="text-[11px] font-normal text-[var(--color-text-secondary)]">
              Batch upload to Doctor Cloud
            </span>
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Terminal Log */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-[11px] space-y-1.5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400">
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Sync Telemetry Terminal
          </span>
          <button
            type="button"
            onClick={handleResetSimulation}
            className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
          >
            Reset Demo
          </button>
        </div>
        {logs.map((log, idx) => (
          <div key={idx} className="leading-relaxed truncate">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
