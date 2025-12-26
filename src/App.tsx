import { useEffect, useState } from 'react'
import './App.css'
import { getSceneNumber } from './data-model/codes.ts'
import { SceneTable } from './scene-table/SceneTable.tsx'
import { ShotStatus } from './data-model/shot-status.ts'
import { StatusFilterSelector } from './StatusFilterSelector.tsx'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

function App() {
  // Project State
  const project = useQuery(api.projects.getAll)?.[0]
  const projectScenes = useQuery(api.scenes.getForProjectWithShots, { projectId: project?._id }) ?? []
  const createScene = useMutation(api.scenes.create)
  useEffect(() => localStorage.setItem('project', JSON.stringify(project)), [project])

  // UI State
  const [statusFilter, setStatusFilter] = useState<ShotStatus[]>([])

  // Scenes
  const addScene = async () => {
    if (!project) throw Error('No project')
    await createScene({ projectId: project._id })
  }

  const scenes = projectScenes.map((scene, sceneIndex) => {
    return (
      <SceneTable
        key={getSceneNumber(scene, sceneIndex)}
        sceneId={scene._id}
        sceneIndex={sceneIndex}
        shotStatusFilter={statusFilter}
      />
    )
  })

  // Scene Links
  const sceneLinks = projectScenes.map((scene, sceneIndex) => {
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
        data-tooltip-content={scene.description || ('Scene ' + sceneNumber.toString())}
      >
        {sceneNumber}
      </a>
    )
  })

  // Component
  return (
    <>
      <div>
        {projectScenes.map(it => it.lockedNumber)}
      </div>
      <div className={'w-full max-w-screen-xl top-0 sticky z-10 flex flex-col pb-4 items-start bg-slate-800'}>
        <div className={'w-full flex flex-row items-center mb-4'}>
          <h1 className="text-3xl my-4 grow">
            BrickShot
          </h1>
        </div>
        <div className={'self-stretch flex flex-row items-center'}>
          <div className={'grow flex flex-row items-center'}>
            <span className={'mr-1'}>Scenes:</span>
            {sceneLinks}
          </div>
          <div className={'flex flex-row items-center'}>
            <StatusFilterSelector selected={statusFilter} onChange={setStatusFilter} />
          </div>
        </div>
      </div>
      <div
        className="w-full max-w-screen-xl grid mb-10
                   justify-stretch justify-items-stretch items-stretch
                   p-[1px] gap-[1px] bg-slate-800 *:bg-slate-900"
        style={{ gridTemplateColumns: 'auto auto auto 1fr 1fr auto' }}
      >
        {scenes}
        <button
          className={'col-start-1 col-span-full mt-4 rounded-md text-start p-2 text-slate-300 hover:text-slate-100 hover:bg-slate-700'}
          onClick={() => void addScene()}
        >
          + Add Scene
        </button>
      </div>
    </>
  )
}

export default App
