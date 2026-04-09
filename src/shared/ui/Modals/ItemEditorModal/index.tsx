import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { RepeatConfigSchema } from '@/shared/types/event/event'
import type { ItemEditorDraft } from '@/shared/types/modal/itemEditor'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import ScheduleEditorForm from '@/shared/ui/Modals/ScheduleEditor/ScheduleEditorForm'
import TodoEditorForm from '@/shared/ui/Modals/TodoEditor/TodoEditorForm'

import EditorModalLayout from './EditorModalLayout'
import * as S from './ItemEditorModal.style'

type ItemType = 'todo' | 'schedule'

const pad2 = (value: number) => String(value).padStart(2, '0')

const formatTimeFromDate = (value: Date) => `${pad2(value.getHours())}:${pad2(value.getMinutes())}`

const getDefaultDraft = (
  date: string,
  initialType: ItemType,
  initialEvent?: CalendarEvent | null,
): ItemEditorDraft => {
  const baseStart = initialEvent?.start ? new Date(initialEvent.start) : new Date(date)
  const baseEnd =
    initialEvent?.end && new Date(initialEvent.end).getTime() !== baseStart.getTime()
      ? new Date(initialEvent.end)
      : new Date(baseStart.getTime() + 60 * 60 * 1000)

  return {
    title:
      initialType === 'schedule' && initialEvent?.title === '새 일정'
        ? ''
        : (initialEvent?.title ?? ''),
    description: initialEvent?.content ?? '',
    startDate: baseStart,
    endDate: baseEnd,
    startTime: formatTimeFromDate(baseStart),
    endTime: initialType === 'todo' ? formatTimeFromDate(baseStart) : formatTimeFromDate(baseEnd),
    isAllday: initialEvent?.isAllDay ?? false,
    eventColor: initialEvent?.color ?? (initialType === 'todo' ? 'GRAY' : 'BLUE'),
    repeatConfig: defaultRepeatConfig as RepeatConfigSchema,
    location: initialEvent?.location ?? '',
    address: initialEvent?.address ?? null,
  }
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
}: ItemEditorModalProps) => {
  const [activeType, setActiveType] = useState<ItemType>(initialType)
  const [draftValues, setDraftValues] = useState<ItemEditorDraft | null>(() =>
    isEditing ? null : getDefaultDraft(date, initialType, initialEvent),
  )
  const [footerChildren, setFooterChildren] = useState<ReactNode | null>(null)
  const [deleteHandler, setDeleteHandler] = useState<() => void>(() => () => undefined)
  const [closeGuard, setCloseGuard] = useState<null | (() => boolean)>(null)
  const [modalWrapperElement, setModalWrapperElement] = useState<HTMLDivElement | null>(null)
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
    setActiveType(initialType)
  }, [initialType])

  useEffect(() => {
    setDraftValues(isEditing ? null : getDefaultDraft(date, initialType, initialEvent))
  }, [date, initialEvent, initialType, isEditing])

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
