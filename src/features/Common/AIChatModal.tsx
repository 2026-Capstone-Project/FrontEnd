import { SparkleIcon } from '../Home/Icon/SparkleIcon'
import * as S from './AIChatModal.styles'

function AIChatModal() {
  return (
    <S.Container>
      <S.Title>
        <S.IconWrapper>
          <SparkleIcon startColor="#4684C1" endColor="#00DCCC" size={24} />
        </S.IconWrapper>
        AI 비서에게 일정을 맡기세요
      </S.Title>

      <S.ChatBox>{/* 채팅 메시지들이 들어갈 공간으로 비워두겠습니다 */}</S.ChatBox>

      <S.InputWrapper>
        <S.Input placeholder="예시) 내일 오후 3시 치과 진료 받으러 감" />
        <S.SendButton aria-label="전송">↑</S.SendButton>
      </S.InputWrapper>
    </S.Container>
  )
}

export default AIChatModal
