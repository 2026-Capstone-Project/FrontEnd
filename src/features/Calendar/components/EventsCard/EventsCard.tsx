import EventDetailCard from '../EventDetailCard/EventDetailCard'
import * as S from './EventsCard.style'
const EventsCard = () => {
  return (
    <S.Card>
      <S.Header>
        2025년 12월 18일 목요일
        <S.Dot />
      </S.Header>
      <S.EventCards>
        <EventDetailCard />
        <EventDetailCard />
        <EventDetailCard />
        <EventDetailCard />
      </S.EventCards>
    </S.Card>
  )
}

export default EventsCard
