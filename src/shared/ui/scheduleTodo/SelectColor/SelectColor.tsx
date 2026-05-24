/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react'

import Arrow from '@/shared/assets/icons/chevron.svg?react'
import { EVENT_COLORS } from '@/shared/constants/event'
import { theme } from '@/shared/styles/theme'
import type { EventColorType } from '@/shared/types/event/event'

import * as S from './SelectColor.style'

type SelectColorProps = {
  value?: EventColorType
  onChange: (value: EventColorType) => void
  readOnly?: boolean
  onReadOnlyAttempt?: () => void
}

const SelectColor = ({
  value,
  onChange,
  readOnly = false,
  onReadOnlyAttempt,
}: SelectColorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target as Node | null
      if (dropdownRef.current && targetNode && !dropdownRef.current.contains(targetNode)) {
        setDropdownOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [dropdownOpen])
  const resolvedValue = EVENT_COLORS.includes(value as EventColorType)
    ? (value as EventColorType)
    : EVENT_COLORS[0]
  const palette = theme.colors[resolvedValue]

  const COLOR_LABELS: Record<string, string> = {
    BLUE: '파랑',
    GREEN: '초록',
    PINK: '분홍',
    PURPLE: '보라',
    GRAY: '회색',
    YELLOW: '노랑',
  }

  return (
    <S.ColorDropdown ref={dropdownRef}>
      <S.TriggerButton
        type="button"
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-label="색상 선택"
        onClick={() => {
          if (readOnly) {
            onReadOnlyAttempt?.()
            return
          }
          setDropdownOpen((prev) => !prev)
        }}
      >
        <S.Circle color={palette.point} />
        <Arrow css={{ rotate: '-90deg' }} color="#A5A5A5" />
      </S.TriggerButton>
      {dropdownOpen && (
        <S.ColorOptions role="listbox" aria-label="색상 목록">
          {EVENT_COLORS.map((colorName) => (
            <S.CircleOption
              key={colorName}
              type="button"
              role="option"
              aria-selected={resolvedValue === colorName}
              aria-label={COLOR_LABELS[colorName] ?? colorName}
              color={theme.colors[colorName].point}
              isSelected={resolvedValue === colorName}
              onClick={() => {
                if (readOnly) {
                  onReadOnlyAttempt?.()
                  return
                }
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
