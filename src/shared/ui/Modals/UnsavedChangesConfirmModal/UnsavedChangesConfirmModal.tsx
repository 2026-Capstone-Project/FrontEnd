import Modal from '@/shared/ui/common/Modal/Modal'

import * as S from './UnsavedChangesConfirmModal.style'

type UnsavedChangesConfirmModalProps = {
  target: 'schedule' | 'todo'
  isEditing: boolean
  onClose: () => void
  onConfirmLeave: () => void
}

const UnsavedChangesConfirmModal = ({
  target,
  isEditing,
  onClose,
  onConfirmLeave,
}: UnsavedChangesConfirmModalProps) => {
  const noun = target === 'schedule' ? '일정' : '할 일'
  const title = isEditing ? '변경사항이 있어요.' : `작성 중인 ${noun}이 있어요.`
  const description = isEditing
    ? '저장하지 않으면 기존 내용으로 유지됩니다.'
    : `저장하지 않고 나가면 입력한 내용이 사라집니다.`
  const keepLabel = isEditing ? '계속 수정하기' : '계속 작성하기'

  return (
    <Modal onClick={onClose}>
      <S.Card>
        <S.Title>{title}</S.Title>
        <S.Description>{description}</S.Description>
        <S.ButtonRow>
          <S.KeepButton type="button" onClick={onClose}>
            {keepLabel}
          </S.KeepButton>
          <S.LeaveButton type="button" onClick={onConfirmLeave}>
            나가기
          </S.LeaveButton>
        </S.ButtonRow>
      </S.Card>
    </Modal>
  )
}

export default UnsavedChangesConfirmModal
