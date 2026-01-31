/** @jsxImportSource @emotion/react */
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { FormProvider } from 'react-hook-form'

import type { CalendarEvent } from '@/features/Calendar/domain/types'
import { useAddTodoForm } from '@/shared/hooks/useAddTodoForm'
import { useRepeatChangeGuard } from '@/shared/hooks/useRepeatChangeGuard'
import { theme } from '@/shared/styles/theme'
import { type AddTodoFormValues } from '@/shared/types/event'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'
import CustomBasisPanel from '@/shared/ui/modal/AddTodo/components/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from '@/shared/ui/modal/AddTodo/components/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/modal/AddTodo/components/CustomTimePicker/CustomTimePicker'
import * as S from '@/shared/ui/modal/AddTodo/index.style'
import DeleteConfirmModal from '@/shared/ui/modal/DeleteConfirmModal/DeleteConfirmModal'
import EditConfirmModal, {
  type EditConfirmOption,
} from '@/shared/ui/modal/EditConfirmModal/EditConfirmModal'
import { formatDisplayDate } from '@/shared/utils/date'

type AddTodoFormProps = {
  registerDeleteHandler?: (handler?: () => void) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  onClose: () => void
  isEditing?: boolean
  headerTitlePortalTarget?: HTMLElement | null
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
  onEventTimingChange?: (
    eventId: CalendarEvent['id'],
    start: Date,
    end: Date,
    allDay: boolean,
  ) => void
}

