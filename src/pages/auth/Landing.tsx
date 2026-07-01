import { Clock4, MapPin, UserRound } from 'lucide-react'
import { useEffect, useRef } from 'react'

import GoogleIcon from '@/assets/icons/google.svg?react'
import KakaoIcon from '@/assets/icons/kakao.svg?react'
import NaverIcon from '@/assets/icons/naver.svg?react'
import LandingCalendar from '@/assets/login/LandingCalendar_noBack.svg?react'
import LandingTodo from '@/assets/login/LandingTodo.svg?react'
import Logo from '@/assets/logo.svg?react'
import * as ChatS from '@/features/Common/AIChatModal.styles'
import { SparkleIcon } from '@/features/Home/Icon/SparkleIcon'
import * as HomeS from '@/pages/main/HomePage/HomePage.styles'
import { redirectToSocialLogin } from '@/shared/api/auth/auth'
import Plus from '@/shared/assets/icons/plus.svg?react'
import Robot from '@/shared/assets/icons/robot_noBackground.svg?react'
import Star from '@/shared/assets/icons/star.svg?react'

import * as S from './Landing.styles'

const features = [
  {
    title: '말하면 바로 등록돼요',
    description: ['"내일 1시에 미팅" 한 마디면 충분해요', '번거로운 과정을 줄여줘요'],
    align: 'left',
    slot: 'chat',
  },
  {
    title: '캘리오가 먼저 제안해요',
    description: [
      '반복되는 일정 패턴을 학습해 다음 일정을 미리 추천해요.',
      '등록 버튼 하나로 바로 추가 완료.',
    ],
    align: 'right',
    slot: 'suggest',
  },
  {
    title: '일정도, 할 일도 여기 다 있어요',
    description: ['여러 앱을 사용할 필요 없이 한 곳에서 관리해요'],
    align: 'left',
    slot: 'todo',
  },
  {
    title: '친구와 함께하는 일정도 쉽게',
    description: [
      '공유 일정을 만들어 친구를 초대하세요',
      '친구가 수락하면 각자 캘린더에 자동으로 등록돼요',
    ],
    align: 'right',
    slot: 'share',
  },
]

