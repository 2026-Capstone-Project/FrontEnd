import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Logo = styled.img`
  height: 50px;
  width: auto;
  cursor: pointer;
`

const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Card = styled.div`
  width: 800px;
  max-width: calc(100% - 32px);
  height: 400px;
  display: flex;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  ${media.down(theme.breakPoints.tablet)} {
    flex-direction: column;
    height: auto;
    width: 100%;
    max-width: 100%;
    background: none;
    backdrop-filter: none;
    box-shadow: none;
    border-radius: 0;
  }
`

const Left = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;

  p {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 28px;
  }

  ${media.down(theme.breakPoints.tablet)} {
    justify-content: center;
    align-items: center;

    p {
      font-size: 22px;
      margin-bottom: 10px;
      text-align: center;
    }
  }
`

export { Card, Left, Wrapper }
