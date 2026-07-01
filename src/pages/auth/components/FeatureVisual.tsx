import { Clock4, MapPin, UserRound } from 'lucide-react'

import LandingCalendar from '@/assets/login/LandingCalendar_noBack.svg?react'
import LandingTodo from '@/assets/login/LandingTodo.svg?react'
import { SparkleIcon } from '@/features/Home/Icon/SparkleIcon'
import Plus from '@/shared/assets/icons/plus.svg?react'

import * as S from '../Landing.styles'

export function FeatureVisual({ slot, reverse }: { slot: string; reverse: boolean }) {
  if (slot === 'chat') {
    return (
      <S.ImageSlot $reverse={reverse} $type={slot} aria-label="AI 채팅 이미지 영역">
        <S.LandingChatPreview $reverse={reverse}>
          <S.ChatUserMessage>
            <S.ChatUserBubble>내일 1시에 졸업 프로젝트 미팅 있어</S.ChatUserBubble>
          </S.ChatUserMessage>

          <S.ChatBotMessage>
            <S.ChatBotContent>
              <S.BotFallbackBubble>
                일정 <b>졸업 프로젝트 미팅</b>
                <br />
                날짜 <b>2026년 5월 7일 목요일</b>
                <br />
                시간 <b>오후 1시 (13:00)</b>
                <br />
                유형 <b>일정</b>
                <br />
                <button type="button">일정 등록하기</button>
              </S.BotFallbackBubble>
            </S.ChatBotContent>
          </S.ChatBotMessage>
        </S.LandingChatPreview>
      </S.ImageSlot>
    )
  }

  if (slot === 'suggest') {
    return (
      <S.LandingSuggestionCard $reverse={reverse}>
        <S.SuggestionHeader>
          <S.SuggestionTag>AI 제안</S.SuggestionTag>
          <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={34} />
        </S.SuggestionHeader>
        <S.SuggestionText>
          4주째 한 번 미팅을 가졌는데, 이번 주가 4주차예요!
          <br />
          이번 주도 회의 일정을 등록할까요?
        </S.SuggestionText>
        <S.SuggestionButtonRow>
          <S.SuggestionGhostButton type="button">거절</S.SuggestionGhostButton>
          <S.SuggestionPrimaryButton type="button">등록</S.SuggestionPrimaryButton>
        </S.SuggestionButtonRow>
      </S.LandingSuggestionCard>
    )
  }

  if (slot === 'todo') {
    return (
      <S.ImageSlot $reverse={reverse} $type={slot} aria-label="일정과 할 일 이미지 영역">
        <S.TodoPreview>
          <S.IconTile>
            <LandingCalendar />
          </S.IconTile>
          <S.PlusMark>
            <Plus />
          </S.PlusMark>
          <S.IconTile>
            <LandingTodo />
          </S.IconTile>
        </S.TodoPreview>
      </S.ImageSlot>
    )
  }

  return (
    <S.ShareCardPreview $reverse={reverse}>
      <S.ShareHeader>
        <S.ShareTitle>일정 공유</S.ShareTitle>
        <S.ShareCount>3</S.ShareCount>
      </S.ShareHeader>
      <S.ShareCard>
        <S.ShareInviteRow>
          <S.ShareAvatar>a</S.ShareAvatar>
          <S.ShareInviteText>
            <strong>김캘리님이 초대했어요</strong>
            <span>방금 전</span>
          </S.ShareInviteText>
          <S.ShareActions>
            <button type="button">거절</button>
            <button type="button">수락</button>
          </S.ShareActions>
        </S.ShareInviteRow>
        <S.ShareDetail>
          <S.ShareDetailTitle>
            <span />
            대전 여행
          </S.ShareDetailTitle>
          <S.ShareMeta>
            <Clock4 />
            2026년 4월 10일 (금) - 4월 11일 (토)
          </S.ShareMeta>
          <S.ShareMeta>
            <MapPin />
            대전
          </S.ShareMeta>
          <S.ShareMeta>
            <UserRound />
            참여자 4명
          </S.ShareMeta>
        </S.ShareDetail>
      </S.ShareCard>
    </S.ShareCardPreview>
  )
}
