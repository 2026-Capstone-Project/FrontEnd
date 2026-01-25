import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Dropdown = styled.div`
  position: relative;
  width: 100%;
`

export const DropdownTrigger = styled.button`
  width: 100%;
  border: 1px solid ${theme.colors.lightGray};
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  color: ${theme.colors.textColor2};
  background: ${theme.colors.white};
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  max-height: 100px;
  overflow-y: auto;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.lightGray};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  z-index: 10;
`

export const DropdownItem = styled.button<{ isActive?: boolean }>`
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  background: ${(props) => (props.isActive ? '#e9f4f7' : 'transparent')};
  border: none;
  color: ${(props) => (props.isActive ? theme.colors.primary2 : theme.colors.textColor2)};
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${theme.colors.inputColor};
  }
`
