import { theme } from '@/shared/styles/theme'
import type { EventColorType } from '@/shared/types/event/event'
import type { PriorityColorType } from '@/shared/types/event/priority'

// 우선순위 타입을 Todo 카드에 사용할 색상 팔레트로 변환한다.
export const getColorPalette = (name: PriorityColorType) => {
  return theme.colors.priority[name]
}

export type { EventColorType }
