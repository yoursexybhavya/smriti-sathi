import { useState, useEffect } from 'react';
import { 
  TrendingUp, Brain, Heart, Calendar, Award, Activity, Volume2, 
  VolumeX, Share2, CheckCircle2, AlertTriangle, ShieldCheck, 
  Download, Clock, Pill, Droplet, Coffee, X 
} from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import LargeButton from '../components/LargeButton';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useVoice } from '../hooks/useVoice';
import { 
  longitudinalAnalyticsService, 
  LongitudinalMetrics, 
  TimeWindow 
} from '../services/LongitudinalAnalyticsService';

interface ProgressScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function ProgressScreen({ onNavigate, isOnline = true }: ProgressScreenProps) {
  const { state } = useApp();
  const { language } = useLanguage();
  const userId = state.currentPatient?.id ? parseInt(state.currentPatient.id) : 1;
  const patientName = state.currentPatient?.name || 'Elder';

  const { speak, stopSpeaking, isSpeaking } = useVoice();

  const [timeWindow, setTimeWindow] = useState<TimeWindow>('365d');
  const [metrics, setMetrics] = useState<LongitudinalMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAshaModal, setShowAshaModal] = useState(false);
  const [copiedAshaReport, setCopiedAshaReport] = useState(false);

  useEffect(() => {
    loadMetrics();
    return () => {
      stopSpeaking();
    };
  }, [userId, timeWindow]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await longitudinalAnalyticsService.getLongitudinalMetrics(userId, timeWindow);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load longitudinal metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudioSummary = () => {
    if (!metrics) return;
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    const textToRead = language === 'as' 
      ? metrics.spokenSummary.textAssamese 
      : metrics.spokenSummary.textEnglish;
    speak(textToRead, language === 'as' ? 'as' : 'en');
  };

  const handleCopyAshaReport = async () => {
    if (!metrics) return;
    try {
      await navigator.clipboard.writeText(metrics.ashaReportText);
      setCopiedAshaReport(true);
      setTimeout(() => setCopiedAshaReport(false), 2500);
    } catch (e) {
      console.warn('Failed to copy report to clipboard:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-between">
      <AppHeader 
        title="My Progress" 
        subtitle="মোৰ অগ্ৰগতি আৰু স্বাস্থ্য প্ৰতিবেদন" 
        isOnline={isOnline} 
        showBack 
        onBack={() => onNavigate('home')} 
        showSettings
        onSettingsPress={() => onNavigate('settings')}
      />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 pb-28 space-y-6">
        {/* Time Window Selector Pills */}
        <div className="flex items-center justify-between bg-[var(--color-card)] p-2 rounded-2xl border-2 border-[var(--color-border)] shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] pl-2 hidden sm:inline">
            Tracking Period:
          </span>
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-around">
            {(['365d', '180d', '90d', '30d', '7d'] as TimeWindow[]).map((win) => {
              const labels: Record<TimeWindow, string> = {
                '365d': '1 Year',
                '180d': '6 Mos',
                '90d': '3 Mos',
                '30d': '30 Days',
                '7d': '7 Days',
              };
              const isSelected = timeWindow === win;
              return (
                <button
                  key={win}
                  type="button"
                  onClick={() => setTimeWindow(win)}
                  className={`min-h-[44px] px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-md scale-105'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]'
                  }`}
                >
                  {labels[win]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio-First Hero Banner for Illiterate Elders & Family */}
        <Card elevated className="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-900/80 rounded-3xl shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg">
                <Volume2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[var(--color-text)]">
                  Listen to Health Report
                </h3>
                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  স্বাস্থ্য প্ৰতিবেদন শুনক (অসমীয়া / English)
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  Tap to hear your {timeWindow === '365d' ? 'past year' : 'recent'} chores and memory summary spoken aloud.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayAudioSummary}
              className={`min-h-[56px] px-6 py-3.5 rounded-2xl font-extrabold flex items-center gap-3 transition-all duration-200 border-2 shadow-md active:scale-95 ${
                isSpeaking
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 hover:scale-105'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-6 h-6" />
                  <span>Stop Speaking / বন্ধ কৰক</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6" />
                  <span>Play Spoken Report</span>
                </>
              )}
            </button>
          </div>
        </Card>

        {loading || !metrics ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-base font-bold text-[var(--color-text-muted)]">Calibrating longitudinal health data...</p>
          </div>
        ) : (
          <>
            {/* Clinical Stability Performance Index (SPI) Engine Card */}
            <Card elevated className="p-5 sm:p-6 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-3xl shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    metrics.spi.status === 'STABLE'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : metrics.spi.status === 'MILD_VARIATION'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  }`}>
                    {metrics.spi.status === 'STABLE' ? (
                      <ShieldCheck className="w-7 h-7" />
                    ) : (
                      <AlertTriangle className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-text)]">
                      {metrics.spi.statusTitle}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {metrics.spi.statusTitleRegional}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${
                    metrics.spi.status === 'STABLE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                      : metrics.spi.status === 'MILD_VARIATION'
                      ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                  }`}>
                    {metrics.spi.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
                <div className="bg-[var(--color-bg-subtle)] p-3.5 rounded-2xl border border-[var(--color-border)] text-center">
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {metrics.spi.baselineMedian}%
                  </p>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">14-Session Baseline</p>
                </div>
                <div className="bg-[var(--color-bg-subtle)] p-3.5 rounded-2xl border border-[var(--color-border)] text-center">
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                    {metrics.spi.recentMedian}%
                  </p>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">Recent Window</p>
                </div>
                <div className="bg-[var(--color-bg-subtle)] p-3.5 rounded-2xl border border-[var(--color-border)] text-center">
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {metrics.cognitive.totalSessions}
                  </p>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">Total Exercises</p>
                </div>
                <div className="bg-[var(--color-bg-subtle)] p-3.5 rounded-2xl border border-[var(--color-border)] text-center">
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {metrics.chores.overallAdherencePct}%
                  </p>
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] mt-1">Routine Adherence</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                <strong>Clinical Observation:</strong> {metrics.spi.statusDescription} ({metrics.spi.statusDescriptionRegional})
              </div>
            </Card>

            {/* Daily Chores & Routine Adherence Section */}
            <Card elevated className="p-5 sm:p-6 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-text)]">
                      Daily Chores & Routine Adherence
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)]">দৈনিক কাৰ্যসূচী আৰু ঔষধ খোৱাৰ হাৰ</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {metrics.chores.overallAdherencePct}%
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-muted)] block">Done on time</span>
                </div>
              </div>

              {/* Visual Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {metrics.chores.breakdown.map((chore) => (
                  <div 
                    key={chore.type}
                    className="p-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-subtle)] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{chore.icon}</span>
                      <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {chore.percentage}%
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-[var(--color-text)]">{chore.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{chore.nameRegional}</p>
                    </div>
                    <div className="mt-3 w-full bg-[var(--color-border)] rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${chore.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cognitive Domains & Family Recognition Accuracy */}
            <Card elevated className="p-5 sm:p-6 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-3xl shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[var(--color-text)]">
                    Cognitive & Family Memory Accuracy
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">পৰিয়াল আৰু স্মৃতি পৰীক্ষাৰ ফলাফল</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-center">
                  <span className="text-2xl mb-1 inline-block">❤️</span>
                  <p className="text-2xl font-black text-rose-500">{metrics.cognitive.familyQuizAccuracy}%</p>
                  <p className="text-sm font-extrabold text-[var(--color-text)] mt-1">Family Recognition</p>
                  <p className="text-xs text-[var(--color-text-muted)]">পৰিয়াল চিনাক্তকৰণ</p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-center">
                  <span className="text-2xl mb-1 inline-block">🧩</span>
                  <p className="text-2xl font-black text-indigo-500">{metrics.cognitive.memoryAccuracy}%</p>
                  <p className="text-sm font-extrabold text-[var(--color-text)] mt-1">Working Memory</p>
                  <p className="text-xs text-[var(--color-text-muted)]">কাৰ্যকৰী স্মৃতি শক্তি</p>
                </div>

                <div className="p-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-center">
                  <span className="text-2xl mb-1 inline-block">⏱️</span>
                  <p className="text-2xl font-black text-amber-500">{metrics.cognitive.medianLatencySeconds}s</p>
                  <p className="text-sm font-extrabold text-[var(--color-text)] mt-1">Response Speed</p>
                  <p className="text-xs text-[var(--color-text-muted)]">উত্তৰ দিয়াৰ গতি</p>
                </div>
              </div>
            </Card>

            {/* ASHA Health Worker Action Hub */}
            <Card elevated className="p-5 sm:p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-emerald-300 dark:border-emerald-800 rounded-3xl shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xl font-extrabold text-[var(--color-text)]">
                      ASHA Community Health Worker Hub
                    </h3>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 font-semibold mt-1">
                    আশা কৰ্মীৰ সৈতে প্ৰতিবেদন বিনিময়
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] max-w-lg mt-1">
                    Export a non-diagnostic clinical summary card of chores and memory metrics calibrated over the {timeWindow === '365d' ? 'past year' : 'selected window'}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAshaModal(true)}
                  className="min-h-[52px] px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md border-2 border-emerald-700 flex items-center gap-2.5 active:scale-95 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Send to ASHA Worker</span>
                </button>
              </div>
            </Card>
          </>
        )}
      </main>

      {/* ASHA Handoff Modal */}
      {showAshaModal && metrics && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)] max-w-xl w-full rounded-3xl border-3 border-[var(--color-border)] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
              <div>
                <h3 className="text-xl font-extrabold text-[var(--color-text)]">
                  ASHA Community Clinical Handoff
                </h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  আশা কৰ্মীৰ বাবে সাজু কৰা প্ৰতিবেদন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAshaModal(false)}
                className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-bg-subtle)]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-700 overflow-x-auto">
              {metrics.ashaReportText}
            </pre>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyAshaReport}
                className="flex-1 min-h-[52px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                {copiedAshaReport ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    <span>Copy Report for ASHA</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[52px] px-6 bg-[var(--color-card)] hover:bg-[var(--color-bg-subtle)] text-[var(--color-text)] font-bold rounded-2xl border-2 border-[var(--color-border)] flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-5 h-5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="py-4 text-center text-xs text-[var(--color-text-muted)]">
        Smriti Sathi • Longitudinal Dementia Cognitive Platform
      </footer>
    </div>
  );
}
