import { useEffect, useRef } from 'react'

import type { TimePickerRenderProps } from '@/shared/types/event'

import * as S from './CustomTimePicker.style'

const getTimeParts = (time?: string) => {
  const [nextHour = '09', nextMinute = '00'] = (time ?? '09:00').split(':')
  return { nextHour, nextMinute }
}

const CustomTimePicker = ({ value = '09:00', onChange }: TimePickerRenderProps) => {
  const hourRef = useRef<HTMLInputElement | null>(null)
  const minuteRef = useRef<HTMLInputElement | null>(null)
  const { nextHour: initialHour, nextMinute: initialMinute } = getTimeParts(value)

  useEffect(() => {
    const { nextHour, nextMinute } = getTimeParts(value)
    if (hourRef.current && hourRef.current.value !== nextHour) {
      hourRef.current.value = nextHour
    }
    if (minuteRef.current && minuteRef.current.value !== nextMinute) {
      minuteRef.current.value = nextMinute
    }
  }, [value])

  // 입력값 검증 및 업데이트 (시: 0-23, 분: 0-59)
  const sanitizeDigits = (value: string) => value.replace(/[^0-9]/g, '').slice(0, 2)
  const formatTwoDigits = (value?: string) => value?.padStart(2, '0') ?? '00'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hour' | 'minute') => {
    const max = type === 'hour' ? 23 : 59
    const digits = sanitizeDigits(e.target.value)
    let val = digits
    if (digits.length > 0) {
      const numeric = Number(digits)
      if (!Number.isNaN(numeric)) {
        const clamped = Math.min(Math.max(numeric, 0), max)
        val = clamped.toString().padStart(digits.length, '0')
      }
    }
    e.target.value = val

    if (type === 'hour' && val.length === 2) {
      const currentMinute = minuteRef.current?.value ?? initialMinute
      onChange(`${val}:${formatTwoDigits(currentMinute)}`)
    }

    if (type === 'minute' && val.length === 2) {
      const currentHour = hourRef.current?.value ?? initialHour
      onChange(`${formatTwoDigits(currentHour)}:${val}`)
    }
  }

  // 포커스 아웃 시 1자리 숫자를 2자리로 보정 (예: '9' -> '09')
  const handleBlur = () => {
    const formattedHour = formatTwoDigits(hourRef.current?.value ?? initialHour)
    const formattedMin = formatTwoDigits(minuteRef.current?.value ?? initialMinute)
    if (hourRef.current) hourRef.current.value = formattedHour
    if (minuteRef.current) minuteRef.current.value = formattedMin
    onChange(`${formattedHour}:${formattedMin}`)
  }

  return (
    <S.TimePickerWrapper>
      <S.TimeInputContainer>
        <S.DirectInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          defaultValue={initialHour}
          ref={hourRef}
          onChange={(e) => handleInputChange(e, 'hour')}
          onBlur={handleBlur}
          placeholder="HH"
        />
        <S.TimeDivider>:</S.TimeDivider>
        <S.DirectInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          defaultValue={initialMinute}
          ref={minuteRef}
          onChange={(e) => handleInputChange(e, 'minute')}
          onBlur={handleBlur}
          placeholder="mm"
        />
      </S.TimeInputContainer>
    </S.TimePickerWrapper>
  )
}

export default CustomTimePicker
