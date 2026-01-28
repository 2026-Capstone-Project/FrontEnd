import { useState } from 'react'

import TodoCard from '../TodoCard/TodoCard'
import * as S from './TodoSection.style'

const TodoSection = () => {
  const [todoState, setTodoState] = useState<'ALL' | 'TODAY' | 'IMPORTANCE' | 'COMPLETED'>('ALL')
  return (
    <S.Wrapper>
      <S.Section>
        <S.Header>
          <S.StateButtonGroup>
            <S.StateButton onClick={() => setTodoState('ALL')} $isActive={todoState === 'ALL'}>
              전체
            </S.StateButton>
            <S.StateButton onClick={() => setTodoState('TODAY')} $isActive={todoState === 'TODAY'}>
              오늘
            </S.StateButton>
            <S.StateButton
              onClick={() => setTodoState('IMPORTANCE')}
              $isActive={todoState === 'IMPORTANCE'}
            >
              중요도
            </S.StateButton>
            <S.StateButton
              onClick={() => setTodoState('COMPLETED')}
              $isActive={todoState === 'COMPLETED'}
            >
              완료
            </S.StateButton>
          </S.StateButtonGroup>
          <button className="add-button">할 일 추가 +</button>
        </S.Header>
        <S.CardList>
          <TodoCard
            title="프로젝트 기획서 작성"
            date="오늘"
            isHighlight
            priority="HIGH"
            time="17:00"
          />
          <TodoCard
            title="영어 단어 암기"
            date="내일"
            priority="MEDIUM"
            repeat={true}
            repeatInfo="매일"
          />
          <TodoCard title="프로젝트 기획서 작성" date="내일" time="17:00" priority="LOW" />
          <TodoCard
            title="캡스톤 프로젝트 회의"
            repeat={true}
            repeatInfo="매주 목요일 22:00"
            date="내일"
            time="22:00"
            priority="HIGH"
          />
        </S.CardList>
      </S.Section>
    </S.Wrapper>
  )
}

export default TodoSection
