import { useId, useState } from 'react'
import { createPortal } from 'react-dom'

import Modal from '../../common/Modal/Modal'
import * as S from './EditConfirmModal.style'

const optionValues = ['single', 'future', 'all'] as const
export type EditConfirmOption = (typeof optionValues)[number]

const EditConfirmModal = ({
  title,
  onCancel,
  onConfirm,
}: {
  title: string
  onCancel?: () => void
  onConfirm?: (option: EditConfirmOption) => void
}) => {
  const radioName = useId()
  const [selectedOption, setSelectedOption] = useState<EditConfirmOption>('single')

  return createPortal(
    <Modal onClick={onCancel}>
      <S.ModalWrapper>
        <S.Title>이 변경사항을 어떻게 적용할까요?</S.Title>
        <S.OptionsContainer>
          {optionValues.map((value) => {
            const optionId = `${radioName}-${value}`
            const isChecked = selectedOption === value
            const label =
              value === 'single'
                ? '이 이벤트에 대해서만 적용'
                : value === 'future'
                  ? '이 이벤트부터 이후 이벤트'
                  : `모든 "${title}" 이벤트에 대해 적용`
            return (
              <S.OptionWrapper key={value}>
                <S.HiddenRadio
                  id={optionId}
                  name={radioName}
                  type="radio"
                  value={value}
                  checked={isChecked}
                  onChange={() => setSelectedOption(value)}
                />
                <S.OptionLabel htmlFor={optionId}>
                  <S.RadioIndicator $checked={isChecked} />
                  {label}
                </S.OptionLabel>
              </S.OptionWrapper>
            )
          })}
        </S.OptionsContainer>
        <S.ButtonsContainer>
          <S.CancelButton onClick={onCancel}>취소</S.CancelButton>
          <S.EditButton
            onClick={() => {
              onConfirm?.(selectedOption)
            }}
          >
            적용
          </S.EditButton>
        </S.ButtonsContainer>
      </S.ModalWrapper>
    </Modal>,
    document.getElementById('modal-root')!,
  )
}

export default EditConfirmModal
