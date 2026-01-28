import { theme } from '@/shared/styles/theme'
import type { EventColorType } from '@/shared/types/event'

export const getColorPalette = (name: EventColorType) => {
  return theme.colors[name]
}

export type { EventColorType }
