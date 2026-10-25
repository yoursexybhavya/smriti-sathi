/**
 * SMRITI SATHI — Error Boundary
 *
 * The crash screen is the one screen someone sees at the worst possible
 * moment, so it is written in the same warm, calm language as the rest of the
 * product: no red alarm panels, no developer jargon in the elder's face, and
 * a single obvious way forward. Diagnostics stay available, folded away.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { LifeBuoy, RefreshCw, RotateCcw } from 'lucide-react';

/**
 * The boundary sits above the i18n provider, so it cannot use the `t()` hook.
 * It reads the saved language directly and carries its own five phrases — the
 * crash screen must never depend on anything that could itself be broken.
 */
const CRASH_COPY: Record<string, { title: string; body: string; retry: string; reload: string; details: string }> = {
  en: {
    title: 'Something went wrong',
    body: 'This is not your fault, and nothing you have saved is lost. Your memories, reminders and progress are still on this device.',
    retry: 'Try again',
    reload: 'Reload the app',
    details: 'Technical details',
  },
  hi: {
    title: 'कुछ गड़बड़ हो गई',
    body: 'इसमें आपकी कोई गलती नहीं है और आपका सेव किया हुआ कुछ भी नहीं खोया है। आपकी यादें, रिमाइंडर और प्रगति अभी भी इसी डिवाइस में सुरक्षित हैं।',
    retry: 'फिर कोशिश करें',
    reload: 'ऐप फिर खोलें',
    details: 'तकनीकी जानकारी',
  },
  as: {
    title: 'কিবা এটা ভুল হ’ল',
    body: 'এইয়া আপোনাৰ ভুল নহয়, আৰু আপুনি ছেভ কৰা একো হেৰাই যোৱা নাই। আপোনাৰ স্মৃতি, সোঁৱৰণী আৰু অগ্ৰগতি এই ডিভাইচতে আছে।',
    retry: 'পুনৰ চেষ্টা কৰক',
    reload: 'এপ্‌ পুনৰ খোলক',
    details: 'কাৰিকৰী তথ্য',
  },
  brx: {
    title: 'मोनसे गोरोन्थि जाबाय',
    body: 'बेयो नोंनि गोरोन्थि नङा, आरो नोंनि सेभ खालामनाय मोनोबो गैयिजा। नोंनि मुंगथु, रिमाइंडार आरो गोदान बे डिभाइसआव दं।',
    retry: 'फुन्दो नाय',
    reload: 'एप फुन्दो खेव',
    details: 'टेक्निकल फोरमान',
  },
  mni: {
    title: 'করিগুম্বা অমা তৌখিবি',
    body: 'অসি নহাক্কী খুন্নু নত্তে, অমসুং নহাক্না সেভ তৌখিবা অমত্তা লাইখিবশি। নহাক্কী নিংশিং, রিমাইন্দর অমসুং চৎখিবা অসি মসি দিভাইসতা লৈরি।',
    retry: 'অমুক হন্না হংবিয়ু',
    reload: 'এপ অমুক হন্না হংবিয়ু',
    details: 'তেকনিকেল ওয়ারোল',
  },
};

function crashCopy() {
  let lang = 'en';
  try {
    const stored = localStorage.getItem('smriti_lang');
    if (stored && stored in CRASH_COPY) lang = stored;
  } catch {
    /* storage blocked — English is the safe fallback */
  }
  return CRASH_COPY[lang] ?? CRASH_COPY.en;
}

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const copy = crashCopy();
      return (
        <div
          className="flex min-h-[100dvh] w-full items-center justify-center p-5"
          style={{ background: 'var(--canvas)', color: 'var(--ink)' }}
          role="alert"
        >
          <div className="card card--pad w-full max-w-[30rem] text-center">
            <div
              className="mx-auto grid h-16 w-16 place-items-center rounded-[var(--r-md)]"
              style={{ background: 'var(--brand-teal-soft)', color: 'var(--brand-teal-deep)' }}
            >
              <LifeBuoy className="h-8 w-8" aria-hidden />
            </div>

            <h1 className="t-h2 mt-4">{copy.title}</h1>
            <p className="t-body mt-2">{copy.body}</p>

            <div className="mt-5 grid gap-2">
              <button type="button" className="btn btn--lg btn--block" onClick={this.handleReset}>
                <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
                {copy.retry}
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--block"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-[18px] w-[18px]" aria-hidden />
                {copy.reload}
              </button>
            </div>

            {this.state.error && (
              <details className="mt-5 text-left">
                <summary className="cursor-pointer text-[0.82rem] font-bold" style={{ color: 'var(--ink-3)' }}>
                  {copy.details}
                </summary>
                <div
                  className="mt-2 max-h-40 overflow-auto rounded-[var(--r-sm)] p-3 font-mono text-[0.72rem] leading-relaxed"
                  style={{ background: 'var(--surface-sunken)', color: 'var(--ink-2)' }}
                >
                  <p className="mb-2 font-bold">{this.state.error.message}</p>
                  <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                </div>
              </details>
            )}

            <p className="t-xs mt-5">
              If this keeps happening, close the app and open it again. Everything works offline.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
