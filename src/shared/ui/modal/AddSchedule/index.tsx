import type { Event } from '@/shared/types/calendar/types'
import AddItemModal from '@/shared/ui/modal/AddItem'

type AddScheduleModalProps = Parameters<typeof AddItemModal>[0] & {
  event?: Event | null
}

const AddScheduleModal = ({ event, ...props }: AddScheduleModalProps) => (
  <AddItemModal {...props} defaultType="schedule" initialEvent={event} />
)

export default AddScheduleModal
