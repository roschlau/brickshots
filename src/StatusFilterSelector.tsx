import {ShotStatus, shotStatusValues, statusIconCode} from './data-model/shot-status.ts'
import {Listbox, ListboxButton, ListboxOption, ListboxOptions} from '@headlessui/react'
import {byOrder} from './comparatorUtils.ts'
import {Icon} from './ui-atoms/Icon.tsx'

export function StatusFilterSelector({selected, onChange}: {
  selected: ShotStatus[],
  onChange: (selected: ShotStatus[]) => void,
}) {
  return (
    <Listbox value={selected} onChange={selected => onChange([...selected].sort(byOrder(shotStatusValues)))} multiple>
      <ListboxButton
        className={'border border-1 flex flex-row items-center gap-2 pl-3 pr-4 py-1 rounded-full hover:border-slate-400 hover:text-slate-100 ' +
          (selected.length === 0 ? 'border-slate-600 text-slate-500' : 'border-slate-500 text-slate-200')}
      >
        <Icon code={'filter_list'}/>
        {selected.length === 0 ? 'Status' : (selected.join(', '))}
      </ListboxButton>
      <ListboxOptions anchor="bottom end" className="mt-2 rounded bg-slate-700 shadow-xl">
        {
          shotStatusValues.map(status => (
            <ListboxOption key={status} value={status}
                           className={'group flex flex-row items-center gap-2 p-2 cursor-pointer data-[focus]:bg-slate-600'}>
              <Icon code={statusIconCode(status)}/>
              <span className={'grow'}>{status}</span>
              <div className={'size-6 grid place-content-center'}>
                <div
                  className={'size-2 rounded-full bg-green-500 shadow-glow shadow-green-500 invisible group-data-[selected]:visible'}></div>
              </div>
            </ListboxOption>
          ))
        }
      </ListboxOptions>
    </Listbox>
  )
}
