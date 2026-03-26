import ItemEditorModal from '@/shared/ui/Modals/ItemEditorModal'

const TodoEditorModal = (props: Parameters<typeof ItemEditorModal>[0]) => (
  <ItemEditorModal {...props} initialType="todo" />
)

export default TodoEditorModal
