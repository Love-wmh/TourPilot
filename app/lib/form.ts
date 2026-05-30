export function formDataToObject(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries())
}

export function numberValue(value: FormDataEntryValue | undefined, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}
