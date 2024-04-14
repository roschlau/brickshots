import {useEffect, useState} from 'react'
import './App.css'
import {loadProject, SceneData, ShotData} from './persistence.ts'

function App() {
  const [project, setProject] = useState(loadProject())
  console.log(project.scenes.flatMap(scene => scene.shots).filter(shot => shot.animated).map(shot => shot.description))
  useEffect(() => localStorage.setItem('project', JSON.stringify(project)), [project])
  const scenes = project.scenes.map((scene, index) => {
    return (
      <SceneTableRows
        key={scene.frozenCode ?? index}
        scene={scene}
        sceneIndex={index}
        onUpdate={(updatedScene => setProject({ ...project, scenes: project.scenes.map((oldScene, i) => i === index ? updatedScene : oldScene) }))}
      />
    )
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

function SceneTableRows({scene, sceneIndex, onUpdate}: { scene: SceneData, sceneIndex: number, onUpdate: (scene: SceneData) => void }) {
  const shots = scene.shots.map((shot, index) => (
    <ShotTableRow
      key={shot.frozenCode ?? index}
      shot={shot}
      sceneCode={scene.frozenCode ?? sceneIndex}
      shotIndex={index}
      onUpdate={(updatedShot) => onUpdate({ ...scene, shots: scene.shots.map((oldShot, i) => i === index ? updatedShot : oldShot) })}
    />
  ))
  return (
    <>
      <div className="col-start-1 col-span-5 mt-4">
        {scene.name}
      </div>
      {shots}
    </>
  )
}

function ShotTableRow({shot, sceneCode, shotIndex, onUpdate}: {
  shot: ShotData,
  sceneCode: number,
  shotIndex: number,
  onUpdate: (shot: ShotData) => void
}) {
  return (
    <>
      <div className={'col-start-1 text-sm ' + (shot.frozenCode ? 'text-slate-100' : 'text-slate-500')}>
        {sceneCode}-{shot.frozenCode ?? shotIndex}
      </div>
      <div className="col-start-2">
        <input
          type={'text'}
          value={shot.location ?? ''}
          onChange={value => onUpdate({ ...shot, location: value.target.value})}
        />
      </div>
      <div className="col-start-3">
        <textarea
          rows={1}
          value={shot.description}
          onChange={value => onUpdate({ ...shot, description: value.target.value})}
        ></textarea>
      </div>
      <div className="col-start-4">
        <textarea
          rows={1}
          onChange={value => onUpdate({ ...shot, notes: value.target.value})}
        ></textarea>
      </div>
      <div className="col-start-5">
        <input
          type={'checkbox'}
          checked={shot.animated}
          onChange={value => onUpdate({ ...shot, animated: value.target.checked})}
        />
      </div>
    </>
  )
}

export default App
