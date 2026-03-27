import * as S from './TodoStatus.style'

const TodoStatus = ({ progress, total }: { progress: number; total: number }) => {
  const hasTodayTodos = total > 0
  const percent = hasTodayTodos ? Math.round((progress / total) * 100) : 0

  return (
    <S.Wrapper>
      <S.Header>
        <S.Description>오늘의 할 일 진행 상황</S.Description>
        {hasTodayTodos && <S.Percentage>{percent} %</S.Percentage>}
      </S.Header>
      {hasTodayTodos ? (
        <S.StatusBar>
          {progress > 0 && (
            <S.StatusInfo width={(progress / total) * 100}>
              {total}개 중 {progress}개 완료
            </S.StatusInfo>
          )}
        </S.StatusBar>
      ) : (
        <S.EmptyState>
          <S.DotRow aria-hidden="true">
            <S.Dot $index={0} />
            <S.Dot $index={1} />
            <S.Dot $index={2} />
          </S.DotRow>
          <S.EmptyMessage>오늘 등록된 할 일이 없어요, 새로운 할 일을 추가해보세요.</S.EmptyMessage>
        </S.EmptyState>
      )}
    </S.Wrapper>
  )
}

export default TodoStatus