function FeatureVisual({ slot, reverse }: { slot: string; reverse: boolean }) {
  if (slot === 'chat') {
    return (
      <S.ImageSlot $reverse={reverse} $type={slot} aria-label="AI 채팅 이미지 영역">
        <S.LandingChatPreview $reverse={reverse}>
          <ChatS.UserMessageWrapper>
            <ChatS.UserBubble>내일 1시에 졸업 프로젝트 미팅 있어</ChatS.UserBubble>
          </ChatS.UserMessageWrapper>

          <ChatS.BotMessageWrapper>
            <ChatS.BotContentArea>
              <S.BotFallbackBubble>
                일정 <b>졸업 프로젝트 미팅</b>
                <br />
                날짜 <b>2026년 5월 7일 목요일</b>
                <br />
                시간 <b>오후 1시 (13:00)</b>
                <br />
                유형 <b>일정</b>
                <br />
                <button>일정 등록하기</button>
              </S.BotFallbackBubble>
            </ChatS.BotContentArea>
          </ChatS.BotMessageWrapper>
        </S.LandingChatPreview>
      </S.ImageSlot>
    )
  }

  if (slot === 'suggest') {
    return (
      <S.LandingSuggestionCard $reverse={reverse}>
        <HomeS.CardHeader>
          <HomeS.Tag type="ai">AI 제안</HomeS.Tag>
          <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={34} />
        </HomeS.CardHeader>
        <HomeS.CardText>
          4주째 한 번 미팅을 가졌는데, 이번 주가 4주차예요!
          <br />
          이번 주도 회의 일정을 등록할까요?
        </HomeS.CardText>
        <HomeS.ButtonRow>
          <HomeS.GhostButton type="button">거절</HomeS.GhostButton>
          <HomeS.PrimaryButton type="button">등록</HomeS.PrimaryButton>
        </HomeS.ButtonRow>
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

export default function Landing() {
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return

    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          entry.target.setAttribute('data-visible', 'true')
          observer.unobserve(entry.target)
        })
      },
      { root, threshold: 0.24 },
    )

    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [])

  function handleSocialLogin(provider: string) {
    redirectToSocialLogin(provider)
  }

  return (
    <S.Page ref={pageRef}>
      <S.Hero>
        <S.Circle $width="491px" $color="rgba(146, 255, 233, 0.70)" $top="30%" $left="50%" />
        <S.Circle $width="723px" $color="rgba(141, 207, 225, 0.90)" $top="10%" $left="10%" />
        <S.Circle
          $width="375px"
          $color="rgba(146, 255, 233, 0.40)"
          $top="25%"
          $left="80%"
          $blur="200px"
        />
        <S.Circle $width="514px" $color="rgba(146, 255, 233, 0.50)" $top="45%" $left="80%" />
        <S.Circle $width="449px" $color="rgba(236, 235, 255, 0.50)" $top="30%" $left="30%" />
        <S.Circle $width="538px" $color="rgba(84, 152, 208, 0.5)" $top="60%" $left="80%" />
        <S.Circle $width="491px" $color="rgba(146, 255, 233, 0.70)" $top="40%" $left="40%" />
        <S.BackgroundText>
          Calender
          <br /> + i/O
        </S.BackgroundText>
        <S.Nav>
          <S.Tagline>현대인을 위한 AI 일정 비서</S.Tagline>
          <S.Logo>
            <Logo />
          </S.Logo>
        </S.Nav>

        <S.HeroGrid>
          <S.RobotIconSlot>
            <Robot width="200px" height="200px" />
          </S.RobotIconSlot>
          <S.HeroCopy>
            <S.HeroTitle>
              <span>말 한마디로</span>
              <span>일정이 완성된다</span>
            </S.HeroTitle>
            <S.HeroText>
              자연어로 입력하면 AI가 자동으로 일정을 등록해드려요.
              <br />
              친구와 함께하는 일정도 손쉽게 공유할 수 있어요.
            </S.HeroText>
            <S.StartLink to="/login">AI 일정 관리 시작하기</S.StartLink>
          </S.HeroCopy>
        </S.HeroGrid>
        <S.ScrollCue aria-hidden="true" />
      </S.Hero>

      <S.Section>
        <S.SectionTitle>
          캘리오랑 하면 이렇게 달라져요 <Star width="33px" />
        </S.SectionTitle>

        {features.map((feature) => (
          <S.FeatureRow key={feature.title} $align={feature.align} data-reveal>
            <S.FeatureCopy $reverse={feature.align === 'right'}>
              <S.FeatureTitle>{feature.title}</S.FeatureTitle>
              {feature.description.map((line) => (
                <S.FeatureText key={line}>{line}</S.FeatureText>
              ))}
            </S.FeatureCopy>
            <FeatureVisual slot={feature.slot} reverse={feature.align === 'right'} />
          </S.FeatureRow>
        ))}
      </S.Section>

      <S.Cta>
        <S.CtaTitle>일정 관리, 오늘부터 바꿔보세요</S.CtaTitle>
        <S.RobotSlot $compact aria-label="하단 대표 이미지 영역">
          <Robot width="94px" height="94px" />
        </S.RobotSlot>
        <S.CtaText>
          말 한마디로 일정을 완성하는 경험,
          <br />
          캘리오와 함께하세요.
        </S.CtaText>
        <S.SocialButtons>
          <S.Google onClick={() => handleSocialLogin('GOOGLE')}>
            <GoogleIcon />
            Google로 계정 만들기
          </S.Google>
          <S.Kakao onClick={() => handleSocialLogin('KAKAO')}>
            <KakaoIcon />
            카카오로 계정 만들기
          </S.Kakao>
          <S.Naver onClick={() => handleSocialLogin('NAVER')}>
            <NaverIcon />
            NAVER로 계정 만들기
          </S.Naver>
        </S.SocialButtons>
      </S.Cta>

      <S.Footer>
        <S.FooterBrand>
          <span>현대인을 위한 AI 일정 비서</span>
          <S.FooterLogo>
            <Logo />
          </S.FooterLogo>
        </S.FooterBrand>
        <S.FooterCopyright>© 2026 Cali/o. All rights reserved.</S.FooterCopyright>
        <S.FooterLinks>
          {/* <button type="button">서비스 소개</button> */}
          <a
            href="https://fortune-squash-ece.notion.site/3908f1b5499880468dbfc2567d5ab359?pvs=74"
            target="_blank"
            rel="noreferrer"
          >
            개인정보처리방침
          </a>
          <a href="mailto:calio.co.kr@gmail.com">문의하기</a>
        </S.FooterLinks>
      </S.Footer>
    </S.Page>
  )
}
