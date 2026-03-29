import moment from 'moment'

import { useCalendarMutation } from '@/shared/hooks/query/useCalendarMutation'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import { DeleteConfirmModal, EditConfirmModal, type EditConfirmOption } from '@/shared/ui/modal'

type AddScheduleFormConfirmModalsProps = {
  deleteWarningVisible: boolean
  eventTitle?: string
  occurrenceDate: string
  eventId: CalendarEvent['id']
  isEditConfirmOpen: boolean
  isApplyConfirmOpen: boolean
  onCloseDelete: () => void
  onCancelEdit: () => void
  onConfirmEdit: (option: EditConfirmOption) => void
}

const AddScheduleFormConfirmModals = ({
  deleteWarningVisible,
  eventTitle,
  occurrenceDate,
  eventId,
  isEditConfirmOpen,
  isApplyConfirmOpen,
  onCloseDelete,
  onCancelEdit,
  onConfirmEdit,
}: AddScheduleFormConfirmModalsProps) => {
  const { useDeleteEvent } = useCalendarMutation()
  const { mutate: deleteEventMutate } = useDeleteEvent()
  const normalizedOccurrenceDate = occurrenceDate
    ? moment(occurrenceDate).format('YYYY-MM-DDTHH:mm:ss')
    : ''

  return (
    <>
      {deleteWarningVisible && (
        <DeleteConfirmModal
          title={eventTitle || '새로운 이벤트'}
          onClose={onCloseDelete}
          target={{ type: 'event', id: eventId, occurrenceDate: normalizedOccurrenceDate }}
          mutate={deleteEventMutate}
        />
      )}
      {(isEditConfirmOpen || isApplyConfirmOpen) && (
        <EditConfirmModal onCancel={onCancelEdit} onConfirm={onConfirmEdit} />
      )}
    </>
  )
}

export default AddScheduleFormConfirmModals
