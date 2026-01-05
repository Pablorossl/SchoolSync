import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import './styles/index.css'

// Habilitar Mock Service Worker en desarrollo si está configurado
if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_MOCK_API === 'true') {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass', // No interferir con peticiones no mockeadas
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
