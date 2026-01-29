import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'

import { theme } from '@/shared/styles/theme'

export const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.lightGray};
  position: fixed;
  z-index: 100;
  top: 0;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
`

export const Inner = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: space-between;
  padding: 0 32px;
`

export const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
`

export const Logo = styled.img`
  height: 32px;
  width: auto;
  cursor: pointer;
`

export const Nav = styled.nav`
  display: flex;
  gap: 8px;
`

export const NavItem = styled(NavLink)`
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-family: ${theme.fonts.main};
  font-weight: 500;
  color: ${theme.colors.black};
  text-decoration: none;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.lightGray};
  }

  &.active {
    background-color: ${theme.colors.sub};
    color: ${theme.colors.primary2};
    font-weight: 600;
  }
`
