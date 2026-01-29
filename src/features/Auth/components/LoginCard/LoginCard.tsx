import { useState } from 'react'

import GoogleIcon from '@/assets/icons/google.svg?react'
import KakaoIcon from '@/assets/icons/kakao.svg?react'
import NaverIcon from '@/assets/icons/naver.svg?react'

import * as S from './LoginCard.style'

const LoginCard = () => {
  const [isLoginMode, setIsLoginMode] = useState(true)

  const toggleMode = () => setIsLoginMode((prev) => !prev)

  return (
    <S.Right>
      <S.InnerCard>
        <S.Title>{isLoginMode ? '로그인하기' : '계정 만들기'}</S.Title>

        <S.Google>
          <S.IconWrapper>
            <GoogleIcon />
          </S.IconWrapper>
          <S.ButtonText>Google로 {isLoginMode ? '로그인하기' : '계정 만들기'}</S.ButtonText>
        </S.Google>

        <S.Kakao>
          <S.IconWrapper>
            <KakaoIcon />
          </S.IconWrapper>
          <S.ButtonText>카카오로 {isLoginMode ? '로그인하기' : '계정 만들기'}</S.ButtonText>
        </S.Kakao>

        <S.Naver>
          <S.IconWrapper>
            <NaverIcon />
          </S.IconWrapper>
          <S.ButtonText>NAVER로 {isLoginMode ? '로그인하기' : '계정 만들기'}</S.ButtonText>
        </S.Naver>

        <S.Footer>
          {isLoginMode ? '아직 계정이 없다면?' : '이미 계정이 있다면?'}
          <S.LinkText onClick={toggleMode}>{isLoginMode ? '계정 만들기' : '로그인하기'}</S.LinkText>
        </S.Footer>
      </S.InnerCard>
    </S.Right>
  )
}

export default LoginCard
