import logo from '@/assets/logo.svg'

import * as S from './Header.styles'

export default function Header() {
  return (
    <S.HeaderWrapper>
      <S.Inner>
        <S.LogoLink to="/">
          <S.Logo src={logo} alt="Cali/o Logo" />
        </S.LogoLink>

        <S.Nav>
          <S.NavItem to="/">홈</S.NavItem>
          <S.NavItem to="/todo">할 일</S.NavItem>
          <S.NavItem to="/calendar">캘린더</S.NavItem>
          <S.NavItem to="/settings">설정</S.NavItem>
        </S.Nav>
      </S.Inner>
    </S.HeaderWrapper>
  )
}
