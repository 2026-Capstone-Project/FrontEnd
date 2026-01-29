import * as S from './Modal.styles'

interface TModalprops {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
}

function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText,
  isDanger = false,
}: TModalprops) {
  if (!isOpen) return null

  const hasButtons = confirmText || cancelText

  return (
    <S.Overlay onClick={onClose}>
      <S.ModalContainer onClick={(e) => e.stopPropagation()}>
        <S.Title>{title}</S.Title>
        {description && <S.Description>{description}</S.Description>}

        {hasButtons && (
          <S.ButtonGroup>
            {cancelText && <S.CancelButton onClick={onClose}>{cancelText}</S.CancelButton>}
            {confirmText && onConfirm && (
              <S.ConfirmButton $isDanger={isDanger} onClick={onConfirm}>
                {confirmText}
              </S.ConfirmButton>
            )}
          </S.ButtonGroup>
        )}
      </S.ModalContainer>
    </S.Overlay>
  )
}

export default Modal
