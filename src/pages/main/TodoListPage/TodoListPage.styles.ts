import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  justify-content: center;
  align-self: center;
  justify-self: center;
  gap: 32px;
  width: 100%;
  height: 100%;
  flex: 1;
  max-width: 1440px;
  position: relative;
  .mobile-custom-view-button {
    display: none;
  }
  ${media.down(theme.breakPoints.desktop)} {
    display: flex;
    gap: 16px;
    flex-direction: column;
    align-items: center;
    .mobile-custom-view-button {
      display: block;
    }
  }
`
export const Title = styled.div`
  font-size: 32px;
  width: 100%;
  font-weight: 700;
  display: flex;
  gap: 18px;
  align-items: center;
  div {
    color: ${theme.colors.textColor2};
  }
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 24px;
  }
`
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  gap: 32px;
`
