/** @jsxImportSource @emotion/react */

import styled from '@emotion/styled'

import { media } from '../styles/media'
import { theme } from '../styles/theme'

const DefaultAppLayout = ({ children }: { children: React.ReactNode }) => {
  return <ContentWrapper>{children}</ContentWrapper>
}

export default DefaultAppLayout

const ContentWrapper = styled.div`
  flex: 1;
  flex-direction: row;
  justify-self: center;
  align-self: flex-start;
  height: 100%;
  min-height: 100%;
  display: flex;
  overflow-x: hidden;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  max-width: 1440px;
  width: 100%;
  ${media.down(theme.breakPoints.tablet)} {
    padding: 16px 24px;
  }
  ${media.down(theme.breakPoints.mobile)} {
    padding: 8px 16px;
  }
`
