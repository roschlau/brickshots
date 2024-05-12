import {ShotData} from '../data-model/shot.ts'
import {shotCode} from '../data-model/codes.ts'
import clipboard from 'clipboardy'
import toast from 'react-hot-toast'
import {nextStatus, statusIconCode, statusTooltip} from '../data-model/shot-status.ts'
import {Icon} from '../ui-atoms/Icon.tsx'
import {EditableTextCell} from './EditableTextCell.tsx'

export function ShotTableRow({
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
