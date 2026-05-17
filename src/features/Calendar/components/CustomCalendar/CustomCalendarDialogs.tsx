import type { UseMutateFunction } from '@tanstack/react-query'

import type { RecurrenceEventSeriesScope } from '@/shared/constants/recurrenceScope'
import { EditConfirmModal, type EditConfirmOption } from '@/shared/ui/Modals'
import DeleteConfirmModal from '@/shared/ui/Modals/DeleteConfirmModal/DeleteConfirmModal'

import type { DeleteConfirmState, RecurringDropConfirmState } from './CustomCalendar.types'

type EventDeleteVariables = {
  eventId: number
  params: {
    scope?: RecurrenceEventSeriesScope
    occurrenceDate: string
  }
}

type CustomCalendarDialogsProps = {
  deleteConfirm: DeleteConfirmState
  onCloseDeleteConfirm: () => void
  deleteEventMutate: UseMutateFunction<unknown, unknown, EventDeleteVariables, unknown>
  recurringDropConfirm: RecurringDropConfirmState
  onCloseRecurringDropConfirm: () => void
  onConfirmRecurringDrop: (option: EditConfirmOption) => void
}

const CustomCalendarDialogs = ({
  deleteConfirm,
  onCloseDeleteConfirm,
  deleteEventMutate,
  recurringDropConfirm,
  onCloseRecurringDropConfirm,
  onConfirmRecurringDrop,
}: CustomCalendarDialogsProps) => (
  <>
    {deleteConfirm.isOpen && deleteConfirm.eventId != null && (
      <DeleteConfirmModal
        onClose={onCloseDeleteConfirm}
        title={deleteConfirm.title}
        target={{
          type: 'event',
          id: deleteConfirm.eventId,
          occurrenceDate: deleteConfirm.occurrenceDate,
        }}
        mutate={deleteEventMutate}
      />
    )}
    {recurringDropConfirm.isOpen && (
      <EditConfirmModal onCancel={onCloseRecurringDropConfirm} onConfirm={onConfirmRecurringDrop} />
    )}
  </>
)

export default CustomCalendarDialogs
