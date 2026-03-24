import { useMutation } from '@tanstack/react-query'

import BellIcon from '@/assets/icons/bell.svg?react'
import AIChatModal from '@/features/Common/AIChatModal'
import { SparkleIcon } from '@/features/Home/Icon/SparkleIcon'
import { queryClient } from '@/shared/api'
import { fetchReminders, fetchTodayBriefing, suggestionApi } from '@/shared/api/home/home'
import { useCustomQuery } from '@/shared/hooks/common/customQuery'

import * as S from './HomePage.styles'

export default function HomePage() {
  const { data: briefing, isLoading } = useCustomQuery(['todayBriefing'], fetchTodayBriefing, {
    select: (response) => response.result,
  })

  const { data: reminders = [] } = useCustomQuery(['reminders'], fetchReminders, {
    select: (response) => response.result,
    refetchInterval: 60000,
  })

  const formatDateKorean = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(date)
  }

  const getEmptyMessage = (reason?: string) => {
    if (reason === 'DISABLED') return '브리핑 기능이 비활성화 상태입니다'
    if (reason === 'NOT_EVENT_TODAY') return '오늘 예정된 일정이 없습니다'
    if (reason === 'TIME_NOT_REACHED') return '브리핑 생성 시간이 되지 않았습니다'
    return ''
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return ''
    const parts = timeStr.split(':')
    if (parts.length < 2) return timeStr
    return `${parts[0]}:${parts[1]}`
  }

  const { data: suggestions = [] } = useCustomQuery(['suggestions'], suggestionApi.getSuggestions, {
    select: (response) => response.result.details,
    refetchInterval: 60000,
  })

  const { mutate: handleAccept } = useMutation({
    mutationFn: suggestionApi.acceptSuggestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suggestions'] }),
  })

  const { mutate: handleReject } = useMutation({
    mutationFn: suggestionApi.rejectSuggestion,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suggestions'] }),
  })

  return (
    <S.Container>
      <S.Left>
        <S.DateTitle>{formatDateKorean(briefing?.date)}</S.DateTitle>
        <S.SubTitle>AI가 오늘의 일정을 한눈에, 쉽게 정리해드려요</S.SubTitle>

        <S.BriefingCard>
          <S.BriefingHeader>
            <S.CardTitle>오늘의 일정 브리핑</S.CardTitle>
            {briefing?.reason === 'AVAILABLE' && <S.RedDot />}
          </S.BriefingHeader>

          <S.BriefingContent>
            {isLoading ? (
              <S.ScheduleItem>AI가 브리핑을 생성하고 있습니다. . .</S.ScheduleItem>
            ) : briefing?.reason === 'AVAILABLE' && briefing.briefInfo ? (
              <S.ScheduleList>
                {briefing.briefInfo.map((item, index) => (
                  <S.ScheduleItem key={index}>
                    <span className="time">{formatTime(item.startTime)}</span>
                    <span className="content">{item.title}</span>
                  </S.ScheduleItem>
                ))}
              </S.ScheduleList>
            ) : (
              <S.ScheduleItem>
                <span className="content">
                  {getEmptyMessage(briefing?.reason) || '오늘의 브리핑을 확인할 수 없습니다.'}
                </span>
              </S.ScheduleItem>
            )}
          </S.BriefingContent>
          <S.BadgeRow>
            <S.Badge>
              <span>{briefing?.eventCount ?? 0}</span>일정
            </S.Badge>
            <S.Badge>
              <span>{briefing?.toDoCount ?? 0}</span>
              <S.TodoText>할 일</S.TodoText>
            </S.Badge>
          </S.BadgeRow>
        </S.BriefingCard>

        {reminders?.map((reminder) => {
          return (
            <S.Card key={reminder.id}>
              <S.CardHeader>
                <S.Tag type="remind">리마인드</S.Tag>
                <S.IconWrapper>
                  <BellIcon />
                </S.IconWrapper>
              </S.CardHeader>

              <S.CardText>{reminder.message}</S.CardText>
            </S.Card>
          )
        })}

        {suggestions.map((suggestion) => (
          <S.Card key={suggestion.id}>
            <S.CardHeader>
              <S.Tag type="ai">AI 제안</S.Tag>
              <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={42} />
            </S.CardHeader>

            <S.CardText>{suggestion.content}</S.CardText>

            <S.ButtonRow>
              <S.GhostButton onClick={() => handleReject(suggestion.id)}>거절</S.GhostButton>
              <S.PrimaryButton onClick={() => handleAccept(suggestion.id)}>등록</S.PrimaryButton>
            </S.ButtonRow>
          </S.Card>
        ))}

        {/* --- 개발용 임시 버튼 추가 영역  개발 끝나면 지울게요 --- */}
        {import.meta.env.VITE_DEV_MODE === 'true' && (
          <S.DevButtonWrapper>
            <button
              onClick={() =>
                suggestionApi
                  .createSuggestion()
                  .then(() => queryClient.invalidateQueries({ queryKey: ['suggestions'] }))
              }
            >
              제안 생성 (임시)
            </button>
            <button
              onClick={() =>
                suggestionApi
                  .deleteSuggestion()
                  .then(() => queryClient.invalidateQueries({ queryKey: ['suggestions'] }))
              }
            >
              전체 삭제 (임시)
            </button>
          </S.DevButtonWrapper>
        )}
      </S.Left>
      <AIChatModal />
    </S.Container>
  )
}
