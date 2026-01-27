export const toMinutes = (time?: string) => {
  if (!time) return 0
  const [hours, minutes] = time.split(':').map((part) => Number(part))
  return hours * 60 + minutes
}

export const formatMinutes = (total: number) => {
  const normalized = Math.max(total, 0)
  const hours = Math.floor(normalized / 60)
  const minutes = normalized % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
