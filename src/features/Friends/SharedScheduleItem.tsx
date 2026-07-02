/** @jsxImportSource @emotion/react */
import * as S from './Friend.styles'

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
    <div
      style={{
        background: '#fff',
        padding: '16px 20px',
        borderRadius: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <span
          style={{
            color: accentColor,
            fontSize: '18px',
            lineHeight: 1,
          }}
        >
          ●
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: '16px',
            color: '#333',
          }}
        >
          {title}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginRight: '12px',
        }}
      >
        <span style={{ fontSize: '14px', color: '#868e96' }}>{displayDate}</span>

        <div
          style={{
            backgroundColor: '#EBEAF8',
            color: '#594fca',
            padding: '8px 12px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          공유자: {sharerName}
        </div>
      </div>

      <S.CommonButton
        bgColor="#fff1f0"
        textColor="#ff4d4f"
        style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '13px' }}
        onClick={handleCancelShare}
      >
        공유 취소
      </S.CommonButton>
    </div>
  )
}
