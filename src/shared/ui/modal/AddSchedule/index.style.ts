import styled from '@emotion/styled'

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
  height: 80px;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 400;
  resize: none;
  background-color: ${theme.colors.inputColor};
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary2};
  }
`
export const DateSelection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
export const DateSelectionColumn = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-direction: column;
`
export const DateFieldRow = styled.div`
  flex: 1;
  display: flex;
  height: 43px;
  gap: 8px;
  align-items: center;
`
export const DateFieldLabel = styled.span`
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
  background: rgba(245, 245, 245, 0.5);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 14px;
  height: fit-content;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  z-index: 3000;
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
export const TitleInput = styled.input`
  width: 100%;
  height: 43px;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  background-color: ${theme.colors.inputColor};
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary2};
  }
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  gap: 20px;
`
