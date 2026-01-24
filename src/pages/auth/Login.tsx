import LoginCard from '@/features/Auth/components/LoginCard/LoginCard'

import * as S from './Login.styles'

export default function Login() {
  return (
    <S.Background>
      <S.Wrapper>
        <S.Card>
          <S.Left>
            말하면 일정이 된다
            <h1>Calio</h1>
          </S.Left>
          <LoginCard />
        </S.Card>
      </S.Wrapper>
    </S.Background>
  )
}
