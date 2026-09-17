import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Smriti Sathi:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backgroundColor: '#0A1420',
            color: '#FFFFFF',
            textAlign: 'center',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FF7247',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              marginBottom: '16px',
            }}
          >
            🧠
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>
            Smriti Sathi (স্মৃতি সাথী)
          </h1>
          <p style={{ fontSize: '16px', color: '#94A9C4', maxWidth: '380px', marginBottom: '24px' }}>
            Starting memory care workout. If the screen does not load automatically, tap below to refresh.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              backgroundColor: '#FF7247',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Start App 🚀
          </button>
          {this.state.error && (
            <pre
              style={{
                marginTop: '20px',
                fontSize: '11px',
                color: '#647B99',
                maxWidth: '90%',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                textAlign: 'left',
              }}
            >
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
