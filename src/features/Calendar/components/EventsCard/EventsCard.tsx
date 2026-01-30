import { createPortal } from 'react-dom'

import { mockCalendarEvents } from '../../mocks/calendarEvents'
import EventDetailCard from '../EventDetailCard/EventDetailCard'
import * as S from './EventsCard.style'
const EventsCard = ({
  selectedDate,
  onClose,
  mode,
}: {
  selectedDate: Date
  onClose: () => void
  mode: 'inline' | 'modal'
}) => {
  const startOfSelectedDay = new Date(selectedDate)
  startOfSelectedDay.setHours(0, 0, 0, 0)
  const endOfSelectedDay = new Date(startOfSelectedDay)
  endOfSelectedDay.setHours(23, 59, 59, 999)

  const data = mockCalendarEvents.filter((event) => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)
    return eventStart <= endOfSelectedDay && eventEnd >= startOfSelectedDay
  })
  return createPortal(
    <S.CardOverlay onClick={mode === 'modal' ? onClose : undefined}>
      <S.CardWrapper
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <S.Card>
          <S.Header>
            {selectedDate.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
            <S.Dot />
          </S.Header>
          {data.length > 0 ? (
            <S.EventCards>
              {data.map((event) => (
                <EventDetailCard key={event.id} event={event} />
              ))}
            </S.EventCards>
          ) : (
            <S.EmptyEvent>예정된 일정 없음</S.EmptyEvent>
          )}
        </S.Card>
      </S.CardWrapper>
    </S.CardOverlay>,
    document.getElementById(mode === 'modal' ? 'modal-root' : 'desktop-card-area')!,
  )
}

export default EventsCard
