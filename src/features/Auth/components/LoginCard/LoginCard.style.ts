import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  ${media.down(theme.breakPoints.tablet)} {
    padding: 5px;
    width: 100%;
  }
`

export const InnerCard = styled.div`
  width: 380px;
  max-width: 100%;
  min-height: 480px;
  padding: 80px 32px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: 90px;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.45);

  box-shadow:
    inset 4px 6px 15px rgba(255, 255, 255, 0.4),
    inset -4px -6px 15px rgba(0, 0, 0, 0.03),
    0 20px 40px rgba(0, 0, 0, 0.08);
`

export const Title = styled.h2`
  margin: 0 0 50px;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  /* 물과 잘 어울리는 투명감 있는 청록/네이비 계열 */
  color: #3e6b77;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);

  ${media.down(theme.breakPoints.tablet)} {
    font-size: 22px;
    margin-bottom: 60px;

    font-size: 0;

    &::after {
      content: '오늘 일정도 함께해요';
      font-size: 25px;
      font-weight: 600;
    }
  }
`

export const SocialButton = styled.button`
  width: 80%;
  height: 54px;
  border-radius: 20px;
  border: none;
  margin-bottom: 16px;
  padding: 0 30px;

  display: flex;
  align-items: center;

  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  /* 부드러운 상호작용 */
  transition:
    transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    filter 0.2s,
    box-shadow 0.3s;

  &:hover {
    transform: scale(1.03); /* 마우스 올리면 말랑하게 부풀어 오름 */
    filter: brightness(0.95);
  }

  &:active {
    transform: scale(0.98); /* 누르면 꾹 짜지는 느낌 */
  }
`

export const ButtonText = styled.span`
  flex: 1;
  text-align: center;
  text-decoration: none;
  &:visited,
  &:active,
  &:link {
    color: inherit; /* 부모 컬러를 따르도록 수정 */
    text-decoration: none;
  }
`

export const IconWrapper = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`

/* 버튼마다 물에 젖은 듯한 광택(inset shadow) 추가 */
export const Google = styled(SocialButton)`
  background: rgba(255, 255, 255, 0.8);
  color: #222;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow:
    inset 2px 4px 6px rgba(255, 255, 255, 0.9),
    0 4px 10px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow:
      inset 2px 4px 6px rgba(255, 255, 255, 0.9),
      0 8px 15px rgba(0, 0, 0, 0.1);
  }
`

export const Kakao = styled(SocialButton)`
  background: #fee500;
  color: #181600;
  box-shadow:
    inset 2px 4px 6px rgba(255, 255, 255, 0.5),
    0 4px 10px rgba(254, 229, 0, 0.3);

  &:hover {
    box-shadow:
      inset 2px 4px 6px rgba(255, 255, 255, 0.5),
      0 8px 15px rgba(254, 229, 0, 0.4);
  }
`

export const Naver = styled(SocialButton)`
  background: #2db400;
  color: white;
  box-shadow:
    inset 2px 4px 6px rgba(255, 255, 255, 0.3),
    0 4px 10px rgba(45, 180, 0, 0.3);

  &:hover {
    box-shadow:
      inset 2px 4px 6px rgba(255, 255, 255, 0.3),
      0 8px 15px rgba(45, 180, 0, 0.4);
  }
`

export const Footer = styled.div`
  margin-top: 28px;
  font-size: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6); /* 배경이 투명하므로 가독성을 위해 살끔 어둡게 처리 */
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
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`
