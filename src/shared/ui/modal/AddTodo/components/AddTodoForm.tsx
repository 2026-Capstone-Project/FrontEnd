/** @jsxImportSource @emotion/react */
import moment from 'moment'
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { FormProvider } from 'react-hook-form'

import { useAddTodoForm } from '@/shared/hooks/form/useAddTodoForm'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import { useGetDetailTodoQuery } from '@/shared/hooks/query/useTodoQueries'
import { useRepeatChangeGuard } from '@/shared/hooks/repeat/useRepeatChangeGuard'
import { theme } from '@/shared/styles/theme'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import { type AddTodoFormValues, type RepeatConfigSchema } from '@/shared/types/event/event'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'
import {
  DeleteConfirmModal,
  EditConfirmModal,
  type EditConfirmOption,
  UnsavedChangesConfirmModal,
} from '@/shared/ui/modal'
import SelectColor from '@/shared/ui/modal/AddSchedule/components/SelectColor/SelectColor'
import CustomBasisPanel from '@/shared/ui/modal/AddTodo/components/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from '@/shared/ui/modal/AddTodo/components/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/modal/AddTodo/components/CustomTimePicker/CustomTimePicker'
import * as S from '@/shared/ui/modal/AddTodo/index.style'
import { formatDisplayDate } from '@/shared/utils/date'
import { mapRecurrenceGroupToRepeatConfig } from '@/shared/utils/recurrenceGroup'

