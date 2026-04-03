import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const TabControls = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  background-color: ${theme.colors.inputColor};
  border-radius: 16px;
`

export const TabButton = styled.button<{ $isActive?: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  width: 50%;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $isActive }) => ($isActive ? '#e9f4f7' : theme.colors.inputColor)};
  color: ${({ $isActive }) => ($isActive ? theme.colors.primary2 : theme.colors.textColor3)};
  border: ${({ $isActive }) => ($isActive ? `1px solid #C9E7F0}` : 'none')};
`
