export function StatusMessage({ message, error }: { message?: string; error?: string }) {
  if (!message && !error) return null

  return (
    <p className={`mx-4 -mt-3 mb-4 text-sm ${error ? 'text-destructive' : 'text-emerald-600'}`}>
      {error || message}
    </p>
  )
}
