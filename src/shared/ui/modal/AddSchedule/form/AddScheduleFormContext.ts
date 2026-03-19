import type { CSSProperties, MouseEvent, RefObject } from 'react'
import { createContext, useContext, useMemo } from 'react'

import type { UseAddScheduleFormResult } from '@/shared/hooks/form/useAddScheduleForm'
import type { DatePickerField, TimePickerField } from '@/shared/types/event/event'
import type { RepeatConfigSchema } from '@/shared/types/event/event'
import type { RepeatConfig, RepeatType } from '@/shared/types/recurrence/repeat'

export type AddScheduleFormContextValue = {
  headerTitlePortalTarget?: HTMLElement | null
  searchPlacePortalTarget: Element | DocumentFragment | null
  searchPlacePortalPlacement: 'container' | 'viewport'
  isAllday: boolean
  startDate: string
  endDate: string
  eventStartDate: Date | null
  eventEndDate: Date | null
  eventStartTime?: string
  eventEndTime?: string
  activeCalendarField: DatePickerField | null
  calendarRef: RefObject<HTMLDivElement | null>
  portalPosition: { top: number; left: number } | null
  calendarPortalStyle?: CSSProperties
  handleCalendarButtonClick: (
    field: DatePickerField,
  ) => (event: MouseEvent<HTMLButtonElement>) => void
  handleDateSelect: (selectedDate: Date) => void
  handleTimeChange: (field: TimePickerField, value: string) => void
  handleAllDayToggle: () => void
  mapButtonRef: RefObject<HTMLButtonElement | null>
  handleMapButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
  closeSearchPlace: () => void
  isSearchPlaceOpen: boolean
  mapRef: RefObject<HTMLDivElement | null>
  repeatConfig: RepeatConfigSchema
  updateConfig: (changes: Partial<RepeatConfig>) => void
  handleRepeatType: (value: RepeatType) => void
  onTitleConfirm: (value: string) => void
}

const AddScheduleFormContext = createContext<AddScheduleFormContextValue | null>(null)

export const useAddScheduleFormContext = () => {
  const context = useContext(AddScheduleFormContext)
  if (!context) {
    throw new Error('useAddScheduleFormContext must be used within AddScheduleFormProvider')
  }
  return context
}

type AddScheduleFormContextInput = {
  schedule: UseAddScheduleFormResult
  headerTitlePortalTarget?: HTMLElement | null
  startDate: string
  endDate: string
  portal: {
    portalPosition: { top: number; left: number } | null
    calendarPortalStyle?: CSSProperties
    handleCalendarButtonClick: (
      field: DatePickerField,
    ) => (event: MouseEvent<HTMLButtonElement>) => void
    handleDateSelect: (selectedDate: Date) => void
    handleTimeChange: (field: TimePickerField, value: string) => void
    mapButtonRef: RefObject<HTMLButtonElement | null>
    handleMapButtonClick: (event: MouseEvent<HTMLButtonElement>) => void
    searchPlacePortalTarget: Element | DocumentFragment | null
    searchPlacePortalPlacement: 'container' | 'viewport'
  }
  handleAllDayToggle: () => void
  onTitleConfirm: (value: string) => void
}

export const useAddScheduleFormContextValue = ({
  schedule,
  headerTitlePortalTarget,
  startDate,
  endDate,
  portal,
  handleAllDayToggle,
  onTitleConfirm,
}: AddScheduleFormContextInput) => {
  return useMemo<AddScheduleFormContextValue>(
    () => ({
      headerTitlePortalTarget,
      searchPlacePortalTarget: portal.searchPlacePortalTarget,
      searchPlacePortalPlacement: portal.searchPlacePortalPlacement,
      isAllday: schedule.isAllday,
      startDate,
      endDate,
      eventStartDate: schedule.eventStartDate,
      eventEndDate: schedule.eventEndDate,
      eventStartTime: schedule.eventStartTime,
      eventEndTime: schedule.eventEndTime,
      activeCalendarField: schedule.activeCalendarField,
      calendarRef: schedule.calendarRef,
      portalPosition: portal.portalPosition,
      calendarPortalStyle: portal.calendarPortalStyle,
      handleCalendarButtonClick: portal.handleCalendarButtonClick,
      handleDateSelect: portal.handleDateSelect,
      handleTimeChange: portal.handleTimeChange,
      handleAllDayToggle,
      mapButtonRef: portal.mapButtonRef,
      handleMapButtonClick: portal.handleMapButtonClick,
      closeSearchPlace: schedule.closeSearchPlace,
      isSearchPlaceOpen: schedule.isSearchPlaceOpen,
      mapRef: schedule.mapRef,
      repeatConfig: schedule.repeatConfig,
      updateConfig: schedule.updateConfig,
      handleRepeatType: schedule.handleRepeatType,
      onTitleConfirm,
    }),
    [
      endDate,
      handleAllDayToggle,
      headerTitlePortalTarget,
      onTitleConfirm,
      portal.calendarPortalStyle,
      portal.handleCalendarButtonClick,
      portal.handleDateSelect,
      portal.handleMapButtonClick,
      portal.handleTimeChange,
      portal.mapButtonRef,
      portal.portalPosition,
      portal.searchPlacePortalPlacement,
      portal.searchPlacePortalTarget,
      schedule.closeSearchPlace,
      schedule.activeCalendarField,
      schedule.calendarRef,
      schedule.eventEndDate,
      schedule.eventEndTime,
      schedule.eventStartDate,
      schedule.eventStartTime,
      schedule.handleRepeatType,
      schedule.isAllday,
      schedule.isSearchPlaceOpen,
      schedule.mapRef,
      schedule.repeatConfig,
      schedule.updateConfig,
      startDate,
    ],
  )
}

export { AddScheduleFormContext }
