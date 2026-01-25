import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const CardOverlay = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: fit-content;

  ${media.down(theme.breakPoints.desktop)} {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 1000;
    height: 100vh;
  }
`

export const CardWrapper = styled.div`
  display: flex;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 0.1);
  width: 400px;
  height: fit-content;
  background-color: #ffffff;
  ${media.down(theme.breakPoints.desktop)} {
    position: absolute;
    z-index: 1000;
    align-self: center;
    left: calc(50% - 200px);
  }
`
export const EventCards = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 4px solid ${theme.colors.primary2};
  color: ${theme.colors.textPrimary};
  font-weight: 500;
  font-size: 18px;
  padding: 2px 0 2px 0;
  margin: 24px;
  border-radius: 4px;
  gap: 28px;
`
export const Header = styled.div`
  width: 100%;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  padding: 20px 32px;
  font-size: 18px;
  display: flex;
  color: ${theme.colors.textPrimary};
  justify-content: space-between;
  font-weight: 500;
  align-items: center;
  background: linear-gradient(0deg, #e9f4f7 0%, #e9f4f7 100%), #deecec;
`

export const Dot = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${theme.colors.red};
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
`
export const EmptyEvent = styled.div`
  font-size: 18px;
  color: ${theme.colors.primary2};
  font-weight: 500;
  margin: 24px;
`
