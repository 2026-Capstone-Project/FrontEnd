import { useCallback, useEffect, useState } from 'react'

import type { CalendarEvent } from '@/features/Calendar/domain/types'

type ModalState = {
  isOpen: boolean
  eventId: CalendarEvent['id'] | null
}

type UseCalendarModalArgs = {
  currentDate: Date
  removeEvent: (eventId: CalendarEvent['id']) => void
}

const normalizeDate = (value?: Date | string | null): Date => {
  if (!value) return new Date()
  return value instanceof Date ? value : new Date(value)
}

export const useCalendarModal = ({ currentDate, removeEvent }: UseCalendarModalArgs) => {
  const [modalDate, setModalDate] = useState<string>(() => new Date().toISOString())
  const [modal, setModal] = useState<ModalState>({ isOpen: false, eventId: null })
  const [isModalEditing, setIsModalEditing] = useState(false)

  const handleAddEvent = useCallback(
    (referenceDate?: Date | string) => {
      const baseDate = referenceDate ?? currentDate ?? new Date()
      const targetDate = normalizeDate(baseDate)
      setModalDate(targetDate.toISOString())
      setIsModalEditing(false)
      setModal({ isOpen: true, eventId: 0 })
    },
    [currentDate],
  )

  const handleEventClick = useCallback((event: CalendarEvent) => {
    const start = event.start instanceof Date ? event.start : new Date(event.start ?? Date.now())
    setModalDate(start.toISOString())
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
      event.preventDefault()
      removeEvent(eventId)
      setModal({ isOpen: false, eventId: null })
      setIsModalEditing(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modal.eventId, modal.isOpen, removeEvent])

  return {
    modal,
    modalDate,
    isModalEditing,
    handleAddEvent,
    handleEventClick,
    handleCloseModal,
  }
}
