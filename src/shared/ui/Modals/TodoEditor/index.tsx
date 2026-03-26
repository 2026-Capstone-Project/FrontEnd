// ItemEditorModal을 할 일 편집 모드로 여는 진입점 컴포넌트입니다.
import ItemEditorModal from '@/shared/ui/Modals/ItemEditorModal'

const TodoEditorModal = (props: Parameters<typeof ItemEditorModal>[0]) => (
  <ItemEditorModal {...props} initialType="todo" />
)

export default TodoEditorModal
