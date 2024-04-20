import {useEffect, useState} from 'react'
import './App.css'
import {code, dummyProject, loadProject, SceneData, ShotData} from './persistence.ts'
import clipboard from 'clipboardy'

function App() {
  const [project, setProject] = useState(loadProject())
  useEffect(() => localStorage.setItem('project', JSON.stringify(project)), [project])
  console.log(project.scenes.flatMap((scene, sceneIndex) => scene.shots
    .filter(shot => shot.lockedCode != null)
    .map((shot, shotIndex) => code(scene, sceneIndex).toString() + '-' + code(shot, shotIndex).toString())
  ))
  const scenes = project.scenes.map((scene, sceneIndex) => {
    function updateScene(updatedScene: SceneData) {
      setProject({...project, scenes: project.scenes.map((oldScene, i) => i === sceneIndex ? updatedScene : oldScene)})
    }

    return (
      <SceneTableRows
        key={code(scene, sceneIndex)}
        scene={scene}
        sceneIndex={sceneIndex}
        onUpdate={updateScene}
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

function SceneTableRows({scene, sceneIndex, onUpdate}: {
  scene: SceneData,
  sceneIndex: number,
  onUpdate: (scene: SceneData) => void
}) {
  const shots = scene.shots.map((shot, shotIndex) => {
    const updateShot = (updatedShot: ShotData) => {
      onUpdate({
        ...scene,
        lockedCode: updatedShot.lockedCode && !scene.lockedCode ? code(scene, sceneIndex) : scene.lockedCode,
        shots: scene.shots.map((oldShot, i) => i === shotIndex ? updatedShot : oldShot),
      })
    }
    return (
      <ShotTableRow
        key={code(shot, shotIndex)}
        shot={shot}
        sceneCode={code(scene, sceneIndex)}
        shotIndex={shotIndex}
        onUpdate={updateShot}
      />
    )
  })
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
  onUpdate: (shot: ShotData) => void,
}) {
  const shotFullCode = sceneCode.toString() + '-' + code(shot, shotIndex).toString()
  function shotCodeClicked() {
    if (shot.lockedCode === null) {
      onUpdate({...shot, lockedCode: code(shot, shotIndex)})
    }
    void clipboard.write(shotFullCode)
  }
  return (
    <>
      <div
        className={'col-start-1 text-sm cursor-pointer ' + ((shot.lockedCode != null) ? 'text-slate-100' : 'text-slate-500')}
        onClick={shotCodeClicked}
      >
        {shotFullCode}
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
          value={shot.notes}
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
