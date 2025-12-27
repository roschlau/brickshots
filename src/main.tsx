import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { Tooltip } from 'react-tooltip'
import './index.css'
import { ConvexReactClient } from 'convex/react'
import { ConvexAuthProvider } from '@convex-dev/auth/react'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

const root = document.getElementById('root')
if (!root) {
  throw Error('Root element not found')
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <div className={'flex flex-col items-center isolate'}>
        <App />
      </div>
      <Toaster />
      <Tooltip id={'tooltip'} />
    </ConvexAuthProvider>
  </React.StrictMode>,
)
