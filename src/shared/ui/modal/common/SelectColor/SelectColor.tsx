/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import Arrow from '@/shared/assets/icons/chevron.svg?react'
import { EVENT_COLORS } from '@/shared/constants/event'
import { theme } from '@/shared/styles/theme'
import type { EventColorType } from '@/shared/types/event/event'

import * as S from './SelectColor.style'

type SelectColorProps = {
  value?: EventColorType
  onChange: (value: EventColorType) => void
}

const SelectColor = ({ value, onChange }: SelectColorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const optionsRef = useRef<HTMLDivElement | null>(null)
  const [optionsPosition, setOptionsPosition] = useState({ top: 0, left: 8 })

  useEffect(() => {
    if (!dropdownOpen) {
      return
    }
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const targetNode = event.target as Node | null
      const clickedInsideTrigger = !!(
        dropdownRef.current &&
        targetNode &&
        dropdownRef.current.contains(targetNode)
      )
      const clickedInsideOptions = !!(
        optionsRef.current &&
        targetNode &&
        optionsRef.current.contains(targetNode)
      )
      if (!clickedInsideTrigger && !clickedInsideOptions) {
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
  const palette = theme.colors[resolvedValue]
  const handleToggleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    const nextOpen = !dropdownOpen
    if (nextOpen) {
      const rect = event.currentTarget.getBoundingClientRect()
      setOptionsPosition({
        top: rect.bottom + 8,
        left: Math.max(rect.right - 92, 8),
      })
    }
    setDropdownOpen(nextOpen)
  }

  return (
    <S.ColorDropdown ref={dropdownRef} onClick={handleToggleDropdown}>
      <S.Circle color={palette.point} />
      <Arrow css={{ rotate: '-90deg' }} color="#A5A5A5" />
      {dropdownOpen &&
        // SSR 환경에서 document 접근 에러를 피하기 위한 방어 로직입니다.
        typeof document !== 'undefined' &&
        createPortal(
          <S.ColorOptions
            ref={optionsRef}
            style={{
              top: `${optionsPosition.top}px`,
              left: `${optionsPosition.left}px`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {EVENT_COLORS.map((colorName) => (
              <S.CircleOption
                key={colorName}
                color={theme.colors[colorName].point}
                isSelected={resolvedValue === colorName}
                onClick={() => {
                  onChange(colorName)
                  setDropdownOpen(false)
                }}
              />
            ))}
          </S.ColorOptions>,
          document.getElementById('modal-root') ?? document.body,
        )}
    </S.ColorDropdown>
  )
}

export default SelectColor
