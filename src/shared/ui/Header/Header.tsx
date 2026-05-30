import { useState } from 'react'

import logo from '@/assets/logo.svg'

import * as S from './Header.styles'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <S.HeaderWrapper>
      <S.Inner>
        <S.LogoLink to="/" onClick={closeMenu}>
          <S.Logo src={logo} alt="Cali/o Logo" />
        </S.LogoLink>

        <S.MenuButton isOpen={isOpen} onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </S.MenuButton>

        <S.Overlay isOpen={isOpen} onClick={closeMenu} />

        <S.Nav isOpen={isOpen}>
          <S.NavItem to="/" onClick={closeMenu}>
            홈
          </S.NavItem>
          <S.NavItem to="/todo" onClick={closeMenu}>
            할 일
          </S.NavItem>
          <S.NavItem to="/friends" onClick={closeMenu}>
            친구
          </S.NavItem>
          <S.NavItem to="/calendar" onClick={closeMenu}>
            캘린더
          </S.NavItem>
          <S.NavItem to="/settings" onClick={closeMenu}>
            설정
          </S.NavItem>
        </S.Nav>
      </S.Inner>
    </S.HeaderWrapper>
  )
}
