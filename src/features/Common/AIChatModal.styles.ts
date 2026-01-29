import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${theme.gradients.ai2};
  border-radius: 30px;
  padding: 24px 32px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);

  position: fixed;
  top: 150px;
  right: 40px;
  width: 450px;
  height: 430px;
  z-index: 999;

  @media (max-width: 1024px) {
    position: relative;
    top: 0;
    right: 0;
    width: 100%;
    height: auto;
    margin: 20px 0;
    z-index: 1;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 20px;
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

export const ChatBox = styled.div`
  flex: 1;
  background: ${theme.colors.white};
  border-radius: 16px;
  margin-bottom: 16px;
  overflow-y: auto;
`

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;

  background: ${theme.colors.white};
  border-radius: 24px;
  padding: 4px 4px 4px 16px;
  width: 100%;

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
  border-radius: 20px;

  @media (max-width: 480px) {
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
  background: ${theme.colors.primary2};
  color: ${theme.colors.white};
  border: none;
  cursor: pointer;
  font-size: 20px;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.9);
  }
`
