import { useEffect, useMemo, useState } from 'react'
import type { DateLocalizer } from 'react-big-calendar'

import type { CalendarEventActions } from '@/features/Calendar/components/CustomCalendar/CustomCalendar.types'
import { useCalendarApiEvents } from '@/features/Calendar/hooks/useCalendarApiEvents'
import { useCalendarDateCellWrapper } from '@/features/Calendar/hooks/useCalendarDateCellWrapper'
import { useCalendarDateRange } from '@/features/Calendar/hooks/useCalendarDateRange'
import { useCalendarDayViewTiming } from '@/features/Calendar/hooks/useCalendarDayViewTiming'
import { useCalendarDeleteConfirm } from '@/features/Calendar/hooks/useCalendarDeleteConfirm'
import { useCalendarDraftEvent } from '@/features/Calendar/hooks/useCalendarDraftEvent'
import { useCalendarEvents } from '@/features/Calendar/hooks/useCalendarEvents'
import { useCalendarKeyDelete } from '@/features/Calendar/hooks/useCalendarKeyDelete'
import { useCalendarModal } from '@/features/Calendar/hooks/useCalendarModal'
import { useCalendarNavigation } from '@/features/Calendar/hooks/useCalendarNavigation'
import { useCalendarRbcProps } from '@/features/Calendar/hooks/useCalendarRbcProps'
import { useCalendarRecurringDropConfirm } from '@/features/Calendar/hooks/useCalendarRecurringDropConfirm'
import { useCalendarResponsive } from '@/features/Calendar/hooks/useCalendarResponsive'
import { useCalendarSelectionBridge } from '@/features/Calendar/hooks/useCalendarSelectionBridge'
import { useCalendarTodoActions } from '@/features/Calendar/hooks/useCalendarTodoActions'
import { useCalendarViewCreationHandlers } from '@/features/Calendar/hooks/useCalendarViewCreationHandlers'
import { useCustomCalendarMutations } from '@/features/Calendar/hooks/useCustomCalendarMutations'
import { useStoredCalendarView } from '@/features/Calendar/hooks/useStoredCalendarView'
import { getCalendarModalEvent } from '@/features/Calendar/utils/helpers/calendarModalEvent'

type UseCustomCalendarControllerArgs = {
  localizer: DateLocalizer
  onSelectedDateChange?: (selectedDate: Date) => void
}

export const useCustomCalendarController = ({
  localizer,
  onSelectedDateChange,
}: UseCustomCalendarControllerArgs) => {
  const { view, setView } = useStoredCalendarView()
  const [date, setDate] = useState<Date>(new Date())
  const { startDate, endDate } = useCalendarDateRange(view, date)
  const { events: apiEvents, refetch: refetchEvents } = useCalendarApiEvents(startDate, endDate)
  const {
    patchEventMutate,
    deleteEventMutate,
    patchCompleteTodoMutate,
    patchTodoTiming,
    deleteTodoMutate,
  } = useCustomCalendarMutations()

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
  } = useCalendarSelectionBridge({
    isModalEditing,
    isModalOpen: modal.isOpen,
    modalEventId: modal.eventId,
    removeEvent,
    handleEventClick,
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

  const {
    dayViewWithHandlers,
    handleSelectSlotWrapper,
    handleWeekViewCreateEvent,
    handleWeekViewSelectDate,
  } = useCalendarViewCreationHandlers({
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
