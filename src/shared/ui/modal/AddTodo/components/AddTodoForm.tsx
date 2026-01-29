import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { FormProvider } from 'react-hook-form'

import { useAddTodoForm } from '@/shared/hooks/useAddTodoForm'
import { theme } from '@/shared/styles/theme'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import RepeatTypeGroup from '@/shared/ui/common/RepeatTypeGroup/RepeatTypeGroup'
import TerminationPanel from '@/shared/ui/common/TerminationPanel/TerminationPanel'
import TitleSuggestionInput from '@/shared/ui/common/TitleSuggestionInput/TitleSuggestionInput'
import CustomBasisPanel from '@/shared/ui/modal/AddTodo/components/CustomBasisPanel/CustomBasisPanel'
import CustomDatePicker from '@/shared/ui/modal/AddTodo/components/CustomDatePicker/CustomDatePicker'
import CustomTimePicker from '@/shared/ui/modal/AddTodo/components/CustomTimePicker/CustomTimePicker'
import * as S from '@/shared/ui/modal/AddTodo/index.style'
import DeleteConfirmModal from '@/shared/ui/modal/DeleteConfirmModal/DeleteConfirmModal'
import { formatDisplayDate } from '@/shared/utils/date'

type AddTodoFormProps = {
  registerDeleteHandler?: (handler: () => void) => void
  registerFooterChildren?: (node: ReactNode | null) => void
  date: string
  mode?: 'modal' | 'inline'
  eventId: number
  onClose: () => void
}

const AddTodoForm = ({
  date,
  mode = 'modal',
  eventId,
  onClose,
  registerDeleteHandler,
  registerFooterChildren,
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
  } = useAddTodoForm({ date })
  const { register } = formMethods

  console.log('편집할 이벤트 ID:', eventId)
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

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit(values)
    onClose()
  })

  const handleDelete = useCallback(() => {
    if (repeatConfig.repeatType !== 'none') {
      setDeleteWarningVisible(true)
    } else {
      console.log('일정 삭제 로직 처리')
    }
  }, [repeatConfig])

  useEffect(() => {
    registerDeleteHandler?.(handleDelete)
    return () => registerDeleteHandler?.(() => undefined)
  }, [handleDelete, registerDeleteHandler])

  useEffect(() => {
    registerFooterChildren?.(null)
  }, [registerFooterChildren])

  return (
    <>
      {!isInlineMode &&
        shouldShowModalOverlay &&
        typeof document !== 'undefined' &&
        createPortal(<S.PortalDarkLayer />, document.getElementById('modal-root')!)}
      <FormProvider {...formMethods}>
        <form id="add-todo-form" onSubmit={handleFormSubmit}>
          <S.FormContent>
            <TitleSuggestionInput fieldName="todoTitle" placeholder="새로운 할 일" />
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
      </FormProvider>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={todoTitle || '새로운 이벤트'}
          onClose={() => setDeleteWarningVisible(false)}
        />
      )}
    </>
  )
}

export default AddTodoForm
