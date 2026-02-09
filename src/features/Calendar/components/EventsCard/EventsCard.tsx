import { createPortal } from 'react-dom'

import { useEventQuery } from '@/shared/hooks/query/useCalendarQueries'

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
  const editDate = new Date(selectedDate)
  const year = editDate.getFullYear()
  const month = String(editDate.getMonth() + 1).padStart(2, '0')
  const day = String(editDate.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  const { data } = useEventQuery(formattedDate, formattedDate)
  const details = data?.result?.details ?? []

  const startOfSelectedDay = new Date(selectedDate)
  startOfSelectedDay.setHours(0, 0, 0, 0)
  const endOfSelectedDay = new Date(startOfSelectedDay)
  endOfSelectedDay.setHours(23, 59, 59, 999)

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
          {details.length > 0 ? (
            <S.EventCards>
              {details.map((event) => (
                <EventDetailCard key={event.id} event={event} type={'schedule'} />
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
