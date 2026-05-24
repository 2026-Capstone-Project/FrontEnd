import { useCallback } from 'react'

import { type EventColorType, type RepeatConfigSchema } from '@/shared/types/event/event'
import {
  type CustomRepeatBasis,
  type RepeatConfig,
  type RepeatType,
} from '@/shared/types/recurrence/repeat'

type UseRepeatConfigControllerProps = {
  repeatConfig: RepeatConfigSchema
  onRepeatConfigChange: (value: RepeatConfigSchema) => void
  onEventColorChange: (value: EventColorType) => void
}

export type UseRepeatConfigControllerResult = {
  handleRepeatType: (value: RepeatType) => void
  updateConfig: (changes: Partial<RepeatConfig>) => void
  setEventColor: (value: EventColorType) => void
}

export const useRepeatConfigController = ({
  repeatConfig,
  onRepeatConfigChange,
  onEventColorChange,
}: UseRepeatConfigControllerProps): UseRepeatConfigControllerResult => {
  const isCustomBasis = (value: RepeatType): value is CustomRepeatBasis =>
    value !== 'none' && value !== 'custom'

  const handleRepeatType = (value: RepeatType) => {
    if (value === 'custom') {
      if (repeatConfig.repeatType === 'custom') {
        onRepeatConfigChange({ ...repeatConfig, repeatType: 'none', customBasis: null })
        return
      }
      onRepeatConfigChange({
        ...repeatConfig,
        repeatType: 'custom',
        customBasis: repeatConfig.customBasis ?? 'daily',
      })
      return
    }

    if (repeatConfig.repeatType === 'custom' && isCustomBasis(value)) {
      onRepeatConfigChange({ ...repeatConfig, customBasis: value })
      return
    }

    const nextType = repeatConfig.repeatType === value ? 'none' : value
    onRepeatConfigChange({
      ...repeatConfig,
      repeatType: nextType,
      customBasis: null,
    })
  }

  const updateConfig = (changes: Partial<RepeatConfig>) =>
    onRepeatConfigChange({ ...repeatConfig, ...changes })

  const setEventColor = useCallback(
    (value: EventColorType) => {
      onEventColorChange(value)
    },
    [onEventColorChange],
  )

  return {
    handleRepeatType,
    updateConfig,
    setEventColor,
  }
}
