import { useCallback } from 'react'
import { type UseFormReturn } from 'react-hook-form'

import { type AddScheduleFormValues, type EventColorType } from '@/shared/types/event'
import {
  type CustomRepeatBasis,
  type RepeatConfig,
  type RepeatConfigSchema,
  type RepeatType,
} from '@/shared/types/repeat'

type UseRepeatConfigControllerProps = {
  repeatConfig: RepeatConfigSchema
  setValue: UseFormReturn<AddScheduleFormValues>['setValue']
}

export type UseRepeatConfigControllerResult = {
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  setEventColor: (value: EventColorType) => void
}

export const useRepeatConfigController = ({
  repeatConfig,
  setValue,
}: UseRepeatConfigControllerProps): UseRepeatConfigControllerResult => {
  const handleRepeatConfigChange = (value: RepeatConfigSchema) => {
    setValue('repeatConfig', value, { shouldValidate: true })
  }

  const isCustomBasis = (value: RepeatType): value is CustomRepeatBasis =>
    value !== 'none' && value !== 'custom'

  const handleRepeatType = (value: RepeatType) => {
    if (value === 'custom') {
      if (repeatConfig.repeatType === 'custom') {
        handleRepeatConfigChange({ ...repeatConfig, repeatType: 'none', customBasis: null })
        return
      }
      handleRepeatConfigChange({
        ...repeatConfig,
        repeatType: 'custom',
        customBasis: repeatConfig.customBasis ?? 'daily',
      })
      return
    }

    if (repeatConfig.repeatType === 'custom' && isCustomBasis(value)) {
      handleRepeatConfigChange({ ...repeatConfig, customBasis: value })
      return
    }

    const nextType = repeatConfig.repeatType === value ? 'none' : value
    handleRepeatConfigChange({
      ...repeatConfig,
      repeatType: nextType,
      customBasis: null,
    })
  }

  const updateConfig = (changes: Partial<RepeatConfig>) =>
    handleRepeatConfigChange({ ...repeatConfig, ...changes })

  const setEventColor = useCallback(
    (value: EventColorType) => {
      setValue('eventColor', value, { shouldValidate: true })
    },
    [setValue],
  )

  return {
    handleRepeatType,
    updateConfig,
    setEventColor,
  }
}
