import type { PriorityType } from '@/shared/types/event/priority'

export const PRIORITY_OPTIONS: Array<{ value: PriorityType; label: string }> = [
  { value: 'HIGH', label: '높음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'LOW', label: '낮음' },
]
