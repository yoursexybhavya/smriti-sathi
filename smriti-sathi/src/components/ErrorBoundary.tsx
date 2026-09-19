/**
 * SMRITI SATHI — Error Boundary
 * 
 * Catches React errors and displays a user-friendly error screen.
 * Prevents the entire app from crashing.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center mx-auto mb-6 text-rose-500">
              <AlertTriangle size={40} className="text-rose-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight">
              Something went wrong
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-base">
              We encountered an unexpected error. Your data is safe. 
              Please try refreshing the page.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 mb-2">
                  Error details
                </summary>
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-4 text-xs font-mono text-rose-800 dark:text-rose-300 overflow-auto max-h-40">
                  <p className="font-bold mb-2">{this.state.error.message}</p>
                  <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full min-h-[56px] py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-lg
                  active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
              >
                <RefreshCw size={24} />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full min-h-[56px] py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-lg
                  active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/30"
              >
                Refresh Page
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
