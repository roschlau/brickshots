import {useEffect, useState} from 'react'
import './App.css'
import {blankScene, dummyProject, loadProject, newShot, SceneData, ShotData} from './persistence.ts'
import clipboard from 'clipboardy'
import {getSceneNumber, nextShotAutoNumber, shotCode} from './codes.ts'

function App() {
  const [project, setProject] = useState(loadProject())
  useEffect(() => localStorage.setItem('project', JSON.stringify(project)), [project])
  const scenes = project.scenes.map((scene, sceneIndex) => {
    const updateScene = (updatedScene: SceneData) => {
      setProject({...project, scenes: project.scenes.map((oldScene, i) => i === sceneIndex ? updatedScene : oldScene)})
    }

    const deleteScene = () => {
      setProject({...project, scenes: project.scenes.filter((_, i) => i !== sceneIndex)})
    }

    return (
      <SceneTableRows
        key={getSceneNumber(scene, sceneIndex)}
        scene={scene}
        sceneIndex={sceneIndex}
        onUpdate={updateScene}
        onDelete={deleteScene}
      />
    )
  })
  const resetProject = () => setProject(dummyProject)
  const backupProject = () => localStorage.setItem('backup-' + new Date().toISOString(), JSON.stringify(project))
  const addScene = () => setProject({...project, scenes: [...project.scenes, blankScene()]})
  return (
    <>
      <DevBar onResetProject={resetProject} onBackupProject={backupProject}/>
      <h1 className="text-3xl mb-4">{project.name}</h1>
      <div
        className="w-full max-w-screen-lg grid p-[1px] gap-[1px] bg-slate-800 *:bg-slate-900 justify-stretch justify-items-stretch items-stretch"
        style={{gridTemplateColumns: 'auto auto auto 1fr 1fr auto'}}
      >
        {scenes}
        <div className={'col-start-1 col-span-full flex flex-row'}>
          <button className={'justify-self-start p-2 text-slate-300 hover:text-slate-100'} onClick={addScene}>
            + Add Scene
          </button>
        </div>
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

function SceneTableRows({scene, sceneIndex, onUpdate, onDelete}: {
  scene: SceneData,
  sceneIndex: number,
  onUpdate: (scene: SceneData) => void,
  onDelete: () => void,
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
  const addShot = () => {
    const shot = newShot({location: scene.shots[scene.shots.length - 1]?.location})
    onUpdate({...scene, shots: [...scene.shots, shot]})
  }
  return (
    <>
      <div className="col-start-1 col-span-full p-1 pt-4 pr-0 flex flex-row gap-2 items-baseline">
        <span className={'font-bold text-lg grow'}>
          Scene {sceneNumber}
        </span>
        <button
          className={'p-2 text-sm text-slate-500 hover:text-red-600'}
          onClick={onDelete}>
          Delete
        </button>
      </div>
      {shots}
      <div className={'col-start-1 col-span-full flex flex-row'}>
        <button className={'p-2 text-slate-300 hover:text-slate-100'} onClick={addShot}>
          + Add Shot
        </button>
      </div>
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
  const [editing, setEditing] = useState<null | 'location' | 'description' | 'notes'>()

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
    onUpdate({...shot, animated, lockedNumber: animated && shot.lockedNumber === null ? shotNumber : shot.lockedNumber})
  }

  return (
    <>
      <div className="col-start-1 grid grid-flow-col place-content-start items-center px-1">
        <input
          type={'checkbox'}
          className={'cursor-pointer'}
          checked={shot.animated}
          onChange={value => setAnimated(value.target.checked)}
        />
        <button
          onClick={shotCodeClicked}
          className={'p-2 text-sm hover:text-slate-100 ' + ((shot.lockedNumber != null) ? 'text-slate-300' : 'text-slate-500')}
        >
          {shotFullCode}
        </button>
      </div>
      <div className="col-start-3 self-stretch relative">
        <div
          className={'h-full cursor-pointer p-1 whitespace-break-spaces text-sm text-slate-200'}
          onClick={() => setEditing('location')}
        >
          {shot.location}
        </div>
        { editing === 'location' ?
          <textarea
            className={'absolute z-10 top-0 left-0 size-full p-1 text-sm text-slate-200'}
            autoFocus
            value={shot.location ?? ''}
            onChange={value => onUpdate({...shot, location: value.target.value})}
            onBlur={() => setEditing(null)}
            onKeyDown={event => event.key === 'Escape' ? setEditing(null) : ''}
          /> : ''
        }
      </div>
      <div className="col-start-4 self-stretch relative">
        <div
          className={'h-full cursor-pointer p-1 whitespace-break-spaces text-sm text-slate-200'}
          onClick={() => setEditing('description')}
        >
          {shot.description}
        </div>
        { editing === 'description' ?
          <textarea
            className={'absolute z-10 top-0 left-0 size-full p-1 text-sm text-slate-200'}
            autoFocus
            value={shot.description}
            onChange={value => onUpdate({...shot, description: value.target.value})}
            onBlur={() => setEditing(null)}
            onKeyDown={event => event.key === 'Escape' ? setEditing(null) : ''}
          /> : ''
        }
      </div>
      <div className="col-start-5 self-stretch relative">
        <div
          className={'h-full cursor-pointer p-1 whitespace-break-spaces text-sm text-slate-200'}
          onClick={() => setEditing('notes')}
        >
          {shot.notes}
        </div>
        { editing === 'notes' ?
          <textarea
            className={'absolute z-10 top-0 left-0 size-full p-1 text-sm text-slate-200'}
            autoFocus
            value={shot.notes}
            onChange={value => onUpdate({...shot, notes: value.target.value})}
            onBlur={() => setEditing(null)}
            onKeyDown={event => event.key === 'Escape' ? setEditing(null) : ''}
          /> : ''
        }
      </div>
      <div className="col-start-6">
        <button
          onClick={onDelete}
          className={'p-2 text-sm text-slate-500 hover:text-red-600'}
        >
          Delete
        </button>
      </div>
    </>
  )
}

export default App
