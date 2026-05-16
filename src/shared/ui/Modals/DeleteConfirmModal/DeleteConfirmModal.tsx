import type { UseMutateFunction } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { createPortal } from 'react-dom'

import {
  RECURRENCE_EVENT_SCOPE,
  RECURRENCE_TODO_SCOPE,
  type RecurrenceEventSeriesScope,
  type RecurrenceTodoScope,
} from '@/shared/constants/recurrenceScope'

import Modal from '../../common/Modal/Modal'
import * as S from './DeleteConfirmModal.style'

type EventDeleteVariables = {
  eventId: number
  params: {
    scope?: RecurrenceEventSeriesScope
    occurrenceDate: string
  }
}

type TodoDeleteVariables = {
  todoId: number
  occurrenceDate?: string
  scope?: RecurrenceTodoScope
}

type DeleteConfirmTarget =
  | { type: 'event'; id: number; occurrenceDate: string }
  | { type: 'todo'; id: number; occurrenceDate?: string }

type DeleteConfirmModalBaseProps = {
  onClose: () => void
  title: string
}

type DeleteConfirmModalProps =
  | (DeleteConfirmModalBaseProps & {
      target: Extract<DeleteConfirmTarget, { type: 'event' }>
      mutate: UseMutateFunction<unknown, unknown, EventDeleteVariables, unknown>
    })
  | (DeleteConfirmModalBaseProps & {
      target: Extract<DeleteConfirmTarget, { type: 'todo' }>
      mutate: UseMutateFunction<unknown, unknown, TodoDeleteVariables, unknown>
    })

const isEventDeleteProps = (
  props: DeleteConfirmModalProps,
): props is Extract<DeleteConfirmModalProps, { target: { type: 'event' } }> =>
  props.target.type === 'event'

const DeleteConfirmModal = (props: DeleteConfirmModalProps) => {
  const { onClose, title } = props
  const radioName = useId()
  const [selectedOption, setSelectedOption] = useState<'single' | 'future'>('single')
  const isEventTarget = props.target.type === 'event'

  const options = [
    {
      value: 'single',
      label: isEventTarget ? '이 이벤트' : '이 할 일',
    },
    {
      value: 'future',
      label: isEventTarget ? '이 이벤트부터 이후 이벤트' : '이 할 일부터 이후 할 일',
    },
  ] as const

  const handleDelete = () => {
    if (isEventDeleteProps(props)) {
      const scope: RecurrenceEventSeriesScope =
        selectedOption === 'single'
          ? RECURRENCE_EVENT_SCOPE.THIS_EVENT
          : RECURRENCE_EVENT_SCOPE.THIS_AND_FOLLOWING_EVENTS
      const params = { scope, occurrenceDate: props.target.occurrenceDate }
      props.mutate(
        { eventId: props.target.id, params },
        {
          onSuccess: () => {
            onClose()
          },
        },
      )
      return
    }
    const scope: RecurrenceTodoScope =
      selectedOption === 'single'
        ? RECURRENCE_TODO_SCOPE.THIS_TODO
        : RECURRENCE_TODO_SCOPE.THIS_AND_FOLLOWING
    props.mutate(
      { todoId: props.target.id, occurrenceDate: props.target.occurrenceDate, scope },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return createPortal(
    <Modal onClick={onClose}>
      <S.ModalWrapper>
        <S.Title>{`${isEventTarget ? '반복 일정' : '반복 할 일'} "${title}" 삭제`}</S.Title>
        <S.OptionsContainer>
          {options.map((option) => {
            const optionId = `${radioName}-${option.value}`
            const isChecked = selectedOption === option.value
            return (
              <S.OptionWrapper key={option.value}>
                <S.HiddenRadio
                  id={optionId}
                  name={radioName}
                  type="radio"
                  value={option.value}
                  checked={isChecked}
                  onChange={() => setSelectedOption(option.value)}
                />
                <S.OptionLabel htmlFor={optionId}>
                  <S.RadioIndicator $checked={isChecked} />
                  {option.label}
                </S.OptionLabel>
              </S.OptionWrapper>
            )
          })}
        </S.OptionsContainer>
        <S.ButtonsContainer>
          <S.CancelButton onClick={onClose}>취소</S.CancelButton>
          <S.DeleteButton onClick={handleDelete}>
            {isEventTarget ? '이벤트 삭제' : '할 일 삭제'}
          </S.DeleteButton>
        </S.ButtonsContainer>
      </S.ModalWrapper>
    </Modal>,
    document.getElementById('modal-root')!,
  )
}

export default DeleteConfirmModal
