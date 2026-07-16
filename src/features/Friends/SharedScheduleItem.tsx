import { useMutation, useQueryClient } from '@tanstack/react-query'

import { eventShareApi } from '@/shared/api/friends/eventShare'
import { getErrorMessage } from '@/shared/utils'
import { useToastStore } from '@/store/useToastStore'

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
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

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

  const leaveEventMutation = useMutation({
    mutationFn: () => eventShareApi.leaveEvent(eventId),
    onSuccess: (response) => {
      if (response.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ['calendar'] })
        queryClient.invalidateQueries({ queryKey: ['events'] })
        queryClient.invalidateQueries({ queryKey: ['todos'] })

        showToast({
          title: '그룹 탈퇴 완료',
          message: '성공적으로 탈퇴되었습니다.',
          toastType: 'success',
        })

        onCancelSuccess?.()
      } else {
        showToast({
          title: '탈퇴 처리 실패',
          message: response.message || '탈퇴 처리에 실패했습니다.',
          toastType: 'error',
        })
      }
    },
    onError: (error) => {
      console.error(error)
      const errorMessage = getErrorMessage(error)

      showToast({
        title: '오류 발생',
        message: errorMessage || '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
        toastType: 'error',
      })
    },
  })

  const handleCancelShare = () => {
    if (window.confirm('정말 이 공유 이벤트에서 탈퇴하시겠습니까?')) {
      leaveEventMutation.mutate()
    }
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
        <S.CancelButton
          bgColor="#fff1f0"
          textColor="#ff4d4f"
          onClick={handleCancelShare}
          disabled={leaveEventMutation.isPending}
        >
          {leaveEventMutation.isPending ? '취소 중...' : '공유 취소'}
        </S.CancelButton>
      </S.MetaArea>
    </S.Container>
  )
}
