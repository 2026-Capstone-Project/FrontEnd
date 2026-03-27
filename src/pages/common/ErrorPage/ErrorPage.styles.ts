import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  background: ${theme.colors.background};
  color: ${theme.colors.textPrimary};
`

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`

export const Description = styled.p`
  font-size: 16px;
  color: ${theme.colors.textColor3};
  margin: 0;
`

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`

const BaseButton = styled.button`
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${theme.colors.primary2};
    outline-offset: 2px;
  }
`

export const PrimaryButton = styled(BaseButton)`
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
`

export const SecondaryButton = styled(BaseButton)`
  background: ${theme.colors.lightGray};
  color: ${theme.colors.textPrimary};
`
