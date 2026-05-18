// 일정 편집 모달에서 사용하는 전용 스타일 정의입니다.
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
export const SelectionColumn = styled.div<{ isAllday: boolean }>`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex-direction: ${({ isAllday }) => (isAllday ? 'row' : 'column')};
  align-items: ${({ isAllday }) => (isAllday ? 'center' : 'flex-start')};
  color: #a5a5a5;
`
export const FieldRow = styled.div<{ isAllday?: boolean }>`
  flex: ${({ isAllday }) => (isAllday ? 'none' : '1')};
  display: flex;
  height: 30px;
  gap: 8px;
  align-items: center;
  width: fit-content;
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
  z-index: 10200;
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

export const SearchPlacePortal = styled.div<{ $placement?: 'container' | 'viewport' }>`
  position: ${({ $placement }) => ($placement === 'container' ? 'absolute' : 'fixed')};
  width: min(380px, 100%);
  max-height: min(620px, calc(100vh - 24px));
  overflow-y: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 0 100px 40px rgba(0, 0, 0, 0.1);
  z-index: 10100;
  ${media.down(theme.breakPoints.tablet)} {
    width: min(90vw, 360px);
  }
  ${media.down(theme.breakPoints.mobile)} {
    width: min(90vw, 320px);
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
  margin-top: 24px;
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

export const FieldMap = styled.button<{ $hasValue?: boolean }>`
  flex: 1;
  height: 43px;
  border-radius: 8px;
  padding: 10px;
  background-color: ${theme.colors.inputColor};
  font-size: 14px;
  color: ${({ $hasValue }) => ($hasValue ? theme.colors.textPrimary : theme.colors.textColor3)};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const PortalDarkLayer = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 10050;
`
export const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const FriendWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`
export const FriendSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 30px;
  background-color: #f7f7f7;
  .added-friend-list {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
  .added-friend {
    border-radius: 40px;
    font-size: 12px;
    border: 1px solid #d5d4e3;
    background: #fff;
    display: flex;
    padding: 6px 8px;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: fit-content;
    color: #5d5b71;
  }
  .remove-friend-button {
    border: none;
    background: transparent;
    color: #d5d4e3;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
  }
`
export const FriendSectionOpenButton = styled.button<{ isOpen: boolean; isShared: boolean }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 12px 20px;
  cursor: pointer;
  align-items: center;
  .arrow {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(-90deg)' : 'rotate(180deg)')};
  }
  .section-title {
    display: flex;
    gap: 4px;
    align-items: center;
    border-radius: 40px;
    padding: 6px 8px;
    background-color: ${({ isShared }) => (isShared ? theme.colors.share.base : '#f7f7f7')};
    border: 1px solid ${({ isShared }) => (isShared ? '#f0f0f0' : '#eaeaea')};
    font-size: 12px;
    font-weight: 600;
    color: ${({ isShared }) => (isShared ? theme.colors.share.point : theme.colors.textColor3)};
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${({ isShared }) =>
      isShared ? theme.colors.share.point : theme.colors.textColor3};
  }
`
