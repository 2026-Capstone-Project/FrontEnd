import Rotate from '@/shared/assets/icons/rotate.svg?react'
import { MAIN_OPTIONS } from '@/shared/constants/event'
import type { CustomRepeatBasis, RepeatType } from '@/shared/types/recurrence/repeat'

import * as S from './RepeatTypeGroup.style'

type Props = {
  repeatType: RepeatType
  customBasis?: CustomRepeatBasis | null
  onToggleType: (value: RepeatType) => void
  canToggleDetail: boolean
  isDetailOpen: boolean
  onToggleDetail: () => void
}

const RepeatTypeGroup = ({
  repeatType,
  customBasis,
  onToggleType,
  canToggleDetail,
  isDetailOpen,
  onToggleDetail,
}: Props) => (
  <S.RepeatRow>
    <S.Label>반복</S.Label>
    <S.IconButton
      type="button"
      disabled={!canToggleDetail}
      isOpen={isDetailOpen}
      onClick={onToggleDetail}
      aria-label="반복 상세 설정 열기"
      title="반복 상세 설정"
    >
      <Rotate className="icon" />
    </S.IconButton>
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
