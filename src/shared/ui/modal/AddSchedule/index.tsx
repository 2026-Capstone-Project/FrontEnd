import AddItemModal from '@/shared/ui/modal/AddItem'

const AddScheduleModal = (props: Parameters<typeof AddItemModal>[0]) => (
  <AddItemModal {...props} defaultType="schedule" />
)

export default AddScheduleModal
