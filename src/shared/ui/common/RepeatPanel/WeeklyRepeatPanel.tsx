import { useState } from 'react'

import { WEEKDAYS } from '@/shared/constants/event'
import type { RepeatConfigSchema } from '@/shared/types/event/event'
import type { RepeatConfig, WeekdayName } from '@/shared/types/recurrence/repeat'

import * as S from './RepeatPanel.style'

type Props = {
  config: RepeatConfigSchema
  updateConfig: (changes: Partial<RepeatConfig>) => void
}

const WeeklyRepeatPanel = ({ config, updateConfig }: Props) => {
  const [intervalInput, setIntervalInput] = useState<string | null>(null)

  const displayInterval = intervalInput ?? String(config.customWeeklyInterval ?? 1)

  const commitInterval = (rawValue: string) => {
    const raw = Number(rawValue)
    const next = Number.isNaN(raw) ? 1 : Math.min(Math.max(raw, 1), 52)
    updateConfig({ customWeeklyInterval: next })
  }

  return (
    <>
      <S.NumberRepeat>
        <S.InlineInput
          type="number"
          min={1}
          max={52}
          value={displayInterval}
          onFocus={() => setIntervalInput(String(config.customWeeklyInterval ?? 1))}
          onChange={(event) => setIntervalInput(event.target.value)}
          onBlur={(event) => {
            commitInterval(event.target.value)
            setIntervalInput(null)
          }}
        />
        주마다 반복
      </S.NumberRepeat>
      <S.DayGrid>
        {WEEKDAYS.map((day) => {
          const isActive = config.customWeeklyDays?.includes(day.key) ?? false
          const toggleDay = () => {
            const current = config.customWeeklyDays ?? []
            const next = isActive
              ? current.filter((value: WeekdayName | undefined) => value !== day.key)
              : [...current, day.key]
            updateConfig({ customWeeklyDays: next })
          }
          return (
            <S.DayChip key={day.key} isActive={isActive} type="button" onClick={toggleDay}>
              {day.label}
            </S.DayChip>
          )
        })}
      </S.DayGrid>
    </>
  )
}

export default WeeklyRepeatPanel
