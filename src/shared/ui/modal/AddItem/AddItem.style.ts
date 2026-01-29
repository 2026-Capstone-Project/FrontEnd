import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const TabControls = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`

export const TabButton = styled.button<{ $isActive?: boolean }>`
  padding: 6px 12px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $isActive }) =>
    $isActive ? theme.colors.primary2 : theme.colors.inputColor};
  color: ${({ $isActive }) => ($isActive ? theme.colors.white : theme.colors.textColor3)};
`
