import type { PriorityColorType } from '../types/priority'

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
