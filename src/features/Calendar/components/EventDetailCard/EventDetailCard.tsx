import * as S from './EventDetailCard.style'
const EventCard = () => {
  return (
    <S.EventWrapper>
      <S.Time>14:00</S.Time>
      <S.TextWrapper>
        <S.Title>졸프회의</S.Title>
        <S.Content>회의 대비 발표 자료 준비</S.Content>
      </S.TextWrapper>
    </S.EventWrapper>
  )
}

export default EventCard
