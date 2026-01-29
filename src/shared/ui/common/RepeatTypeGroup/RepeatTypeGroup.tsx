import Rotate from '@/shared/assets/icons/rotate.svg?react'
import { MAIN_OPTIONS } from '@/shared/constants/event'
import type { CustomRepeatBasis, RepeatType } from '@/shared/types/repeat'

import * as S from './RepeatTypeGroup.style'

type Props = {
  repeatType: RepeatType
  customBasis?: CustomRepeatBasis | null
  onToggleType: (value: RepeatType) => void
}

const RepeatTypeGroup = ({ repeatType, customBasis, onToggleType }: Props) => (
  <S.RepeatRow>
    <S.Label>반복</S.Label>
    <Rotate className="icon" />
    <S.ButtonsWrapper>
      {MAIN_OPTIONS.map((option) => (
        <S.RepeatButton
          key={option.type}
          isActive={
            repeatType === option.type || (repeatType === 'custom' && customBasis === option.type)
          }
          onClick={() => onToggleType(option.type)}
          type="button"
        >
          {option.label}
        </S.RepeatButton>
      ))}
    </S.ButtonsWrapper>
  </S.RepeatRow>
)

export default RepeatTypeGroup
