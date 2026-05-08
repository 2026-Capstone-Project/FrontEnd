import styled from '@emotion/styled'

import { theme } from '@/shared/styles'
export const InputWrapper = styled.div`
  position: relative;
  background-color: ${theme.colors.share.base};
  padding: 12px;
  border-radius: 20px;
`

export const SearchInput = styled.input`
  width: 100%;
  border-radius: 12px;
  padding: 12px 84px 12px 14px;
  border: 1px solid #acacac;
  background-color: ${theme.colors.white};
  color: ${theme.colors.textColor2};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #9a9a9a;
  }

  &:focus {
    outline: none;
    border-color: #acacac;
    box-shadow: none;
  }
`

export const InputActions = styled.div`
  position: absolute;
  top: 34px;
  right: 20px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
`

export const SearchButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: ${theme.colors.primary2};
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:not(:disabled):hover {
    color: ${theme.colors.white};
  }
`

export const SearchResult = styled.div<{ position: { left: number; top: number; width: number } }>`
  position: fixed;
  left: ${({ position }) => position.left}px;
  top: ${({ position }) => position.top}px;
  width: ${({ position }) => position.width}px;
  z-index: 22000;
  background-color: ${theme.colors.white};
  border-radius: 20px;
  padding: 12px;
  gap: 4px;
  display: flex;
  flex-direction: column;
  max-height: 158px;
  overflow-y: auto;
  overflow-anchor: none;
`

export const SearchResultItem = styled.button<{ isAdded: boolean }>`
  width: 100%;
  border: none;
  padding: 7px 24px;
  border-radius: 16px;
  align-items: center;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  background-color: ${(props) => (props.isAdded ? theme.colors.share.base : '#f1f1f1')};

  .divider {
    width: 1px;
    height: 16px;
    background-color: #d2d3d2;
    margin: 0 8px;
  }
  .plus {
    margin-left: auto;
  }
  .close {
    margin-left: auto;
  }
`

export const EmptySearchResult = styled.div`
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  background-color: #f1f1f1;
  color: ${theme.colors.textColor3};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`

export const Name = styled.div<{ isAdded: boolean }>`
  color: ${(props) => (props.isAdded ? '#484569' : '#655446')};
`

export const Email = styled.div`
  color: ${theme.colors.textColor2};
  font-weight: 400;
`
