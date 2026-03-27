import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 34px;
  gap: 32px;
  justify-content: center;
  border: 1px solid #fdfdfd;
  width: 400px;
  border-radius: 20px;
  background:
    linear-gradient(0deg, #f5f5f5 0%, #f5f5f5 100%),
    linear-gradient(270deg, rgba(189, 210, 211, 0.4) 0%, rgba(238, 238, 238, 0.5) 100%), #fdfdfd;
  ${media.down(theme.breakPoints.desktop)} {
    width: 100%;
    gap: 10px;
    padding: 20px 26px;
    height: fit-content;
  }
`
export const StatusBar = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 20px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
export const StatusInfo = styled.div<{ width: number }>`
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
  background: ${theme.gradients.ai};
  width: ${({ width }) => width}%;
  height: 100%;
  padding: 16px 0;
  border-radius: 20px;
  ${media.down(theme.breakPoints.desktop)} {
    font-size: 14px;
    font-weight: 500;
    padding: 10px 0;
  }
`
export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`
export const Description = styled.div`
  font-weight: 600;
  font-size: 20px;
  color: ${theme.colors.black};
  ${media.down(theme.breakPoints.desktop)} {
    font-size: 16px;
  }
`
export const Percentage = styled.div`
  font-weight: 700;
  font-size: 24px;
  color: ${theme.colors.primary2};
  ${media.down(theme.breakPoints.desktop)} {
    font-size: 20px;
  }
`

export const EmptyState = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
`

export const DotRow = styled.div`
  display: flex;
  align-items: center;
  gap: 22px;
`

export const Dot = styled.div<{ $index: number }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $index }) =>
    $index === 0 ? '#47AAC5' : $index === 1 ? '#1E8DB2' : '#0C6C87'};
`

export const EmptyMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: ${theme.colors.primary2};
  text-align: center;
  word-break: keep-all;
  ${media.down(theme.breakPoints.desktop)} {
    font-size: 16px;
  }
`
