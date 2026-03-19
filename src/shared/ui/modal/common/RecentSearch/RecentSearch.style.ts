import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  background-color: ${theme.colors.inputColor};
  padding: 4px;
`

export const SearchButton = styled.button`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 8px 10px;
  font-size: 13px;
  color: ${theme.colors.textColor2};
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const DeleteButton = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: transparent;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`
