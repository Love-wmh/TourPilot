import { Loader2 } from 'lucide-react'

export function GlobalLoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/30 dark:bg-black/50">
      <Loader2 className="size-10 animate-spin text-background" />
    </div>
  )
}
