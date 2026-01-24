import { theme } from '@/shared/styles/theme'
import type { EventColorType } from '@/types/color'

export const getColorPalette = (name?: EventColorType) => {
  if (!name) return null
  return theme.colors[name]
}

export type { EventColorType }
