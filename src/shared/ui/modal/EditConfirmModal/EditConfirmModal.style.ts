import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

export const ModalWrapper = styled.div`
  background-color: #fff;
  padding: 40px 50px 20px 50px;
  border-radius: 20px;
  box-shadow: 0 0 100px 30px rgba(0, 0, 0, 0.1);
  width: fit-content;
  max-width: 420px;
  gap: 28px;
  display: flex;
  flex-direction: column;
  ${media.down(theme.breakPoints.mobile)} {
    max-width: 90vw;
    padding: 30px;
  }
`

export const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: 600;
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 20px;
  }
`

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`

export const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`

export const HiddenRadio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`

export const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  color: ${theme.colors.textColor2};
  width: 100%;
  cursor: pointer;
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 16px;
  }
`

export const RadioIndicator = styled.span<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${theme.colors.lightGray};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.2s,
    background-color 0.2s;

  ${({ $checked }) =>
    $checked
      ? `
        border-color: ${theme.colors.primary2};
        background-color: ${theme.colors.primary2};
      `
      : `
        border-color: ${theme.colors.lightGray};
        background-color: transparent;
      `}

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ $checked }) => ($checked ? theme.colors.white : 'transparent')};
    transition: background-color 0.2s;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 16px;
`

export const CancelButton = styled.button`
  background-color: transparent;
  border: none;
  color: ${theme.colors.primary2};
  font-size: 16px;
  border-radius: 16px;
  background-color: ${theme.colors.sub};
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 12px;
    padding: 10px 16px;
  }
`

export const EditButton = styled.button`
  border: 1px solid ${theme.colors.red};
  border-radius: 16px;
  color: ${theme.colors.red};
  font-size: 16px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  ${media.down(theme.breakPoints.tablet)} {
    font-size: 12px;
    padding: 10px 16px;
  }
`
