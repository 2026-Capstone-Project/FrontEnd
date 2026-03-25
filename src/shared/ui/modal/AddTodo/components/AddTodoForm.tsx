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

import { useTodoSubmitFlow } from '@/shared/hooks/addTodo/useTodoSubmitFlow'
import { useThrottledValue } from '@/shared/hooks/common/useThrottledValue'
import { useUnsavedCloseGuard } from '@/shared/hooks/common/useUnsavedCloseGuard'
import { useSyncEventTiming } from '@/shared/hooks/form'
import { useAddTodoForm } from '@/shared/hooks/form/useAddTodoForm'
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import {
  useGetDetailTodoQuery,
  useGetTodoTitleHistoryQuery,
} from '@/shared/hooks/query/useTodoQueries'
import { theme } from '@/shared/styles/theme'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import { type AddTodoFormValues, type RepeatConfigSchema } from '@/shared/types/event/event'
import type { PriorityType } from '@/shared/types/event/priority'
import { defaultRepeatConfig } from '@/shared/types/recurrence/repeat'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'
import { DeleteConfirmModal, EditConfirmModal, UnsavedChangesConfirmModal } from '@/shared/ui/modal'
import * as S from '@/shared/ui/modal/AddTodo/index.style'
import CustomBasisPanel from '@/shared/ui/modal/common/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from '@/shared/ui/modal/common/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/modal/common/CustomTimePicker/CustomTimePicker'
import SelectColor from '@/shared/ui/modal/common/SelectColor/SelectColor'
import { formatDisplayDate } from '@/shared/utils/date'
import { getPriorityColor } from '@/shared/utils/priority'
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

