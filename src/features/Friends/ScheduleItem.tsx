/** @jsxImportSource @emotion/react */
import { Clock4, MapPin, UserRound } from 'lucide-react'

import * as S from './Friend.styles'
interface ScheduleItemProps {
  inviter: string
  title: string
  startDate: string
  endDate?: string
  location: string
  participants: number
  accentColor: string
}

export default function ScheduleItem({
  inviter,
  title,
  startDate,
  endDate,
  location,
  participants,
  accentColor,
}: ScheduleItemProps) {
  const formatDate = (dateStr: string, includeYear: boolean = true) => {
    const date = new Date(dateStr)

    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]

    if (includeYear) {
      return `${year}년 ${month}월 ${day}일 (${week})`
    }
    return `${month}월 ${day}일 (${week})`
  }

  const displayDate = () => {
    if (!endDate || startDate === endDate) {
      return formatDate(startDate)
    }
    return `${formatDate(startDate)} - ${formatDate(endDate, false)}`
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#f1f3f5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '18px',
              fontWeight: 600,
              color: '#adb5bd',
            }}
          >
            {inviter[0]}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#333' }}>
              {inviter}님이 초대했어요
            </div>
            <div style={{ fontSize: '13px', color: '#adb5bd', marginTop: '2px' }}>방금 전</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <S.CommonButton bgColor="#f1f3f5" textColor="#868e96" style={{ borderRadius: '12px' }}>
            거절
          </S.CommonButton>
          <S.CommonButton bgColor="#edf2ff" textColor="#5c6ac4" style={{ borderRadius: '12px' }}>
            수락
          </S.CommonButton>
        </div>
      </div>

      <div
        style={{
          background: `${accentColor}1A`,
          padding: '20px',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            fontSize: '17px',
            fontWeight: 800,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ color: accentColor || '#ffbb00', fontSize: '11px' }}>●</span> {title}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '14px',
            color: '#495057',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock4 style={{ width: '16px', height: '16px' }} /> {displayDate()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin style={{ width: '16px', height: '16px' }} />
            {location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserRound style={{ width: '16px', height: '16px' }} />
            참여자 {participants}명
          </div>
        </div>
      </div>
    </div>
  )
}
