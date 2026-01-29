import BellIcon from '@/assets/icons/bell.svg?react'
import AIChatModal from '@/features/Common/AIChatModal'
import { SparkleIcon } from '@/features/Home/Icon/SparkleIcon'

import * as S from './HomePage.styles'

export default function HomePage() {
  return (
    <S.Container>
      <S.Left>
        <S.DateTitle>2025년 12월 30일 화요일</S.DateTitle>
        <S.SubTitle>AI가 오늘의 일정을 한눈에, 쉽게 정리해드려요</S.SubTitle>
        <AIChatModal />
        <S.BriefingCard>
          <S.BriefingHeader>
            <S.CardTitle>오늘의 일정 브리핑</S.CardTitle>
            <S.RedDot />
          </S.BriefingHeader>

          <S.BriefingContent>
            <S.ScheduleList>
              <S.ScheduleItem>
                <span className="time">14:00</span>
                <span className="content">졸프 회의</span>
              </S.ScheduleItem>
              <S.ScheduleItem>
                <span className="time">19:00</span>
                <span className="content">친구와 저녁 약속</span>
              </S.ScheduleItem>
              <S.ScheduleItem isDeadline>
                <span className="time">23:59</span>
                <span className="content">전공 과제 마감</span>
              </S.ScheduleItem>
            </S.ScheduleList>
          </S.BriefingContent>

          <S.BadgeRow>
            <S.Badge>
              <span>2</span>일정
            </S.Badge>
            <S.Badge>
              <span>1</span>
              <S.TodoText>할 일</S.TodoText>
            </S.Badge>
          </S.BadgeRow>
        </S.BriefingCard>

        <S.Card>
          <S.CardHeader>
            <S.Tag type="remind">리마인드</S.Tag>
            <S.IconWrapper>
              <BellIcon />
            </S.IconWrapper>
          </S.CardHeader>

          <S.CardText>
            <b>8시간 뒤,</b> 전공 과제 마감이에요.
          </S.CardText>
        </S.Card>

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
    </S.Container>
  )
}
