import { Component } from 'react'

function isChunkError(error) {
  return (
    error?.name === 'ChunkLoadError' ||
    error?.message?.includes('Failed to fetch dynamically imported module') ||
    error?.message?.includes('Importing a module script failed') ||
    error?.message?.includes('Loading chunk') ||
    error?.message?.includes('Loading CSS chunk')
  )
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, chunkError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, chunkError: isChunkError(error) }
  }

  componentDidCatch(error) {
    if (isChunkError(error)) {
      // New deployment → chunk hash changed → force full reload to get new chunks
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError && !this.state.chunkError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0c14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          color: '#fff',
          fontFamily: 'sans-serif',
        }}>
          <p style={{ color: '#9ca3af', fontSize: 15 }}>Có lỗi xảy ra, vui lòng thử lại.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 24px',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Tải lại trang
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
