/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react'

import { type EventColorType, getColorPalette } from '@/features/Calendar/utils/colorPalette'
import Arrow from '@/shared/assets/icons/chevron.svg?react'
import { EVENT_COLORS } from '@/shared/constants/event'

import * as S from './SelectColor.style'

type SelectColorProps = {
  value?: EventColorType
  onChange: (value: EventColorType) => void
}

const SelectColor = ({ value, onChange }: SelectColorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!dropdownOpen) {
      return
    }
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target as Node | null
      if (dropdownRef.current && targetNode && !dropdownRef.current.contains(targetNode)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [dropdownOpen])
  const resolvedValue = EVENT_COLORS.includes(value as EventColorType)
    ? (value as EventColorType)
    : EVENT_COLORS[0]
  const palette = getColorPalette(resolvedValue)

  return (
    <S.ColorDropdown ref={dropdownRef} onClick={() => setDropdownOpen((prev) => !prev)}>
      <S.Circle color={palette.point} />
      <Arrow css={{ rotate: '-90deg' }} color="#A5A5A5" />
      {dropdownOpen && (
        <S.ColorOptions>
          {EVENT_COLORS.map((colorName) => (
            <S.CircleOption
              key={colorName}
              color={getColorPalette(colorName).point}
              isSelected={resolvedValue === colorName}
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
