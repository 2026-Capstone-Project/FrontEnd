import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const EventWrapper = styled.div`
  display: flex;
  gap: 24px;
  padding-left: 16px;
  align-items: center;
`
export const Time = styled.div`
  color: ${theme.colors.primary2};
  white-space: nowrap;
  min-width: 46px;
  font-size: 18px;
  font-weight: 500;
  ${media.down(theme.breakPoints.desktop)} {
    font-size: 16px;
  }
`

export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: ${theme.colors.black};
  ${media.down(theme.breakPoints.desktop)} {
    font-size: 16px;
  }
`

export const Content = styled.div`
  font-size: 16px;
  color: #5d5d5d;
  word-break: keep-all;
  font-weight: 500;
  ${media.down(theme.breakPoints.desktop)} {
    font-size: 14px;
  }
`
export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const DeleteButton = styled.button`
  margin-left: auto;
  cursor: pointer;
  border: none;
  background-color: transparent;
  padding: 0;
  display: flex;
  align-items: center;
`
