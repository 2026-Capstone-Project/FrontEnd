/** @jsxImportSource @emotion/react */
import { Clock4, MapPin, UserRound } from 'lucide-react'

import { eventShareApi } from '@/shared/api/friends/eventShare'
import { getErrorMessage } from '@/shared/utils'
import { useToastStore } from '@/store/useToastStore'

import * as S from './Friend.styles'

interface ScheduleItemProps {
  participantId: number
  inviter: string
  title: string
  startDate: string
  endDate?: string
  location: string
  participants: number
  accentColor: string
  createdAt: string
  onActionSuccess?: () => void
}

export default function ScheduleItem({
  participantId,
  inviter = '이름없음',
  title = '',
  startDate,
  endDate,
  location = '',
  participants = 0,
  accentColor = '#5c6ac4',
  createdAt,
  onActionSuccess,
}: ScheduleItemProps) {
  const handleReject = async () => {
    try {
      const response = await eventShareApi.rejectInvitation(participantId)
      if (response.isSuccess) {
        showToast({
          title: '초대 거절 완료',
          message: '초대를 거절했습니다.',
          toastType: 'success',
        })
        onActionSuccess?.()
      }
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error)

      showToast({
        title: '초대 거절 실패',
        message: errorMessage || '초대 거절에 실패했습니다.',
        toastType: 'error',
      })
    }
  }

  const handleAccept = async () => {
    try {
      const response = await eventShareApi.acceptInvitation(participantId)
      if (response.isSuccess) {
        showToast({
          title: '초대 수락 완료',
          message: '초대를 수락했습니다.',
          toastType: 'success',
        })
        onActionSuccess?.()
      }
    } catch (error) {
      console.error(error)
      const errorMessage = getErrorMessage(error)

      showToast({
        title: '초대 수락 실패',
        message: errorMessage || '초대 수락에 실패했습니다.',
        toastType: 'error',
      })
    }
  }

  const formatDate = (dateStr: string, includeYear: boolean = true) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''

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

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return '방금 전'

    const now = new Date()
    const past = new Date(dateStr)

    if (isNaN(past.getTime())) return '방금 전'

    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) return '방금 전'

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}시간 전`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}일 전`

    return `${past.getMonth() + 1}월 ${past.getDate()}일`
  }

  const { showToast } = useToastStore()

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
            {inviter?.charAt(0) || '?'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#333' }}>
              {inviter}님이 초대했어요
            </div>
            <div style={{ fontSize: '13px', color: '#adb5bd', marginTop: '2px' }}>
              {getRelativeTime(createdAt)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <S.CommonButton
            bgColor="#f1f3f5"
            textColor="#868e96"
            style={{ borderRadius: '12px' }}
            onClick={handleReject}
          >
            거절
          </S.CommonButton>
          <S.CommonButton
            bgColor="#edf2ff"
            textColor="#5c6ac4"
            style={{ borderRadius: '12px' }}
            onClick={handleAccept}
          >
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
            {location && location.trim() ? location : '장소 미정'}
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
