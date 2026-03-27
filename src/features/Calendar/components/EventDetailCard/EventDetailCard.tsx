import type { Event } from '@/shared/types/calendar/types'
import type { TodoType } from '@/shared/types/todo/types'

import * as S from './EventDetailCard.style'

type EventDetailCardProps = { event: Event; type: 'schedule' } | { event: TodoType; type: 'todo' }

const formatTodoDueTime = (dueTime: TodoType['dueTime']) => {
  if (!dueTime) return ''
  if (typeof dueTime === 'string') return dueTime.slice(0, 5)
  const hour = String(dueTime.hour ?? 0).padStart(2, '0')
  const minute = String(dueTime.minute ?? 0).padStart(2, '0')
  return `${hour}:${minute}`
}

const EventDetailCard = ({ event, type }: EventDetailCardProps) => {
  const time =
    type === 'todo'
      ? event.isAllDay
        ? '종일'
        : `${formatTodoDueTime(event.dueTime)} 까지`.trim()
      : event.isAllDay
        ? '종일'
        : new Date(event.start).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })

  const content = type === 'todo' ? event.memo?.trim() : event.content?.trim()

  return (
    <S.EventWrapper>
      <S.Time>{time}</S.Time>
      <S.TextWrapper>
        <S.Title type={type}>{event.title}</S.Title>
        <S.Content>{content ? content : '-'}</S.Content>
      </S.TextWrapper>
    </S.EventWrapper>
  )
}

export default EventDetailCard
