import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'

export const Checkbox = styled.input<{ isChecked?: boolean }>`
  appearance: none;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.isChecked ? theme.colors.primary2 : '#D2D3D2')};
  cursor: pointer;
  transition: background-color 150ms ease;
`

export const CheckboxContainer = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
`

export const CheckIcon = styled.div<{ isVisible?: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 150ms ease;
  pointer-events: none;
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 400;
`
