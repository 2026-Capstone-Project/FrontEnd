// ItemEditorModal을 일정 편집 모드로 여는 진입점 컴포넌트입니다.
import type { CalendarEvent } from '@/shared/types/calendar/types'
import ItemEditorModal from '@/shared/ui/Modals/ItemEditorModal'

type ScheduleEditorModalProps = Parameters<typeof ItemEditorModal>[0] & {
  event?: CalendarEvent | null
}

const ScheduleEditorModal = ({ event, ...props }: ScheduleEditorModalProps) => (
  <ItemEditorModal {...props} initialType="schedule" initialEvent={event} />
)

export default ScheduleEditorModal
