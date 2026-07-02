import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DateLocalizer, View } from 'react-big-calendar'

import type { CalendarEventActions } from '@/features/Calendar/components/Calendar/Calendar.types'
import type { CalendarEvent } from '@/shared/types/calendar/types'

import { getCalendarModalEvent } from '../utils/helpers/calendarModalEvent'
import { useCalendarApiEvents } from './useCalendarApiEvents'
import { useCalendarCreationHandlers } from './useCalendarCreationHandlers'
import { useCalendarDateCellWrapper } from './useCalendarDateCellWrapper'
import { useCalendarDateRange } from './useCalendarDateRange'
import { useCalendarDayViewTiming } from './useCalendarDayViewTiming'
import { useCalendarDeleteConfirm } from './useCalendarDeleteConfirm'
import { useCalendarDraftEvent } from './useCalendarDraftEvent'
import { useCalendarEvents } from './useCalendarEvents'
import { useCalendarKeyDelete } from './useCalendarKeyDelete'
import { useCalendarModal } from './useCalendarModal'
import { useCalendarMutations } from './useCalendarMutations'
import { useCalendarNavigation } from './useCalendarNavigation'
import { useCalendarRbcProps } from './useCalendarRbcProps'
import { useCalendarRecurringDropConfirm } from './useCalendarRecurringDropConfirm'
import { useCalendarResponsive } from './useCalendarResponsive'
import { useCalendarSelection } from './useCalendarSelection'
import { useCalendarTodoActions } from './useCalendarTodoActions'
import { useStoredCalendarView } from './useStoredCalendarView'

type UseCalendarControllerArgs = {
  localizer: DateLocalizer
  initialView?: View
  onSelectedDateChange?: (selectedDate: Date) => void
}

