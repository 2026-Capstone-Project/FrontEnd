import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import { DeleteConfirmModal, EditConfirmModal, type EditConfirmOption } from '@/shared/ui/modal'

type ScheduleConfirmModalsProps = {
  deleteWarningVisible: boolean
  eventTitle?: string
  eventId: number
  occurrenceDate: string
  isEditConfirmOpen: boolean
  isApplyConfirmOpen: boolean
  onCloseDelete: () => void
  onCancelEdit: () => void
  onConfirmEdit: (option: EditConfirmOption) => void
}

const ScheduleConfirmModals = ({
  deleteWarningVisible,
  eventTitle,
  eventId,
  occurrenceDate,
  isEditConfirmOpen,
  isApplyConfirmOpen,
  onCloseDelete,
  onCancelEdit,
  onConfirmEdit,
}: ScheduleConfirmModalsProps) => {
  const { useDeleteEvent } = useCalendarMutation()
  const { mutate: deleteEventMutate } = useDeleteEvent()

  return (
    <>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={eventTitle || '새로운 이벤트'}
          onClose={onCloseDelete}
          target={{ type: 'event', id: eventId, occurrenceDate }}
          mutate={deleteEventMutate}
        />
      )}
      {(isEditConfirmOpen || isApplyConfirmOpen) && (
        <EditConfirmModal onCancel={onCancelEdit} onConfirm={onConfirmEdit} />
      )}
    </>
  )
}
export default ScheduleConfirmModals
