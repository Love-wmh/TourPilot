export function StatusMessage({ error }: { message?: string; error?: string }) {
  if (!error) return null

  return <p className="mx-4 -mt-3 mb-4 text-sm text-destructive">{error}</p>
}
