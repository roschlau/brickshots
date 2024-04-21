export function Icon({code, className}: { code: string, className?: string }) {
  return (
    <div className={'material-symbols-rounded ' + (className ?? '')}>
      {code}
    </div>
  )
}
