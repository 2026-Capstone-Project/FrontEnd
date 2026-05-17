/** @jsxImportSource @emotion/react */
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { useCustomCalendarController } from '@/features/Calendar/hooks/useCustomCalendarController'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import CalendarModals from './CalendarModals'
import * as S from './CustomCalendar.style'
import CustomCalendarDialogs from './CustomCalendarDialogs'
import CustomCalendarMobileActions from './CustomCalendarMobileActions'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)
export type { SelectDateSource } from './CustomCalendar.types'

type CustomCalendarProps = {
  onSelectedDateChange?: (selectedDate: Date) => void
}

const CustomCalendar = ({ onSelectedDateChange }: CustomCalendarProps) => {
  const {
    view,
    date,
    calendarProps,
    modalDate,
    modalEventId,
    modalEvent,
    isModalEditing,
    modalMode,
    eventActions,
    deleteConfirm,
    recurringDropConfirm,
    deleteEventMutate,
    handleAddEvent,
    handleCloseModalWithCleanup,
    handleCloseDeleteConfirm,
    handleCloseRecurringDropConfirm,
    handleConfirmRecurringDrop,
    onView,
  } = useCustomCalendarController({ localizer, onSelectedDateChange })

  return (
    <div css={{ position: 'relative', height: 'fit-content', width: '100%' }}>
      <CustomCalendarMobileActions
        view={view}
        onView={onView}
        currentDate={date}
        onAddEvent={handleAddEvent}
      />
      <S.CalendarWrapper view={view}>
        <DragAndDropCalendar {...calendarProps} />
      </S.CalendarWrapper>
      <CalendarModals
        modalDate={modalDate}
        modalEventId={modalEventId}
        modalEvent={modalEvent}
        isModalEditing={isModalEditing}
        modalMode={modalMode}
        onCloseModal={handleCloseModalWithCleanup}
        eventActions={eventActions}
      />
      <CustomCalendarDialogs
        deleteConfirm={deleteConfirm}
        onCloseDeleteConfirm={handleCloseDeleteConfirm}
        deleteEventMutate={deleteEventMutate}
        recurringDropConfirm={recurringDropConfirm}
        onCloseRecurringDropConfirm={handleCloseRecurringDropConfirm}
        onConfirmRecurringDrop={handleConfirmRecurringDrop}
      />
    </div>
  )
}

export default CustomCalendar
