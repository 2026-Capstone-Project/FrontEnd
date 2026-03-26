// 할 일 편집 중 필요한 삭제 확인과 반복 수정 범위 확인 모달을 모아둔 컴포넌트입니다.
import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import { DeleteConfirmModal, EditConfirmModal, type EditConfirmOption } from '@/shared/ui/Modals'

type TodoEditorConfirmModalsProps = {
  deleteWarningVisible: boolean
  todoTitle?: string
  eventId: CalendarEvent['id']
  occurrenceDate: string
  isEditConfirmOpen: boolean
  isApplyConfirmOpen: boolean
  onCloseDelete: () => void
  onCancelEdit: () => void
  onConfirmEdit: (option: EditConfirmOption) => void
}

const TodoEditorConfirmModals = ({
  deleteWarningVisible,
  todoTitle,
  eventId,
  occurrenceDate,
  isEditConfirmOpen,
  isApplyConfirmOpen,
  onCloseDelete,
  onCancelEdit,
  onConfirmEdit,
}: TodoEditorConfirmModalsProps) => {
  const { useDeleteTodo } = useTodoMutations()
  const { mutate: deleteTodoMutate } = useDeleteTodo()

  return (
    <>
      {deleteWarningVisible && eventId != null && eventId !== 0 && (
        <DeleteConfirmModal
          title={todoTitle || '새로운 할 일'}
          onClose={onCloseDelete}
          target={{
            type: 'todo',
            id: eventId,
            occurrenceDate,
          }}
          mutate={deleteTodoMutate}
        />
      )}
      {(isEditConfirmOpen || isApplyConfirmOpen) && (
        <EditConfirmModal onCancel={onCancelEdit} onConfirm={onConfirmEdit} />
      )}
    </>
  )
}

export default TodoEditorConfirmModals
