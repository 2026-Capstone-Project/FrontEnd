import type { UseMutateFunction } from '@tanstack/react-query'
import type { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop'

import type { RecurrenceEventSeriesScope } from '@/shared/constants/recurrenceScope'
import type { CalendarEvent } from '@/shared/types/calendar/types'
import { EditConfirmModal, type EditConfirmOption } from '@/shared/ui/Modals'
import DeleteConfirmModal from '@/shared/ui/Modals/DeleteConfirmModal/DeleteConfirmModal'

type EventDeleteVariables = {
  eventId: number
  params: {
    scope?: RecurrenceEventSeriesScope
    occurrenceDate: string
  }
}

type DeleteConfirmState = {
  isOpen: boolean
  eventId: CalendarEvent['id'] | null
  title: string
  occurrenceDate: string
}

type RecurringDropConfirmState = {
  isOpen: boolean
  target: 'event' | 'todo'
  args: EventInteractionArgs<CalendarEvent> | null
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
