import LandingCalendar from '@/assets/login/LandingCalendar.svg'
import LandingChat from '@/assets/login/LandingChat.svg'
import LandingFriends from '@/assets/login/LandingFriends.svg'
import LandingRobot from '@/assets/login/LandingRobot.svg'
import logo from '@/assets/logo.svg'
import LoginCard from '@/features/Auth/components/LoginCard/LoginCard'
import PageMeta from '@/shared/ui/common/PageMeta/PageMeta'

import * as S from './Login.styles'

export default function Login() {
  return (
    <S.Wrapper>
      {/* 로그인 화면은 검색 노출 가치가 없고, 랜딩과 내용이 겹쳐 색인에서 제외합니다. */}
      <PageMeta title="로그인" noIndex />
      <S.Card>
        <S.Left>
          <S.Logo src={logo} alt="Cali/o Logo" />
          <S.Title>
            <p>말 한마디로</p>
            <p>일정이 완성된다</p>
          </S.Title>
          <S.Description>
            자연어로 입력하면 AI가 자동으로 일정을 등록해드려요.
            <br />
            친구와 함께하는 일정도 손쉽게 공유할 수 있어요.
          </S.Description>
          <S.Info>
            <img src={LandingChat} alt="Chat Icon" />
            <S.InfoContent>
              <S.InfoTitle>채팅 한 줄로 일정 등록</S.InfoTitle>
              <S.InfoText>input : 말 한마디 → output : 일정 등록</S.InfoText>
            </S.InfoContent>
          </S.Info>
          <S.Info>
            <img src={LandingRobot} alt="Chat Icon" />
            <S.InfoContent>
              <S.InfoTitle>AI가 반복되는 일정 추천</S.InfoTitle>
              <S.InfoText>사용자 데이터 기반으로 먼저 일정을 추천</S.InfoText>
            </S.InfoContent>
          </S.Info>
          <S.Info>
            <img src={LandingCalendar} alt="Chat Icon" />
            <S.InfoContent>
              <S.InfoTitle>캘린더 + 할 일 통합 관리</S.InfoTitle>
              <S.InfoText>일정과 할 일을 하나의 앱에서 깔끔하게</S.InfoText>
            </S.InfoContent>
          </S.Info>
          <S.Info>
            <img src={LandingFriends} alt="Chat Icon" />
            <S.InfoContent>
              <S.InfoTitle>친구와 일정 공유도 쉽게</S.InfoTitle>
              <S.InfoText>일정 생성 후 초대 → 수락으로 함께하는 일정 완성</S.InfoText>
            </S.InfoContent>
          </S.Info>
        </S.Left>

        <LoginCard />
      </S.Card>
    </S.Wrapper>
  )
}
