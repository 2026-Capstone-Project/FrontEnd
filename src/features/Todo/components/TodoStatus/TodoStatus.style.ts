import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 170px;
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
  }
`
export const StatusBar = styled.div`
  width: 100%;
  background-color: #ffffff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
export const StatusInfo = styled.div<{ width: number }>`
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #ffffff;
  background: ${theme.gradients.ai};
  width: ${({ width }) => width}%;
  height: 100%;
  padding: 16px 0;
  border-radius: 20px;
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
`
export const Percentage = styled.div`
  font-weight: 700;
  font-size: 24px;
  color: ${theme.colors.primary2};
`
