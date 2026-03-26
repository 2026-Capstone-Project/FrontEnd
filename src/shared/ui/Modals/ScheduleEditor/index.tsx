import type { CalendarEvent } from '@/shared/types/calendar/types'
import ItemEditorModal from '@/shared/ui/Modals/ItemEditorModal'

type ScheduleEditorModalProps = Parameters<typeof ItemEditorModal>[0] & {
  event?: CalendarEvent | null
}

const ScheduleEditorModal = ({ event, ...props }: ScheduleEditorModalProps) => (
  <ItemEditorModal {...props} initialType="schedule" initialEvent={event} />
)

export default ScheduleEditorModal
