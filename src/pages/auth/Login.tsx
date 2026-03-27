import logo from '@/assets/logo.svg'
import LoginCard from '@/features/Auth/components/LoginCard/LoginCard'

import * as S from './Login.styles'

export default function Login() {
  return (
    <S.Wrapper>
      <S.Card>
        <S.Left>
          <p>말하면 일정이 된다</p>
          <S.Logo src={logo} alt="Cali/o Logo" />
        </S.Left>
        <LoginCard />
      </S.Card>
    </S.Wrapper>
  )
}
