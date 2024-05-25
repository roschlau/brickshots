import {useEffect, useState} from 'react'
import './App.css'
import {download, loadProject, openProject} from './persistence.ts'
import clipboard from 'clipboardy'
import {getSceneNumber} from './data-model/codes.ts'
import {Icon} from './ui-atoms/Icon.tsx'
import toast from 'react-hot-toast'
import {newProject, ProjectData} from './data-model/project.ts'
import {newScene, SceneData} from './data-model/scene.ts'
import {SceneTable} from './scene-table/SceneTable.tsx'

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
      <SceneTable
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
      <div className={'w-full max-w-screen-xl top-0 sticky z-10 flex flex-col pb-4 items-center bg-slate-800'}>
        <div className={'w-full flex flex-row items-center mb-4'}>
          <h1 className="text-3xl my-4 grow">
            BrickShots
          </h1>
          <ProjectMenu
            onSaveProject={() => download(project)}
            onNewProject={resetProject}
            onOpenFile={file => void loadProjectFromFile(file)}
          />
        </div>
        <div className={'flex flex-row items-center'}>
          <span className={'mr-1'}>Scenes:</span>
          {sceneLinks}
        </div>
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

function ProjectMenu({onNewProject, onSaveProject, onOpenFile}: {
  onNewProject: () => void,
  onSaveProject: () => void,
  onOpenFile: (file: File) => void,
}) {
  return (
    <div className={'flex flex-row'}>
      <button className={'p-2 flex flex-row items-center gap-2 rounded hover:bg-slate-700'} onClick={onNewProject}>
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
             className={'cursor-pointer p-2 flex flex-row items-center gap-2 rounded hover:bg-slate-700'}>
        <Icon code={'upload'}/>
        Open
      </label>
      <button className={'p-2 flex flex-row items-center gap-2 rounded hover:bg-slate-700'} onClick={onSaveProject}>
        <Icon code={'download'}/>
        Save
      </button>
    </div>
  )
}

export default App