type AddTodoFormProps = {
  registerDeleteHandler?: (handler?: () => void) => void
  registerCloseGuard?: (guard?: (() => boolean) | null) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: CalendarEvent['id']
  onClose: () => void
  isEditing?: boolean
  headerTitlePortalTarget?: HTMLElement | null
  onEventTitleConfirm?: (eventId: CalendarEvent['id'], title: string) => void
  onEventColorChange?: (eventId: CalendarEvent['id'], color: CalendarEvent['color']) => void
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
  registerCloseGuard,
  registerFooterChildren,
  isEditing = false,
  headerTitlePortalTarget,
  onEventTitleConfirm,
  onEventColorChange,
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
    eventColor,
    setEventColor,
  } = useAddTodoForm({ date, id: eventId, isEditing })
  const { register, setValue, formState } = formMethods
  const { isDirty } = formState
  const allowCloseRef = useRef(false)
  const [isUnsavedConfirmOpen, setIsUnsavedConfirmOpen] = useState(false)
  const occurrenceDate = useMemo(() => moment(date).format('YYYY-MM-DD'), [date])
  const shouldFetchDetail = isEditing && eventId != null && eventId !== 0
  const { data: detailData } = useGetDetailTodoQuery(eventId, occurrenceDate, shouldFetchDetail)
  const { useDeleteTodo, usePatchTodo } = useTodoMutations()
  const { mutate: deleteTodoMutate } = useDeleteTodo()
  const { mutate: patchTodoMutate } = usePatchTodo()
  const [calendarAnchor, setCalendarAnchor] = useState<DOMRect | null>(null)
  const [deleteWarningVisible, setDeleteWarningVisible] = useState(false)
  const [isMobileLayout, setIsMobileLayout] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${theme.breakPoints.tablet})`).matches
  })
  const startDate = formatDisplayDate(todoDate)

  useEffect(() => {
    if (!isEditing) return
    const detail = detailData?.result
    if (!detail) return

    const baseDate = detail.occurrenceDate ? new Date(detail.occurrenceDate) : new Date(date)
    const dueTime = detail.dueTime
    const parsedTime =
      typeof dueTime === 'string'
        ? dueTime.slice(0, 5)
        : `${String(dueTime?.hour ?? 0).padStart(2, '0')}:${String(dueTime?.minute ?? 0).padStart(
            2,
            '0',
          )}`

    setValue('todoTitle', detail.title ?? '', { shouldValidate: true })
    setValue('todoDescription', detail.memo ?? '', { shouldValidate: true })
    setValue('todoDate', baseDate, { shouldValidate: true })
    setValue('todoEndTime', parsedTime, { shouldValidate: true })
    setValue('eventColor', detail.color ?? 'GRAY', { shouldValidate: true })
    setIsAllday(detail.isAllDay)

    const mappedRepeatConfig = mapRecurrenceGroupToRepeatConfig(detail.recurrenceGroup)
    const nextRepeatConfig: RepeatConfigSchema = {
      ...defaultRepeatConfig,
      ...mappedRepeatConfig,
      customWeeklyDays: mappedRepeatConfig.customWeeklyDays ?? [],
      customMonthlyDates: mappedRepeatConfig.customMonthlyDates ?? [],
      customYearlyMonths: mappedRepeatConfig.customYearlyMonths ?? [],
    } as RepeatConfigSchema
    setValue('repeatConfig', nextRepeatConfig, { shouldValidate: true })
  }, [date, detailData, isEditing, setIsAllday, setValue])

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
  const isPersistedTodo = isEditing && eventId != null && eventId !== 0
  const deleteOccurrenceDate = useMemo(() => {
    if (detailData?.result?.occurrenceDate) {
      return moment(detailData.result.occurrenceDate).format('YYYY-MM-DD')
    }
    return moment(todoDate ?? date).format('YYYY-MM-DD')
  }, [date, detailData?.result?.occurrenceDate, todoDate])
  const requestClose = useCallback(
    (force?: boolean) => {
      if (force) {
        allowCloseRef.current = true
      }
      onClose()
    },
    [onClose],
  )

  const closeGuard = useCallback(() => {
    if (allowCloseRef.current) {
      allowCloseRef.current = false
      return true
    }
    if (!isDirty) return true
    setIsUnsavedConfirmOpen(true)
    return false
  }, [isDirty])

  const handleCloseUnsavedConfirm = useCallback(() => {
    setIsUnsavedConfirmOpen(false)
  }, [])

  const handleLeaveUnsavedForm = useCallback(() => {
    setIsUnsavedConfirmOpen(false)
    requestClose(true)
  }, [requestClose])

  useEffect(() => {
    if (!registerCloseGuard) return
    registerCloseGuard(closeGuard)
    return () => registerCloseGuard()
  }, [closeGuard, registerCloseGuard])

  const renderTitleInput = () => (
    <TitleSuggestionInput
      fieldName="todoTitle"
      placeholder="새로운 할 일"
      autoFocus
      formController={formMethods}
      onLiveChange={(value) => {
        if (eventId != null && eventId !== 0) {
          onEventTitleConfirm?.(eventId, value)
        }
      }}
      onConfirm={(value) => onEventTitleConfirm?.(eventId, value)}
    />
  )

  const hasExistingRecurrence = Boolean(detailData?.result?.recurrenceGroup)
  const repeatGuardEnabled = isEditing && hasExistingRecurrence
  // 편집 모드에서 반복 변경을 가드해 확인 또는 취소가 가능하도록 합니다.
  const {
    isOpen: isEditConfirmOpen,
    confirmChange,
    revertChange,
    requestConfirmation,
  } = useRepeatChangeGuard({
    repeatConfig,
    isEditing: repeatGuardEnabled,
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

  const handleFormSubmit = handleSubmit(async (values) => {
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
    try {
      await onSubmit(values)
      requestClose(true)
    } catch (error) {
      console.error('[AddTodoForm] submit failed', error)
      const message =
        error instanceof Error
          ? error.message
          : '할 일 저장 중 오류가 발생했습니다. 다시 시도해주세요.'
      alert(message)
    }
  })

  const handleConfirmedSubmit = useCallback(
    async (option: EditConfirmOption) => {
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
      try {
        await onSubmit(pendingTodoValues)
        requestClose(true)
        setPendingTodoValues(null)
      } catch (error) {
        console.error('[AddTodoForm] submit failed', error)
        const message =
          error instanceof Error
            ? error.message
            : '할 일 저장 중 오류가 발생했습니다. 다시 시도해주세요.'
        alert(message)
      }
    },
    [
      confirmChange,
      eventId,
      onEventTitleConfirm,
      onSubmit,
      pendingTodoValues,
      requestClose,
      syncEventTiming,
    ],
  )

  const handleCancelRepeat = useCallback(() => {
    revertChange()
    setPendingTodoValues(null)
  }, [revertChange])

  const handleDelete = useCallback(() => {
    if (!isPersistedTodo) {
      requestClose(true)
      return
    }
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
      return
    }
    deleteTodoMutate(
      {
        todoId: eventId,
        occurrenceDate: deleteOccurrenceDate,
      },
      {
        onSuccess: () => requestClose(true),
      },
    )
  }, [
    deleteOccurrenceDate,
    deleteTodoMutate,
    eventId,
    isPersistedTodo,
    repeatConfig.repeatType,
    requestClose,
  ])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.()
  }, [handleDelete, registerDeleteHandler])

  const handleColorChange = useCallback(
    (value: CalendarEvent['color']) => {
      setEventColor(value)
      if (eventId != null && eventId !== 0) {
        onEventColorChange?.(eventId, value)
      }
      if (!isEditing || eventId == null || eventId === 0) {
        return
      }
      patchTodoMutate({
        todoId: eventId,
        occurrenceDate: deleteOccurrenceDate,
        ...(hasExistingRecurrence ? { scope: 'THIS_TODO' as const } : {}),
        requestBody: {
          color: value,
        },
      })
    },
    [
      deleteOccurrenceDate,
      eventId,
      hasExistingRecurrence,
      isEditing,
      onEventColorChange,
      patchTodoMutate,
      setEventColor,
    ],
  )

  const footerNode = useMemo(
    () => <SelectColor value={eventColor} onChange={handleColorChange} />,
    [eventColor, handleColorChange],
  )

  useEffect(() => {
    if (eventId == null || eventId === 0) return
    if (!onEventTimingChange) return
    const baseDate = todoDate ?? new Date(date)
    if (isAllday) {
      const start = new Date(baseDate)
      start.setHours(0, 0, 0, 0)
      const end = new Date(baseDate)
      end.setHours(23, 59, 59, 999)
      onEventTimingChange(eventId, start, end, true)
      return
    }
    const start = buildDateTime(baseDate, todoEndTime)
    onEventTimingChange(eventId, start, start, false)
  }, [buildDateTime, date, eventId, isAllday, onEventTimingChange, todoDate, todoEndTime])

  useEffect(() => {
    registerFooterChildren?.(footerNode)
    return () => registerFooterChildren?.(null)
  }, [footerNode, registerFooterChildren])

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
              onLiveChange={(value) => {
                if (eventId != null && eventId !== 0) {
                  onEventTitleConfirm?.(eventId, value)
                }
              }}
              onConfirm={(value) => onEventTitleConfirm?.(eventId, value)}
            />,
            headerTitlePortalTarget,
          )}
      </FormProvider>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={todoTitle || '새로운 이벤트'}
          onClose={() => setDeleteWarningVisible(false)}
          target={{
            type: 'todo',
            id: eventId,
            occurrenceDate: deleteOccurrenceDate,
          }}
          mutate={deleteTodoMutate}
        />
      )}
      {isEditConfirmOpen && (
        <EditConfirmModal onCancel={handleCancelRepeat} onConfirm={handleConfirmedSubmit} />
      )}
      {isUnsavedConfirmOpen && (
        <UnsavedChangesConfirmModal
          target="todo"
          isEditing={isEditing}
          onClose={handleCloseUnsavedConfirm}
          onConfirmLeave={handleLeaveUnsavedForm}
        />
      )}
    </>
  )
}

export default AddTodoForm
