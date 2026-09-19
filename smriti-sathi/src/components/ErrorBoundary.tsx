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
        <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-3">
              Something went wrong
            </h1>
            
            <p className="text-[#7A7A7A] mb-6 leading-relaxed">
              We encountered an unexpected error. Your data is safe. 
              Please try refreshing the page.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-[#4A4A4A] cursor-pointer hover:text-[#1A1A1A] mb-2">
                  Error details
                </summary>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs font-mono text-red-800 overflow-auto max-h-40">
                  <p className="font-bold mb-2">{this.state.error.message}</p>
                  <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                </div>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-4 bg-[#1B5E20] text-white rounded-2xl font-bold text-lg
                  hover:bg-[#0D3B12] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <RefreshCw size={24} />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-[#F5F0E8] text-[#4A4A4A] rounded-2xl font-bold text-lg
                  hover:bg-[#E0D8CC] active:scale-[0.98] transition-all"
              >
                Refresh Page
              </button>
            </div>

            <p className="text-xs text-[#7A7A7A] mt-6">
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
