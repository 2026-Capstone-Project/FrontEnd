import styled from '@emotion/styled'

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

  @media (max-width: 768px) {
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

const Right = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const InnerCard = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 32px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%;
  }
`

const Title = styled.h2`
  margin: 0 0 24px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
`
const SocialButton = styled.button`
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

const ButtonText = styled.span`
  flex: 1;
  text-align: center;
`

const IconWrapper = styled.span`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
`

const Google = styled(SocialButton)`
  background: white;
  border: 1px solid #ffffff;
`

const Kakao = styled(SocialButton)`
  background: #fee500;
`

const Naver = styled(SocialButton)`
  background: #2db400;
  color: white;
`
const Footer = styled.div`
  margin-top: 24px;
  font-size: 14px;
  text-align: center;
`

const LinkText = styled.span`
  margin-left: 6px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`

export {
  IconWrapper,
  Wrapper,
  ButtonText,
  Card,
  Left,
  Right,
  Title,
  SocialButton,
  Google,
  Kakao,
  Naver,
  Footer,
  LinkText,
  InnerCard,
}
