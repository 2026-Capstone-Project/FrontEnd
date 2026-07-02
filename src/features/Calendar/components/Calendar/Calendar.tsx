/** @jsxImportSource @emotion/react */
import 'moment/locale/ko'
import 'react-big-calendar/lib/css/react-big-calendar.css'

import moment from 'moment'
import type { View } from 'react-big-calendar'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import { useCalendarController } from '@/features/Calendar/hooks/useCalendarController'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import * as S from './Calendar.style'
import CalendarDialogs from './CalendarDialogs'
import CalendarMobileActions from './CalendarMobileActions'
import CalendarModals from './CalendarModals'

moment.locale('ko')
const localizer = momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop<CalendarEvent, object>(Calendar)
export type { SelectDateSource } from './Calendar.types'

type CustomCalendarProps = {
  initialView?: View
  onSelectedDateChange?: (selectedDate: Date) => void
}

const CustomCalendar = ({ initialView, onSelectedDateChange }: CustomCalendarProps) => {
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
  } = useCalendarController({ localizer, initialView, onSelectedDateChange })

  return (
    <div css={{ position: 'relative', height: 'fit-content', width: '100%' }}>
      <CalendarMobileActions
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
      <CalendarDialogs
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
