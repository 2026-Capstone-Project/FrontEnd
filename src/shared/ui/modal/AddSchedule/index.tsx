import type { CalendarEvent } from '@/shared/types/calendar/types'
import AddItemModal from '@/shared/ui/modal/AddItem'

type AddScheduleModalProps = Parameters<typeof AddItemModal>[0] & {
  event?: CalendarEvent | null
}

const AddScheduleModal = ({ event, ...props }: AddScheduleModalProps) => (
  <AddItemModal {...props} defaultType="schedule" initialEvent={event} />
)

export default AddScheduleModal
