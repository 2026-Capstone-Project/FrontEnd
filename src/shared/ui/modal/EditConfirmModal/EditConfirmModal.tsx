import { useId, useState } from 'react'
import { createPortal } from 'react-dom'

import Modal from '../../common/Modal/Modal'
import * as S from './EditConfirmModal.style'

const EditConfirmModal = ({
  title,
  onCancel,
  onConfirm,
}: {
  title: string
  onCancel?: () => void
  onConfirm?: () => void
}) => {
  const radioName = useId()
  const [selectedOption, setSelectedOption] = useState<'single' | 'future' | 'all'>('single')

  const options = [
    { value: 'single', label: '이 이벤트에 대해서만 적용' },
    { value: 'future', label: '이 이벤트부터 이후 이벤트' },
    { value: 'all', label: `모든 "${title}" 이벤트에 대해 적용` },
  ] as const

  return createPortal(
    <Modal onClick={onCancel}>
      <S.ModalWrapper>
        <S.Title>이 변경사항을 어떻게 적용할까요?</S.Title>
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
          <S.CancelButton onClick={onCancel}>취소</S.CancelButton>
          <S.EditButton
            onClick={() => {
              onConfirm?.()
            }}
          >
            이벤트 수정
          </S.EditButton>
        </S.ButtonsContainer>
      </S.ModalWrapper>
    </Modal>,
    document.getElementById('modal-root')!,
  )
}

export default EditConfirmModal
