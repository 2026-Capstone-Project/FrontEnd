import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  overscroll-behavior: none;
`

export const ModalContainer = styled.div`
  background: white;
  width: 344px;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 0 100px 30px rgba(0, 0, 0, 0.1);
`

export const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #000;
  white-space: pre-line;
`

export const Description = styled.p`
  color: #666;
  margin-bottom: 55px;
  line-height: 1.5;
`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`

const BaseButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.7;
  }
`

export const CancelButton = styled(BaseButton)`
  background-color: ${theme.colors.sub};
  color: ${theme.colors.primary};
`

export const ConfirmButton = styled(BaseButton)<{ $isDanger?: boolean }>`
  background-color: white;

  color: ${({ $isDanger, theme }) => ($isDanger ? theme.colors.red : theme.colors.primary)};

  border: 1px solid
    ${({ $isDanger, theme }) => ($isDanger ? theme.colors.red : theme.colors.primary)};

  flex: 1;
`
