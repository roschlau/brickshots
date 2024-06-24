import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {Toaster} from 'react-hot-toast'
import {Tooltip} from 'react-tooltip'
import './index.css'
import {invoke} from '@tauri-apps/api'

invoke('greet', {name: 'Brickfilmers'})
  .then(
    (result) => console.log(result),
    (error) => console.error(error),
  )

const root = document.getElementById('root')
if (!root) {
  throw Error('Root element not found')
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <div className={'flex flex-col items-center isolate'}>
      <App/>
    </div>
    <Toaster/>
    <Tooltip id={'tooltip'}/>
  </React.StrictMode>,
)
