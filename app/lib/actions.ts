import { useState } from 'react'
import { useRevalidator } from 'react-router'
import { toast } from 'sonner'

export function formDataToObject(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries())
}

export function numberValue(value: FormDataEntryValue | undefined, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export function optionalNumberValue(value: FormDataEntryValue | undefined) {
  if (value === undefined || value === '' || value === 'none') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function useMutation() {
  const revalidator = useRevalidator()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function run(action: () => Promise<unknown>, successMessage: string, form?: HTMLFormElement) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await action()
      form?.reset()
      setMessage('')
      toast.success(successMessage)
      revalidator.revalidate()
    } catch (error) {
      setError(error instanceof Error ? error.message : '操作失败')
    } finally {
      setBusy(false)
    }
  }

  return { busy, message, error, run }
}
