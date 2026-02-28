import { theme } from '@/shared/styles/theme'
import type { EventColorType } from '@/shared/types/event/event'

// 서버에서 내려오는 일정 색상 키를 실제 테마 팔레트 값으로 매핑한다.
export const getColorPalette = (name: EventColorType) => {
  return theme.colors[name]
}

export type { EventColorType }
