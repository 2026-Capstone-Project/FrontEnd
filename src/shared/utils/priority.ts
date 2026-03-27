import type { PriorityColorType } from '../types/event/priority'

// 우선순위 enum(HIGH/MEDIUM/LOW)을 한국어 라벨로 변환한다.
export function translatePriority(priority: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  switch (priority) {
    case 'HIGH':
      return '높음'
    case 'MEDIUM':
      return '보통'
    case 'LOW':
      return '낮음'
    default:
      return '낮음'
  }
}

// 우선순위 enum을 배지 색상 토큰으로 변환한다.
export function getPriorityColor(priority: 'HIGH' | 'MEDIUM' | 'LOW'): PriorityColorType {
  switch (priority) {
    case 'HIGH':
      return 'red'
    case 'MEDIUM':
      return 'yellow'
    case 'LOW':
      return 'green'
    default:
      return 'green'
  }
}
