import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import ScheduleEditorForm from '@/shared/ui/Modals/ScheduleEditor/ScheduleEditorForm'
import TodoEditorForm from '@/shared/ui/Modals/TodoEditor/TodoEditorForm'
import { buildDefaultItemEditorDraft } from '@/shared/utils'

import EditorModalLayout from './EditorModalLayout'
import * as S from './ItemEditorModal.style'

type ItemType = 'todo' | 'schedule'

const buildDateTime = (fallbackDate: string, dateValue?: Date | null, timeValue?: string) => {
  const nextDate = dateValue ? new Date(dateValue) : new Date(fallbackDate)
  if (!timeValue) {
    nextDate.setHours(0, 0, 0, 0)
    return nextDate
  }

  const [hour, minute] = timeValue.split(':').map((value) => Number.parseInt(value, 10))
  nextDate.setHours(Number.isNaN(hour) ? 0 : hour, Number.isNaN(minute) ? 0 : minute, 0, 0)
  return nextDate
}

type ItemEditorModalProps = {
  onClose: () => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  initialType?: ItemType
  showTypeTabs?: boolean
  isEditing?: boolean
  initialEvent?: CalendarEvent | null
  onEventColorChange?: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: CalendarEvent['title']) => void
  onEventTypeChange?: (eventId: CalendarEvent['id'], type: ItemType) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
    occurrenceDate?: CalendarEvent['occurrenceDate'],
  ) => void
  draftValues?: ItemEditorDraft | null
  onDraftChange?: (draft: ItemEditorDraft | null) => void
}

