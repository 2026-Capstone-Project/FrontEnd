import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { RepeatConfigSchema } from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatTimeFromDate = (value: Date) => `${pad2(value.getHours())}:${pad2(value.getMinutes())}`

export const buildDefaultItemEditorDraft = (
  date: string,
  initialType: 'todo' | 'schedule',
  initialEvent?: CalendarEvent | null,
): ItemEditorDraft => {
  const baseStart = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const baseEnd =
    initialEvent?.end && new Date(initialEvent.end).getTime() !== baseStart.getTime()
      ? new Date(initialEvent.end)
      : new Date(baseStart.getTime() + 60 * 60 * 1000)

  return {
    title:
      initialType === 'schedule' && initialEvent?.title === '새 일정'
        ? ''
        : (initialEvent?.title ?? ''),
    description: initialEvent?.content ?? '',
    startDate: baseStart,
    endDate: baseEnd,
    startTime: formatTimeFromDate(baseStart),
    endTime: initialType === 'todo' ? formatTimeFromDate(baseStart) : formatTimeFromDate(baseEnd),
    isAllday: initialEvent?.isAllDay ?? false,
    eventColor: initialEvent?.color ?? (initialType === 'todo' ? 'GRAY' : 'BLUE'),
    repeatConfig: defaultRepeatConfig as RepeatConfigSchema,
    location: initialEvent?.location ?? '',
    address: initialEvent?.address ?? null,
  }
}
