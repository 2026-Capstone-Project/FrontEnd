import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  width: 100%;
  max-width: 1440px;
  height: fit-content;
  padding: 24px 48px;
  .mobile-custom-view-button {
    display: none;
  }
  ${media.down(theme.breakPoints.tablet)} {
    padding: 16px 24px;
    gap: 16px;
    flex-direction: column;
    align-items: center;
    .mobile-custom-view-button {
      display: block;
    }
  }
  ${media.down(theme.breakPoints.mobile)} {
    padding: 8px 16px;
  }
`
