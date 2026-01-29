/** @jsxImportSource @emotion/react */
import { useRef } from 'react'

import { MONTHLY_DAY_OPTIONS, MONTHLY_WEEK_OPTIONS } from '@/shared/constants/event'
import type { RepeatConfigSchema } from '@/shared/types/event'
import type { MonthlyPatternDay, MonthlyPatternWeek, RepeatConfig } from '@/shared/types/repeat'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import Dropdown from '@/shared/ui/common/Dropdown/Dropdown'
import { dayLabel, weekLabel } from '@/shared/utils/date'

import * as S from './RepeatPanel.style'

type Props = {
  config: RepeatConfigSchema
  monthlyDates: number[]
  updateConfig: (changes: Partial<RepeatConfig>) => void
}

const MonthlyRepeatPanel = ({ config, monthlyDates, updateConfig }: Props) => {
  const mode = config.customMonthlyMode ?? 'dates'
  const weekRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLDivElement>(null)

  const selectedWeek = config.customMonthlyPatternWeek ?? '1'
  const selectedDay = config.customMonthlyPatternDay ?? 'mon'

  return (
    <>
      <S.NumberRepeat>
        <S.InlineInput
          type="number"
          min={1}
          max={11}
          value={config.customMonthlyInterval ?? 1}
          onChange={(event) =>
            updateConfig({ customMonthlyInterval: Number(event.target.value) || 1 })
          }
        />
        개월마다 반복
      </S.NumberRepeat>
      <Checkbox
        label="날짜 지정"
        checked={mode === 'dates'}
        onChange={() => updateConfig({ customMonthlyMode: 'dates' })}
      />

      {mode === 'dates' && (
        <S.MultiSelectGrid>
          {Array.from({ length: 31 }, (_, idx) => idx + 1).map((day) => {
            const active = monthlyDates.includes(day)
            return (
              <S.DayChip
                key={day}
                isActive={active}
                type="button"
                onClick={() => {
                  const next = active
                    ? monthlyDates.filter((value) => value !== day)
                    : [...monthlyDates, day]
                  updateConfig({ customMonthlyDates: next })
                }}
              >
                {day}
              </S.DayChip>
            )
          })}
        </S.MultiSelectGrid>
      )}
      <Checkbox
        label="조건 지정"
        checked={mode === 'pattern'}
        onChange={() => updateConfig({ customMonthlyMode: 'pattern' })}
      />
      {mode === 'pattern' && (
        <div css={{ display: 'flex', gap: '12px' }}>
          <Dropdown
            ref={weekRef}
            options={MONTHLY_WEEK_OPTIONS}
            optionLabel={weekLabel as (option: string | number) => string}
            selectedOption={selectedWeek}
            onSelect={(value) => {
              updateConfig({ customMonthlyPatternWeek: value as MonthlyPatternWeek })
            }}
          />

          <Dropdown
            ref={dayRef}
            options={MONTHLY_DAY_OPTIONS}
            optionLabel={dayLabel as (option: string | number) => string}
            selectedOption={selectedDay}
            onSelect={(value) => {
              updateConfig({ customMonthlyPatternDay: value as MonthlyPatternDay })
            }}
          />
        </div>
      )}
    </>
  )
}

export default MonthlyRepeatPanel
