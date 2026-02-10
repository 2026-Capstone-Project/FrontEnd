import { useId, useState } from 'react'
import { createPortal } from 'react-dom'

import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'

import Modal from '../../common/Modal/Modal'
import * as S from './DeleteConfirmModal.style'

const DeleteConfirmModal = ({
  onClose,
  title,
  eventId,
  occurrenceDate,
}: {
  onClose: () => void
  title: string
  eventId: number
  occurrenceDate: string
}) => {
  const radioName = useId()
  const [selectedOption, setSelectedOption] = useState<'single' | 'future' | 'all'>('single')
  const { useDeleteEvent } = useCalendarMutation()
  const { mutate: deleteEventMutate } = useDeleteEvent()
  type DeleteScope = 'THIS_EVENT' | 'THIS_AND_FOLLOWING_EVENTS' | 'ALL_EVENTS'
  const options = [
    { value: 'single', label: '이 이벤트' },
    { value: 'future', label: '이 이벤트부터 이후 이벤트' },
    { value: 'all', label: '모든 이벤트' },
  ] as const

  const handleDelete = () => {
    const scope: DeleteScope =
      selectedOption === 'single'
        ? 'THIS_EVENT'
        : selectedOption === 'future'
          ? 'THIS_AND_FOLLOWING_EVENTS'
          : 'ALL_EVENTS'
    const params = { scope, occurrenceDate }
    deleteEventMutate(
      { eventId, params },
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
        <S.Title>반복 일정 "{title}" 삭제</S.Title>
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
          <S.DeleteButton onClick={handleDelete}>이벤트 삭제</S.DeleteButton>
        </S.ButtonsContainer>
      </S.ModalWrapper>
    </Modal>,
    document.getElementById('modal-root')!,
  )
}

export default DeleteConfirmModal
