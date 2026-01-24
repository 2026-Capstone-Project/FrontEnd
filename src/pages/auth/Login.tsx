import {
  ButtonText,
  Card,
  Footer,
  Google,
  IconWrapper,
  InnerCard,
  Kakao,
  Left,
  LinkText,
  Naver,
  Right,
  Title,
  Wrapper,
  Background,
} from './Login.styles'

import GoogleIcon from '@/assets/icons/google.svg?react'
import NaverIcon from '@/assets/icons/naver.svg?react'
import KakaoIcon from '@/assets/icons/kakao.svg?react'

export default function Login() {
  return (
    <Background>
      <Wrapper>
        <Card>
          <Left>
            말하면 일정이 된다
            <h1>Calio</h1>
          </Left>

          <Right>
            <InnerCard>
              <Title>로그인하기</Title>

              <Google>
                <IconWrapper>
                  <GoogleIcon />
                </IconWrapper>
                <ButtonText>Google로 로그인하기</ButtonText>
              </Google>

              <Kakao>
                <IconWrapper>
                  <KakaoIcon />
                </IconWrapper>
                <ButtonText>카카오로 로그인하기</ButtonText>
              </Kakao>

              <Naver>
                <IconWrapper>
                  <NaverIcon />
                </IconWrapper>
                <ButtonText>NAVER로 로그인하기</ButtonText>
              </Naver>

              <Footer>
                아직 계정이 없다면?
                <LinkText>계정 만들기</LinkText>
              </Footer>
            </InnerCard>
          </Right>
        </Card>
      </Wrapper>
    </Background>
  )
}
