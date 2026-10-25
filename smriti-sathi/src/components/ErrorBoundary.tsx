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

            <h1 className="t-h2 mt-4">Something went wrong</h1>
            <p className="t-body mt-2">
              This is not your fault, and nothing you have saved is lost. Your memories, reminders and
              progress are still on this device.
            </p>

            <div className="mt-5 grid gap-2">
              <button type="button" className="btn btn--lg btn--block" onClick={this.handleReset}>
                <RotateCcw className="h-[18px] w-[18px]" aria-hidden />
                Try again
              </button>
              <button
                type="button"
                className="btn btn--secondary btn--block"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-[18px] w-[18px]" aria-hidden />
                Reload the app
              </button>
            </div>

            {this.state.error && (
              <details className="mt-5 text-left">
                <summary className="cursor-pointer text-[0.82rem] font-bold" style={{ color: 'var(--ink-3)' }}>
                  Technical details
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
