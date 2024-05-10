import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Toaster} from 'react-hot-toast'

const root = document.getElementById('root')
if (!root) {
    throw Error('Root element not found')
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
    <Toaster/>
  </React.StrictMode>,
)
