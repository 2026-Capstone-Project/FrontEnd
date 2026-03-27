// 훅: 캘린더 모달 상태와 열림/닫힘 흐름을 관리합니다.
// 캘린더 모달의 열림/편집 상태와 삭제 단축키를 관리하는 훅
import { useCallback, useEffect, useState } from 'react'

import type { CalendarEvent } from '@/shared/types/calendar/types'

type ModalState = {
  isOpen: boolean
  eventId: CalendarEvent['id'] | null
}

type UseCalendarModalArgs = {
  currentDate: Date
  removeEvent: (eventId: CalendarEvent['id'], occurrenceDate: string, isRecurring: boolean) => void
  isRecurring: (eventId: CalendarEvent['id']) => boolean
}

const normalizeDate = (value?: Date | string | null): Date => {
  if (!value) return new Date()
  return value instanceof Date ? value : new Date(value)
}

export const useCalendarModal = ({
  currentDate,
  removeEvent,
  isRecurring,
}: UseCalendarModalArgs) => {
  const [modalDate, setModalDate] = useState<string>(() => new Date().toISOString())
  const [modal, setModal] = useState<ModalState>({ isOpen: false, eventId: null })
  const [isModalEditing, setIsModalEditing] = useState(false)

  const handleAddEvent = useCallback(
    (referenceDate?: Date | string, eventId?: CalendarEvent['id'] | null) => {
      const baseDate = referenceDate ?? currentDate ?? new Date()
      const targetDate = normalizeDate(baseDate)
      setModalDate(targetDate.toISOString())
      setIsModalEditing(false)
      setModal({ isOpen: true, eventId: eventId ?? 0 })
    },
    [currentDate],
  )

  const handleEventClick = useCallback((event: CalendarEvent) => {
    const start = event.start instanceof Date ? event.start : new Date(event.start ?? Date.now())
    const occurrenceBase = event.occurrenceDate ? new Date(event.occurrenceDate) : (start as Date)
    setModalDate(occurrenceBase.toISOString())
    setIsModalEditing(true)
    setModal({ isOpen: true, eventId: event.id })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal({ isOpen: false, eventId: null })
    setIsModalEditing(false)
  }, [])

  useEffect(() => {
    if (!modal.isOpen || modal.eventId == null) return undefined
    const eventId = modal.eventId
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Backspace') return
      const target = event.target as HTMLElement | null
      if (target) {
        const tagName = target.tagName
        const isEditable = tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable
        if (isEditable) return
      }
      event.preventDefault()
      removeEvent(eventId, modalDate, isRecurring(eventId))
      setModal({ isOpen: false, eventId: null })
      setIsModalEditing(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modal.eventId, modal.isOpen, modalDate, removeEvent, isRecurring])

  return {
    modal,
    modalDate,
    isModalEditing,
    handleAddEvent,
    handleEventClick,
    handleCloseModal,
  }
}
