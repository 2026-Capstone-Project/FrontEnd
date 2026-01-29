import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'
export const Wrapper = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
  color: ${theme.colors.textColor3};
  display: flex;
  align-items: center;
  cursor: text;
  height: fit-content;
  display: flex;
  flex-direction: column;
`

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  .icon {
    position: absolute;
    right: 35px;
    top: 30px;
  }
  input {
    background-color: ${theme.colors.white};
    border: none;
    width: 100%;
    border-radius: 12px;
    padding: 10px 12px;
    border: 1px solid #acacac;
    &:focus {
      outline: none;
    }
  }
`

export const SearchList = styled.div`
  width: 100%;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: scroll;
`
