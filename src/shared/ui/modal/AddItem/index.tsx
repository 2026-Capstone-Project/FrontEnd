import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CalendarEvent } from '@/features/Calendar/domain/types'
import AddModalLayout from '@/shared/ui/modal/AddModalLayout/AddModalLayout'
import AddScheduleForm from '@/shared/ui/modal/AddSchedule/components/AddScheduleForm'
import AddTodoForm from '@/shared/ui/modal/AddTodo/components/AddTodoForm'

import * as S from './AddItem.style'

type ActiveType = 'todo' | 'schedule'

type AddItemModalProps = {
  onClose: () => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  defaultType?: ActiveType
  tabsVisible?: boolean
  isEditing?: boolean
  initialEvent?: CalendarEvent | null
  onEventColorChange?: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: CalendarEvent['title']) => void
  onEventTypeChange?: (eventId: CalendarEvent['id'], type: CalendarEvent['type']) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
  ) => void
}

const AddItemModal = ({
  onClose,
  date,
  mode = 'modal',
  eventId,
  defaultType = 'todo',
  tabsVisible = true,
  isEditing = false,
  initialEvent = null,
  onEventColorChange,
  onEventTitleConfirm,
  onEventTypeChange,
  onEventTimingChange,
}: AddItemModalProps) => {
  const [activeType, setActiveType] = useState<ActiveType>(defaultType)
  const [footerChildren, setFooterChildren] = useState<ReactNode | null>(null)
  const [deleteHandler, setDeleteHandler] = useState<() => void>(() => () => undefined)
  const noopDeleteHandler = useCallback(() => undefined, [])

  const registerDeleteHandler = useCallback(
    (handler?: (() => void) | null) => {
      setDeleteHandler(() => handler ?? noopDeleteHandler)
    },
    [noopDeleteHandler],
  )

  const registerFooterChildren = useCallback((node: React.ReactNode | null) => {
    setFooterChildren(node)
  }, [])

  useEffect(() => {
    setActiveType(defaultType)
  }, [defaultType])

  useEffect(() => {
    if (eventId == null || eventId === 0) return
    onEventTypeChange?.(eventId, activeType)
  }, [activeType, eventId, onEventTypeChange])

  const handleSubmitId = useMemo(
    () => (activeType === 'todo' ? 'add-todo-form' : 'add-schedule-form'),
    [activeType],
  )

  const tabs = (
    <S.TabControls>
      <S.TabButton
        type="button"
        $isActive={activeType === 'todo'}
        onClick={() => setActiveType('todo')}
      >
        할 일
      </S.TabButton>
      <S.TabButton
        type="button"
        $isActive={activeType === 'schedule'}
        onClick={() => setActiveType('schedule')}
      >
        일정
      </S.TabButton>
    </S.TabControls>
  )

  const inlinePortalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.getElementById('desktop-card-area')
  }, [])
  const modalRoot = useMemo(() => {
    if (typeof document === 'undefined') return null
    return document.getElementById('modal-root')
  }, [])
  const [headerTitlePortalTarget, setHeaderTitlePortalTarget] = useState<HTMLElement | null>(null)
  const handleHeaderTitleRef = useCallback((node: HTMLDivElement | null) => {
    setHeaderTitlePortalTarget(node)
  }, [])
  const layout = (
    <AddModalLayout
      mode={mode}
      type={activeType}
      onClose={onClose}
      submitFormId={handleSubmitId}
      handleDelete={deleteHandler}
      footerChildren={footerChildren}
      headerExtras={tabsVisible ? tabs : undefined}
      headerTitleContainerRef={handleHeaderTitleRef}
    >
      {activeType === 'todo' ? (
        <AddTodoForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={onClose}
          registerDeleteHandler={registerDeleteHandler}
          headerTitlePortalTarget={headerTitlePortalTarget}
          isEditing={isEditing}
          onEventTitleConfirm={onEventTitleConfirm}
          onEventTimingChange={onEventTimingChange}
        />
      ) : (
        <AddScheduleForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={onClose}
          registerDeleteHandler={registerDeleteHandler}
          registerFooterChildren={registerFooterChildren}
          headerTitlePortalTarget={headerTitlePortalTarget}
          initialEvent={initialEvent}
          isEditing={isEditing}
          onEventColorChange={onEventColorChange}
          onEventTitleConfirm={onEventTitleConfirm}
          onEventTimingChange={onEventTimingChange}
        />
      )}
    </AddModalLayout>
  )

  if (mode === 'inline' && inlinePortalRoot) {
    return createPortal(layout, inlinePortalRoot)
  }

  if (mode === 'modal' && modalRoot) {
    return createPortal(layout, modalRoot)
  }

  return layout
}

export default AddItemModal
