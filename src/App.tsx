import {useState} from 'react'
import './App.css'
import {loadProject} from './persistence.ts'
import {Scene, Shot} from './model.ts'

function App() {
  const [project] = useState(loadProject())
  const scenes = project.scenes.map(scene => {
    return <SceneTableRows key={scene.code} scene={scene}/>
  })
  return (
    <>
      <h1 className="text-3xl mb-4">{project.name}</h1>
      <div className="grid gap-2 justify-items-start items-baseline">
        {scenes}
      </div>
    </>
  )
}

function SceneTableRows({scene}: { scene: Scene }) {
  const shots = scene.shots.map(shot => <ShotTableRow key={shot.code} shot={shot} sceneCode={scene.code}/>)
  return (
    <>
      <div className="col-start-1 col-span-5 mt-4">
        {scene.name}
      </div>
      {shots}
    </>
  )
}

function ShotTableRow({shot, sceneCode}: { shot: Shot, sceneCode: number }) {
  return (
    <>
      <div className={'col-start-1 text-sm ' + (shot.isCodeFrozen ? 'text-slate-100' : 'text-slate-500')}>
        {sceneCode}-{shot.code}
      </div>
      <div className="col-start-2">
        {shot.location}
      </div>
      <div className="col-start-3">
        {shot.description}
      </div>
      <div className="col-start-4">
        {shot.notes}
      </div>
      <div className="col-start-5">
        {shot.animated}
      </div>
    </>
  )
}

export default App
