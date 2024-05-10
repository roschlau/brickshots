import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {Toaster} from 'react-hot-toast'
import {Tooltip} from 'react-tooltip'
import './index.css'

const root = document.getElementById('root')
if (!root) {
    throw Error('Root element not found')
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
    <Toaster/>
    <Tooltip id={'tooltip'}/>
  </React.StrictMode>,
)
