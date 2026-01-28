import type { RepeatConfigSchema } from '@/shared/types/event'
import type { RepeatConfig } from '@/shared/types/repeat'

import * as S from './RepeatPanel.style'

type Props = {
  config: RepeatConfigSchema
  updateConfig: (changes: Partial<RepeatConfig>) => void
}

const DailyRepeatPanel = ({ config, updateConfig }: Props) => (
  <S.Wrapper>
    <S.InlineInput
      type="number"
      min={1}
      max={364}
      value={config.customDailyInterval ?? 1}
      onChange={(event) => {
        const raw = Number(event.target.value)
        const next = Number.isNaN(raw) ? 1 : Math.min(Math.max(raw, 1), 364)
        updateConfig({ customDailyInterval: next })
      }}
    />
    <S.Label>일마다 반복</S.Label>
  </S.Wrapper>
)

export default DailyRepeatPanel
