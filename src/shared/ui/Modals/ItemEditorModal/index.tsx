import { useCallback, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { ItemEditorDraft, ItemType } from '@/shared/types/modal/itemEditor'
import ScheduleEditorForm from '@/shared/ui/Modals/ScheduleEditor/ScheduleEditorForm'
import TodoEditorForm from '@/shared/ui/Modals/TodoEditor/TodoEditorForm'
import { useEditorDraft } from '@/shared/utils/useEditorDraft'
import { useEditorRegistry } from '@/shared/utils/useEditorRegistry'
import { useEditorTypeSync } from '@/shared/utils/useEditorTypeSync'
import { useToastStore } from '@/store/useToastStore'

import EditorModalLayout from './EditorModalLayout'
import * as S from './ItemEditorModal.style'

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
  onEventSharedChange?: (eventId: CalendarEvent['id'], isShared: boolean) => void
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
  onEventSharedChange,
  onEventTypeChange,
  onEventTimingChange,
  draftValues: externalDraftValues,
  onDraftChange: onExternalDraftChange,
}: ItemEditorModalProps) => {
  const { draftValues, draftValuesRef, setDraftValues } = useEditorDraft({
    date,
    initialType,
    initialEvent,
    isEditing,
    externalDraftValues,
    onExternalDraftChange,
  })

  const {
    footerChildren,
    deleteHandler,
    handleClose,
    registerDeleteHandler,
    registerFooterChildren,
    registerCloseGuard,
  } = useEditorRegistry(onClose)

  const { activeType, setActiveType, isScheduleShared, setIsScheduleShared } = useEditorTypeSync({
    initialType,
    showTypeTabs,
    eventId,
    date,
    initialEvent,
    draftValuesRef,
    onEventTypeChange,
    onEventTimingChange,
  })

  const [modalWrapperElement, setModalWrapperElement] = useState<HTMLDivElement | null>(null)
  const modalWrapperRef = useRef<HTMLDivElement | null>(null)
  const isReadOnlySchedule =
    isEditing && initialType === 'schedule' && initialEvent?.isOwner === false
  const showReadOnlyScheduleToast = useCallback(() => {
    useToastStore.getState().showToast({
      title: '일정을 수정할 수 없습니다',
      message: '일정 소유자만 수정할 수 있습니다.',
      toastType: 'warning',
    })
  }, [])

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
        onClick={() => {
          if (isReadOnlySchedule) {
            showReadOnlyScheduleToast()
            return
          }
          setActiveType('todo')
        }}
      >
        할 일
      </S.TabButton>
      <S.TabButton
        type="button"
        $isActive={activeType === 'schedule'}
        onClick={() => {
          if (isReadOnlySchedule) {
            showReadOnlyScheduleToast()
            return
          }
          setActiveType('schedule')
        }}
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
  const handleSharedChange = useCallback(
    (isShared: boolean) => {
      setIsScheduleShared(isShared)
      if (eventId == null || eventId === 0) return
      onEventSharedChange?.(eventId, isShared)
    },
    [eventId, onEventSharedChange, setIsScheduleShared],
  )

  const layout = (
    <EditorModalLayout
      mode={mode}
      type={activeType}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitFormId={activeType === 'todo' ? 'add-todo-form' : 'add-schedule-form'}
      handleDelete={deleteHandler}
      footerChildren={footerChildren}
      hideActions={isReadOnlySchedule && activeType === 'schedule'}
      submitButtonLabel={
        activeType === 'schedule' && isScheduleShared ? '저장 및 초대 전송' : undefined
      }
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
          isShared={isScheduleShared}
          onEventColorChange={onEventColorChange}
          onEventTitleConfirm={onEventTitleConfirm}
          onEventTimingChange={onEventTimingChange}
          onSharedChange={handleSharedChange}
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