const PRIORITY_OPTIONS: Array<{ value: PriorityType; label: string }> = [
  { value: 'HIGH', label: '높음' },
  { value: 'MEDIUM', label: '중간' },
  { value: 'LOW', label: '낮음' },
]

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
    todoPriority,
    setTodoPriority,
  } = useAddTodoForm({ date, id: eventId, isEditing })
  const { register, setValue, formState } = formMethods
  const { isDirty } = formState
  const [detailOccurrenceDate, setDetailOccurrenceDate] = useState(() =>
    moment(date).format('YYYY-MM-DD'),
  )
  const detailQueryAnchorRef = useRef<{ eventId: CalendarEvent['id']; date: string } | null>(null)
  const hydratedDetailKeyRef = useRef<string | null>(null)
  const shouldFetchDetail = isEditing && eventId != null && eventId !== 0
  const { data: detailData } = useGetDetailTodoQuery(
    eventId,
    detailOccurrenceDate,
    shouldFetchDetail,
  )
  const isPersistedTodo = isEditing && eventId != null && eventId !== 0
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
  const { isUnsavedConfirmOpen, requestClose, handleCloseUnsavedConfirm, handleLeaveUnsavedForm } =
    useUnsavedCloseGuard({
      isDirty,
      onClose,
      registerCloseGuard,
    })

  useEffect(() => {
    if (!isEditing || eventId == null || eventId === 0) return
    const nextDate = moment(date).format('YYYY-MM-DD')
    const anchor = detailQueryAnchorRef.current
    if (!anchor || anchor.eventId !== eventId) {
      detailQueryAnchorRef.current = { eventId, date: nextDate }
      hydratedDetailKeyRef.current = null
      setDetailOccurrenceDate(nextDate)
    }
  }, [date, eventId, isEditing])

  useEffect(() => {
    if (!isEditing) return
    const detail = detailData?.result
    if (!detail) return
    const detailKey = `${detail.todoId}-${detail.occurrenceDate ?? ''}`
    if (hydratedDetailKeyRef.current === detailKey) return
    hydratedDetailKeyRef.current = detailKey

    const baseDate = detail.occurrenceDate ? new Date(detail.occurrenceDate) : new Date()
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
    setValue('todoPriority', detail.priority ?? 'MEDIUM', { shouldValidate: true })
    setIsAllday(detail.isAllDay)

    const mappedRepeatConfig = mapRecurrenceGroupToRepeatConfig(detail.recurrenceGroup)
    const nextRepeatConfig: RepeatConfigSchema = {
      ...defaultRepeatConfig,
      ...mappedRepeatConfig,
      customMonthlyMode: mappedRepeatConfig.customMonthlyMode ?? 'dates',
      customMonthlyPatternWeek: mappedRepeatConfig.customMonthlyPatternWeek ?? '1',
      customMonthlyPatternDay: mappedRepeatConfig.customMonthlyPatternDay ?? 'mon',
      customYearlyConditionEnabled: mappedRepeatConfig.customYearlyConditionEnabled ?? false,
      customYearlyConditionWeek: mappedRepeatConfig.customYearlyConditionWeek ?? '1',
      customYearlyConditionDay: mappedRepeatConfig.customYearlyConditionDay ?? 'mon',
      customWeeklyDays: mappedRepeatConfig.customWeeklyDays ?? [],
      customMonthlyDates: mappedRepeatConfig.customMonthlyDates ?? [],
      customYearlyMonths: mappedRepeatConfig.customYearlyMonths ?? [],
    }
    setValue('repeatConfig', nextRepeatConfig, { shouldValidate: true })
  }, [detailData, isEditing, setIsAllday, setValue])

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
  const deleteOccurrenceDate = useMemo(() => {
    if (detailData?.result?.occurrenceDate) {
      return moment(detailData.result.occurrenceDate).format('YYYY-MM-DD')
    }
    return moment(todoDate ?? date).format('YYYY-MM-DD')
  }, [date, detailData?.result?.occurrenceDate, todoDate])
  const titleKeyword = todoTitle?.trim() ?? ''
  const throttledTitleKeyword = useThrottledValue(titleKeyword, 150)
  const { data: todoTitleHistoryData } = useGetTodoTitleHistoryQuery(
    throttledTitleKeyword,
    Boolean(throttledTitleKeyword),
  )
  const todoTitleSuggestions = todoTitleHistoryData?.result.titleHistory ?? []
  const renderTitleInput = () => (
    <TitleSuggestionInput
      fieldName="todoTitle"
      placeholder="새로운 할 일"
      autoFocus
      formController={formMethods}
      suggestions={todoTitleSuggestions}
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
  const patchOccurrenceDate = useMemo(() => {
    if (detailData?.result?.occurrenceDate) {
      return moment(detailData.result.occurrenceDate).format('YYYY-MM-DD')
    }
    return moment(todoDate ?? date).format('YYYY-MM-DD')
  }, [date, detailData?.result?.occurrenceDate, todoDate])

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
  const {
    isEditConfirmOpen,
    isApplyConfirmOpen,
    handleFormSubmit,
    handleConfirmedSubmit,
    handleCancelRepeat,
  } = useTodoSubmitFlow({
    eventId,
    hasExistingRecurrence,
    repeatGuardEnabled,
    isDetailReady: !isPersistedTodo || !shouldFetchDetail || Boolean(detailData?.result),
    repeatConfig,
    setValue,
    handleSubmit,
    patchOccurrenceDate,
    onSubmit,
    onClose: () => requestClose(true),
    syncEventTiming,
    onEventTitleConfirm,
  })

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
      const previousColor = eventColor
      setEventColor(value)
      if (eventId != null && eventId !== 0) {
        onEventColorChange?.(eventId, value)
      }
      if (!isEditing || eventId == null || eventId === 0) {
        return
      }
      patchTodoMutate(
        {
          todoId: eventId,
          occurrenceDate: deleteOccurrenceDate,
          ...(hasExistingRecurrence ? { scope: 'THIS_TODO' as const } : {}),
          requestBody: {
            color: value,
          },
        },
        {
          onError: () => {
            setEventColor(previousColor)
            if (eventId != null && eventId !== 0) {
              onEventColorChange?.(eventId, previousColor)
            }
          },
        },
      )
    },
    [
      eventColor,
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

  useSyncEventTiming({
    eventId,
    fallbackDate: date,
    isAllDay: isAllday,
    startDate: todoDate,
    startTime: todoEndTime,
    singlePointTime: true,
    buildDateTime,
    onEventTimingChange,
  })

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
            <S.PrioritySection>
              <S.PriorityLabel>중요도</S.PriorityLabel>
              <S.PriorityOptions>
                {PRIORITY_OPTIONS.map((option) => {
                  const token = getPriorityColor(option.value)
                  const palette = theme.colors.priority[token]
                  return (
                    <S.PriorityOptionButton
                      key={option.value}
                      type="button"
                      isActive={todoPriority === option.value}
                      baseColor={palette.base}
                      pointColor={palette.point}
                      onClick={() => setTodoPriority(option.value)}
                    >
                      {option.label}
                    </S.PriorityOptionButton>
                  )
                })}
              </S.PriorityOptions>
            </S.PrioritySection>
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
              suggestions={todoTitleSuggestions}
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
      {(isEditConfirmOpen || isApplyConfirmOpen) && (
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
