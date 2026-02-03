import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  min-height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  border-radius: 16px;
  background: ${theme.colors.white};
  color: ${theme.colors.textPrimary};
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.08);
  text-align: center;
`

export const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
`

export const Description = styled.p`
  margin: 0;
  color: ${theme.colors.textColor3};
  font-size: 14px;
`

export const ErrorMessage = styled.p`
  margin: 0;
  color: ${theme.colors.textColor2};
  font-size: 12px;
  opacity: 0.8;
`

export const Button = styled.button`
  margin-top: 6px;
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
`
