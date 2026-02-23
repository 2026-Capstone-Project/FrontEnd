import moment from 'moment'

import type { CalendarEvent } from '@/shared/types/calendar/types'
import type { EditConfirmOption } from '@/shared/ui/modal'

import ScheduleConfirmModals from './ScheduleConfirmModals'

type AddScheduleFormConfirmModalsProps = {
  deleteWarningVisible: boolean
  eventTitle?: string
  occurrenceDate: string
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
  occurrenceDate,
  eventId,
  isEditConfirmOpen,
  isApplyConfirmOpen,
  onCloseDelete,
  onCancelEdit,
  onConfirmEdit,
}: AddScheduleFormConfirmModalsProps) => {
  const normalizedOccurrenceDate = occurrenceDate
    ? moment(occurrenceDate).format('YYYY-MM-DDTHH:mm:ss')
    : ''

  return (
    <ScheduleConfirmModals
      deleteWarningVisible={deleteWarningVisible}
      // 반복 일정 적용 모달에 보여줄 타이틀
      eventTitle={eventTitle}
      // 반복 일정 삭제/수정 시 기준이 되는 태생 occurrenceDate
      occurrenceDate={normalizedOccurrenceDate}
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
