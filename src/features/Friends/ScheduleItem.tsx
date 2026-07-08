import { Clock4, MapPin, UserRound } from 'lucide-react'

import { eventShareApi } from '@/shared/api/friends/eventShare'
import { getErrorMessage } from '@/shared/utils'
import { useToastStore } from '@/store/useToastStore'

import * as S from './ScheduleItem.style'

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
    <S.Container>
      <S.Header>
        <S.InviterArea>
          <S.Avatar>{inviter?.charAt(0) || '?'}</S.Avatar>
          <S.InviterTextArea>
            <S.InviterTitle>{inviter}님이 초대했어요</S.InviterTitle>
            <S.RelativeTime>{getRelativeTime(createdAt)}</S.RelativeTime>
          </S.InviterTextArea>
        </S.InviterArea>

        <S.Actions>
          <S.ActionButton bgColor="#f1f3f5" textColor="#868e96" onClick={handleReject}>
            거절
          </S.ActionButton>
          <S.ActionButton bgColor="#edf2ff" textColor="#5c6ac4" onClick={handleAccept}>
            수락
          </S.ActionButton>
        </S.Actions>
      </S.Header>

      <S.DetailCard color={accentColor}>
        <S.Title>
          <S.Dot color={accentColor}>●</S.Dot> {title}
        </S.Title>

        <S.MetaList>
          <S.MetaItem>
            <Clock4 /> {displayDate()}
          </S.MetaItem>
          <S.MetaItem>
            <MapPin />
            {location && location.trim() ? location : '장소 미정'}
          </S.MetaItem>
          <S.MetaItem>
            <UserRound />
            참여자 {participants}명
          </S.MetaItem>
        </S.MetaList>
      </S.DetailCard>
    </S.Container>
  )
}
