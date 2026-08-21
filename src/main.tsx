import React, { Component, type ReactNode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error in React tree:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', color: '#111', background: '#fff', minHeight: '100vh' }}>
          <h1 style={{ color: '#e11d48' }}>Application Error</h1>
          <p>An unexpected error occurred while rendering the page:</p>
          <pre style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', overflowX: 'auto', color: '#b91c1c' }}>
            {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px', padding: '10px 20px', background: '#1A4095', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Global window error fallback
window.addEventListener('error', (event) => {
  const root = document.getElementById('root')
  if (root && root.children.length === 0) {
    root.innerHTML = `
      <div style="padding: 40px; font-family: sans-serif; background: #fff; min-height: 100vh;">
        <h1 style="color: #e11d48;">JavaScript Load Error</h1>
        <p>A script error occurred during page load:</p>
        <pre style="background: #f1f5f9; padding: 16px; border-radius: 8px; color: #b91c1c;">${event.message} at ${event.filename}:${event.lineno}</pre>
        <button onclick="window.location.reload()" style="margin-top: 16px; padding: 10px 20px; background: #1A4095; color: #fff; border: none; border-radius: 6px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `
  }
})

const rootEl = document.getElementById('root')
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </React.StrictMode>,
  )
}