const ItemEditorModal = ({
  onClose,
  date,
  mode = 'modal',
  eventId,
  initialType = 'todo',
  showTypeTabs = true,
  isEditing = false,
  initialEvent = null,
  onEventColorChange,
  onEventTitleConfirm,
  onEventTypeChange,
  onEventTimingChange,
  draftValues: externalDraftValues,
  onDraftChange: onExternalDraftChange,
}: ItemEditorModalProps) => {
  const [activeType, setActiveType] = useState<ItemType>(initialType)
  const [internalDraftValues, setInternalDraftValues] = useState<ItemEditorDraft | null>(() =>
    isEditing ? null : buildDefaultItemEditorDraft(date, initialType, initialEvent),
  )
  const draftValues = externalDraftValues ?? internalDraftValues
  const draftValuesRef = useRef(draftValues)
  const setDraftValues = useCallback(
    (draft: ItemEditorDraft | null) => {
      if (onExternalDraftChange) {
        onExternalDraftChange(draft)
        return
      }
      setInternalDraftValues(draft)
    },
    [onExternalDraftChange],
  )
  const [footerChildren, setFooterChildren] = useState<ReactNode | null>(null)
  const [deleteHandler, setDeleteHandler] = useState<() => void>(() => () => undefined)
  const [closeGuard, setCloseGuard] = useState<null | (() => boolean)>(null)
  const [modalWrapperElement, setModalWrapperElement] = useState<HTMLDivElement | null>(null)
  const modalWrapperRef = useRef<HTMLDivElement | null>(null)
  const previousActiveTypeRef = useRef(activeType)
  const noopDeleteHandler = useCallback(() => undefined, [])

  useEffect(() => {
    draftValuesRef.current = draftValues
  }, [draftValues])

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
    setActiveType(initialType)
  }, [initialType])

  useEffect(() => {
    if (externalDraftValues !== undefined) return
    setInternalDraftValues(
      isEditing ? null : buildDefaultItemEditorDraft(date, initialType, initialEvent),
    )
  }, [date, externalDraftValues, initialEvent, initialType, isEditing])

  useEffect(() => {
    if (eventId == null || eventId === 0) return
    onEventTypeChange?.(eventId, activeType)
  }, [activeType, eventId, onEventTypeChange])

  useEffect(() => {
    if (!showTypeTabs) return
    if (previousActiveTypeRef.current === activeType) return
    previousActiveTypeRef.current = activeType
    if (eventId == null || eventId === 0) return
    if (!onEventTimingChange) return

    const latestDraftValues = draftValuesRef.current
    const startDate =
      latestDraftValues?.startDate ?? (initialEvent?.start ? new Date(initialEvent.start) : null)
    const endDate =
      latestDraftValues?.endDate ?? (initialEvent?.end ? new Date(initialEvent.end) : startDate)
    const isAllDay = latestDraftValues?.isAllday ?? initialEvent?.isAllDay ?? false
    const occurrenceDate = initialEvent?.occurrenceDate

    if (activeType === 'todo') {
      if (isAllDay) {
        const start = new Date(startDate ?? new Date(date))
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setHours(23, 59, 59, 999)
        onEventTimingChange(eventId, start, end, true, occurrenceDate)
        return
      }

      const point = buildDateTime(
        date,
        startDate,
        latestDraftValues?.endTime ?? latestDraftValues?.startTime,
      )
      onEventTimingChange(eventId, point, point, false, occurrenceDate)
      return
    }

    if (isAllDay) {
      const start = new Date(startDate ?? new Date(date))
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDate ?? start)
      end.setHours(23, 59, 59, 999)
      onEventTimingChange(eventId, start, end, true, occurrenceDate)
      return
    }

    const start = buildDateTime(date, startDate, latestDraftValues?.startTime)
    const end = buildDateTime(date, endDate ?? startDate, latestDraftValues?.endTime)
    onEventTimingChange(eventId, start, end, false, occurrenceDate)
  }, [
    activeType,
    date,
    eventId,
    initialEvent?.end,
    initialEvent?.isAllDay,
    initialEvent?.occurrenceDate,
    initialEvent?.start,
    onEventTimingChange,
    showTypeTabs,
  ])

  const handleSubmit = useCallback(() => {
    const submitFormId = activeType === 'todo' ? 'add-todo-form' : 'add-schedule-form'
    const scopedTarget = modalWrapperRef.current?.querySelector(
      `#${submitFormId}`,
    ) as HTMLFormElement | null
    const target = scopedTarget ?? (document.getElementById(submitFormId) as HTMLFormElement | null)
    if (!target) return
    // requestSubmit을 지원하지 않는 환경에서는 아래 dispatchEvent 경로로 안전하게 폴백합니다.
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
  const handleModalWrapperRef = useCallback((node: HTMLDivElement | null) => {
    modalWrapperRef.current = node
    setModalWrapperElement((prev) => (prev === node ? prev : node))
  }, [])
  const layout = (
    <EditorModalLayout
      mode={mode}
      type={activeType}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitFormId={activeType === 'todo' ? 'add-todo-form' : 'add-schedule-form'}
      handleDelete={deleteHandler}
      footerChildren={footerChildren}
      headerExtras={showTypeTabs ? tabs : undefined}
      headerTitleContainerRef={handleHeaderTitleRef}
      modalWrapperRef={handleModalWrapperRef}
    >
      {activeType === 'todo' ? (
        <TodoEditorForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={handleClose}
          initialEvent={initialEvent}
          draftValues={draftValues}
          onDraftChange={setDraftValues}
          registerDeleteHandler={registerDeleteHandler}
          registerCloseGuard={registerCloseGuard}
          registerFooterChildren={registerFooterChildren}
          headerTitlePortalTarget={headerTitlePortalTarget}
          isEditing={isEditing}
          onEventColorChange={onEventColorChange}
          onEventTitleConfirm={onEventTitleConfirm}
          onEventTimingChange={onEventTimingChange}
        />
      ) : (
        <ScheduleEditorForm
          date={date}
          eventId={eventId}
          mode={mode}
          onClose={handleClose}
          modalWrapperElement={modalWrapperElement}
          draftValues={draftValues}
          onDraftChange={setDraftValues}
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
    </EditorModalLayout>
  )

  if (mode === 'inline' && inlinePortalRoot) {
    return createPortal(layout, inlinePortalRoot)
  }

  if (mode === 'modal' && modalRoot) {
    return createPortal(layout, modalRoot)
  }

  return layout
}

export default ItemEditorModal
