import * as S from './TodoStatus.style'

const TodoStatus = ({ progress, total }: { progress: number; total: number }) => {
  return (
    <S.Wrapper>
      <S.Header>
        <S.Description>오늘의 할 일 진행 상황</S.Description>
        <S.Percentage>{Math.round((progress / total) * 100)} %</S.Percentage>
      </S.Header>
      <S.StatusBar>
        <S.StatusInfo width={(progress / total) * 100}>
          {total}개 중 {progress}개 완료
        </S.StatusInfo>
      </S.StatusBar>
    </S.Wrapper>
  )
}

export default TodoStatus
