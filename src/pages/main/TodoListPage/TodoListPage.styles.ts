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
    flex-direction: column-reverse;
    align-items: center;
    margin-bottom: 40px;
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
  min-height: calc(100vh - 110px);
  height: calc(100vh - 110px);
  flex: 1;
  gap: 32px;
`

export const EmptyState = styled.div`
  border: 1px dashed ${theme.colors.lightGray};
  border-radius: 16px;
  padding: 20px 24px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`

export const EmptyTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textColor2};
`

export const EmptyDesc = styled.div`
  font-size: 13px;
  color: ${theme.colors.textColor2};
`
