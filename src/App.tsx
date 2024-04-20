import {useEffect, useState} from 'react'
import './App.css'
import {blankShot, dummyProject, loadProject, SceneData, ShotData} from './persistence.ts'
import clipboard from 'clipboardy'
import {nextShotAutoNumber, getSceneNumber, shotCode} from './codes.ts'

function App() {
  const [project, setProject] = useState(loadProject())
  useEffect(() => localStorage.setItem('project', JSON.stringify(project)), [project])
  const scenes = project.scenes.map((scene, sceneIndex) => {
    function updateScene(updatedScene: SceneData) {
      setProject({...project, scenes: project.scenes.map((oldScene, i) => i === sceneIndex ? updatedScene : oldScene)})
    }

    return (
      <SceneTableRows
        key={getSceneNumber(scene, sceneIndex)}
        scene={scene}
        sceneIndex={sceneIndex}
        onUpdate={updateScene}
      />
    )
  })
  const resetProject = () => setProject(dummyProject)
  const backupProject = () => localStorage.setItem('backup-' + new Date().toISOString(), JSON.stringify(project))
  return (
    <>
      <DevBar onResetProject={resetProject} onBackupProject={backupProject}/>
      <h1 className="text-3xl mb-4">{project.name}</h1>
      <div className="grid gap-2 justify-items-start items-baseline">
        {scenes}
      </div>
    </>
  )
}

function DevBar({onResetProject, onBackupProject}: {
  onResetProject: () => void,
  onBackupProject: () => void
}) {
  return (
    <div className={'absolute top-0 right-0 flex flex-row'}>
      <button className={'p-2'} onClick={onBackupProject}>
        Backup
      </button>
      <button className={'p-2'} onClick={onResetProject}>
        Reset
      </button>
    </div>
  )
}

function SceneTableRows({scene, sceneIndex, onUpdate}: {
  scene: SceneData,
  sceneIndex: number,
  onUpdate: (scene: SceneData) => void
}) {
  const lockedShotNumbers = scene.shots.map(it => it.lockedNumber).filter((it): it is number => it !== null)
  const shotNumbers: Record<number, number> = {}
  const sceneNumber = getSceneNumber(scene, sceneIndex)
  const shots = scene.shots.map((shot, shotIndex) => {
    const updateShot = (updatedShot: ShotData) => {
      onUpdate({
        ...scene,
        lockedNumber: updatedShot.lockedNumber && !scene.lockedNumber ? sceneNumber : scene.lockedNumber,
        shots: scene.shots.map((oldShot, i) => i === shotIndex ? updatedShot : oldShot),
      })
    }
    const deleteShot = () => {
      onUpdate({
        ...scene,
        shots: scene.shots.filter((_, i) => i !== shotIndex),
      })
    }
    const shotNumber = shot.lockedNumber ?? nextShotAutoNumber(shotNumbers[shotIndex - 1] ?? 0, lockedShotNumbers)
    shotNumbers[shotIndex] = shotNumber
    return (
      <ShotTableRow
        key={shotNumber}
        shot={shot}
        sceneNumber={sceneNumber}
        shotNumber={shotNumber}
        onUpdate={updateShot}
        onDelete={deleteShot}
      />
    )
  })
  const addShot = () => onUpdate({...scene, shots: [...scene.shots, blankShot()]})
  return (
    <>
      <div className="col-start-1 col-span-5 mt-4 font-bold text-lg">
        Scene {sceneNumber}
      </div>
      {shots}
      <button onClick={addShot}>
        + Add Shot
      </button>
    </>
  )
}

function ShotTableRow({shot, sceneNumber, shotNumber, onUpdate, onDelete}: {
  shot: ShotData,
  sceneNumber: number,
  shotNumber: number,
  onUpdate: (shot: ShotData) => void,
  onDelete: () => void,
}) {
  const shotFullCode = shotCode(sceneNumber, shotNumber)

  const shotCodeClicked = () => {
    if (shot.lockedNumber === null) {
      onUpdate({...shot, lockedNumber: shotNumber})
      void clipboard.write(shotFullCode)
    } else {
      const newShotCode = window.prompt('Change locked shot code to:', shot.lockedNumber.toString())
      if (newShotCode !== null) {
        if (newShotCode.trim().length === 0) {
          onUpdate({...shot, lockedNumber: null})
          return
        }
        const parsed = parseInt(newShotCode)
        if (isNaN(parsed)) {
          throw Error('Invalid shotcode: ' + newShotCode)
        }
        if (parsed !== shot.lockedNumber) {
          onUpdate({...shot, lockedNumber: parsed})
        }
        void clipboard.write(sceneNumber.toString() + '-' + parsed.toString())
      }
    }
  }

  const setAnimated = (animated: boolean) => {
    onUpdate({...shot, animated, lockedNumber: animated && shot.lockedNumber === null ? shotNumber : shot.lockedNumber })
  }

  return (
    <>
      <div
        className={'col-start-1 text-sm cursor-pointer ' + ((shot.lockedNumber != null) ? 'text-slate-100' : 'text-slate-500')}
        onClick={shotCodeClicked}
      >
        {shotFullCode}
      </div>
      <div className="col-start-2">
        <input
          type={'text'}
          value={shot.location ?? ''}
          onChange={value => onUpdate({...shot, location: value.target.value})}
        />
      </div>
      <div className="col-start-3">
        <textarea
          rows={1}
          value={shot.description}
          onChange={value => onUpdate({...shot, description: value.target.value})}
        ></textarea>
      </div>
      <div className="col-start-4">
        <textarea
          rows={1}
          value={shot.notes}
          onChange={value => onUpdate({...shot, notes: value.target.value})}
        ></textarea>
      </div>
      <div className="col-start-5">
        <input
          type={'checkbox'}
          checked={shot.animated}
          onChange={value => setAnimated(value.target.checked)}
        />
      </div>
      <div className="col-start-6">
        <button
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </>
  )
}

export default App
