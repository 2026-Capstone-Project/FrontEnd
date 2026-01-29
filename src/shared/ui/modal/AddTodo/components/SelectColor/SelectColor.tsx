/** @jsxImportSource @emotion/react */
import { useState } from 'react'

import { type EventColorType, getColorPalette } from '@/features/Calendar/utils/colorPalette'
import Arrow from '@/shared/assets/icons/chevron.svg?react'
import { EVENT_COLORS } from '@/shared/constants/event'

import * as S from './SelectColor.style'

type SelectColorProps = {
  value: EventColorType
  onChange: (value: EventColorType) => void
}

const SelectColor = ({ value, onChange }: SelectColorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  return (
    <S.ColorDropdown>
      <S.Circle color={getColorPalette(value).point} />
      <Arrow
        css={{ rotate: '-90deg' }}
        color="#A5A5A5"
        onClick={() => setDropdownOpen((prev) => !prev)}
      />
      {dropdownOpen && (
        <S.ColorOptions>
          {EVENT_COLORS.map((colorName) => (
            <S.CircleOption
              key={colorName}
              color={getColorPalette(colorName).point}
              isSelected={value === colorName}
              onClick={() => {
                onChange(colorName)
                setDropdownOpen(false)
              }}
            />
          ))}
        </S.ColorOptions>
      )}
    </S.ColorDropdown>
  )
}

export default SelectColor
