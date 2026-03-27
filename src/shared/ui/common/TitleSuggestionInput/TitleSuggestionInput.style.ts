import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Input = styled.input`
  width: 100%;
  height: 43px;
  border: none;
  border-radius: 8px;
  padding: 0 12px 0 0;
  font-size: 20px;
  font-weight: 500;
  &:focus {
    outline: none;
    border: none;
  }
`

export const SuggestionList = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.white};
  border-radius: 12px;
  border: 1px solid ${theme.colors.lightGray};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 5;
  max-height: 120px;
  overflow-y: scroll;
`

export const SuggestionItem = styled.button`
  display: inline-flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 16px;
  color: ${theme.colors.textColor3};
  text-align: left;
  cursor: pointer;
  width: 100%;
`

export const Highlight = styled.span`
  color: ${theme.colors.primary2};
  font-weight: 600;
`