const AddTodoForm = ({
  date,
  mode = 'modal',
  eventId,
  onClose,
  registerDeleteHandler,
  isEditing = false,
  headerTitlePortalTarget,
  onEventTitleConfirm,
  onEventTimingChange,
}: AddTodoFormProps) => {
  const {
    formMethods,
    activeCalendarField,
    calendarRef,
    isAllday,
    repeatConfig,
    handleCalendarOpen,
    handleDateSelect,
    handleTimeChange,
    handleSubmit,
    onSubmit,
    setIsAllday,
    updateConfig,
    handleRepeatType,
    repeatEndDate,
    todoEndTime,
    todoDate,
    todoTitle,
  } = useAddTodoForm({ date, id: eventId })
  const { register, setValue } = formMethods
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`).matches
  })
  const startDate = formatDisplayDate(todoDate)

  const handleCalendarButtonClick =
    (field: 'start' | 'end') => (event: ReactMouseEvent<HTMLButtonElement>) => {
      handleCalendarOpen(field)
      const target = event.currentTarget
      setCalendarAnchor(target.getBoundingClientRect())
    }

  const portalPosition = useMemo(() => {
    if (!calendarAnchor) return null
    if (typeof window === 'undefined') return null
    const scrollY = window.scrollY || 0
    const scrollX = window.scrollX || 0
    return {
      top: calendarAnchor.bottom + scrollY + 8,
      left: calendarAnchor.left + scrollX,
    }
  }, [calendarAnchor])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const mediaQuery = window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`)
    const handler = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches)
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const calendarPortalStyle = useMemo(() => {
    if (!portalPosition || isMobileLayout) return undefined
    return {
      top: portalPosition.top,
      left: portalPosition.left,
    }
  }, [portalPosition, isMobileLayout])

  const isInlineMode = mode === 'inline'
  const shouldShowModalOverlay = !isInlineMode && activeCalendarField
  const renderTitleInput = () => (
    <TitleSuggestionInput
      fieldName="todoTitle"
      placeholder="새로운 할 일"
      autoFocus
      formController={formMethods}
      onConfirm={(value) => onEventTitleConfirm?.(eventId, value)}
    />
  )

  // 편집 모드에서 반복 변경을 가드해 확인 또는 취소가 가능하도록 합니다.
  const {
    isOpen: isEditConfirmOpen,
    confirmChange,
    revertChange,
    requestConfirmation,
  } = useRepeatChangeGuard({
    repeatConfig,
    isEditing,
    setValue,
  })
  const [pendingTodoValues, setPendingTodoValues] = useState<AddTodoFormValues | null>(null)

  const buildDateTime = useCallback((dateValue: Date | null, timeValue?: string) => {
    const nextDate = dateValue ? new Date(dateValue) : new Date()
    if (!timeValue) {
      nextDate.setHours(0, 0, 0, 0)
      return nextDate
    }
    const [hour, minute] = timeValue.split(':').map((value) => Number.parseInt(value, 10))
    nextDate.setHours(Number.isNaN(hour) ? 0 : hour, Number.isNaN(minute) ? 0 : minute, 0, 0)
    return nextDate
  }, [])

  const syncEventTiming = useCallback(
    (values: AddTodoFormValues) => {
      if (eventId == null || eventId === 0) return
      if (!onEventTimingChange) return
      const baseDate = values.todoDate ?? new Date(date)
      if (values.isAllday) {
        const start = new Date(baseDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(baseDate)
        end.setHours(23, 59, 59, 999)
        onEventTimingChange(eventId, start, end, true)
        return
      }
      const start = buildDateTime(baseDate, values.todoEndTime)
      onEventTimingChange(eventId, start, start, false)
    },
    [buildDateTime, date, eventId, onEventTimingChange],
  )

  const handleFormSubmit = handleSubmit((values) => {
    if (requestConfirmation()) {
      setPendingTodoValues(values)
      return
    }
    if (eventId != null && eventId !== 0) {
      const nextTitle = values.todoTitle ?? ''
      if (nextTitle) {
        onEventTitleConfirm?.(eventId, nextTitle)
      }
    }
    syncEventTiming(values)
    onSubmit(values)
    onClose()
  })

  const handleConfirmedSubmit = useCallback(
    (option: EditConfirmOption) => {
      void option
      if (!pendingTodoValues) return
      confirmChange()
      if (eventId != null && eventId !== 0) {
        const nextTitle = pendingTodoValues.todoTitle ?? ''
        if (nextTitle) {
          onEventTitleConfirm?.(eventId, nextTitle)
        }
      }
      syncEventTiming(pendingTodoValues)
      onSubmit(pendingTodoValues)
      onClose()
      setPendingTodoValues(null)
    },
    [
      confirmChange,
      eventId,
      onClose,
      onEventTitleConfirm,
      onSubmit,
      pendingTodoValues,
      syncEventTiming,
    ],
  )

  const handleCancelRepeat = useCallback(() => {
    revertChange()
    setPendingTodoValues(null)
  }, [revertChange])

  const handleDelete = useCallback(() => {
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
      console.log('반복 할 일 삭제 로직 처리')
    } else {
      console.log('할 일 삭제 로직 처리')
    }
  }, [repeatConfig])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.()
  }, [handleDelete, registerDeleteHandler])

  return (
    <>
      {!isInlineMode &&
        shouldShowModalOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <FormProvider {...formMethods}>
        <form id="add-todo-form" onSubmit={handleFormSubmit}>
          <S.FormContent>
            {!headerTitlePortalTarget && renderTitleInput()}
            <S.Selection>
              <S.SelectionColumn>
                <S.FieldRow>
                  <S.DateFieldButton type="button" onClick={handleCalendarButtonClick('start')}>
                    {startDate}
                  </S.DateFieldButton>

                  {!isAllday && (
                    <CustomTimePicker
                      field="start"
                      value={todoEndTime ?? ''}
                      onChange={(value) => handleTimeChange('start', value)}
                    />
                  )}
                  <S.FieldLabel>까지</S.FieldLabel>
                </S.FieldRow>
              </S.SelectionColumn>
              {activeCalendarField &&
                portalPosition &&
                typeof document !== 'undefined' &&
                createPortal(
                  <S.CalendarPortal ref={calendarRef} style={calendarPortalStyle}>
                    <CustomDatePicker
                      key={activeCalendarField}
                      field={activeCalendarField}
                      selectedDate={todoDate}
                      onSelectDate={handleDateSelect}
                    />
                  </S.CalendarPortal>,
                  document.getElementById('modal-root')!,
                )}
            </S.Selection>
            <Checkbox
              checked={isAllday}
              onChange={() => setIsAllday((prev) => !prev)}
              label="종일"
            />
            <S.TextareaWrapper>
              <S.TextareaHeader>메모</S.TextareaHeader>
              <S.Textarea {...register('todoDescription')} />
            </S.TextareaWrapper>
            <RepeatTypeGroup
              repeatType={repeatConfig.repeatType}
              customBasis={repeatConfig.customBasis}
              onToggleType={handleRepeatType}
            />
          </S.FormContent>
          <div css={{ marginTop: '12px' }}>
            {repeatConfig.repeatType === 'custom' && (
              <CustomBasisPanel
                config={repeatConfig}
                customBasis={repeatConfig.customBasis}
                updateConfig={updateConfig}
              />
            )}
            {repeatConfig.repeatType !== 'none' && (
              <TerminationPanel
                config={repeatConfig}
                updateConfig={updateConfig}
                minDate={repeatEndDate ?? null}
              />
            )}
          </div>
        </form>
        {headerTitlePortalTarget &&
          createPortal(
            <TitleSuggestionInput
              fieldName="todoTitle"
              placeholder="새로운 할 일"
              autoFocus
              formController={formMethods}
              onConfirm={(value) => onEventTitleConfirm?.(eventId, value)}
            />,
            headerTitlePortalTarget,
          )}
      </FormProvider>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={todoTitle || '새로운 이벤트'}
          onClose={() => setDeleteWarningVisible(false)}
        />
      )}
      {isEditConfirmOpen && (
        <EditConfirmModal
          title={todoTitle || '할 일'}
          onCancel={handleCancelRepeat}
          onConfirm={handleConfirmedSubmit}
        />
      )}
    </>
  )
}

export default AddTodoForm
