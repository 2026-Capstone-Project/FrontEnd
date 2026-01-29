/** @jsxImportSource @emotion/react */
import { useRef } from 'react'

import { MONTHLY_DAY_OPTIONS, MONTHLY_WEEK_OPTIONS, MONTHS } from '@/shared/constants/event'
import type { RepeatConfigSchema } from '@/shared/types/event'
import type { MonthlyPatternDay, MonthlyPatternWeek, RepeatConfig } from '@/shared/types/repeat'
import Checkbox from '@/shared/ui/common/Checkbox/Checkbox'
import Dropdown from '@/shared/ui/common/Dropdown/Dropdown'
import { dayLabel, weekLabel } from '@/shared/utils/date'

import * as S from './RepeatPanel.style'

type Props = {
  config: RepeatConfigSchema
  updateConfig: (changes: Partial<RepeatConfig>) => void
}

const YearlyRepeatPanel = ({ config, updateConfig }: Props) => {
  const monthlyMonths = config.customYearlyMonths ?? []
  const weekRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLDivElement>(null)

  const selectedWeek = config.customYearlyConditionWeek ?? '1'
  const selectedDay = config.customYearlyConditionDay ?? 'mon'

  return (
    <>
      <S.NumberRepeat>
        <S.InlineInput
          type="number"
          min={1}
          max={99}
          value={config.customYearlyInterval ?? 1}
          onChange={(event) =>
            updateConfig({ customYearlyInterval: Number(event.target.value) || 1 })
          }
        />
        년마다 반복
      </S.NumberRepeat>
      <S.MultiSelectMonthGrid>
        {MONTHS.map((month) => {
          const active = monthlyMonths.includes(month)
          return (
            <S.MonthChip
              key={month}
              isActive={active}
              type="button"
              onClick={() => {
                const current = monthlyMonths
                const next = active
                  ? current.filter((value) => value !== month)
                  : [...current, month]
                updateConfig({ customYearlyMonths: next })
              }}
            >
              {month}월
            </S.MonthChip>
          )
        })}
      </S.MultiSelectMonthGrid>
      <S.RepeatRow>
        <Checkbox
          label="추가 조건 지정하기"
          checked={config.customYearlyConditionEnabled}
          onChange={() =>
            updateConfig({ customYearlyConditionEnabled: !config.customYearlyConditionEnabled })
          }
        />
      </S.RepeatRow>
      {config.customYearlyConditionEnabled && (
        <div css={{ display: 'flex', gap: '12px' }}>
          <Dropdown
            ref={weekRef}
            options={MONTHLY_WEEK_OPTIONS}
            optionLabel={weekLabel as (option: string | number) => string}
            selectedOption={selectedWeek}
            onSelect={(value) => {
              updateConfig({ customYearlyConditionWeek: value as MonthlyPatternWeek })
            }}
          />

          <Dropdown
            ref={dayRef}
            options={MONTHLY_DAY_OPTIONS}
            optionLabel={dayLabel as (option: string | number) => string}
            selectedOption={selectedDay}
            onSelect={(value) => {
              updateConfig({ customYearlyConditionDay: value as MonthlyPatternDay })
            }}
          />
        </div>
      )}
    </>
  )
}

export default YearlyRepeatPanel
