import { useEffect, useState } from 'react'

import type { TimePickerRenderProps } from '@/shared/types/event'

import * as S from './CustomTimePicker.style'

const CustomTimePicker = ({ value, onChange }: TimePickerRenderProps) => {
  const [hour, setHour] = useState(value?.split(':')[0] || '09')
  const [minute, setMinute] = useState(value?.split(':')[1] || '00')

  useEffect(() => {
    if (!value) return
    const [nextHour = '00', nextMinute = '00'] = value.split(':')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHour(nextHour)
    setMinute(nextMinute)
  }, [value])

  // 입력값 검증 및 업데이트 (시: 0-23, 분: 0-59)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'hour' | 'minute') => {
    let val = e.target.value.replace(/[^0-9]/g, '').slice(0, 2) // 숫자만 2자리까지

    if (type === 'hour') {
      if (parseInt(val) > 23) val = '23'
      setHour(val)
      if (val.length === 2) onChange(`${val}:${minute}`)
    } else {
      if (parseInt(val) > 59) val = '59'
      setMinute(val)
      if (val.length === 2) onChange(`${hour}:${val}`)
    }
  }

  // 포커스 아웃 시 1자리 숫자를 2자리로 보정 (예: '9' -> '09')
  const handleBlur = () => {
    const formattedHour = hour.padStart(2, '0')
    const formattedMin = minute.padStart(2, '0')
    setHour(formattedHour)
    setMinute(formattedMin)
    onChange(`${formattedHour}:${formattedMin}`)
  }

  return (
    <S.TimePickerWrapper>
      <S.TimeInputContainer>
        <S.DirectInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={hour}
          onChange={(e) => handleInputChange(e, 'hour')}
          onBlur={handleBlur}
          placeholder="HH"
        />
        <S.TimeDivider>:</S.TimeDivider>
        <S.DirectInput
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minute}
          onChange={(e) => handleInputChange(e, 'minute')}
          onBlur={handleBlur}
          placeholder="mm"
        />
      </S.TimeInputContainer>
    </S.TimePickerWrapper>
  )
}

export default CustomTimePicker
