import { useEffect, useRef } from 'react'

import GoogleIcon from '@/assets/icons/google.svg?react'
import KakaoIcon from '@/assets/icons/kakao.svg?react'
import NaverIcon from '@/assets/icons/naver.svg?react'
import Logo from '@/assets/logo.svg?react'
import { redirectToSocialLogin } from '@/shared/api/auth/auth'
import Robot from '@/shared/assets/icons/robot_noBackground.svg?react'
import Star from '@/shared/assets/icons/star.svg?react'

import { features } from './components/features'
import { FeatureVisual } from './components/FeatureVisual'
import * as S from './Landing.styles'

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
