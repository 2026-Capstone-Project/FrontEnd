import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Right = styled.div`
  flex: 1;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${media.down(theme.breakPoints.tablet)} {
    padding: 20px;
    width: 100%;
  }
`

export const InnerCard = styled.div`
  width: 100%;
  max-width: 900px;
  padding: 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  ${media.down(theme.breakPoints.tablet)} {
    width: 100%;
  }
`

export const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`
export const SocialButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: none;
  margin-bottom: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;

  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  background: none;

  &:hover {
    filter: brightness(0.9);
    transition: filter 0.2s;
  }
`

export const ButtonText = styled.span`
  flex: 1;
  text-align: center;
`

export const IconWrapper = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
`

export const Google = styled(SocialButton)`
  background: white;
  border: 1px solid white;
`

export const Kakao = styled(SocialButton)`
  background: #fee500;
`

export const Naver = styled(SocialButton)`
  background: #2db400;
  color: white;
`
export const Footer = styled.div`
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
`

export const LinkText = styled.button`
  background: none;
  border: 0;
  padding: 0;

  color: inherit;
  font: inherit;
  line-height: inherit;

  text-decoration: underline;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`
