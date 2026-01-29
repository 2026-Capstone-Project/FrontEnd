import styled from '@emotion/styled'

import { media } from '@/shared/styles/media'
import { theme } from '@/shared/styles/theme'

type CheckboxColorProps = {
  isChecked?: boolean
  activeColor?: string
  inactiveColor?: string
}

export const Checkbox = styled.input<CheckboxColorProps>`
  appearance: none;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 12px;
  background-color: ${({ isChecked, activeColor, inactiveColor }) =>
    isChecked ? (activeColor ?? theme.colors.primary2) : (inactiveColor ?? '#e8e8e8')};
  cursor: pointer;
  transition: background-color 150ms ease;
  ${media.down(theme.breakPoints.tablet)} {
    border-radius: 6px;
  }
`

export const CheckboxContainer = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  ${media.down(theme.breakPoints.mobile)} {
    width: 20px;
    height: 20px;
  }
`

export const CheckIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 150ms ease;
  pointer-events: none;
  svg {
    width: 50%;
    height: 50%;
  }
`

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`
