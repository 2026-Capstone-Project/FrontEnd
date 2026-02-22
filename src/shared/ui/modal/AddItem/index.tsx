import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CalendarEvent } from '@/shared/types/calendar/types'
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
  onEventTypeChange?: (eventId: CalendarEvent['id'], type: ActiveType) => void
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
  const [closeGuard, setCloseGuard] = useState<null | (() => boolean)>(null)
  const modalWrapperRef = useRef<HTMLDivElement | null>(null)
  const noopDeleteHandler = useCallback(() => undefined, [])

  const registerDeleteHandler = useCallback(
    (handler?: (() => void) | null) => {
      setDeleteHandler(() => handler ?? noopDeleteHandler)
    },
    [noopDeleteHandler],
  )

  const registerFooterChildren = useCallback((node: React.ReactNode | null) => {
    setFooterChildren((prev) => (prev === node ? prev : node))
  }, [])

  const registerCloseGuard = useCallback((guard?: (() => boolean) | null) => {
    setCloseGuard((prev) => {
      const next = guard ?? null
      return prev === next ? prev : next
    })
  }, [])

  const handleClose = useCallback(() => {
    if (closeGuard && !closeGuard()) return
    onClose()
  }, [closeGuard, onClose])

  useEffect(() => {
    setActiveType(defaultType)
  }, [defaultType])

  useEffect(() => {
    if (eventId == null || eventId === 0) return
    onEventTypeChange?.(eventId, activeType)
  }, [activeType, eventId, onEventTypeChange])

  const handleSubmit = useCallback(() => {
    const submitFormId = activeType === 'todo' ? 'add-todo-form' : 'add-schedule-form'
    const scopedTarget = modalWrapperRef.current?.querySelector(
      `#${submitFormId}`,
    ) as HTMLFormElement | null
    const target = scopedTarget ?? (document.getElementById(submitFormId) as HTMLFormElement | null)
    if (!target) return
    if (typeof target.requestSubmit === 'function') {
      target.requestSubmit()
      return
    }
    target.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  }, [activeType])

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
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitFormId={activeType === 'todo' ? 'add-todo-form' : 'add-schedule-form'}
      handleDelete={deleteHandler}
      footerChildren={footerChildren}
      headerExtras={tabsVisible ? tabs : undefined}
      headerTitleContainerRef={handleHeaderTitleRef}
      modalWrapperRef={modalWrapperRef}
    >
      {activeType === 'todo' ? (
        <AddTodoForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={handleClose}
          registerDeleteHandler={registerDeleteHandler}
          registerFooterChildren={registerFooterChildren}
          headerTitlePortalTarget={headerTitlePortalTarget}
          isEditing={isEditing}
          onEventColorChange={onEventColorChange}
          onEventTitleConfirm={onEventTitleConfirm}
          onEventTimingChange={onEventTimingChange}
        />
      ) : (
        <AddScheduleForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={handleClose}
          registerDeleteHandler={registerDeleteHandler}
          registerFooterChildren={registerFooterChildren}
          registerCloseGuard={registerCloseGuard}
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
