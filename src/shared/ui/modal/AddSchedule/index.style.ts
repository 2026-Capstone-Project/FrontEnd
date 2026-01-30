import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
`
export const Button = styled.button<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? '#E9F4F7' : '#F7F7F7')};
  color: ${(props) => (props.isActive ? theme.colors.primary2 : '#757575')};
  border: none;
  border-radius: 8px;
  padding: 2px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
`
export const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
`
export const Textarea = styled.textarea`
  width: 382px;
  max-width: 100%;
  height: 80px;
  border: none;
  border-radius: 8px;
  padding: 6px 12px 12px 12px;
  font-size: 14px;
  font-weight: 400;
  resize: none;
  background-color: ${theme.colors.inputColor};
  &:focus {
    outline: none;
  }
`
export const Selection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
export const SelectionColumn = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-direction: column;
`
export const FieldRow = styled.div`
  flex: 1;
  display: flex;
  height: 43px;
  gap: 8px;
  align-items: center;
`
export const FieldLabel = styled.span`
  font-size: 14px;
  color: ${theme.colors.textColor3};
`
export const DateFieldButton = styled.button`
  border-radius: 8px;
  padding: 10px;
  background-color: ${theme.colors.inputColor};
  font-size: 16px;
  color: ${theme.colors.textColor3};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`
export const CalendarPortal = styled.div`
  position: fixed;
  width: min(330px, 100%);
  background: rgba(245, 245, 245, 0.2);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 14px;
  height: fit-content;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  z-index: 3000;
  ${media.down(theme.breakPoints.desktop)} {
    background: rgba(245, 245, 245, 0.8);
  }
  ${media.down(theme.breakPoints.tablet)} {
    width: min(90vw, 360px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(245, 245, 245, 0.8);
  }
`

export const SearchPlacePortal = styled.div`
  position: fixed;
  width: min(380px, 100%);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  z-index: 3000;
  ${media.down(theme.breakPoints.tablet)} {
    width: min(90vw, 360px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  ${media.down(theme.breakPoints.mobile)} {
    width: min(90vw, 320px);
    top: 55%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

export const CalendarPlaceholder = styled.div`
  border: 1px dashed ${theme.colors.lightGray};
  border-radius: 12px;
  min-height: 150px;
  display: grid;
  place-items: center;
  color: ${theme.colors.textColor2};
  font-size: 14px;
  text-align: center;
  padding: 16px;
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 20px;
`
export const TextareaWrapper = styled.div`
  width: 100%;
  border-radius: 8px;
  background-color: ${theme.colors.inputColor};
`
export const TextareaHeader = styled.div`
  color: ${theme.colors.textColor3};
  padding: 12px 10px 0 10px;
  width: 100%;
  display: flex;
`

export const FieldMap = styled.button`
  flex: 1;
  height: 43px;
  border-radius: 8px;
  padding: 10px;
  background-color: ${theme.colors.inputColor};
  font-size: 14px;
  color: ${theme.colors.textColor3};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
`

export const PortalDarkLayer = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 2995;
`
