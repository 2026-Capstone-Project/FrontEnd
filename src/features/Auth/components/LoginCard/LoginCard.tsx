import GoogleIcon from '@/assets/icons/google.svg?react'
import KakaoIcon from '@/assets/icons/kakao.svg?react'
import NaverIcon from '@/assets/icons/naver.svg?react'
import { redirectToSocialLogin } from '@/shared/api/auth/auth'

import * as S from './LoginCard.style'

const LoginCard = () => {
  function handleSocialLogin(provider: string) {
    redirectToSocialLogin(provider)
  }

  return (
    <S.Right>
      <S.InnerCard>
        <S.Title>로그인 하기</S.Title>

        <S.Google
          onClick={function () {
            handleSocialLogin('GOOGLE')
          }}
        >
          <S.IconWrapper>
            <GoogleIcon />
          </S.IconWrapper>
          <S.ButtonText>Google로 로그인하기</S.ButtonText>
        </S.Google>

        <S.Kakao
          onClick={function () {
            handleSocialLogin('KAKAO')
          }}
        >
          <S.IconWrapper>
            <KakaoIcon />
          </S.IconWrapper>
          <S.ButtonText>카카오로 로그인하기</S.ButtonText>
        </S.Kakao>

        <S.Naver
          onClick={function () {
            handleSocialLogin('NAVER')
          }}
        >
          <S.IconWrapper>
            <NaverIcon />
          </S.IconWrapper>
          <S.ButtonText>NAVER로 로그인하기</S.ButtonText>
        </S.Naver>
      </S.InnerCard>
    </S.Right>
  )
}

export default LoginCard
