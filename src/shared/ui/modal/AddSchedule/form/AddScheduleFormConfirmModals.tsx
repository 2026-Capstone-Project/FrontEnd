import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EditConfirmOption } from '@/shared/ui/modal'
import { formatIsoDate } from '@/shared/utils/date'

import ScheduleConfirmModals from './ScheduleConfirmModals'

type AddScheduleFormConfirmModalsProps = {
  deleteWarningVisible: boolean
  eventTitle?: string
  eventStartDate: Date | null
  eventId: CalendarEvent['id']
  isEditConfirmOpen: boolean
  isApplyConfirmOpen: boolean
  onCloseDelete: () => void
  onCancelEdit: () => void
  onConfirmEdit: (option: EditConfirmOption) => void
}

const AddScheduleFormConfirmModals = ({
  deleteWarningVisible,
  eventTitle,
  eventStartDate,
  eventId,
  isEditConfirmOpen,
  isApplyConfirmOpen,
  onCloseDelete,
  onCancelEdit,
  onConfirmEdit,
}: AddScheduleFormConfirmModalsProps) => {
  return (
    <ScheduleConfirmModals
      deleteWarningVisible={deleteWarningVisible}
      // 반복 일정 적용 모달에 보여줄 타이틀
      eventTitle={eventTitle}
      // 반복 일정 적용 시 기준이 되는 occurrenceDate
      occurrenceDate={eventStartDate ? formatIsoDate(eventStartDate) : ''}
      eventId={eventId}
      isEditConfirmOpen={isEditConfirmOpen}
      isApplyConfirmOpen={isApplyConfirmOpen}
      onCloseDelete={onCloseDelete}
      onCancelEdit={onCancelEdit}
      onConfirmEdit={onConfirmEdit}
    />
  )
}

export default AddScheduleFormConfirmModals
