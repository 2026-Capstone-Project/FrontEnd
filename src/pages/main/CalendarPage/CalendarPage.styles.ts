import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const PageWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  justify-content: center;
  align-self: center;
  justify-self: center;
  gap: 32px;
  width: 100%;
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

export const AddScheduleModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  padding: 16px;
`

export const AddScheduleModalInner = styled.div`
  width: 100%;
  max-width: 100%;
`
