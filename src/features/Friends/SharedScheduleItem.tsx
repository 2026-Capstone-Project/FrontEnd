import * as S from './SharedScheduleItem.style'

interface SharedScheduleItemProps {
  eventId: number
  title: string
  startDate: string
  endDate?: string
  sharerName: string
  accentColor: string
  onCancelSuccess?: () => void
}

export default function SharedScheduleItem({
  eventId,
  title = '',
  startDate = '',
  endDate,
  sharerName = '이름없음',
  accentColor = '#5c6ac4',
  onCancelSuccess,
}: SharedScheduleItemProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
    return `${month}월 ${day}일 (${week})`
  }

  const displayDate =
    !endDate || startDate === endDate
      ? formatDate(startDate)
      : `${formatDate(startDate)} - ${formatDate(endDate)}`

  const handleCancelShare = () => {
    console.log(`eventId ${eventId} 공유 취소 클릭`)
    onCancelSuccess?.()
  }

  return (
    <S.Container>
      <S.TitleArea>
        <S.Dot color={accentColor}>●</S.Dot>
        <S.Title>{title}</S.Title>
        <S.DateText>{displayDate}</S.DateText>
      </S.TitleArea>

      <S.MetaArea>
        <S.SharerBadge>공유자: {sharerName}</S.SharerBadge>
        <S.CancelButton bgColor="#fff1f0" textColor="#ff4d4f" onClick={handleCancelShare}>
          공유 취소
        </S.CancelButton>
      </S.MetaArea>
    </S.Container>
  )
}
