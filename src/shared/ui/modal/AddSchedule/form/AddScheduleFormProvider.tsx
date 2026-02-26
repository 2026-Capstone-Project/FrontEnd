import type { ReactNode } from 'react'

import {
  AddScheduleFormContext,
  type AddScheduleFormContextValue,
} from '@/shared/ui/modal/AddSchedule/form/AddScheduleFormContext'

type AddScheduleFormProviderProps = {
  value: AddScheduleFormContextValue
  children: ReactNode
}

export const AddScheduleFormProvider = ({ value, children }: AddScheduleFormProviderProps) => {
  return <AddScheduleFormContext.Provider value={value}>{children}</AddScheduleFormContext.Provider>
}
