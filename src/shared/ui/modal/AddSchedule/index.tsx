import type { CalendarEvent } from '@/features/Calendar/domain/types'
import AddItemModal from '@/shared/ui/modal/AddItem'

type AddScheduleModalProps = Parameters<typeof AddItemModal>[0] & {
  event?: CalendarEvent | null
}

const AddScheduleModal = ({ event, ...props }: AddScheduleModalProps) => (
  <AddItemModal {...props} defaultType="schedule" initialEvent={event} />
)

export default AddScheduleModal
