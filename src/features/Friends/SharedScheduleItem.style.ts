import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

import { CommonButton } from './Friend.styles'

export const Container = styled.div`
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  ${media.down(theme.breakPoints.tablet)} {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 16px;
  }
`

export const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`

export const Dot = styled.span<{ color: string }>`
  color: ${(props) => props.color};
  font-size: 18px;
  line-height: 1;
`

export const Title = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: #333333;
`

export const MetaArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-right: 12px;
  ${media.down(theme.breakPoints.tablet)} {
    margin-left: auto;
    gap: 12px;
  }
`

export const DateText = styled.span`
  font-size: 14px;
  color: #868e96;
`

export const SharerBadge = styled.div`
  background-color: #ebeaf8;
  color: #594fca;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`

export const CancelButton = styled(CommonButton)`
  padding: 8px 12px !important;
  border-radius: 10px;
  font-size: 13px;
`
