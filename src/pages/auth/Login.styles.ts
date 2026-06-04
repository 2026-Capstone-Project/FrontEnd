import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Logo = styled.img`
  height: 50px;
  width: auto;
  cursor: pointer;
  margin-bottom: 32px;

  image-rendering: -webkit-optimize-contrast;
  transform: translateZ(0);
  backface-visibility: hidden;

  ${media.down(theme.breakPoints.tablet)} {
    margin-bottom: 20px;
  }
`

const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100vw;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  background: linear-gradient(
    135deg,
    #e2f5f8 0%,
    #c6e4ed 30%,
    #aae5e7 45%,
    #b5eae9 55%,
    #caecf2 100%
  );
`

const Card = styled.div`
  width: 1100px;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
  gap: 80px;

  ${media.down(theme.breakPoints.tablet)} {
    flex-direction: column;
    justify-content: center;
    gap: 40px;
    padding: 0 20px;
  }
`

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #1a2f3b;

  ${media.down(theme.breakPoints.tablet)} {
    align-items: center;
    text-align: center;
  }
`

export const Title = styled.h1`
  display: flex;
  flex-direction: column;
  font-size: 48px;
  margin: 0 0 28px 0;
  letter-spacing: -0.8px;
  font-family: 'GmarketSansMedium', sans-serif;
  gap: 10px;
  color: #005067;
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 32px;
    margin-bottom: 16px;
  }
`

export const Description = styled.p`
  font-family: 'NanumSquare';
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: #64808e;
  margin: 0;

  ${media.down(theme.breakPoints.tablet)} {
    font-size: 14px;
  }
`

export const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 24px;

  ${media.down(theme.breakPoints.tablet)} {
    justify-content: center;
    margin-top: 16px;
  }
`

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const InfoText = styled.span`
  font-family: 'NanumSquare', sans-serif;
  font-size: 14px;
  color: #3e6b77;
`

export const InfoTitle = styled.span`
  font-family: 'NanumSquare', sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: #3e6b77;
`

export { Card, Left, Wrapper }
