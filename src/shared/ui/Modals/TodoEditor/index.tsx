// ItemEditorModal을 할 일 편집 모드로 여는 진입점 컴포넌트입니다.
import type { CalendarEvent } from '@/shared/types/calendar/types'
import ItemEditorModal from '@/shared/ui/Modals/ItemEditorModal'

type TodoEditorModalProps = Parameters<typeof ItemEditorModal>[0] & {
  event?: CalendarEvent | null
}

const TodoEditorModal = ({ event, ...props }: TodoEditorModalProps) => (
  <ItemEditorModal {...props} initialType="todo" initialEvent={event} />
)

export default TodoEditorModal
