import { Brain, Clock, TrendingUp, Heart, ChevronRight, Sun, Sparkles, Play, BellRing, CalendarHeart } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  isOnline?: boolean;
}

export default function HomeScreen({ onNavigate, isOnline = true }: HomeScreenProps) {
  const greeting = getGreeting();

  return (
    <>
      <AppHeader
        title="Smriti Sathi"
        subtitle="Your memory companion"
        showSettings
        onSettingsPress={() => onNavigate('settings')}
        isOnline={isOnline}
      />
      <div className="px-4 sm:px-6 py-6 pb-28 space-y-6 max-w-7xl mx-auto">
        {/* Hero Greeting */}
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-0 bg-[radial-gradient(600px_280px_at_18%_0%,rgba(79,70,229,0.12),transparent_60%),radial-gradient(520px_300px_at_92%_20%,rgba(16,185,129,0.12),transparent_60%),radial-gradient(520px_280px_at_55%_100%,rgba(245,158,11,0.08),transparent_60%)]" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,transparent,#DDD6FE,transparent)] opacity-60" />
          <div className="relative p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex h-14 w-14 rounded-2xl items-center justify-center bg-[linear-gradient(135deg,#FFFBEB_0%,#FEF3C7_100%)] border border-amber-200 shadow-sm flex-shrink-0">
                <Sun size={26} className="text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-extrabold tracking-wide">
                  <Sparkles size={12} /> DAILY CARE • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </div>
                <h2 className="mt-3 text-[22px] sm:text-[26px] font-extrabold tracking-tight leading-none text-[var(--color-text)]" style={{ fontFamily: 'var(--font-display)' }}>
                  {greeting}
                </h2>
                <p className="mt-2 text-[14px] sm:text-[15px] font-medium leading-relaxed text-[var(--color-text-secondary)] max-w-[52ch]">
                  Let’s do something nice for your mind today — a gentle game, a calm reminder, a familiar memory.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 3 games this week
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-bold shadow-sm">
                    <TrendingUp size={12} /> Keep it up!
                  </span>
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-center gap-2 flex-shrink-0">
                <div className="h-[88px] w-[88px] rounded-[24px] bg-[linear-gradient(135deg,#4F46E5_0%,#7C3AED_100%)] shadow-[0_12px_28px_rgba(79,70,229,0.28)] flex items-center justify-center text-white">
                  <CalendarHeart size={36} />
                </div>
                <span className="text-[11px] font-extrabold tracking-wide text-[var(--color-text-muted)]">TODAY</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-center">
                <p className="text-[11px] font-extrabold tracking-wide text-[var(--color-text-muted)]">STREAK</p>
                <p className="text-[22px] font-black tracking-tight text-[var(--color-text)]">6 days</p>
                <p className="text-[11px] font-semibold text-emerald-600">• On track</p>
              </div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 text-center shadow-sm">
                <p className="text-[11px] font-extrabold tracking-wide text-[var(--color-text-muted)]">NEXT</p>
                <p className="text-[13px] font-extrabold text-[var(--color-text)] leading-tight">Memory • 11:00 AM</p>
                <p className="text-[11px] font-semibold text-indigo-600">Tap to start</p>
              </div>
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-3 text-center">
                <p className="text-[11px] font-extrabold tracking-wide text-indigo-700">CARE</p>
                <p className="text-[13px] font-extrabold text-indigo-900 leading-tight">2 reminders</p>
                <p className="text-[11px] font-semibold text-indigo-700">pending today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions — tactile, large */}
        <div className="space-y-3">
          <div className="flex items-baseline justify-between px-1">
            <h3 className="text-[13px] font-black tracking-[0.08em] text-[var(--color-text-muted)]">QUICK ACTIONS</h3>
            <span className="text-[11px] font-bold text-[var(--color-text-faint)]">Tap a card</span>
          </div>

          <Card
            onPress={() => onNavigate('games')}
            className="group p-0 overflow-hidden"
          >
            <div className="flex items-center gap-4 p-4 sm:p-5">
              <div className="h-[56px] w-[56px] rounded-2xl flex items-center justify-center flex-shrink-0 bg-[linear-gradient(135deg,#EFF6FF_0%,#DBEAFE_100%)] border border-sky-200 text-sky-600 shadow-sm group-hover:scale-[1.03] group-hover:shadow-md transition-all">
                <Brain size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[16px] font-extrabold tracking-tight text-[var(--color-text)]">Play a Game</h4>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-extrabold tracking-wide"><Play size={10} /> 4 GAMES</span>
                </div>
                <p className="text-[13px] font-medium text-[var(--color-text-muted)] mt-0.5">Memory & pattern exercises • 5–7 min</p>
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#0EA5E9,#38BDF8)]" />
                </div>
              </div>
              <span className="h-10 w-10 rounded-full bg-slate-900 dark:bg-slate-700 text-white inline-flex items-center justify-center shadow-[0_8px_16px_rgba(15,23,42,0.14)] group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                <ChevronRight size={18} />
              </span>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card onPress={() => onNavigate('reminders')} className="group p-0 overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-[linear-gradient(135deg,#FFFBEB_0%,#FEF3C7_100%)] border border-amber-200 text-amber-600 shadow-sm">
                  <Clock size={22} />
                </div>
                <h4 className="mt-3 text-[15px] font-extrabold tracking-tight text-[var(--color-text)] flex items-center gap-2">
                  Reminders <BellRing size={14} className="text-amber-500" />
                </h4>
                <p className="text-[13px] font-medium text-[var(--color-text-muted)] mt-1">Medicine, hydration & appointments</p>
                <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-500" /> 2 pending • 1 done
                </div>
              </div>
            </Card>

            <Card onPress={() => onNavigate('progress')} className="group p-0 overflow-hidden">
              <div className="p-4 sm:p-5">
                <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-[linear-gradient(135deg,#ECFDF5_0%,#D1FAE5_100%)] border border-emerald-200 text-emerald-600 shadow-sm">
                  <TrendingUp size={22} />
                </div>
                <h4 className="mt-3 text-[15px] font-extrabold tracking-tight text-[var(--color-text)]">My Progress</h4>
                <p className="text-[13px] font-medium text-[var(--color-text-muted)] mt-1">Weekly trends & gentle insights</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold">
                  ↑ +4% this week
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Wellbeing Note */}
        <div className="rounded-[24px] border border-amber-200 bg-[linear-gradient(135deg,#FFFBEB_0%,#FFF7ED_60%,#FFFFFF_100%)] p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 rounded-full bg-white border border-amber-200 shadow-sm inline-flex items-center justify-center flex-shrink-0">
              <Heart size={18} className="text-amber-600" />
            </span>
            <div>
              <h4 className="text-[14px] font-extrabold tracking-tight text-amber-900">A Gentle Reminder</h4>
              <p className="text-[13px] font-medium leading-relaxed text-amber-900/70 mt-1">
                These activities are for cognitive engagement and enjoyment. They are not medical diagnostics. Always consult your doctor for health concerns.
              </p>
            </div>
          </div>
        </div>

        {/* Today's Schedule — timeline */}
        <div className="space-y-3">
          <h3 className="text-[13px] font-black tracking-[0.08em] text-[var(--color-text-muted)] px-1">TODAY • TIMELINE</h3>
          <Card className="p-4 sm:p-5">
            <div className="relative pl-6">
              <div className="absolute left-[7px] top-2 bottom-2 w-[2px] rounded-full bg-[linear-gradient(180deg,#E2E8F0, #CBD5E1)]" />
              <div className="space-y-4">
                <ScheduleItem time="9:00 AM" label="Morning Medicine" done tone="success" />
                <ScheduleItem time="11:00 AM" label="Memory Game Session" tone="indigo" action="Start" />
                <ScheduleItem time="2:00 PM" label="Afternoon Walk" tone="sky" />
                <ScheduleItem time="5:00 PM" label="Evening Tea & Relax" tone="amber" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function ScheduleItem({ time, label, done = false, tone = 'slate', action }: { time: string; label: string; done?: boolean; tone?: 'success' | 'indigo' | 'sky' | 'amber' | 'slate'; action?: string }) {
  const dot: Record<string, string> = {
    success: 'bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.18)] border-white',
    indigo: 'bg-indigo-500 shadow-[0_0_0_6px_rgba(79,70,229,0.15)] border-white',
    sky: 'bg-sky-500 shadow-[0_0_0_6px_rgba(14,165,233,0.15)] border-white',
    amber: 'bg-amber-500 shadow-[0_0_0_6px_rgba(245,158,11,0.15)] border-white',
    slate: 'bg-slate-300 border-white',
  };
  return (
    <div className={`relative flex items-center gap-3 ${done ? 'opacity-60' : ''}`}>
      <span className={`absolute -left-6 h-3.5 w-3.5 rounded-full border-2 ${dot[tone]}`} />
      <span className="text-[12px] font-extrabold tracking-wide text-[var(--color-text-muted)] min-w-[78px]">{time}</span>
      <span className={`text-[14px] font-bold ${done ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text)]'}`}>{label}</span>
      {done ? (
        <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold">Done</span>
      ) : action ? (
        <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full bg-slate-900 dark:bg-indigo-600 text-white text-[11px] font-extrabold shadow-sm">{action}</span>
      ) : null}
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning 🌅';
  if (hour < 17) return 'Good Afternoon ☀️';
  return 'Good Evening 🌙';
}
