import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import type { AddScheduleFormValues, RepeatConfigSchema } from '@/shared/types/event'
import { areRepeatConfigsEqual } from '@/shared/utils/repeatConfig'

type SetRepeatConfigValue = (
  name: 'repeatConfig',
  value: RepeatConfigSchema,
  options?: Parameters<UseFormReturn<AddScheduleFormValues>['setValue']>[2],
) => void

type UseRepeatChangeGuardProps = {
  repeatConfig: RepeatConfigSchema
  isEditing?: boolean
  setValue: SetRepeatConfigValue
}

export const useRepeatChangeGuard = ({
  repeatConfig,
  isEditing = false,
  setValue,
}: UseRepeatChangeGuardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const lastConfirmedRepeatConfig = useRef<RepeatConfigSchema | null>(null)

  useEffect(() => {
    if (!isEditing) {
      lastConfirmedRepeatConfig.current = null
      return
    }
    if (lastConfirmedRepeatConfig.current === null) {
      lastConfirmedRepeatConfig.current = repeatConfig
      return
    }
    if (isOpen) {
      return
    }
    if (lastConfirmedRepeatConfig.current.repeatType === 'none') {
      if (repeatConfig.repeatType !== 'none') {
        lastConfirmedRepeatConfig.current = repeatConfig
      }
      return
    }
  }, [isEditing, isOpen, repeatConfig])

  const requestConfirmation = useCallback(() => {
    if (!isEditing || isOpen) return false
    if (!lastConfirmedRepeatConfig.current) return false
    if (lastConfirmedRepeatConfig.current.repeatType === 'none') {
      if (repeatConfig.repeatType !== 'none') {
        lastConfirmedRepeatConfig.current = repeatConfig
      }
      return false
    }
    if (!areRepeatConfigsEqual(lastConfirmedRepeatConfig.current, repeatConfig)) {
      setIsOpen(true)
      return true
    }
    return false
  }, [isEditing, isOpen, repeatConfig])

  // 변경된 설정을 기준으로 삼고 모달을 닫습니다.
  const confirmChange = useCallback(() => {
    lastConfirmedRepeatConfig.current = repeatConfig
    setIsOpen(false)
  }, [repeatConfig])

  // 취소 시 마지막으로 확정된 설정으로 되돌립니다.
  const revertChange = useCallback(() => {
    if (lastConfirmedRepeatConfig.current) {
      setValue('repeatConfig', lastConfirmedRepeatConfig.current, { shouldValidate: true })
    }
    setIsOpen(false)
  }, [setValue])

  return {
    isOpen,
    confirmChange,
    revertChange,
    requestConfirmation,
  }
}
