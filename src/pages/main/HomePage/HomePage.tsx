import BellIcon from '@/assets/icons/bell.svg?react'
import AIChatModal from '@/features/Common/AIChatModal'
import { SparkleIcon } from '@/features/Home/Icon/SparkleIcon'
import { fetchReminders, fetchTodayBriefing } from '@/shared/api/home/home'
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
    return ''
  }

  const formatTime = (timeStr: string) => {
    if (!timeStr) return ''
    const parts = timeStr.split(':')
    if (parts.length < 2) return timeStr
    return `${parts[0]}:${parts[1]}`
  }

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

        <S.Card>
          <S.CardHeader>
            <S.Tag type="ai">AI 제안</S.Tag>
            <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={42} />
          </S.CardHeader>

          <S.CardText>
            4주에 한 번 미용실 가셨는데, 이번 주가 4주차예요!
            <br />
            이번주 토요일에 미용실 일정을 등록할까요?
          </S.CardText>
          <S.ButtonRow>
            <S.GhostButton>거절</S.GhostButton>
            <S.PrimaryButton>등록</S.PrimaryButton>
          </S.ButtonRow>
        </S.Card>

        <S.Card>
          <S.CardHeader>
            <S.Tag type="ai">AI 제안</S.Tag>
            <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={42} />
          </S.CardHeader>
          <S.CardText>
            매주 목요일 22시에 졸프 회의를 하셨네요.
            <br />
            다음 주 목요일 22시에 졸프 회의 일정을 등록할까요?
          </S.CardText>
          <S.ButtonRow>
            <S.GhostButton>거절</S.GhostButton>
            <S.PrimaryButton>등록</S.PrimaryButton>
          </S.ButtonRow>
        </S.Card>
      </S.Left>
      <AIChatModal />
    </S.Container>
  )
}
