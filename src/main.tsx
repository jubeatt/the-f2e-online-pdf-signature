import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import App from './App'
import AppProvider from './context/AppContext'
import './styles/index.scss'

// pdfjs need it
GlobalWorkerOptions.workerSrc =
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.0.279/build/pdf.worker.js'

ReactDOM.createRoot(document.getElementById('the-f2e-container') as HTMLElement).render(
  // <React.StrictMode>
  <AppProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </AppProvider>
  // {/* </React.StrictMode> */}
)
