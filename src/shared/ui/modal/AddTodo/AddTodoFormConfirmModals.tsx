import { useTodoMutations } from '@/shared/hooks/query/useTodoMutations'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import { DeleteConfirmModal, EditConfirmModal, type EditConfirmOption } from '@/shared/ui/modal'

type AddTodoFormConfirmModalsProps = {
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

const AddTodoFormConfirmModals = ({
  deleteWarningVisible,
  todoTitle,
  eventId,
  occurrenceDate,
  isEditConfirmOpen,
  isApplyConfirmOpen,
  onCloseDelete,
  onCancelEdit,
  onConfirmEdit,
}: AddTodoFormConfirmModalsProps) => {
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

export default AddTodoFormConfirmModals