export const useCalendarController = ({
  localizer,
  initialView,
  onSelectedDateChange,
}: UseCalendarControllerArgs) => {
  // 1. Calendar range and server data
  const { view, setView } = useStoredCalendarView({ initialView })
  const [date, setDate] = useState<Date>(new Date())
  const { startDate, endDate } = useCalendarDateRange(view, date)
  const { events: apiEvents, refetch: refetchEvents } = useCalendarApiEvents(startDate, endDate)

  // 2. Server writes and local event state
  const {
    patchEventMutate,
    deleteEventMutate,
    patchCompleteTodoMutate,
    patchTodoTiming,
    deleteTodoMutate,
  } = useCalendarMutations()

  const {
    events,
    addEvent: enqueueEvent,
    moveEvent,
    resizeEvent,
    updateEventTime: updateLocalEventTime,
    updateEventColor,
    updateEventTiming,
    updateEventType,
    updateEventTitle,
    updateEventShared,
    toggleEventDone,
    removeEvent,
  } = useCalendarEvents({ initialEvents: apiEvents })

  // 3. Todo, delete, modal, and selection flows
  const isDesktop = useCalendarResponsive()
  const modalMode: 'modal' | 'inline' = isDesktop ? 'inline' : 'modal'
  const { handleToggleTodo } = useCalendarTodoActions({
    events,
    toggleEventDone,
    patchCompleteTodoMutate,
  })
  const {
    deleteConfirm,
    isRecurring,
    handleRemoveEvent,
    openDeleteConfirm,
    handleCloseDeleteConfirm,
  } = useCalendarDeleteConfirm({
    events,
    deleteEventMutate,
    refetchEvents,
  })

  const { modal, modalDate, isModalEditing, handleAddEvent, handleEventClick, handleCloseModal } =
    useCalendarModal({
      currentDate: date,
      removeEvent: handleRemoveEvent,
      isRecurring,
    })

  const handleOpenEventFromCalendar = useCallback(
    (event: CalendarEvent) => {
      if (!isModalEditing && modal.isOpen && modal.eventId != null) {
        removeEvent(modal.eventId)
      }
      handleEventClick(event)
    },
    [handleEventClick, isModalEditing, modal.eventId, modal.isOpen, removeEvent],
  )

  const {
    selectedDate,
    setSelectedDate,
    selectedEventId,
    setSelectedEventId,
    selectedEventKey,
    setSelectedEventKey,
    clearSelection,
    selectEvent,
    selectEventOnly,
  } = useCalendarSelection({
    onOpenEvent: handleOpenEventFromCalendar,
  })

  const { handleCloseModalWithCleanup, enqueueDraftEvent } = useCalendarDraftEvent({
    events,
    isModalEditing,
    modal,
    removeEvent,
    handleCloseModal,
    enqueueEvent,
    updateEventTiming,
  })

  const { handleDayViewEventTimeChange, handleDayViewEventTimePreview } = useCalendarDayViewTiming({
    events,
    patchEventMutate,
    patchTodoTiming,
    updateLocalEventTime,
  })

  // 4. Global keyboard and navigation side effects
  useCalendarKeyDelete({
    isModalOpen: modal.isOpen,
    date,
    events,
    selectedEventId,
    selectedEventKey,
    selectedDate,
    onClearSelection: clearSelection,
    onOpenRecurringConfirm: openDeleteConfirm,
    onRemoveEvent: handleRemoveEvent,
    onDeleteTodo: deleteTodoMutate,
  })

  const { onView, onNavigate, onSelectDate } = useCalendarNavigation({
    view,
    date,
    isDesktop,
    setView,
    setDate,
    setSelectedDate,
    setSelectedEventId,
    setSelectedEventKey,
  })

  // 5. View-specific handlers and react-big-calendar props
  const {
    dayViewWithHandlers,
    handleSelectSlotWrapper,
    handleWeekViewCreateEvent,
    handleWeekViewSelectDate,
  } = useCalendarCreationHandlers({
    view,
    enqueueEvent: enqueueDraftEvent,
    handleAddEvent,
    setSelectedDate,
    setSelectedEventId,
    setSelectedEventKey,
    updateEventTime: handleDayViewEventTimeChange,
    updateEventTimePreview: handleDayViewEventTimePreview,
    onToggleTodo: handleToggleTodo,
    selectedEventKey,
    selectEventOnly,
    selectEvent,
  })

  const DateCellWrapper = useCalendarDateCellWrapper({
    setDate,
    setSelectedEventId,
    setSelectedEventKey,
  })

  const {
    recurringDropConfirm,
    handleEventDrop,
    handleCloseRecurringDropConfirm,
    handleConfirmRecurringDrop,
  } = useCalendarRecurringDropConfirm({
    view,
    moveEvent,
    patchEventMutate,
    patchTodoTiming,
  })

  const { calendarProps } = useCalendarRbcProps({
    view,
    date,
    events,
    selectedEventKey,
    effectiveSelectedDate: selectedDate,
    onView,
    onNavigate,
    onSelectDate,
    onSelectEvent: selectEvent,
    onSelectEventOnly: selectEventOnly,
    onDoubleClickEvent: selectEvent,
    onDoubleClickDate: handleWeekViewCreateEvent,
    onSelectWeekDate: handleWeekViewSelectDate,
    onToggleTodo: handleToggleTodo,
    onSelectSlot: handleSelectSlotWrapper,
    onEventDrop: handleEventDrop,
    onEventResize: resizeEvent,
    dateCellWrapper: DateCellWrapper,
    dayViewComponent: dayViewWithHandlers,
    localizer,
  })

  // 6. Modal payloads exposed to the Calendar component
  const modalEvent = useMemo(
    () =>
      getCalendarModalEvent({
        events,
        modalEventId: modal.eventId,
        selectedEventKey,
      }),
    [events, modal.eventId, selectedEventKey],
  )
  const eventActions = useMemo<CalendarEventActions>(
    () => ({
      onEventColorChange: updateEventColor,
      onEventTitleConfirm: updateEventTitle,
      onEventSharedChange: updateEventShared,
      onEventTypeChange: updateEventType,
      onEventTimingChange: updateEventTiming,
    }),
    [updateEventColor, updateEventShared, updateEventTitle, updateEventType, updateEventTiming],
  )

  useEffect(() => {
    onSelectedDateChange?.(selectedDate ?? date)
  }, [date, onSelectedDateChange, selectedDate])

  return {
    view,
    date,
    calendarProps,
    modalDate,
    modalEventId: modal.eventId,
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
  }
}
