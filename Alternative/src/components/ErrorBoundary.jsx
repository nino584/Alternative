import { Component } from 'react';
import { C, T } from '../constants/theme.js';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Report to server
    try {
      fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error?.message || 'Unknown error',
          stack: error?.stack || '',
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {});
    } catch (_) {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.cream, padding: 24 }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <p style={{ fontFamily: "'Alido',serif", fontSize: 64, color: C.lgray, marginBottom: 16 }}>500</p>
            <h1 style={{ ...T.displaySm, color: C.black, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ ...T.body, color: C.gray, lineHeight: 1.8, marginBottom: 32 }}>
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              style={{ padding: '14px 32px', background: C.black, color: C.white, border: 'none', ...T.label, fontSize: 11, letterSpacing: '0.12em', cursor: 'pointer' }}>
              GO HOME
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
