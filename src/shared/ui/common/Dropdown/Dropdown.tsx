/** @jsxImportSource @emotion/react */

import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'

import Arrow from '@/shared/assets/icons/chevron.svg?react'
import { theme } from '@/shared/styles/theme'

import * as S from './Dropdown.style'

type DropdownProps<T extends string | number> = {
  options: T[]
  selectedOption?: T
  onSelect: (value: T) => void
  optionLabel?: (option: T) => string
  placeholder?: string
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps<string | number>>(
  ({ options, selectedOption, onSelect, optionLabel, placeholder = '선택', ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const localRef = useRef<HTMLDivElement | null>(null)

    const label = useMemo(
      () =>
        selectedOption
          ? optionLabel
            ? optionLabel(selectedOption)
            : String(selectedOption)
          : placeholder,
      [optionLabel, placeholder, selectedOption],
    )

    useEffect(() => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(localRef.current)
      } else {
        ref.current = localRef.current
      }
    }, [ref])

    useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (localRef.current && !localRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleOutsideClick)
      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [])

    return (
      <S.Dropdown ref={localRef} {...props}>
        <S.DropdownTrigger
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
        >
          <span>{label}</span>
          <Arrow
            color={theme.colors.textColor3}
            width={16}
            css={{ transform: open ? 'rotate(90deg)' : 'rotate(-90deg)' }}
          />
        </S.DropdownTrigger>
        {open && (
          <S.DropdownMenu>
            {options.map((option) => (
              <S.DropdownItem
                key={String(option)}
                type="button"
                isActive={option === selectedOption}
                onClick={() => {
                  onSelect(option)
                  setOpen(false)
                }}
              >
                {optionLabel ? optionLabel(option) : option}
              </S.DropdownItem>
            ))}
          </S.DropdownMenu>
        )}
      </S.Dropdown>
    )
  },
)

Dropdown.displayName = 'Dropdown'

export default Dropdown
