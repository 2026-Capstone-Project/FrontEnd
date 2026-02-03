/** @JSXImportSource @emotion/react */
import type { Ref } from 'react'

import Check from '@/shared/assets/icons/check.svg?react'
import Close from '@/shared/assets/icons/close.svg?react'
import Trash from '@/shared/assets/icons/trash-2.svg?react'

import * as S from './AddModalLayout.style'
const AddModalLayout = ({
  onClose,
  children,
  type,
  footerChildren,
  submitFormId,
  handleDelete,
  headerExtras,
  mode,
  headerTitleContainerRef,
}: {
  onClose: () => void
  children: React.ReactNode
  type: 'todo' | 'schedule'
  footerChildren?: React.ReactNode
  submitFormId?: string
  mode: 'modal' | 'inline'
  handleDelete?: () => void
  headerExtras?: React.ReactNode
  headerTitleContainerRef?: Ref<HTMLDivElement>
}) => {
  const layoutContent = (
    <S.ModalInner
      onClick={(event) => {
        event.stopPropagation()
      }}
    >
      <S.ModalWrapper mode={mode}>
        <S.ModalHeader>
          <S.TitleWrapper>
            <S.ModalHeaderTitle>
              <S.HeaderTitleWrapper ref={headerTitleContainerRef} />
            </S.ModalHeaderTitle>
            <Close onClick={onClose} />
          </S.TitleWrapper>
          {headerExtras && <S.HeaderExtras>{headerExtras}</S.HeaderExtras>}
        </S.ModalHeader>

        <S.ModalContent>{children}</S.ModalContent>
        <S.ModalFooter>
          <S.FooterLeft>{type === 'schedule' && footerChildren}</S.FooterLeft>
          <S.FooterRight>
            <Trash onClick={handleDelete} css={{ cursor: 'pointer' }} color="#757575" />
            <S.Button type="submit" form={submitFormId}>
              <Check color="#ffffff" />
            </S.Button>
          </S.FooterRight>
        </S.ModalFooter>
      </S.ModalWrapper>
    </S.ModalInner>
  )
  return mode === 'inline' ? (
    <S.InlineWrapper>{layoutContent}</S.InlineWrapper>
  ) : (
    <S.ModalOverlay onClick={onClose}>{layoutContent}</S.ModalOverlay>
  )
}

export default AddModalLayout
