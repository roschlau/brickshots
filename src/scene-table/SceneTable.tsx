import {SceneData} from '../data-model/scene.ts'
import {getSceneNumber, nextShotAutoNumber} from '../data-model/codes.ts'
import {newShot, ShotData} from '../data-model/shot.ts'
import {ShotTableRow} from './ShotTableRow.tsx'
import {Icon} from '../ui-atoms/Icon.tsx'
import {ShotStatus} from '../data-model/shot-status.ts'

export function SceneTable({scene, sceneIndex, shotStatusFilter, onUpdate, onDelete, backupProject}: {
  scene: SceneData,
  sceneIndex: number,
  shotStatusFilter: ShotStatus[],
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
  const shots = scene.shots
    .filter(shot => shotStatusFilter.length === 0 || shotStatusFilter.includes(shot.status))
    .map((shot, shotIndex) => {
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
  return shots.length === 0 && scene.shots.length !== 0 ? null : (
    <>
      <div
        id={'scene-' + sceneNumber.toString()}
        className="col-start-1 col-span-full rounded-t-md pl-3 pr-0 flex flex-row gap-2 items-center overflow-hidden"
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
        className={'col-start-1 col-span-full mb-4 rounded-b-md p-2 pb-3 text-start text-slate-300 hover:text-slate-100 hover:bg-slate-700'}
        onClick={() => addNewShot(scene.shots.length)}>
        + Add Shot
      </button>
    </>
  )
}
