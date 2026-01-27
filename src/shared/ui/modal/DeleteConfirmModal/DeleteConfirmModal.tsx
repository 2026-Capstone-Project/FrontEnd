import Modal from '../../common/Modal/Modal'
import * as S from './DeleteConfirmModal.style'
const DeleteConfirmModal = ({ onClose, title }: { onClose: () => void; title: string }) => {
  return (
    <Modal onClick={onClose}>
      <S.ModalWrapper>
        <S.Title>반복 일정 "{title}" 삭제</S.Title>
        <S.OptionsContainer>
          <S.OptionWrapper>
            <input type="radio" />
            <S.OptionLabel htmlFor="">이 이벤트</S.OptionLabel>
          </S.OptionWrapper>
          <S.OptionWrapper>
            <input type="radio" />
            <S.OptionLabel htmlFor="">이 이벤트부터 이후 이벤트</S.OptionLabel>
          </S.OptionWrapper>
          <S.OptionWrapper>
            <input type="radio" />
            <S.OptionLabel htmlFor="">모든 이벤트</S.OptionLabel>
          </S.OptionWrapper>
        </S.OptionsContainer>
        <S.ButtonsContainer>
          <S.CancelButton>취소</S.CancelButton>
          <S.DeleteButton>이벤트 삭제</S.DeleteButton>
        </S.ButtonsContainer>
      </S.ModalWrapper>
    </Modal>
  )
}

export default DeleteConfirmModal
