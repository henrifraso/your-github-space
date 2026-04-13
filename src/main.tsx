import React, { Component, Suspense, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', background: '#111', color: '#f87171', minHeight: '100vh' }}>
          <h2 style={{ marginBottom: 12 }}>Erro ao carregar App</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#888', marginTop: 12 }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App = React.lazy(() => import('./App.tsx'));

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Suspense fallback={<div style={{ background: '#111', color: 'white', padding: 24 }}>Carregando...</div>}>
      <App />
    </Suspense>
  </ErrorBoundary>
);
