import {useEffect, useState} from 'react'
import './App.css'
import {download, loadProject, openProject} from './persistence.ts'
import clipboard from 'clipboardy'
import {getSceneNumber, nextShotAutoNumber, shotCode} from './codes.ts'
import {Icon} from './Icon.tsx'
import toast from 'react-hot-toast'
import {newShot, ShotData} from './data-model/shot.ts'
import {nextStatus, statusIconCode, statusTooltip} from './data-model/shot-status.ts'
import {newProject, ProjectData} from './data-model/project.ts'
import {newScene, SceneData} from './data-model/scene.ts'

function App() {
  const [project, setProject] = useState(loadProject())
  useEffect(() => localStorage.setItem('project', JSON.stringify(project)), [project])
  const backupProject = (reason: string) => {
    const serialized = JSON.stringify(project)
    localStorage.setItem('backup-' + new Date().toISOString() + '-' + reason, serialized)
    void clipboard.write(serialized)
  }
  const resetProject = () => {
    backupProject('before-new-project')
    setProject(newProject)
  }
  const loadProjectFromFile = async (file: File) => {
    await toast.promise<ProjectData>(
      openProject(file),
      {
        loading: 'Loading file...',
        success: (project) => {
          setProject(project)
          return 'Project loaded!'
        },
        error: (e) => 'Project couldn\'t be loaded:\n' + e,
      },
    )
  }
  const addScene = () => setProject({...project, scenes: [...project.scenes, newScene()]})
  const scenes = project.scenes.map((scene, sceneIndex) => {
    const updateScene = (updatedScene: SceneData) => {
      setProject({...project, scenes: project.scenes.map((oldScene, i) => i === sceneIndex ? updatedScene : oldScene)})
    }

    const deleteScene = () => {
      backupProject('before-scene-deletion')
      setProject({...project, scenes: project.scenes.filter((_, i) => i !== sceneIndex)})
    }

    return (
      <SceneTableRows
        key={getSceneNumber(scene, sceneIndex)}
        scene={scene}
        sceneIndex={sceneIndex}
        onUpdate={updateScene}
        onDelete={deleteScene}
        backupProject={backupProject}
      />
    )
  })
  const sceneLinks = project.scenes.map((scene, sceneIndex) => {
    const sceneNumber = getSceneNumber(scene, sceneIndex)
    const hasWipShots = !!scene.shots.find(shot => shot.status === 'wip')
    const isDone = scene.shots.every(shot => shot.status === 'animated')
    return (
      <a
        key={sceneNumber}
        href={'#scene-' + sceneNumber.toString()}
        className={'py-1 px-2 rounded ' +
          (isDone ? 'text-slate-500' : 'text-slate-200') + ' hover:text-slate-100 ' +
          (hasWipShots ? 'bg-purple-800 hover:bg-purple-700' : 'hover:bg-slate-700')}
        data-tooltip-id={'tooltip'}
        data-tooltip-content={scene.description || ('Scene ' + sceneNumber)}
      >
        {sceneNumber}
      </a>
    )
  })
  return (
    <>
      <DevBar
        onSaveProject={() => download(project)}
        onNewProject={resetProject}
        onOpenFile={file => void loadProjectFromFile(file)}
      />
      <h1 className="text-3xl my-4">
        BrickShots
      </h1>
      <div className={'flex flex-row items-center'}>
        Scenes:
        {sceneLinks}
      </div>
      <div
        className="w-full max-w-screen-xl grid mb-10
                   justify-stretch justify-items-stretch items-stretch
                   p-[1px] gap-[1px] bg-slate-800 *:bg-slate-900"
        style={{gridTemplateColumns: 'auto auto auto 1fr 1fr auto'}}
      >
        {scenes}
        <button
          className={'col-start-1 col-span-full mt-4 rounded-md text-start p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700'}
          onClick={addScene}>
          + Add Scene
        </button>
      </div>
    </>
  )
}

function DevBar({onNewProject, onSaveProject, onOpenFile}: {
  onNewProject: () => void,
  onSaveProject: () => void,
  onOpenFile: (file: File) => void,
}) {
  return (
    <div className={'absolute top-1 right-1 flex flex-row'}>
      <button className={'p-2 flex flex-row items-center gap-1 rounded hover:bg-slate-700'} onClick={onNewProject}>
        <Icon code={'add_circle'}/>
        New
      </button>
      <input id="openProjectInput" type="file" className="sr-only" onChange={event => {
        const file = event.target.files?.[0]
        if (file) {
          onOpenFile(file)
        }
      }}/>
      <label htmlFor="openProjectInput"
             className={'cursor-pointer p-2 flex flex-row items-center gap-1 rounded hover:bg-slate-700'}>
        <Icon code={'folder_open'}/>
        Open
      </label>
      <button className={'p-2 flex flex-row items-center gap-1 rounded hover:bg-slate-700'} onClick={onSaveProject}>
        <Icon code={'save'}/>
        Save
      </button>
    </div>
  )
}

