type AlertProps = {
  type?: 'success' | 'error' | 'info'
  message: string
  onClose?: () => void
}

export default function Alert({ type = 'info', message, onClose }: AlertProps) {
  const color = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  }[type]

  return (
    <div className={`fixed top-5 right-5 border px-4 py-2 rounded shadow-lg ${color} z-50`}>
      <div className="flex items-center justify-between gap-4">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="font-bold text-xl leading-none">&times;</button>
        )}
      </div>
    </div>
  )
}
