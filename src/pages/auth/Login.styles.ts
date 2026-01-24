import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Background = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.gradients.default};
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Card = styled.div`
  width: 720px;
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
  }
`
const Left = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  color: white;
  font-size: 28px;
  font-weight: 700;
`

export { Card, Left, Wrapper }
