import Check from '@/shared/assets/icons/check.svg?react'
import Close from '@/shared/assets/icons/close.svg?react'
import Trash from '@/shared/assets/icons/trash-2.svg?react'

import * as S from './AddModalLayout.style'
const AddModalLayout = ({
  title,
  onClose,
  children,
  type,
  footerChildren,
  submitFormId,
}: {
  title?: string
  onClose: () => void
  children: React.ReactNode
  type: 'todo' | 'schedule'
  footerChildren?: React.ReactNode
  submitFormId?: string
}) => {
  // TODO: Button -> 추후 공용 컴포넌트로 분리 필요
  const modalTitle = title ? title : type === 'todo' ? '새로운 할 일' : '새로운 일정'
  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalInner
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <S.ModalWrapper>
          <S.ModalHeader>
            <S.ModalTitle>{modalTitle}</S.ModalTitle>
            <Close onClick={onClose} />
          </S.ModalHeader>
          <S.ModalContent>{children}</S.ModalContent>
          <S.ModalFooter>
            <S.FooterLeft>{type === 'schedule' && footerChildren}</S.FooterLeft>
            <S.FooterRight>
              <Trash />
              <S.Button type="submit" form={submitFormId}>
                <Check />
              </S.Button>
            </S.FooterRight>
          </S.ModalFooter>
        </S.ModalWrapper>
      </S.ModalInner>
    </S.ModalOverlay>
  )
}

export default AddModalLayout
