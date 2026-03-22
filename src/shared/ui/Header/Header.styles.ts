import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'

import { theme } from '@/shared/styles/theme'

export const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.lightGray};
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
  height: 72px;
  position: sticky;
  top: 0;
  z-index: 1000;
`

export const Inner = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  justify-content: space-between;
  padding: 0 32px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`

export const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  z-index: 1001;
`

export const Logo = styled.img`
  height: 32px;
  width: auto;
  cursor: pointer;
`

export const MenuButton = styled.button<{ isOpen: boolean }>`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;

  @media (max-width: 768px) {
    display: flex;
  }

  span {
    width: 100%;
    height: 2px;
    background: ${theme.colors.black};
    border-radius: 10px;
    transition: all 0.3s ease;

    &:nth-of-type(1) {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg) translateY(11.5px)' : 'none')};
    }
    &:nth-of-type(2) {
      opacity: ${({ isOpen }) => (isOpen ? '0' : '1')};
    }
    &:nth-of-type(3) {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg) translateY(-11.5px)' : 'none')};
    }
  }
`

export const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};

    position: fixed;
    top: 0;
    right: 0;
    width: 280px;
    height: 100vh;
    background: ${theme.colors.white};
    flex-direction: column;
    padding: 100px 20px;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 1000;

    animation: slideIn 0.3s ease-out forwards;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`

export const NavItem = styled(NavLink)`
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-family: ${theme.fonts.main};
  font-weight: 500;
  color: ${theme.colors.black};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.lightGray};
  }

  &.active {
    background-color: ${theme.colors.sub};
    color: ${theme.colors.primary2};
    font-weight: 600;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 18px;
    padding: 15px 20px;
    text-align: center;
  }
`

export const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
  }
`
