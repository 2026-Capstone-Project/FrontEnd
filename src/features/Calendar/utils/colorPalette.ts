import type { EventColorType } from '@/types/color'

const palette: Record<EventColorType, { base: string; point: string }> = {
  sky: { base: '#dcecfc', point: '#94c8ff' },
  mint: { base: '#dcf2ec', point: '#8fd2c0' },
  pink: { base: '#ffebe8', point: '#f5b4aa' },
  violet: { base: '#f1ebf9', point: '#c9b0f0' },
  yellow: { base: '#fff0b3', point: '#f4d144' },
  gray: { base: '#e9e9e9', point: '#757575' },
}

export const getColorPalette = (name?: string) => {
  if (!name) return null
  const key = name.toLowerCase() as EventColorType
  return palette[key] ?? null
}

export type { EventColorType }
