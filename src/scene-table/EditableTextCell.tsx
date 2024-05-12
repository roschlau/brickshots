import {useState} from 'react'

export function EditableTextCell({column, value, onUpdate, className}: {
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
