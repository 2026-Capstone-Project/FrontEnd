import { theme } from '@/shared/styles/theme'
import type { EventColorType } from '@/shared/types/event'
import type { PriorityColorType } from '@/shared/types/priority'

export const getColorPalette = (name: PriorityColorType) => {
  return theme.colors.priority[name]
}

export type { EventColorType }
