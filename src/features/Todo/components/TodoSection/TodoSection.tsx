import Plus from '@/shared/assets/icons/plus.svg?react'
import { useGetTodoQuery } from '@/shared/hooks/query/useTodoQueries'
import AddTodoModal from '@/shared/ui/modal/AddTodo'

import { useTodoSectionState } from '../../hooks/useTodoSectionState'
import {
  formatYmd,
  getIsoDateWithOffset,
  getTodoDateLabel,
  getTodoDueDateTime,
} from '../../utils/todoDate'
import TodoCard from '../TodoCard/TodoCard'
import TodoFilterTabs from './TodoFilterTabs'
import * as S from './TodoSection.style'

const TodoSection = () => {
  const {
    todoFilter,
    setTodoFilter,
    isDesktop,
    addTodoDate,
    todoModalState,
    editingCardKey,
    openAddTodoModal,
    closeAddTodoModal,
  } = useTodoSectionState()
  const { data } = useGetTodoQuery(todoFilter)

  const todayIso = getIsoDateWithOffset(0)
  const todayYmd = formatYmd(new Date())

  return (
    <S.Wrapper>
      <S.Section>
        <S.Header>
          <TodoFilterTabs value={todoFilter} onChange={setTodoFilter} />
          <button
            className="add-button"
            type="button"
            onClick={() => openAddTodoModal({ date: todayIso, isEditing: false })}
          >
            <label>할 일 추가</label> <Plus color="white" width={15} height={15} />
          </button>
        </S.Header>
        <S.CardList>
          {data?.result.todos.map((todo) => (
            <TodoCard
              key={`${todo.todoId}-${todo.occurrenceDate}`}
              id={todo.todoId}
              title={todo.title}
              date={getTodoDateLabel(todo.occurrenceDate, todo.dueTime)}
              occurrenceDate={todo.occurrenceDate}
              isCompleted={todo.isCompleted}
              isHighlight={todo.occurrenceDate === todayYmd}
              isOverdue={
                !todo.isCompleted &&
                getTodoDueDateTime(todo.occurrenceDate, todo.dueTime, todo.isAllDay) < new Date()
              }
              priority={todo.priority}
              isRecurring={todo.isRecurring}
              onDoubleClick={() =>
                openAddTodoModal({
                  date: todo.occurrenceDate,
                  isEditing: true,
                  id: todo.todoId,
                  occurrenceDate: todo.occurrenceDate,
                })
              }
              isEditing={editingCardKey === `${todo.todoId}-${todo.occurrenceDate}`}
            />
          ))}
        </S.CardList>
      </S.Section>
      {todoModalState.open && (
        <AddTodoModal
          date={addTodoDate}
          onClose={closeAddTodoModal}
          eventId={todoModalState.id ?? 0}
          tabsVisible={false}
          isEditing={todoModalState.isEdit}
          mode={isDesktop ? 'inline' : 'modal'}
        />
      )}
    </S.Wrapper>
  )
}

export default TodoSection