function SceneTableRows({scene, sceneIndex, onUpdate, onDelete, backupProject}: {
  scene: SceneData,
  sceneIndex: number,
  onUpdate: (scene: SceneData) => void,
  onDelete: () => void,
  backupProject: (reason: string) => void,
}) {
  const lockedShotNumbers = scene.shots.map(it => it.lockedNumber).filter((it): it is number => it !== null)
  const shotNumbers: Record<number, number> = {}
  const sceneNumber = getSceneNumber(scene, sceneIndex)
  const addNewShot = (index: number) => {
    const shot = newShot({location: (scene.shots[index - 1] ?? scene.shots[index])?.location})
    const newShots = [...scene.shots]
    newShots.splice(index, 0, shot)
    onUpdate({
      ...scene,
      shots: newShots,
    })
  }
  const shots = scene.shots.map((shot, shotIndex) => {
    const updateShot = (updatedShot: ShotData) => {
      onUpdate({
        ...scene,
        lockedNumber: updatedShot.lockedNumber && !scene.lockedNumber ? sceneNumber : scene.lockedNumber,
        shots: scene.shots.map((oldShot, i) => i === shotIndex ? updatedShot : oldShot),
      })
    }
    const deleteShot = () => {
      backupProject('before-shot-deletion')
      onUpdate({
        ...scene,
        shots: scene.shots.filter((_, i) => i !== shotIndex),
      })
    }
    const swapWithPrevious = () => {
      const previous = scene.shots[shotIndex - 1]
      const current = scene.shots[shotIndex]
      if (current === undefined || previous === undefined) {
        throw Error()
      }
      onUpdate({
        ...scene,
        shots: scene.shots.map((shot, i) =>
          i === shotIndex - 1
            ? current
            : i === shotIndex
              ? previous
              : shot),
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
        showSwapButton={shotIndex > 0}
        onUpdate={updateShot}
        onDelete={deleteShot}
        onAddBefore={() => addNewShot(shotIndex)}
        onSwapWithPrevious={swapWithPrevious}
      />
    )
  })
  return (
    <>
      <div
        id={'scene-' + sceneNumber.toString()}
        className="col-start-1 col-span-full rounded-t-md mt-4 pl-3 pr-0 flex flex-row gap-2 items-center overflow-hidden"
      >
        <span className={'font-bold text-lg'}>
          #{sceneNumber}
        </span>
        <input
          type={'text'}
          className={'grow self-stretch my-0.5 p-2 font-bold text-lg rounded bg-transparent border-none placeholder:font-normal'}
          value={scene.description}
          placeholder={'No description'}
          onChange={(event) => onUpdate({...scene, description: event.target.value})}
        />
        <button
          className={'p-2 text-sm text-slate-500 hover:text-red-100 hover:bg-red-900 self-stretch'}
          onClick={onDelete}
        >
          <Icon code={'delete_forever'}/>
        </button>
      </div>
      {shots}
      <button
        className={'col-start-1 col-span-full rounded-b-md p-2 pb-3 text-start text-slate-300 hover:text-slate-100 hover:bg-slate-700'}
        onClick={() => addNewShot(scene.shots.length)}>
        + Add Shot
      </button>
    </>
  )
}

function ShotTableRow({
                        shot,
                        sceneNumber,
                        shotNumber,
                        showSwapButton,
                        onUpdate,
                        onDelete,
                        onAddBefore,
                        onSwapWithPrevious,
                      }: {
  shot: ShotData,
  sceneNumber: number,
  shotNumber: number,
  showSwapButton: boolean,
  onUpdate: (shot: ShotData) => void,
  onDelete: () => void,
  onAddBefore: () => void,
  onSwapWithPrevious: () => void,
}) {
  const shotFullCode = shotCode(sceneNumber, shotNumber)

  const lockAndCopyShotCode = () => {
    if (shot.lockedNumber === null) {
      onUpdate({...shot, lockedNumber: shotNumber})
    }
    const copyPromise = clipboard.write(shotFullCode)
    void toast.promise(copyPromise, {
      loading: 'Copying...',
      success: 'Shotcode copied to clipboard!',
      error: 'Failed to copy shotcode to clipboard',
    })
  }

  const editShotCode = () => {
    if (shot.lockedNumber === null) {
      throw Error('Shotcode not locked')
    }
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

  const cycleStatus = () => {
    const next = nextStatus(shot.status)
    const lockedNumber = (next === 'animated' || next === 'wip') && shot.lockedNumber === null
      ? shotNumber
      : shot.lockedNumber
    onUpdate({...shot, status: next, lockedNumber})
  }

  const onStatusRightClicked = () => {
    const status = shot.status === 'animated'
      ? 'default'
      : shot.status === 'unsure'
        ? 'default'
        : 'unsure'
    onUpdate({...shot, status})
  }

  return (
    <>
      <div
        className={'col-start-1 grid grid-flow-col place-content-start items-center pl-2 group relative' + (shot.status === 'wip' ? ' !bg-purple-900' : '')}>
        <button
          className={'absolute top-0 left-0 -translate-x-[100%] -translate-y-1/2 opacity-0 group-hover:opacity-100'}
          onClick={onAddBefore}
        >
          <Icon code={'add'}/>
        </button>
        {showSwapButton && <button
            className={'absolute top-0 left-0 -translate-x-[200%] -translate-y-1/2 opacity-0 group-hover:opacity-100'}
            onClick={onSwapWithPrevious}
        >
            <Icon code={'swap_vert'}/>
        </button>}
        <button
          onClick={cycleStatus}
          onContextMenu={event => {
            onStatusRightClicked()
            event.preventDefault()
          }}
          className={shot.status === 'wip' ? 'text-slate-300 hover:text-slate-100' : 'text-slate-500 hover:text-slate-100'}
          data-tooltip-id={'tooltip'}
          data-tooltip-html={statusTooltip(shot.status)}
          data-tooltip-place={'bottom'}
        >
          <Icon code={statusIconCode(shot.status)}/>
        </button>
        <button
          onClick={lockAndCopyShotCode}
          className={'p-2 pr-0 text-sm flex flex-row items-center ' + (shot.lockedNumber != null ? 'text-slate-300 hover:text-slate-100' : 'text-slate-500 hover:text-slate-100')}
          data-tooltip-id={'tooltip'}
          data-tooltip-content={'Click to copy'}
          data-tooltip-place={'bottom'}
        >
          {shotFullCode}
          {shot.lockedNumber === null &&
              <Icon
                  code={'lock'}
                  className={'icon-size-20 opacity-0 group-hover:opacity-100 pl-1'}
              />
          }
        </button>
        {shot.lockedNumber !== null &&
            <button
                onClick={editShotCode}
                className={'p-2 pl-1 flex flex-row items-center opacity-0 group-hover:opacity-100'}
                data-tooltip-id={'tooltip'}
                data-tooltip-content={'Edit Shotcode'}
                data-tooltip-place={'bottom'}
            >
                <Icon
                    code={'edit'}
                    className={'icon-size-20 text-slate-500 hover:text-slate-100'}
                />
            </button>
        }
      </div>
      <EditableTextCell
        column={'col-start-3'}
        value={shot.location ?? ''}
        className={shot.status !== 'animated' ? 'text-slate-200' : 'text-slate-500'}
        onUpdate={value => onUpdate({...shot, location: value.trim() === '' ? null : value})}
      />
      <EditableTextCell
        column={'col-start-4'}
        value={shot.description}
        className={shot.status !== 'animated' ? 'text-slate-200' : 'text-slate-500'}
        onUpdate={value => onUpdate({...shot, description: value})}
      />
      <EditableTextCell
        column={'col-start-5'}
        value={shot.notes}
        className={shot.status !== 'animated' ? 'text-slate-200' : 'text-slate-500'}
        onUpdate={value => onUpdate({...shot, notes: value})}
      />
      <div className="col-start-6 self-stretch hover:bg-red-900">
        <button
          onClick={onDelete}
          className={'p-2 text-sm text-slate-500 hover:text-red-100 h-full'}
        >
          <Icon code={'delete_forever'}/>
        </button>
      </div>
    </>
  )
}

function EditableTextCell({column, value, onUpdate, className}: {
  column: string,
  value: string,
  onUpdate: (value: string) => void,
  className?: string,
}) {
  const [editing, setEditing] = useState(false)
  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'Escape':
        setEditing(false)
        break
      case 'Enter':
        if (!event.shiftKey) {
          setEditing(false)
        }
        break
    }
  }
  return (
    <div
      className={column + ' self-stretch relative'} tabIndex={editing ? undefined : 0}
      onFocus={() => setEditing(true)}
    >
      <div
        className={`h-full cursor-pointer p-1 whitespace-break-spaces text-sm ${className ?? ''} hover:text-slate-100 hover:bg-slate-700`}
        onClick={() => setEditing(true)}
      >
        {value}
      </div>
      {editing ?
        <textarea
          className={'absolute z-10 top-0 left-0 size-full p-1 text-sm text-slate-200'}
          autoFocus
          value={value}
          onChange={event => onUpdate(event.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={onKeyDown}
        /> : ''
      }
    </div>
  )
}

export default App
