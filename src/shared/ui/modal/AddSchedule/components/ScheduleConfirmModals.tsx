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
}: ScheduleConfirmModalsProps) => (
  <>
    {deleteWarningVisible && (
      <DeleteConfirmModal
        occurrenceDate={occurrenceDate}
        eventId={eventId}
        title={eventTitle || '새로운 이벤트'}
        onClose={onCloseDelete}
      />
    )}
    {(isEditConfirmOpen || isApplyConfirmOpen) && (
      <EditConfirmModal
        title={eventTitle || '일정'}
        onCancel={onCancelEdit}
        onConfirm={onConfirmEdit}
      />
    )}
  </>
)

export default ScheduleConfirmModals
