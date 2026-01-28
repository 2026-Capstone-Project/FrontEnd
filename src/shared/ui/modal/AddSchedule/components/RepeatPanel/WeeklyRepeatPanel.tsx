import { WEEKDAYS } from '@/shared/constants/event'
import type { RepeatConfigSchema } from '@/shared/types/event'
import type { RepeatConfig } from '@/shared/types/repeat'

import * as S from './RepeatPanel.style'

type Props = {
  config: RepeatConfigSchema
  updateConfig: (changes: Partial<RepeatConfig>) => void
}

const WeeklyRepeatPanel = ({ config, updateConfig }: Props) => (
  <>
    <S.DayGrid>
      {WEEKDAYS.map((day) => {
        const isActive = config.customWeeklyDays?.includes(day.key) ?? false
        const toggleDay = () => {
          const current = config.customWeeklyDays ?? []
          const next = isActive
            ? current.filter((value) => value !== day.key)
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

export default WeeklyRepeatPanel
