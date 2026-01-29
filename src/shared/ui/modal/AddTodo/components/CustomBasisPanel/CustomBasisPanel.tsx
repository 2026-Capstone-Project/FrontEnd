import styled from '@emotion/styled'

import { theme } from '@/shared/styles/theme'
import type { RepeatConfigSchema } from '@/shared/types/event'
import type { CustomRepeatBasis, RepeatConfig } from '@/shared/types/repeat'
import {
  DailyRepeatPanel,
  MonthlyRepeatPanel,
  WeeklyRepeatPanel,
  YearlyRepeatPanel,
} from '@/shared/ui/common/RepeatPanel'

type Props = {
  config: RepeatConfigSchema
  customBasis?: CustomRepeatBasis | null
  updateConfig: (changes: Partial<RepeatConfig>) => void
}

const CustomBasisPanel = ({ config, customBasis, updateConfig }: Props) => {
  const monthlyDates = (config.customMonthlyDates ?? []).filter(
    (value): value is number => typeof value === 'number',
  )

  return (
    <RepeatDetail>
      {customBasis === 'daily' && <DailyRepeatPanel config={config} updateConfig={updateConfig} />}
      {customBasis === 'weekly' && (
        <WeeklyRepeatPanel config={config} updateConfig={updateConfig} />
      )}
      {customBasis === 'monthly' && (
        <MonthlyRepeatPanel
          config={config}
          monthlyDates={monthlyDates}
          updateConfig={updateConfig}
        />
      )}
      {customBasis === 'yearly' && (
        <YearlyRepeatPanel config={config} updateConfig={updateConfig} />
      )}
    </RepeatDetail>
  )
}

export default CustomBasisPanel

export const RepeatDetail = styled.div`
  border: 1px solid ${theme.colors.lightGray};
  padding: 10px 20px;
  background: ${theme.colors.inputColor};
  display: flex;
  flex-direction: column;
  gap: 12px;
`
