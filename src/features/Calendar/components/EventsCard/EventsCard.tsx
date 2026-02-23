import { useEventQuery, useTodoForCalendarQuery } from '@/shared/hooks/query/useCalendarQueries'

import EventDetailCard from '../EventDetailCard/EventDetailCard'
import * as S from './EventsCard.style'
const EventsCard = ({ selectedDate }: { selectedDate: Date }) => {
  const editDate = new Date(selectedDate)
  const year = editDate.getFullYear()
  const month = String(editDate.getMonth() + 1).padStart(2, '0')
  const day = String(editDate.getDate()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  const { data: eventData } = useEventQuery(formattedDate, formattedDate)
  const { data: todoData } = useTodoForCalendarQuery(formattedDate, formattedDate)
  const details = eventData?.result?.details ?? []

  return (
    <S.CardWrapper
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <S.Card mode={'inline'}>
        <S.Header>
          {selectedDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
          <S.Dot />
        </S.Header>
        {details.length > 0 || (todoData?.result?.todos.length ?? 0) > 0 ? (
          <S.EventCards>
            {details.map((event) => (
              <EventDetailCard key={event.id} event={event} type={'schedule'} />
            ))}
            {todoData?.result?.todos.map((todo) => (
              <EventDetailCard key={todo.todoId} event={todo} type={'todo'} />
            ))}
          </S.EventCards>
        ) : (
          <S.EmptyEvent>예정된 일정 없음</S.EmptyEvent>
        )}
      </S.Card>
    </S.CardWrapper>
  )
}

export default EventsCard
