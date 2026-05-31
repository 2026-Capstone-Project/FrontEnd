import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.gradients.ai2};
  border-radius: 30px;
  padding: 24px 32px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 70px;
  right: 0;
  width: 500px;
  height: 400px;
  z-index: 999;
  will-change: transform, opacity;

  ${media.down(theme.breakPoints.desktop)} {
    position: relative;
    top: 0;
    right: 0;
    width: 100%;
    height: 430px;
    margin: 20px 0;
    z-index: 1;
    box-shadow: none;
  }

  ${media.down(theme.breakPoints.tablet)} {
    padding: 20px;
    border-radius: 20px;
    height: 380px;
  }
`

export const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.primary2};
  padding: 10px 0;
  flex-shrink: 0;
`

export const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100%;
    height: 100%;
  }
`

interface ChatBoxProps {
  isEmpty?: boolean
}

export const ChatBox = styled.div<ChatBoxProps>`
  flex: 1;
  background: ${theme.colors.white};
  border-radius: 16px;
  margin-bottom: 16px;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* 비어있을 때는 중앙 정렬 연산 수행 */
  justify-content: ${({ isEmpty }) => (isEmpty ? 'center' : 'flex-start')};
  align-items: ${({ isEmpty }) => (isEmpty ? 'center' : 'stretch')};

  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.GRAY || '#e0e0e0'};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${theme.colors.white};
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
  width: 100%;
  flex-shrink: 0;

  &:focus-within {
    box-shadow: 0 0 0 2px ${theme.colors.primary2}40;
  }
`

export const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  padding: 8px 0;

  ${media.down(theme.breakPoints.mobile)} {
    font-size: 14px;
  }
`

export const SendButton = styled.button`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  padding: 14.5px 17px 13.5px 17px;
  margin-left: 8px;
  background: ${theme.colors.primary2};
  color: ${theme.colors.white};
  border: none;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.9);
  }

  &:disabled {
    background: ${theme.colors.GRAY || '#cbd5e1'};
    cursor: not-allowed;
  }
`
export const UserMessageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

export const UserBubble = styled.div`
  background: ${theme.colors.primary2};
  color: ${theme.colors.white};
  padding: 10px 16px;
  border-radius: 16px 16px 4px 16px;
  font-size: 14px;
  line-height: 1.4;
  max-width: 75%;
  word-break: break-all;
`

export const BotMessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
`

export const BotContentArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 80%;
`

export const BotFallbackBubble = styled.div`
  background: ${theme.colors.GRAY || '#f1f3f5'};
  color: ${theme.colors.black || '#333333'};
  padding: 10px 14px;
  border-radius: 4px 16px 16px 16px;
  font-size: 14px;
  line-height: 1.4;
`

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  color: ${theme.colors.GRAY || '#adb5bd'};
`
