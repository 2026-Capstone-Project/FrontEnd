import AddItemModal from '@/shared/ui/modal/AddItem'

const AddTodoModal = (props: Parameters<typeof AddItemModal>[0]) => (
  <AddItemModal {...props} defaultType="todo" />
)

export default AddTodoModal
