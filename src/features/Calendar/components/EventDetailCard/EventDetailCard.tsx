import type { Event } from '@/shared/types/calendar/types'

import * as S from './EventDetailCard.style'

const EventCard = ({ event, type }: { event: Event; type: 'todo' | 'schedule' }) => {
  const time = event.isAllDay
    ? '종일'
    : new Date(event.start).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })

  return (
    <S.EventWrapper>
      <S.Time>{time}</S.Time>
      <S.TextWrapper>
        <S.Title type={type}>{event.title}</S.Title>
        <S.Content>{event.content !== '' ? event.content : '-'}</S.Content>
      </S.TextWrapper>
    </S.EventWrapper>
  )
}

export default EventCard
