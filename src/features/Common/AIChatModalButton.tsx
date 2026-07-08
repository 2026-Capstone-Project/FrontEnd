import { useEffect, useRef, useState } from 'react'

import Robot from '@/assets/icons/common/robot_noBackground.svg?react'

import AIChatModal from './AIChatModal'
import * as S from './AIChatModalButton.style'
export const AIChatModalButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) return
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [isOpen])

  return (
    <S.Wrapper ref={wrapperRef}>
      <S.AIChatButton
        type="button"
        aria-label={isOpen ? 'AI 채팅 닫기' : 'AI 채팅 열기'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Robot aria-hidden="true" focusable="false" />
      </S.AIChatButton>
      {isOpen && (
        <S.ModalPositioner>
          <AIChatModal isHome={false} />
        </S.ModalPositioner>
      )}
    </S.Wrapper>
  )
}
