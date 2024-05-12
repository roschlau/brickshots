export function Icon({code, fill, className}: { code: string, fill?: boolean, className?: string }) {
  return (
    <div className={'material-symbols-rounded ' + (fill ? 'fill' : '') + (className ?? '')}>
      {code}
    </div>
  )
}
