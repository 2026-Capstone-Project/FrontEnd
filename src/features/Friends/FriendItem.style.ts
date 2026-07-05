import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
`

export const Avatar = styled.div<{ color: string }>`
  width: 56px;
  height: 56px;
  border-radius: 10px;
  background: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  font-weight: bold;
  font-size: 18px;
  color: #666666;
  flex-shrink: 0;
  ${media.down(theme.breakPoints.tablet)} {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }
`

export const Content = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const NameLine = styled.div`
  font-size: 15px;
`

export const Name = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #333333;
  letter-spacing: -0.3px;
`

export const Info = styled.span`
  color: #5c7cff;
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
`

export const Email = styled.div`
  font-size: 14px;
  color: #999999;
  white-space: nowrap;
`

export const Actions = styled.div`
  display: flex;
  gap: 8px;
`
